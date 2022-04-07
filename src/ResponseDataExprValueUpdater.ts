import _ from "lodash"
import * as formUtils from "./formUtils"
import ResponseCleaner from "./ResponseCleaner"
import VisibilityCalculator, { VisibilityStructure } from "./VisibilityCalculator"
import RandomAskedCalculator from "./RandomAskedCalculator"
import { DataSource, Expr, ExprCompiler, FieldExpr, OpExpr, Row, ScalarExpr, Schema } from "mwater-expressions"
import ResponseDataValidator, { ResponseDataValidatorError } from "./ResponseDataValidator"
import { CascadingListQuestion, FormDesign, Item, Question, QuestionBase, SiteQuestion } from "./formDesign"
import { Answer, AquagenxCBTAnswerValue, CascadingListAnswerValue, ChoicesAnswerValue, ResponseData } from "./response"
import { ResponseRow } from "."
import { JsonQLExpr, JsonQLSelectQuery } from "jsonql"

/** Updates data in a response given an expression (mWater expression, see FormSchemaBuilder and also mwater-expressions package) and a value
 * When updates are complete for data, cleanData must be called to clean data (removing values that are invisble because of conditions).
 * and then call validateData to ensure that is valid
 */
export default class ResponseDataExprValueUpdater {
  formDesign: FormDesign
  schema: Schema
  dataSource: DataSource
  formItems: { [id: string]: Item }

  constructor(formDesign: FormDesign, schema: Schema, dataSource: DataSource) {
    this.formDesign = formDesign
    this.schema = schema
    this.dataSource = dataSource

    // Index all items for fast lookup
    this.formItems = {}
    for (let item of formUtils.allItems(this.formDesign)) {
      if (item._type != "Form") {
        if (item._id) {
          this.formItems[item._id] = item
        }
      }
    }
  }

  /** True if an expression can be updated */
  canUpdate(expr: Expr) {
    if (!expr) {
      return false
    }

    // Handle simple fields
    if (expr.type === "field") {
      if (expr.column.match(/^data:[^:]+:value(:.+)?$/)) {
        return true
      }

      // Comments field
      if (expr.column.match(/^data:[^:]+:comments$/)) {
        return true
      }

      // NA/Don't know field
      if (expr.column.match(/^data:[^:]+:na$/) || expr.column.match(/^data:[^:]+:dontknow$/)) {
        return true
      }

      // Specify field
      if (expr.column.match(/^data:[^:]+:specify:.+$/)) {
        return true
      }
    }

    if (
      expr.type === "op" &&
      ["latitude", "longitude"].includes(expr.op) &&
      expr.exprs[0]!.type === "field" &&
      (expr.exprs[0] as any).column.match(/^data:[^:]+:value$/)
    ) {
      return true
    }

    // Can update scalar with single join
    if (expr.type === "scalar" && expr.joins.length === 1 && expr.joins[0].match(/^data:.+$/)) {
      return true
    }

    if (
      expr.type === "op" &&
      expr.op === "contains" &&
      expr.exprs[0]!.type === "field" &&
      (expr.exprs[0] as any).column.match(/^data:[^:]+:value$/) &&
      ((expr.exprs[1] as any).value != null ? (expr.exprs[1] as any).value.length : undefined) === 1
    ) {
      return true
    }

    return false
  }

  /** Cleans data. Must be called after last update is done.
   * createResponseRow takes one parameter (data) and returns a response row
   */
  cleanData(data: ResponseData, createResponseRow: (data: ResponseData) => ResponseRow): Promise<ResponseData>
  cleanData(
    data: ResponseData,
    createResponseRow: (data: ResponseData) => ResponseRow,
    callback: (error: any, cleanedData?: ResponseData) => void
  ): void
  cleanData(
    data: ResponseData,
    createResponseRow: (data: ResponseData) => ResponseRow,
    callback?: (error: any, cleanedData?: ResponseData) => void
  ): void | Promise<ResponseData> {
    // Support older callback method
    if (callback) {
      this.cleanData(data, createResponseRow)
        .then((cleanedData) => {
          callback(null, cleanedData)
        })
        .catch((error) => callback(error))
      return
    }

    // Compute visibility
    const visibilityCalculator = new VisibilityCalculator(this.formDesign, this.schema)
    const randomAskedCalculator = new RandomAskedCalculator(this.formDesign)
    const responseCleaner = new ResponseCleaner()
    return new Promise((resolve, reject) => {
      responseCleaner.cleanData(
        this.formDesign,
        visibilityCalculator,
        null,
        randomAskedCalculator,
        data,
        createResponseRow,
        null,
        (error: any, results: any) => {
          if (error) {
            reject(error)
          } else {
            resolve(results!.data)
          }
        }
      )
    })
  }

  /** Validates the data. Clean first. */
  validateData(data: ResponseData, responseRow: ResponseRow): Promise<ResponseDataValidatorError | null>
  validateData(
    data: ResponseData,
    responseRow: ResponseRow,
    callback: (error: any, result?: ResponseDataValidatorError | null) => void
  ): void
  validateData(
    data: ResponseData,
    responseRow: ResponseRow,
    callback?: (error: any, result?: ResponseDataValidatorError | null) => void
  ): void | Promise<ResponseDataValidatorError | null> {
    // Support older callback method
    if (callback) {
      this.validateData(data, responseRow)
        .then((result) => {
          callback(null, result)
        })
        .catch((error) => callback(error))
      return
    }

    const visibilityCalculator = new VisibilityCalculator(this.formDesign, this.schema)
    return new Promise((resolve, reject) => {
      visibilityCalculator.createVisibilityStructure(data, responseRow, (error: any, visibilityStructure: any) => {
        if (error) {
          reject(error)
          return
        }
        new ResponseDataValidator()
          .validate(this.formDesign, visibilityStructure, data, this.schema, responseRow)
          .then(resolve)
          .catch(reject)
      })
    })
  }

  /** Updates the data of a response, given multiple expressions and their values.
   * This is the preferred way to do multiple updates instead of calling updateData repeatedly,
   * as some expressions may depend on another. For example, if there are two scalar expressions
   * for the same join, then the search for the underlying id value must take into account
   * both constraints (e.g. updating based on water point name and type)
   */
  async updateDataMultiple(data: ResponseData, exprValues: { expr: Expr; value: any }[]): Promise<ResponseData> {
    // Do all updates except for scalar ones
    for (const exprValue of exprValues.filter((ev) => ev.expr!.type != "scalar")) {
      data = await this.updateData(data, exprValue.expr, exprValue.value)
    }

    // Group scalar ones by join and perform each as a group
    const scalarEvs = exprValues
      .filter((ev) => ev.expr!.type == "scalar")
      .map((ev) => ({ expr: ev.expr as ScalarExpr, value: ev.value }))
    const grouped = _.groupBy(scalarEvs, (ev) => ev.expr.joins[0])
    for (const group of Object.values(grouped)) {
      data = await this.updateScalar(
        data,
        group[0].expr.joins[0],
        group.map((ev) => ({ expr: ev.expr.expr, value: ev.value }))
      )
    }

    return data
  }

  /** Updates the data of a response, given an expression and its value. For example,
   * if there is a text field in question q1234, the expression { type: "field", table: "responses:form123", column: "data:q1234:value" }
   * refers to the text field value. Setting it will set data.q1234.value in the data.
   */
  updateData(data: ResponseData, expr: Expr, value: any): Promise<ResponseData>
  updateData(
    data: ResponseData,
    expr: Expr,
    value: any,
    callback: (error: any, responseData?: ResponseData) => void
  ): void
  updateData(
    data: ResponseData,
    expr: Expr,
    value: any,
    callback?: (error: any, responseData?: ResponseData) => void
  ): void | Promise<ResponseData> {
    // Support newer promise method
    if (!callback) {
      return new Promise((resolve, reject) => {
        this.updateData(data, expr, value, (error, responseData) => {
          if (error) {
            reject(error)
          } else {
            resolve(responseData!)
          }
        })
      })
    }

    let matches
    if (!expr || !this.canUpdate(expr)) {
      callback(new Error(`Cannot update expression: ${JSON.stringify(expr)}`))
      return
    }

    // Handle simple fields
    if (expr.type === "field" && expr.column.match(/^data:[^:]+:value$/)) {
      this.updateValue(data, expr, value, callback)
      return
    }

    // Handle quantity and units
    if (expr.type === "field" && expr.column.match(/^data:[^:]+:value:quantity$/)) {
      this.updateQuantity(data, expr, value, callback)
      return
    }

    if (expr.type === "field" && expr.column.match(/^data:[^:]+:value:units$/)) {
      this.updateUnits(data, expr, value, callback)
      return
    }

    // Handle latitude/longitude of location question
    if (
      expr.type === "op" &&
      ["latitude", "longitude"].includes(expr.op) &&
      (expr.exprs[0] as any).type === "field" &&
      (expr.exprs[0] as any).column.match(/^data:.+:value$/)
    ) {
      this.updateLocationLatLng(data, expr, value, callback)
      return
    }

    // Handle location altitude
    if (expr.type === "field" && expr.column.match(/^data:[^:]+:value:altitude$/)) {
      this.updateLocationAltitude(data, expr, value, callback)
      return
    }

    // Handle location accuracy
    if (expr.type === "field" && expr.column.match(/^data:[^:]+:value:accuracy$/)) {
      this.updateLocationAccuracy(data, expr, value, callback)
      return
    }

    // Handle location method
    if (expr.type === "field" && expr.column.match(/^data:[^:]+:value:method$/)) {
      this.updateLocationMethod(data, expr, value, callback)
      return
    }

    // Handle CBT fields
    if (
      expr.type === "field" &&
      (matches = expr.column.match(/^data:[^:]+:value:cbt:(mpn|c1|c2|c3|c4|c5|confidence|healthRisk)$/))
    ) {
      this.updateCBTField(data, expr, value, matches[1], callback)
      return
    }

    // Handle CBT image
    // TODO: This does not just match an AquagenX question but any thing that has image property besides value!
    if (expr.type === "field" && expr.column.match(/^data:[^:]+:value:image$/)) {
      this.updateCBTImage(data, expr, value, callback)
      return
    }

    // Handle Likert (items_choices) and Matrix
    if (expr.type === "field" && expr.column.match(/^data:[^:]+:value:.+$/)) {
      const question = this.formItems[expr.column.match(/^data:([^:]+):value:.+$/)![1]]
      if (!question) {
        return callback(new Error(`Question ${expr.column} not found`))
      }

      const answerType = formUtils.getAnswerType(question as QuestionBase)
      if (answerType === "items_choices") {
        this.updateItemsChoices(data, expr, value, callback)
        return
      }

      if (answerType === "matrix") {
        this.updateMatrix(data, expr, value, callback)
        return
      }

      if (answerType === "cascading_list") {
        this.updateCascadingList(data, expr, value, callback)
        return
      }
    }

    // Handle contains for enumset with one value
    if (
      expr.type === "op" &&
      expr.op === "contains" &&
      (expr.exprs[0] as any).type === "field" &&
      (expr.exprs[0] as any).column.match(/^data:.+:value$/) &&
      ((expr.exprs[1] as any).value != null ? (expr.exprs[1] as any).value.length : undefined) === 1
    ) {
      this.updateEnumsetContains(data, expr, value, callback)
      return
    }

    // Handle specify
    if (expr.type === "field" && expr.column.match(/^data:[^:]+:specify:.+$/)) {
      this.updateSpecify(data, expr, value, callback)
      return
    }

    // Handle comments
    if (expr.type === "field" && expr.column.match(/^data:[^:]+:comments$/)) {
      this.updateComments(data, expr, value, callback)
      return
    }

    // Handle alternate
    if (expr.type === "field" && expr.column.match(/^data:[^:]+:(na|dontknow)$/)) {
      this.updateAlternate(data, expr, value, callback)
      return
    }

    // Can update scalar with single join, non-aggr
    if (expr.type === "scalar" && expr.joins.length === 1 && expr.joins[0].match(/^data:.+:value$/)) {
      this.updateScalar(data, expr.joins[0], [{ expr: expr.expr, value }])
        .then((result) => callback(null, result))
        .catch((error) => callback(error))
      return
    }

    return callback(new Error(`Cannot update expr ${JSON.stringify(expr)}`))
  }

  // Updates a value of a cascading list question
  updateCascadingList(
    data: ResponseData,
    expr: FieldExpr,
    value: any,
    callback: (error: any, responseData?: ResponseData) => void
  ) {
    const [field, questionId, column] = expr.column.match(/^data:([^:]+):value:(c\d)$/)!

    const question = this.formItems[questionId] as CascadingListQuestion | undefined

    if (!question) {
      return callback(new Error(`Question ${expr.column} not found`))
    }

    // Find column
    const colObj = _.find(question.columns, { id: column })
    if (!colObj) {
      return callback(new Error(`Column ${column} in question ${expr.column} not found`))
    }

    // Check that value is valid
    if (!_.find(colObj.enumValues, { id: value })) {
      return callback(
        new Error(
          `Column "${colObj.name[colObj.name._base]}" value ${value} in question "${
            question.text[question.text._base]
          }" not found`
        )
      )
    }

    // Get answer value and set new value
    const answerValue = _.cloneDeep(
      (data[questionId] != null ? (data[questionId] as Answer).value : undefined) || {}
    ) as CascadingListAnswerValue
    answerValue[column] = value

    // Clear id, as it will change with the update
    delete answerValue.id

    // Check that row possibly exists
    let rows = question.rows.slice()
    for (var key in answerValue) {
      rows = _.filter(rows, (r) => r[key] === answerValue[key])
    }

    if (rows.length === 0) {
      return callback(new Error(`Row referenced in question "${question.text[question.text._base]}" not found`))
    }

    return callback(null, this.setValue(data, question, answerValue))
  }

  // Updates a value of a question, e.g. data:somequestion:value
  updateValue(
    data: ResponseData,
    expr: FieldExpr,
    value: any,
    callback: (error: any, responseData?: ResponseData) => void
  ) {
    const question = this.formItems[expr.column.match(/^data:([^:]+):value$/)![1]] as Question | undefined
    if (!question) {
      return callback(new Error(`Question ${expr.column} not found`))
    }

    // Get type of answer
    const answerType = formUtils.getAnswerType(question as Question)
    switch (answerType) {
      case "text":
      case "number":
      case "choice":
      case "choices":
      case "date":
      case "boolean":
      case "image":
      case "images":
      case "texts":
      case "cascading_ref":
        return callback(null, this.setValue(data, question, value))
      case "location":
        // Convert from GeoJSON to lat/lng
        if (!value) {
          return callback(null, this.setValue(data, question, value))
        }

        if (value.type !== "Point") {
          return callback(new Error(`GeoJSON type ${value.type} not supported`))
        }

        var val = _.extend({}, (data[question._id] != null ? (data[question._id] as Answer).value : undefined) || {}, {
          latitude: value.coordinates[1],
          longitude: value.coordinates[0]
        })
        return callback(null, this.setValue(data, question, val))
      case "site":
        // Pretend it was a scalar update, as there is already code for that
        var entityType = formUtils.getSiteEntityType(question as SiteQuestion)
        return this.updateScalar(data, expr.column, [{ expr: { type: "id", table: `entities.${entityType}` }, value }])
          .then((result) => callback(null, result))
          .catch((error) => callback(error))
      default:
        return callback(new Error(`Answer type ${answerType} not supported`))
    }
  }

  // Update a single latitude or longitude of a location
  updateLocationLatLng(
    data: ResponseData,
    expr: OpExpr,
    value: any,
    callback: (error: any, responseData?: ResponseData) => void
  ) {
    let val
    const question = this.formItems[(expr.exprs[0] as any).column.match(/^data:([^:]+):value$/)[1]] as
      | Question
      | undefined
    if (!question) {
      return callback(new Error(`Question ${(expr.exprs[0] as any).column} not found`))
    }

    if (expr.op === "latitude") {
      val = _.extend({}, (data[question._id] != null ? (data[question._id] as Answer).value : undefined) || {}, {
        latitude: value
      })
    } else if (expr.op === "longitude") {
      val = _.extend({}, (data[question._id] != null ? (data[question._id] as Answer).value : undefined) || {}, {
        longitude: value
      })
    } else {
      throw new Error(`Unsupported op ${expr.op}`)
    }

    return callback(null, this.setValue(data, question, val))
  }

  updateLocationMethod(
    data: ResponseData,
    expr: FieldExpr,
    value: any,
    callback: (error: any, responseData?: ResponseData) => void
  ) {
    const question = this.formItems[expr.column.match(/^data:([^:]+):value:method$/)![1]] as Question | undefined
    if (!question) {
      return callback(new Error(`Question ${expr.column} not found`))
    }

    const answer = (data[question._id] || {}) as Answer
    return callback(null, this.setValue(data, question, _.extend({}, answer.value || {}, { method: value })))
  }

  updateLocationAccuracy(
    data: ResponseData,
    expr: FieldExpr,
    value: any,
    callback: (error: any, responseData?: ResponseData) => void
  ) {
    const question = this.formItems[expr.column.match(/^data:([^:]+):value:accuracy$/)![1]] as Question | undefined
    if (!question) {
      return callback(new Error(`Question ${expr.column} not found`))
    }

    const answer = (data[question._id] || {}) as Answer
    return callback(null, this.setValue(data, question, _.extend({}, answer.value || {}, { accuracy: value })))
  }

  updateLocationAltitude(
    data: ResponseData,
    expr: FieldExpr,
    value: any,
    callback: (error: any, responseData?: ResponseData) => void
  ) {
    const question = this.formItems[expr.column.match(/^data:([^:]+):value:altitude$/)![1]] as Question | undefined
    if (!question) {
      return callback(new Error(`Question ${expr.column} not found`))
    }

    const answer = (data[question._id] || {}) as Answer
    return callback(null, this.setValue(data, question, _.extend({}, answer.value || {}, { altitude: value })))
  }

  updateQuantity(
    data: ResponseData,
    expr: FieldExpr,
    value: any,
    callback: (error: any, responseData?: ResponseData) => void
  ) {
    const question = this.formItems[expr.column.match(/^data:([^:]+):value:quantity$/)![1]] as Question | undefined
    if (!question) {
      return callback(new Error(`Question ${expr.column} not found`))
    }

    const answer = (data[question._id] || {}) as Answer
    callback(null, this.setValue(data, question, _.extend({}, answer.value || {}, { quantity: value })))
  }

  updateUnits(
    data: ResponseData,
    expr: FieldExpr,
    value: any,
    callback: (error: any, responseData?: ResponseData) => void
  ) {
    const question = this.formItems[expr.column.match(/^data:([^:]+):value:units$/)![1]] as Question | undefined
    if (!question) {
      return callback(new Error(`Question ${expr.column} not found`))
    }

    const answer = (data[question._id] || {}) as Answer
    callback(null, this.setValue(data, question, _.extend({}, answer.value || {}, { units: value })))
  }

  updateCBTField(
    data: ResponseData,
    expr: FieldExpr,
    value: any,
    cbtField: string,
    callback: (error: any, responseData?: ResponseData) => void
  ) {
    const pattern = new RegExp(`^data:([^:]+):value:cbt:${cbtField}$`)
    const question = this.formItems[expr.column.match(pattern)![1]] as Question | undefined
    if (!question) {
      return callback(new Error(`Question ${expr.column} not found`))
    }

    const answer = (data[question._id] || {}) as Answer
    const updates = {}
    updates[cbtField] = value
    const cbt = _.extend(
      {},
      (answer.value != null ? (answer.value as AquagenxCBTAnswerValue).cbt : undefined) || {},
      updates
    )
    callback(null, this.setValue(data, question, _.extend({}, answer.value || {}, { cbt })))
  }

  updateCBTImage(
    data: ResponseData,
    expr: FieldExpr,
    value: any,
    callback: (error: any, responseData?: ResponseData) => void
  ) {
    const question = this.formItems[expr.column.match(/^data:([^:]+):value:image$/)![1]] as Question | undefined
    if (!question) {
      return callback(new Error(`Question ${expr.column} not found`))
    }

    const answer = (data[question._id] || {}) as Answer
    callback(null, this.setValue(data, question, _.extend({}, answer.value || {}, { image: value })))
  }

  updateEnumsetContains(
    data: ResponseData,
    expr: OpExpr,
    value: any,
    callback: (error: any, responseData?: ResponseData) => void
  ) {
    const question = this.formItems[(expr.exprs[0] as any).column.match(/^data:([^:]+):value$/)[1]] as
      | Question
      | undefined
    if (!question) {
      return callback(new Error(`Question ${(expr.exprs[0] as any).column} not found`))
    }

    let answerValue: string[] =
      (data[question._id] != null ? ((data[question._id] as Answer).value as ChoicesAnswerValue) : undefined) || []

    // Add to list if true
    if (value === true) {
      answerValue = _.union(answerValue, [(expr.exprs[1] as any).value[0]])
    } else if (value === false) {
      answerValue = _.difference(answerValue, [(expr.exprs[1] as any).value[0]])
    }

    callback(null, this.setValue(data, question, answerValue))
  }

  updateSpecify(
    data: ResponseData,
    expr: FieldExpr,
    value: any,
    callback: (error: any, responseData?: ResponseData) => void
  ) {
    const question = this.formItems[expr.column.match(/^data:([^:]+):specify:.+$/)![1]] as Question | undefined
    if (!question) {
      return callback(new Error(`Question ${expr.column} not found`))
    }

    const specifyId = expr.column.match(/^data:[^:]+:specify:(.+)$/)![1]

    const answer = (data[question._id] || {}) as Answer
    let specify = answer.specify || {}
    const change = {}
    change[specifyId] = value
    specify = _.extend({}, specify, change)
    callback(null, this.setAnswer(data, question, _.extend({}, answer, { specify })))
  }

  // Update a Likert-style item
  updateItemsChoices(
    data: ResponseData,
    expr: FieldExpr,
    value: any,
    callback: (error: any, responseData?: ResponseData) => void
  ) {
    const question = this.formItems[expr.column.match(/^data:([^:]+):value:.+$/)![1]] as Question | undefined
    if (!question) {
      return callback(new Error(`Question ${expr.column} not found`))
    }

    const item = expr.column.match(/^data:.+:value:(.+)$/)![1]

    let answerValue = (data[question._id] != null ? (data[question._id] as Answer).value : undefined) || {}
    const change = {}
    change[item] = value
    answerValue = _.extend({}, answerValue, change)
    callback(null, this.setValue(data, question, answerValue))
  }

  // Updates a matrix question
  updateMatrix(
    data: ResponseData,
    expr: FieldExpr,
    value: any,
    callback: (error: any, responseData?: ResponseData) => void
  ) {
    let change
    const question = this.formItems[expr.column.match(/^data:([^:]+):value:.+$/)![1]] as Question | undefined
    if (!question) {
      return callback(new Error(`Question ${expr.column} not found`))
    }

    const item = expr.column.match(/^data:[^:]+:value:(.+):.+:value(:.+)?$/)![1]
    const column = expr.column.match(/^data:[^:]+:value:.+:(.+):value(:.+)?$/)![1]

    let answerValue = (data[question._id] != null ? (data[question._id] as Answer).value : undefined) || {}
    let itemPart = answerValue[item] || {}
    let cellAnswer = itemPart[column] || {}
    const cellValue = cellAnswer.value

    // If direct update (not quantity/units)
    if (expr.column.match(/^data:[^:]+:value:(.+):.+:value$/)) {
      cellAnswer = { value }
      change = {}
      change[column] = cellAnswer
      itemPart = _.extend({}, itemPart, change)

      change = {}
      change[item] = itemPart
      answerValue = _.extend({}, answerValue, change)

      return callback(null, this.setValue(data, question, answerValue))
    }

    // If magnitude
    if (expr.column.match(/^data:.+:value:(.+):.+:value:quantity$/)) {
      cellAnswer = { value: _.extend({}, cellValue || {}, { quantity: value }) }
      change = {}
      change[column] = cellAnswer
      itemPart = _.extend({}, itemPart, change)

      change = {}
      change[item] = itemPart
      answerValue = _.extend({}, answerValue, change)

      return callback(null, this.setValue(data, question, answerValue))
    }

    // If units
    if (expr.column.match(/^data:.+:value:(.+):.+:value:units$/)) {
      cellAnswer = { value: _.extend({}, cellValue || {}, { units: value }) }
      change = {}
      change[column] = cellAnswer
      itemPart = _.extend({}, itemPart, change)

      change = {}
      change[item] = itemPart
      answerValue = _.extend({}, answerValue, change)

      return callback(null, this.setValue(data, question, answerValue))
    }
  }

  updateComments(
    data: ResponseData,
    expr: FieldExpr,
    value: any,
    callback: (error: any, responseData?: ResponseData) => void
  ) {
    const question = this.formItems[expr.column.match(/^data:(.+):comments$/)![1]] as Question | undefined
    if (!question) {
      return callback(new Error(`Question ${expr.column} not found`))
    }

    let answer = (data[question._id] || {}) as Answer
    answer = _.extend({}, answer, { comments: value })
    return callback(null, this.setAnswer(data, question, answer))
  }

  updateAlternate(
    data: ResponseData,
    expr: FieldExpr,
    value: any,
    callback: (error: any, responseData?: ResponseData) => void
  ) {
    const question = this.formItems[expr.column.match(/^data:(.+):(.+)$/)![1]] as Question | undefined
    if (!question) {
      return callback(new Error(`Question ${expr.column} not found`))
    }

    const alternate = expr.column.match(/^data:(.+):(.+)$/)![2]
    let answer = (data[question._id] || {}) as Answer

    // Set if true
    if (value && answer.alternate !== alternate) {
      answer = _.extend({}, answer, { alternate })
    } else if (!value && answer.alternate === alternate) {
      answer = _.extend({}, answer, { alternate: null })
    }

    return callback(null, this.setAnswer(data, question, answer))
  }

  setAnswer(data: ResponseData, question: Question, answer: Answer): ResponseData {
    const change = {}
    change[question._id] = answer
    return _.extend({}, data, change)
  }

  // Sets a value in data
  setValue(data: ResponseData, question: Question, value: any) {
    const answer = (data[question._id] || {}) as Answer
    answer.value = value
    return this.setAnswer(data, question, answer)
  }

  /** Update a scalar, which may have multiple expressions to determine the row referenced */
  async updateScalar(
    data: ResponseData,
    join: string,
    exprValues: { expr: Expr; value: any }[]
  ): Promise<ResponseData> {
    let selectExpr: JsonQLExpr

    // Lookup question
    const question = this.formItems[join.match(/^data:([^:]+):value$/)![1]] as Question | undefined
    if (!question) {
      throw new Error(`Question ${join} not found`)
    }

    // If all values null, remove
    if (exprValues.every((ev) => ev.value == null)) {
      return this.setValue(data, question, null)
    }

    // Shortcut for site question where we have code already
    if (
      question._type === "SiteQuestion" &&
      exprValues.length == 1 &&
      exprValues[0].expr!.type == "field" &&
      (exprValues[0].expr as FieldExpr).column === "code"
    ) {
      return this.setValue(data, question, { code: exprValues[0].value })
    }

    // Create query to get _id or code, depending on question type
    const exprCompiler = new ExprCompiler(this.schema)
    if (question._type === "SiteQuestion") {
      // Site questions store code
      selectExpr = { type: "field", tableAlias: "main", column: "code" }
    } else if (["EntityQuestion", "AdminRegionQuestion", "CascadingRefQuestion"].includes(question._type)) {
      // Entity question etc store _id
      selectExpr = { type: "field", tableAlias: "main", column: "_id" }
    } else {
      throw new Error(`Unsupported type ${question._type}`)
    }

    // Query matches to the expression, limiting to 2 as we want exactly one match
    const table = (exprValues[0].expr as FieldExpr).table
    const query: JsonQLSelectQuery = {
      type: "query",
      selects: [{ type: "select", expr: selectExpr, alias: "value" }],
      from: { type: "table", table: table, alias: "main" },
      where: {
        type: "op",
        op: "and",
        exprs: exprValues.map((ev) => ({
          type: "op",
          op: "=",
          exprs: [exprCompiler.compileExpr({ expr: ev.expr, tableAlias: "main" }), ev.value]
        }))
      },
      limit: 2
    }

    // Perform query
    const rows = await new Promise<Row[]>((resolve, reject) =>
      this.dataSource.performQuery(query, (error, rows) => {
        if (error) {
          return reject(error)
        } else {
          resolve(rows)
        }
      })
    )

    // Only one result
    if (rows.length === 0) {
      throw new Error(`Value ${exprValues.map((ev) => ev.value + "").join(", ")} not found`)
    }

    if (rows.length > 1) {
      throw new Error(`Value ${exprValues.map((ev) => ev.value + "").join(", ")} has multiple matches`)
    }

    // Set value
    if (question._type === "SiteQuestion") {
      return this.setValue(data, question, { code: rows[0].value })
    } else if (["EntityQuestion", "AdminRegionQuestion", "CascadingRefQuestion"].includes(question._type)) {
      return this.setValue(data, question, rows[0].value)
    } else {
      throw new Error(`Unsupported type ${question._type}`)
    }
  }
}
