_ = require 'lodash'
formUtils = require './formUtils'
ResponseCleaner = require './ResponseCleaner'
VisibilityCalculator = require './VisibilityCalculator'
RandomAskedCalculator = require './RandomAskedCalculator'
ExprCompiler = require('mwater-expressions').ExprCompiler
ResponseDataValidator = require './ResponseDataValidator'

# Updates data in a response given an expression (mWater expression, see FormSchemaBuilder and also mwater-expressions package) and a value
# When updates are complete for data, cleanData must be called to clean data (removing values that are invisble because of conditions).
# and then call validateData to ensure that is valid
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
      if expr.column.match(/^data:[^:]+:value(:.+)?$/) 
        return true

      # Comments field
      if expr.column.match(/^data:[^:]+:comments$/)
        return true

      # NA/Don't know field
      if expr.column.match(/^data:[^:]+:na$/) or expr.column.match(/^data:[^:]+:dontknow$/)
        return true

      # Specify field
      if expr.column.match(/^data:[^:]+:specify:.+$/)
        return true

    if expr.type == "op" and expr.op in ['latitude', 'longitude'] and expr.exprs[0].type == "field" and expr.exprs[0].column.match(/^data:[^:]+:value$/)
      return true

    # Can update scalar with single join, non-aggr
    if expr.type == "scalar" and expr.joins.length == 1 and not expr.aggr and expr.joins[0].match(/^data:.+$/)
      return true

    if expr.type == "op" and expr.op == "contains" and expr.exprs[0].type == "field" and expr.exprs[0].column.match(/^data:[^:]+:value$/) and expr.exprs[1].value?.length == 1
      return true

    return false    

  # Cleans data. Must be called after last update is done. 
  # createResponseRow takes one parameter (data) and returns a response row
  # Callback with (error, cleanedData)
  cleanData: (data, createResponseRow, callback) ->
    # Compute visibility
    visibilityCalculator = new VisibilityCalculator(@formDesign)
    randomAskedCalculator = new RandomAskedCalculator(@formDesign)
    responseCleaner = new ResponseCleaner()
    responseCleaner.cleanData @formDesign, visibilityCalculator, null, randomAskedCalculator, data, createResponseRow, null, (error, results) =>
      callback(error, results?.data)

  # Validates the data. Callback null if ok, otherwise string message in second parameter. Clean first.
  validateData: (data, responseRow, callback) ->
    visibilityCalculator = new VisibilityCalculator(@formDesign)
    visibilityCalculator.createVisibilityStructure data, responseRow, (error, visibilityStructure) =>
      if error
        return callback(error)

      result = new ResponseDataValidator().validate(@formDesign, visibilityStructure, data)
      callback(null, result)

  # Updates the data of a response, given an expression and its value. For example,
  # if there is a text field in question q1234, the expression { type: "field", table: "responses:form123", column: "data:q1234:value" }
  # refers to the text field value. Setting it will set data.q1234.value in the data.
  updateData: (data, expr, value, callback) ->
    if not @canUpdate(expr)
      callback(new Error("Cannot update expression"))
      return

    # Handle simple fields
    if expr.type == "field" and expr.column.match(/^data:[^:]+:value$/)
      @updateValue(data, expr, value, callback)
      return

    # Handle quantity and units
    if expr.type == "field" and expr.column.match(/^data:[^:]+:value:quantity$/)
      @updateQuantity(data, expr, value, callback)
      return

    if expr.type == "field" and expr.column.match(/^data:[^:]+:value:units$/)
      @updateUnits(data, expr, value, callback)
      return

    # Handle latitude/longitude of location question
    if expr.type == "op" and expr.op in ['latitude', 'longitude'] and expr.exprs[0].type == "field" and expr.exprs[0].column.match(/^data:.+:value$/)
      @updateLocationLatLng(data, expr, value, callback)
      return

    # Handle location altitude
    if expr.type == "field" and expr.column.match(/^data:[^:]+:value:altitude$/)
      @updateLocationAltitude(data, expr, value, callback)
      return

    # Handle location altitude
    if expr.type == "field" and expr.column.match(/^data:[^:]+:value:accuracy$/)
      @updateLocationAccuracy(data, expr, value, callback)
      return

    # Handle CBT mpn
    if expr.type == "field" and expr.column.match(/^data:[^:]+:value:cbt:mpn$/)
      @updateCBTMPN(data, expr, value, callback)
      return
    
    # Handle CBT confidence
    if expr.type == "field" and expr.column.match(/^data:[^:]+:value:cbt:confidence$/)
      @updateCBTConfidence(data, expr, value, callback)
      return
    
    # Handle CBT healthRisk
    if expr.type == "field" and expr.column.match(/^data:[^:]+:value:cbt:healthRisk$/)
      @updateCBTHealthRisk(data, expr, value, callback)
      return
    
    # Handle CBT image
    if expr.type == "field" and expr.column.match(/^data:[^:]+:value:image$/)
      @updateCBTImage(data, expr, value, callback)
      return
    
    # Handle Likert (items_choices) and Matrix
    if expr.type == "field" and expr.column.match(/^data:[^:]+:value:.+$/)
      question = @formItems[expr.column.match(/^data:([^:]+):value:.+$/)[1]]
      if not question
        return callback(new Error("Question #{expr.column} not found"))

      answerType = formUtils.getAnswerType(question)
      if answerType == "items_choices"
        @updateItemsChoices(data, expr, value, callback)
        return

      if answerType == "matrix"
        @updateMatrix(data, expr, value, callback)
        return

    # Handle contains for enumset with one value
    if expr.type == "op" and expr.op == "contains" and expr.exprs[0].type == "field" and expr.exprs[0].column.match(/^data:.+:value$/) and expr.exprs[1].value?.length == 1
      @updateEnumsetContains(data, expr, value, callback)
      return

    # Handle specify
    if expr.type == "field" and expr.column.match(/^data:[^:]+:specify:.+$/)
      @updateSpecify(data, expr, value, callback)
      return
    
    # Handle comments
    if expr.type == "field" and expr.column.match(/^data:[^:]+:comments$/)
      @updateComments(data, expr, value, callback)
      return

    # Handle alternate
    if expr.type == "field" and expr.column.match(/^data:[^:]+:(na|dontknow)$/)
      @updateAlternate(data, expr, value, callback)
      return

    # Can update scalar with single join, non-aggr
    if expr.type == "scalar" and expr.joins.length == 1 and not expr.aggr and expr.joins[0].match(/^data:.+:value$/)
      @updateScalar(data, expr, value, callback) 
      return

    callback(new Error("Cannot update expr #{JSON.stringify(expr)}"))

  # Updates a value of a question, e.g. data:somequestion:value
  updateValue: (data, expr, value, callback) ->
    question = @formItems[expr.column.match(/^data:([^:]+):value$/)[1]]
    if not question
      return callback(new Error("Question #{expr.column} not found"))

    # Get type of answer
    answerType = formUtils.getAnswerType(question)
    switch answerType
      when "text", "number", "choice", "choices", "date", "boolean", "image", "images", "texts"
        return callback(null, @setValue(data, question, value))
      when "location"
        # Convert from GeoJSON to lat/lng
        if not value
          return callback(null, @setValue(data, question, value))
        
        if value.type != "Point"
          return callback(new Error("GeoJSON type #{value.type} not supported"))   

        val = _.extend({}, data[question._id]?.value or {}, { latitude: value.coordinates[1], longitude: value.coordinates[0] })
        return callback(null, @setValue(data, question, val))

      else
        return callback(new Error("Answer type #{answerType} not supported")) 

  # Update a single latitude or longitude of a location
  updateLocationLatLng: (data, expr, value, callback) ->
    question = @formItems[expr.exprs[0].column.match(/^data:([^:]+):value$/)[1]]
    if not question
      return callback(new Error("Question #{expr.exprs[0].column} not found"))

    if expr.op == "latitude"
      val = _.extend({}, data[question._id]?.value or {}, { latitude: value })
    else if expr.op == "longitude"
      val = _.extend({}, data[question._id]?.value or {}, { longitude: value })
    else
      throw new Error("Unsupported op #{expr.op}")

    return callback(null, @setValue(data, question, val))

  updateLocationAccuracy: (data, expr, value, callback) ->
    question = @formItems[expr.column.match(/^data:([^:]+):value:accuracy$/)[1]]
    if not question
      return callback(new Error("Question #{expr.column} not found"))

    answer = data[question._id] or {}
    return callback(null, @setValue(data, question, _.extend({}, answer.value or {}, accuracy: value)))

  updateLocationAltitude: (data, expr, value, callback) ->
    question = @formItems[expr.column.match(/^data:([^:]+):value:altitude$/)[1]]
    if not question
      return callback(new Error("Question #{expr.column} not found"))

    answer = data[question._id] or {}
    return callback(null, @setValue(data, question, _.extend({}, answer.value or {}, altitude: value)))

  updateQuantity: (data, expr, value, callback) ->
    question = @formItems[expr.column.match(/^data:([^:]+):value:quantity$/)[1]]
    if not question
      return callback(new Error("Question #{expr.column} not found"))

    answer = data[question._id] or {}
    return callback(null, @setValue(data, question, _.extend({}, answer.value or {}, quantity: value)))

  updateUnits: (data, expr, value, callback) ->
    question = @formItems[expr.column.match(/^data:([^:]+):value:units$/)[1]]
    if not question
      return callback(new Error("Question #{expr.column} not found"))

    answer = data[question._id] or {}
    return callback(null, @setValue(data, question, _.extend({}, answer.value or {}, units: value)))

  updateCBTMPN: (data, expr, value, callback) ->
    question = @formItems[expr.column.match(/^data:([^:]+):value:cbt:mpn$/)[1]]
    if not question
      return callback(new Error("Question #{expr.column} not found"))

    answer = data[question._id] or {}
    cbt = _.extend({}, answer.value?.cbt or {}, mpn: value)
    return callback(null, @setValue(data, question, _.extend({}, answer.value or {}, cbt: cbt)))

  updateCBTConfidence: (data, expr, value, callback) ->
    question = @formItems[expr.column.match(/^data:([^:]+):value:cbt:confidence$/)[1]]
    if not question
      return callback(new Error("Question #{expr.column} not found"))

    answer = data[question._id] or {}
    cbt = _.extend({}, answer.value?.cbt or {}, confidence: value)
    return callback(null, @setValue(data, question, _.extend({}, answer.value or {}, cbt: cbt)))
  
  updateCBTHealthRisk: (data, expr, value, callback) ->
    question = @formItems[expr.column.match(/^data:([^:]+):value:cbt:healthRisk$/)[1]]
    if not question
      return callback(new Error("Question #{expr.column} not found"))

    answer = data[question._id] or {}
    cbt = _.extend({}, answer.value?.cbt or {}, healthRisk: value)
    return callback(null, @setValue(data, question, _.extend({}, answer.value or {}, cbt: cbt)))
  
  updateCBTImage: (data, expr, value, callback) ->
    question = @formItems[expr.column.match(/^data:([^:]+):value:image$/)[1]]
    if not question
      return callback(new Error("Question #{expr.column} not found"))

    answer = data[question._id] or {}
    return callback(null, @setValue(data, question, _.extend({}, answer.value or {}, image: value)))

  updateEnumsetContains: (data, expr, value, callback) ->
    question = @formItems[expr.exprs[0].column.match(/^data:([^:]+):value$/)[1]]
    if not question
      return callback(new Error("Question #{expr.exprs[0].column} not found"))

    answerValue = data[question._id]?.value or []

    # Add to list if true
    if value == true
      answerValue = _.union(answerValue, [expr.exprs[1].value[0]])
    else if value == false
      answerValue = _.difference(answerValue, [expr.exprs[1].value[0]])

    return callback(null, @setValue(data, question, answerValue))

  updateSpecify: (data, expr, value, callback) ->
    question = @formItems[expr.column.match(/^data:([^:]+):specify:.+$/)[1]]
    if not question
      return callback(new Error("Question #{expr.column} not found"))

    specifyId = expr.column.match(/^data:[^:]+:specify:(.+)$/)[1]

    answer = data[question._id] or {}
    specify = answer.specify or {}
    change = {}
    change[specifyId] = value
    specify = _.extend({}, specify, change)
    return callback(null, @setAnswer(data, question, _.extend({}, answer, specify: specify)))

  # Update a Likert-style item
  updateItemsChoices: (data, expr, value, callback) ->
    question = @formItems[expr.column.match(/^data:([^:]+):value:.+$/)[1]]
    if not question
      return callback(new Error("Question #{expr.column} not found"))

    item = expr.column.match(/^data:.+:value:(.+)$/)[1]

    answerValue = data[question._id]?.value or {}
    change = {}
    change[item] = value
    answerValue = _.extend({}, answerValue, change)
    return callback(null, @setValue(data, question, answerValue))

  # Updates a matrix question
  updateMatrix: (data, expr, value, callback) ->
    question = @formItems[expr.column.match(/^data:([^:]+):value:.+$/)[1]]
    if not question
      return callback(new Error("Question #{expr.column} not found"))

    item = expr.column.match(/^data:[^:]+:value:(.+):.+:value(:.+)?$/)[1]
    column = expr.column.match(/^data:[^:]+:value:.+:(.+):value(:.+)?$/)[1]

    answerValue = data[question._id]?.value or {}
    itemPart = answerValue[item] or {}
    cellAnswer = itemPart[column] or {}
    cellValue = cellAnswer.value

    # If direct update (not quantity/units)
    if expr.column.match(/^data:[^:]+:value:(.+):.+:value$/)
      cellAnswer = { value: value }
      change = {}
      change[column] = cellAnswer
      itemPart = _.extend({}, itemPart, change)

      change = {}
      change[item] = itemPart
      answerValue = _.extend({}, answerValue, change)

      return callback(null, @setValue(data, question, answerValue))

    # If magnitude
    if expr.column.match(/^data:.+:value:(.+):.+:value:quantity$/)
      cellAnswer = { value: _.extend({}, cellValue or {}, quantity: value) }
      change = {}
      change[column] = cellAnswer
      itemPart = _.extend({}, itemPart, change)

      change = {}
      change[item] = itemPart
      answerValue = _.extend({}, answerValue, change)

      return callback(null, @setValue(data, question, answerValue))

    # If units
    if expr.column.match(/^data:.+:value:(.+):.+:value:units$/)
      cellAnswer = { value: _.extend({}, cellValue or {}, units: value) }
      change = {}
      change[column] = cellAnswer
      itemPart = _.extend({}, itemPart, change)

      change = {}
      change[item] = itemPart
      answerValue = _.extend({}, answerValue, change)

      return callback(null, @setValue(data, question, answerValue))

  updateComments: (data, expr, value, callback) ->
    question = @formItems[expr.column.match(/^data:(.+):comments$/)[1]]
    if not question
      return callback(new Error("Question #{expr.column} not found"))

    answer = data[question._id] or {}
    answer = _.extend({}, answer, comments: value)
    return callback(null, @setAnswer(data, question, answer))

  updateAlternate: (data, expr, value, callback) ->
    question = @formItems[expr.column.match(/^data:(.+):(.+)$/)[1]]
    if not question
      return callback(new Error("Question #{expr.column} not found"))

    alternate = expr.column.match(/^data:(.+):(.+)$/)[2]
    answer = data[question._id] or {}

    # Set if true
    if value and answer.alternate != alternate
      answer = _.extend({}, answer, alternate: alternate)
    else if not value and answer.alternate == alternate
      answer = _.extend({}, answer, alternate: null)

    return callback(null, @setAnswer(data, question, answer))

  setAnswer: (data, question, answer) ->
    change = {}
    change[question._id] = answer
    return _.extend({}, data, change)

  # Sets a value in data
  setValue: (data, question, value) ->
    answer = data[question._id] or {}
    answer.value = value
    return @setAnswer(data, question, answer)

  updateScalar: (data, expr, value, callback) ->
    question = @formItems[expr.joins[0].match(/^data:([^:]+):value$/)[1]]
    if not question
      return callback(new Error("Question #{expr.joins[0]} not found"))

    # If null, remove
    if not value?
      return callback(null, @setValue(data, question, null))

    # Create query to get _id or code, depending on question type
    exprCompiler = new ExprCompiler(@schema)
    if question._type == "SiteQuestion"
      # Site questions store code
      selectExpr = { type: "field", tableAlias: "main", column: "code" }
    else if question._type in ["EntityQuestion", "AdminRegionQuestion"]
      # Entity question store id
      selectExpr = { type: "field", tableAlias: "main", column: "_id" }
    else
      throw new Error("Unsupported type #{question._type}")

    # Query matches to the expression, limiting to 2 as we want exactly one match
    query = {
      type: "query"
      selects: [
        { type: "select", expr: selectExpr, alias: "value" }
      ]
      from: { type: "table", table: expr.expr.table, alias: "main" }
      where: {
        type: "op"
        op: "="
        exprs: [
          exprCompiler.compileExpr(expr: expr.expr, tableAlias: "main")
          value
        ]
      }
      limit: 2
    }

    # Perform query
    @dataSource.performQuery(query, (error, rows) =>
      if error
        return callback(error)

      # Only one result
      if rows.length == 0
        return callback(new Error("Value #{value} not found"))

      if rows.length > 1
        return callback(new Error("Value #{value} has multiple matches"))

      # Set value
      if question._type == "SiteQuestion"
        return callback(null, @setValue(data, question, { code: rows[0].value }))
      else if question._type in ["EntityQuestion", "AdminRegionQuestion"]
        return callback(null, @setValue(data, question, rows[0].value))
      else
        throw new Error("Unsupported type #{question._type}")
    )



