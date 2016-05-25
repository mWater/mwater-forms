formUtils = require './formUtils'
ResponseCleaner = require './ResponseCleaner'
VisibilityCalculator = require './VisibilityCalculator'
ExprCompiler = require('mwater-expressions').ExprCompiler

# Updates data in a response given an expression (mWater expression, see FormSchemaBuilder and also mwater-expressions package) and a value
# When updates are complete for data, cleanData must be called to clean data (removing values that are invisble because of conditions).
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
      if expr.column.match(/^data:.+:value(:.+)?$/) 
        return true

      # Comments field
      if expr.column.match(/^data:.+:comments$/)
        return true

      # NA/Don't know field
      if expr.column.match(/^data:.+:na$/) or expr.column.match(/^data:.+:dontknow$/)
        return true

      # Specify field
      if expr.column.match(/^data:.+:specify:.+$/)
        return true

    # Can update scalar with single join, non-aggr
    if expr.type == "scalar" and expr.joins.length == 1 and not expr.aggr
      return true

    return false    

  # Cleans data. Must be called after last update is done.
  cleanData: (data) ->
    # Compute visibility
    visibilityCalculator = new VisibilityCalculator(@formDesign)
    visibilityStructure = visibilityCalculator.createVisibilityStructure(data)

    responseCleaner = new ResponseCleaner()
    data = responseCleaner.cleanData(data, visibilityStructure, @formDesign)
    return data

  # Updates the data of a response, given an expression and its value. For example,
  # if there is a text field in question q1234, the expression { type: "field", table: "responses:form123", column: "data:q1234:value" }
  # refers to the text field value. Setting it will set data.q1234.value in the data.
  updateData: (data, expr, value, callback) ->
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

    # Handle Likert (items_choices) and Matrix
    if expr.type == "field" and expr.column.match(/^data:.+:value:.+$/)
      question = @formItems[expr.column.match(/^data:(.+):value:.+$/)[1]]
      if not question
        return callback(new Error("Question #{expr.column} not found"))

      answerType = formUtils.getAnswerType(question)
      if answerType == "items_choices"
        @updateItemsChoices(data, expr, value, callback)
        return

      if answerType == "matrix"
        @updateMatrix(data, expr, value, callback)
        return
    
    # Handle comments
    if expr.type == "field" and expr.column.match(/^data:.+:comments$/)
      @updateComments(data, expr, value, callback)
      return

    # Handle alternate
    if expr.type == "field" and expr.column.match(/^data:.+:(na|dontknow)$/)
      @updateAlternate(data, expr, value, callback)
      return

    # Can update scalar with single join, non-aggr
    if expr.type == "scalar" and expr.joins.length == 1 and not expr.aggr and expr.joins[0].match(/^data:.+:value$/)
      @updateScalar(data, expr, value, callback) 

    callback(new Error("Cannot update expr #{JSON.stringify(expr)}"))

  # Updates a value of a question, e.g. data:somequestion:value
  updateValue: (data, expr, value, callback) ->
    question = @formItems[expr.column.match(/^data:(.+):value$/)[1]]
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

  updateQuantity: (data, expr, value, callback) ->
    question = @formItems[expr.column.match(/^data:(.+):value:quantity$/)[1]]
    if not question
      return callback(new Error("Question #{expr.column} not found"))

    answer = data[question._id] or {}
    return callback(null, @setValue(data, question, _.extend({}, answer.value or {}, quantity: value)))

  updateUnits: (data, expr, value, callback) ->
    question = @formItems[expr.column.match(/^data:(.+):value:units$/)[1]]
    if not question
      return callback(new Error("Question #{expr.column} not found"))

    answer = data[question._id] or {}
    return callback(null, @setValue(data, question, _.extend({}, answer.value or {}, units: value)))

  # Update a Likert-style item
  updateItemsChoices: (data, expr, value, callback) ->
    question = @formItems[expr.column.match(/^data:(.+):value:.+$/)[1]]
    if not question
      return callback(new Error("Question #{expr.column} not found"))

    item = expr.column.match(/^data:.+:value:(.+)$/)[1]

    answerValue = data[question._id]?.value or {}
    change = {}
    change[item] = value
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
    question = @formItems[expr.joins[0].match(/^data:(.+):value$/)[1]]
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



