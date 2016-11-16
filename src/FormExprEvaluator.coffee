_ = require 'lodash'
formUtils = require './formUtils'

# Still uses old synchronous version (with limited functionality)
ExprEvaluator = require('mwater-expressions').OldExprEvaluator

# Evaluates mwater expressions that are embedded in questions, etc. 
# Also substitutes them into strings.
# Forms have fields like: "text" that contain localized strings e.g. { en: "My name is {0}", es: "Mi nombre es {0}" }
# There is also a field "textExprs" that contains an array of mWater expressions. e.g. [{ type: "field", table: "responses:12345", column: "data:abc123:value" }]
# This would substitute the value of the abc123 question into the string
# Include locale to determine how units and enums are localized
module.exports = class FormExprEvaluator 
  # Uses a form design
  constructor: (formDesign) ->
    # Index all questions by _id for looking up type. Gracefully degrade if no form
    if formDesign
      @itemMap = _.indexBy(formUtils.allItems(formDesign), "_id")
    else
      @itemMap = {}

  # Render a localized string that may contain one or more expressions as a string.
  # data is the data to use. Usually response.data but when in a roster, is the data for the roster entry'
  # parentData is the response.data if in a roster, null otherwise
  renderString: (localizedStr, exprs, data, parentData, locale = "en") ->
    # Localize string
    str = formUtils.localizeString(localizedStr, locale)

    # Perform substitutions ({0}, {1}, etc.)
    str = str.replace(/\{(\d+)\}/g, (match, index) =>
      index = parseInt(index)
      if exprs?[index]
        return @evaluateExpr(exprs[index], data, parentData, locale) or ""
      return ""
      )
    
    return str

  # Evaluate a single expression
  # data is the data to use. Usually response.data but when in a roster, is the data for the roster entry'
  # parentData is the response.data if in a roster, null otherwise
  evaluateExpr: (expr, data, parentData, locale) ->
    row = @createRow(data, parentData, locale)
    return new ExprEvaluator().evaluate(expr, row)

  # Create row object that ExprEvaluator needs from data
  createRow: (data, parentData, locale) ->
    return {
      # Returns primary key of row. Is the response id, but don't implement for now
      getPrimaryKey: -> throw new Error("Not implemented")
      # gets the value of a column
      getField: (columnId) =>
        # Handle special case of column "response" which joins from roster entry back to main response data (parentData)
        if columnId == "response"
          return @createRow(parentData, null)


        match = columnId.match(/^data:(.+):value$/)
        if match
          item = @itemMap[match[1]]
          if not item
            return null

          # Special case for location question
          if item._type == "LocationQuestion" and data[match[1]]?.value
            # GeoJSON
            return { type: "Point", coordinates: [data[match[1]].value.longitude, data[match[1]].value.latitude] }

          # Entity and Site always return null
          if item._type in ["EntityQuestion", "SiteQuestion"]
            return null

          value = data[match[1]]?.value

          # Localize choice
          if formUtils.getAnswerType(item) == "choice"
            choice = _.findWhere(item.choices, { id: value })
            if choice
              return formUtils.localizeString(choice.label, locale)
            else
              return "???"

          # Localize choices
          if formUtils.getAnswerType(item) == "choices"
            return _.map(value, (v) => 
              choice = _.findWhere(item.choices, { id: v })
              if choice
                return formUtils.localizeString(choice.label, locale)
              else
                return "???").join(", ")

          return value

        match = columnId.match(/^data:(.+):value:accuracy$/)
        if match
          return data[match[1]]?.value?.accuracy

        match = columnId.match(/^data:(.+):value:altitude$/)
        if match
          return data[match[1]]?.value?.altitude

        match = columnId.match(/^data:(.+):value:quantity$/)
        if match
          return data[match[1]]?.value?.quantity

        match = columnId.match(/^data:(.+):value:units$/)
        if match
          units = data[match[1]]?.value?.units
          item = @itemMap[match[1]]

          # Localize units
          if units and item
            units = _.findWhere(item.units, { id: units })
            if units
              return formUtils.localizeString(units.label, locale)
            else
              return "???"
          return null

        match = columnId.match(/^data:(.+):timestamp$/)
        if match
          return data[match[1]]?.timestamp

        match = columnId.match(/^data:(.+):location$/)
        if match
          # GeoJSON
          if data[match[1]].location
            return { type: "Point", coordinates: [data[match[1]].location.longitude, data[match[1]].location.latitude] }
          return null

        match = columnId.match(/^data:(.+):location:accuracy$/)
        if match
          return data[match[1]]?.location?.accuracy

        match = columnId.match(/^data:(.+):location:altitude$/)
        if match
          return data[match[1]]?.location?.altitude

        match = columnId.match(/^data:(.+):na$/)
        if match
          return data[match[1]]?.alternate == "na"
      
        match = columnId.match(/^data:(.+):dontknow$/)
        if match
          return data[match[1]]?.alternate == "dontknow"

        return null
    }
