_ = require 'lodash'
formUtils = require './formUtils'
VisibilityCalculator = require './VisibilityCalculator'
EntityRow = require './EntityRow'

###

Implements the type of row object required by mwater-expressions' ExprEvaluator. Allows expressions to be evaluated
on responses

###
module.exports = class ResponseRow   
  # Create a response row from a response data object.
  # Options:
  #  responseData: data of entire response
  #  formDesign: design of the form
  #  schema: schema to use
  #  rosterId: id of roster if it is a roster row
  #  rosterEntryIndex: index of roster row
  #  getEntityById(entityType, entityId, callback): looks up entity. Any callbacks after first one will be ignored.
  #    callback: called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found
  #  getEntityByCode(entityType, entityCode, callback): looks up an entity. Any callbacks after first one will be ignored.
  #    callback: called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found
  constructor: (options) ->
    @options = options

    @formDesign = options.formDesign
    @schema = options.schema
    @responseData = options.responseData
    @rosterId = options.rosterId
    @rosterEntryIndex = options.rosterEntryIndex
    @getEntityById = options.getEntityById
    @getEntityByCode = options.getEntityByCode
    @deployment = options.deployment

  # Gets the response row for a roster entry
  getRosterResponseRow: (rosterId, rosterEntryIndex) ->
    return new ResponseRow(_.extend({}, @options, rosterId: rosterId, rosterEntryIndex: rosterEntryIndex))

  # Gets primary key of row. callback is called with (error, value)
  getPrimaryKey: (callback) ->
    # Not available if not roster
    if not @rosterId
      return callback(null, null)

    # Get roster id
    callback(null, @responseData[@rosterId][@rosterEntryIndex]._id)

  # Gets the value of a column. callback is called with (error, value)    
  # For joins, getField will get array of rows for 1-n and n-n joins and a row for n-1 and 1-1 joins
  getField: (columnId, callback) ->
    data = @responseData

    # Go into roster
    if @rosterId
      data = @responseData[@rosterId][@rosterEntryIndex].data

    if columnId == "deployment"
      return callback(null, @deployment)

    # Handle "response" of roster
    if columnId == "response" and @rosterId
      return callback(null, new ResponseRow(_.omit(@options, "rosterId", "rosterEntryIndex")))

    # Handle "index" of roster
    if columnId == "index" and @rosterId
      return callback(null, @rosterEntryIndex)

    # Handle data
    if columnId.match(/^data:/)
      parts = columnId.split(":")

      # Roster
      if parts.length == 2
        if _.isArray(@responseData[parts[1]])
          return callback(null, _.map(@responseData[parts[1]], (entry, index) => @getRosterResponseRow(parts[1], index)))

      # Visible
      if parts.length == 3 and parts[2] == "visible"
        visibilityCalculator = new VisibilityCalculator(@formDesign, @schema)
        visibilityCalculator.createVisibilityStructure @responseData, this, (error, visibilityStructure) =>
          if error
            return callback(error)
          callback(null, visibilityStructure[parts[1]])
        return

      # Simple values
      if parts.length == 3 and parts[2] == "value"
        value = data[parts[1]]?.value

        # Null "" and []
        if value == "" or (_.isArray(value) and value.length == 0)
          value = null

        if not value?
          return callback(null, null)

        # Get type of answer
        question = formUtils.findItem(@formDesign, parts[1])
        if not question
          return callback(null, null)

        answerType = formUtils.getAnswerType(question)

        # Pad to YYYY-MM-DD
        if answerType == "date"
          if value.length == 4
            value = value + "-01-01"
          if value.length == 7
            value = value + "-01"

          # If date only, truncate
          if not question.format.match(/ss|LLL|lll|m|h|H/)
            value = value.substr(0, 10)

        if answerType == "site"
          # Create site entity row
          siteType = (if question.siteTypes then question.siteTypes[0]) or "water_point" 
          entityType = siteType.toLowerCase().replace(new RegExp(' ', 'g'), "_")

          code = value.code
          if code
            @getEntityByCode(entityType, code, _.once((entity) => 
              if entity
                callback(null, new EntityRow({ entityType: entityType, entity: entity, schema: @schema, getEntityById: @getEntityById }))
              else
                console.log "Warning: Site #{code} not found in ResponseRow"
                callback(null, null)
                # Note: Error was making some responses impossible to edit or view
                # callback(new Error("Site #{code} not found"))
            ))
          else
            callback(null, null)
          return

        if answerType == "entity"
          # Create site entity row
          if value
            @getEntityById(question.entityType, value, _.once((entity) => 
              if entity
                callback(null, new EntityRow({ entityType: entityType, entity: entity, schema: @schema, getEntityById: @getEntityById }))
              else
                console.log "Warning: Entity #{value} not found in ResponseRow"
                callback(null, null)
                # Note: Error was making some responses impossible to edit or view
                # callback(new Error("Entity #{value} not found"))
            ))
          else
            callback(null, null)
          return

        # Location
        if value and value.latitude?
          return callback(null, { type: "Point", coordinates: [value.longitude, value.latitude]})

        return callback(null, nullify(value))

      # Value can also recurse for handing matrix, item_choices, altitude, accuracy and CBT
      if parts[2] == "value"
        value = data[parts[1]]?.value

        for part in _.drop(parts, 3)
          value = value?[part]

        return callback(null, nullify(value))

      # Specify
      if parts[2] == "specify"
        return callback(null, nullify(data[parts[1]]?.specify?[parts[3]])) 

      # Comments
      if parts[2] == "comments"
        return callback(null, nullify(data[parts[1]]?.comments)) 

      # # Altitude and accuracy
      # if parts[2] == "value" and parts[3] in ["altitude", "accuracy"]
      #   return callback(null, data[parts[1]]?.value?[parts[3]])

      # # Units
      # if parts[2] == "value" and parts[3] in ["quantity", "units"]
      #   return callback(null, data[parts[1]]?.value?[parts[3]])

      # # Aquagenx cbt
      # if parts[2] == "value" and parts[3] == "cbt" and parts[4] in ["c1","c2","c3","c4","c5","healthRisk","mpn","confidence","accuracy"]
      #   return callback(null, data[parts[1]]?.value?[parts[3]]?[parts[4]])

      # if parts[2] == "value" and parts[3] == "image"
      #   return callback(null, data[parts[1]]?.value?[parts[3]])

      # Alternates
      if parts.length == 3 and parts[2] in ['na', 'dontknow']
        return callback(null, data[parts[1]]?.alternate == parts[2] or null)

      # Timestamp
      if parts.length == 3 and parts[2] == "timestamp"
        return callback(null, nullify(data[parts[1]]?.timestamp))

      # Location
      if parts.length == 3 and parts[2] == "location"
        if data[parts[1]]?.location
          return callback(null, { type: "Point", coordinates: [data[parts[1]]?.location.longitude, data[parts[1]].location.latitude]})
        else
          return callback(null, null)

      if parts.length == 4 and parts[2] == "location" and parts[3] == "accuracy"
        return callback(null, nullify(data[parts[1]]?.location?.accuracy))

      if parts.length == 4 and parts[2] == "location" and parts[3] == "altitude"
        return callback(null, nullify(data[parts[1]]?.location?.altitude))

    return callback(null, null)


# Converts undefined to null
nullify = (value) ->
  if value?
    return value
  return null