formUtils = require './formUtils'

# Updates data in a response given an expression (mWater expression, see FormSchemaBuilder and also mwater-expressions package) and a value
module.exports = class ResponseDataExprValueUpdater
  constructor: (formDesign, schema, dataSource) ->
    @formDesign = formDesign
    @schema = schema
    @dataSource = dataSource

    # Index all items for fast lookup
    @formItems = {}
    for item in formUtils.allItems(@formDesign)
      if item._id
        @formItems[item._id] = item

  # True if an expression can be updated
  canUpdate: (expr) ->
    # Handle simple fields
    if expr.type == "field"
      if expr.column.match(/^data:.+:value$/) or expr.column.match(/^data:.+:value:quantity$/) or expr.column.match(/^data:.+:value:units$/)
        return true
  
    return false    

  # Updates the data of a response, given an expression and its value. For example,
  # if there is a text field in question q1234, the expression { type: "field", table: "responses:form123", column: "data:q1234:value" }
  # refers to the text field value. Setting it will set data.q1234.value in the data.
  # suppressCleaning stops any cleaning of data (removing values that are invisble because of conditions). Useful when doing multiple updates
  # in which case it should be true except for last update.
  updateData: (data, expr, value, callback, suppressCleaning = false) ->
    # Handle simple fields
    if expr.type == "field" and expr.column.match(/^data:.+:value$/)
      @updateValue(data, expr, value, callback)
      return

    # Handle quantity and units
    if expr.type == "field" and expr.column.match(/^data:.+:value:quantity$/)
      @updateQuantity(data, expr, value, callback)
      return

    if expr.type == "field" and expr.column.match(/^data:.+:value:units$/)
      @updateUnits(data, expr, value, callback)
      return
    
    callback(new Error("Cannot update expr #{JSON.stringify(expr)}"))

  updateValue: (data, expr, value, callback) ->
    question = @formItems[expr.column.match(/^data:(.+):value$/)[1]]
    if not question
      return callback(new Error("Question #{expr.column} not found"))

    setValue = (val) =>
      answer = data[question._id] or {}
      answer.value = val
      change = {}
      change[question._id] = answer
      data = _.extend({}, data, change)
      return callback(null, data)

    # Get type of answer
    answerType = formUtils.getAnswerType(question)
    switch answerType
      when "text", "number", "choice", "choices", "date", "boolean", "image", "images", "texts"
        return setValue(value)
      when "location"
        # Convert from GeoJSON to lat/lng
        if not value
          return setValue(null)
        
        if value.type != "Point"
          return callback(new Error("GeoJSON type #{value.type} not supported"))   

        return setValue(_.extend({}, data[question._id]?.value or {}, { latitude: value.coordinates[1], longitude: value.coordinates[0] }))

      else
        return callback(new Error("Answer type #{answerType} not supported")) 

  updateQuantity: (data, expr, value, callback) ->
    question = @formItems[expr.column.match(/^data:(.+):value:quantity$/)[1]]
    if not question
      return callback(new Error("Question #{expr.column} not found"))

    answer = data[question._id] or {}
    answer.value = _.extend({}, answer.value or {}, quantity: value)
    change = {}
    change[question._id] = answer
    data = _.extend({}, data, change)
    return callback(null, data)    

  updateUnits: (data, expr, value, callback) ->
    question = @formItems[expr.column.match(/^data:(.+):value:units$/)[1]]
    if not question
      return callback(new Error("Question #{expr.column} not found"))

    answer = data[question._id] or {}
    answer.value = _.extend({}, answer.value or {}, units: value)
    change = {}
    change[question._id] = answer
    data = _.extend({}, data, change)
    return callback(null, data)    
