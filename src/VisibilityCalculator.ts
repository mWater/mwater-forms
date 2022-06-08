import _ from "lodash"
import * as formUtils from "./formUtils"
import async from "async"
import * as conditionUtils from "./conditionUtils"
import { PromiseExprEvaluator, PromiseExprEvaluatorRow, Schema } from "mwater-expressions"
import { BasicItem, Calculation, FormDesign, Group, Instructions, Item, MatrixColumn, MatrixColumnCalculation, MatrixColumnQuestion, MatrixColumnText, Question, RosterGroup, RosterMatrix, Section, Timer } from "./formDesign"
import { Answer, ResponseData, RosterData } from "./response"
import ResponseRow from "./ResponseRow"

/**
Uses conditions to defines the visibility status of all the Sections, Questions, Instructions, Group, RosterGroup and RosterMatrix
The result is kept in the visibilityStructure. It contains an entry with true or false for each element (should never be null or undefined)
A parent (like a section or a group), will always force visible to false for all their children if they are invisible.
The usage is fairly simple. It's created with a form and then the visibilityStructure is recalculated with specify data each time it changes.

Visibility is based both on simple conditions (see conditionUtils), but also on conditionExpr (advanced conditions made of mwater-expressions) 
which need access to the entities which the questions may reference.

Non-rosters are just referenced by id: e.g. { "somequestionid": true }

Unless it is a matrix, in which case it is referenced by "questionid.itemid.columnid"

Rosters are referenced by entry index: e.g. { "somerosterid.2.somequestionid": true }
*/
export default class VisibilityCalculator {
  formDesign: FormDesign
  schema: Schema

  constructor(formDesign: FormDesign, schema: Schema) {
    this.formDesign = formDesign
    this.schema = schema
  }

  /** Updates the visibilityStructure dictionary with one entry for each element
   * data is the data of the response
   * responseRow is a ResponseRow which represents the same row */
  createVisibilityStructure(
    data: ResponseData,
    responseRow: ResponseRow,
    callback: (error: any, visibilityStructure?: VisibilityStructure) => void
  ): void {
    const visibilityStructure = {}
    return this.processItem(this.formDesign, false, data, responseRow, visibilityStructure, "", (error: any) => {
      if (error) {
        return callback(error)
      } else {
        return callback(null, visibilityStructure)
      }
    })
  }

  // Process a form, section or a group (they both behave the same way when it comes to determining visibility)
  processGroup(
    item: FormDesign | Section | Group,
    forceToInvisible: any,
    data: any,
    responseRow: any,
    visibilityStructure: any,
    prefix: any,
    callback: any
  ): void {
    // Once visibility is calculated, call this
    let isVisible: any
    const applyResult = (isVisible: any) => {
      // Forms don't have an _id at design level
      if (item._type == "Group" || item._type == "Section") {
        visibilityStructure[prefix + item._id] = isVisible
      }

      return async.each(
        item.contents as any[],
        (subitem: Section | BasicItem, cb) => {
          return this.processItem(subitem, isVisible === false, data, responseRow, visibilityStructure, prefix, () =>
            _.defer(cb)
          )
        },
        callback
      )
    }

    // Always visible if no condition has been set
    if (forceToInvisible) {
      isVisible = false
    } else if ((item._type == "Group" || item._type == "Section") && item.conditions != null && item.conditions.length > 0) {
      const conditions = conditionUtils.compileConditions(item.conditions)
      isVisible = conditions(data)
    } else {
      isVisible = true
    }

    // Apply conditionExpr
    if ((item._type == "Group" || item._type == "Section") && item.conditionExpr) {
      new PromiseExprEvaluator({ schema: this.schema })
        .evaluate(item.conditionExpr, { row: responseRow })
        .then((value) => {
          // Null or false is not visible
          if (!value) {
            isVisible = false
          }

          applyResult(isVisible)
        })
        .catch((error) => callback(error))
    } else {
      applyResult(isVisible)
    }
  }

  // If the parent is invisible, forceToInvisible is set to true and the item will be invisible no matter what
  // The prefix contains the info set by a RosterGroup or a RosterMatrix
  processItem(
    item: Item | FormDesign,
    forceToInvisible: boolean,
    data: ResponseData,
    responseRow: ResponseRow,
    visibilityStructure: VisibilityStructure,
    prefix: any,
    callback: (error: any, visibilityStructure?: VisibilityStructure) => void
  ) {
    if (formUtils.isQuestionOrMatrixColumnQuestion(item)) {
      this.processQuestion(item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback)
    } else if (["TextColumn", "Calculation"].includes(item._type)) {
      this.processQuestion(item as MatrixColumnText | MatrixColumnCalculation, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback)
    } else if (item._type === "Instructions") {
      // Behaves like a question
      this.processQuestion(item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback)
    } else if (item._type === "Timer") {
      // Behaves like a question
      this.processQuestion(item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback)
    } else if (item._type === "RosterGroup" || item._type === "RosterMatrix") {
      this.processRoster(item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback)
    } else if (formUtils.isTypeWithContents(item)) {
      this.processGroup(item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback)
    } else {
      callback(new Error("Unknown item type " + item._type))
    }
  }

  // Sets visible to false if forceToInvisible is true or the conditions and data make the question invisible
  // The prefix contains the info set by a RosterGroup or a RosterMatrix
  processQuestion(
    question: Question | MatrixColumn | Instructions | Timer | Section | Group,
    forceToInvisible: boolean,
    data: ResponseData,
    responseRow: ResponseRow,
    visibilityStructure: VisibilityStructure,
    prefix: any,
    callback: (error: any, visibilityStructure?: VisibilityStructure) => void
  ) {
    // Once visibility is calculated, call this
    let isVisible: boolean

    const applyResult = (isVisible: boolean) => {
      visibilityStructure[prefix + question._id] = isVisible

      if (question._type === "MatrixQuestion") {
        return async.each(
          question.items,
          (item, cb) => {
            return async.each(
              question.columns,
              (column, cb2) => {
                const newPrefix = `${prefix}${question._id}.${item.id}.`
                return this.processItem(
                  column,
                  isVisible === false,
                  data,
                  responseRow,
                  visibilityStructure,
                  newPrefix,
                  () => _.defer(cb2)
                )
              },
              cb
            )
          },
          callback
        )
      } else {
        return callback(null)
      }
    }

    if (forceToInvisible) {
      isVisible = false
    } else if (!formUtils.isMatrixColumnQuestion(question) 
      && question._type != "TextColumn" 
      && question._type != "Calculation" 
      && question.conditions != null 
      && question.conditions.length > 0) {
      const conditions = conditionUtils.compileConditions(question.conditions)
      isVisible = conditions(data)
    } else {
      isVisible = true
    }

    // Apply randomAsk
    if (formUtils.isQuestion(question) && question.randomAskProbability != null && (data[question._id] as Answer)?.randomAsked === false) {
      isVisible = false
    }

    // Apply conditionExpr
    if (!formUtils.isFormDesign(question) && !formUtils.isMatrixColumn(question) && question.conditionExpr) {
      return new PromiseExprEvaluator({ schema: this.schema })
        .evaluate(question.conditionExpr, { row: responseRow })
        .then((value) => {
          // Null or false is not visible
          if (!value) {
            isVisible = false
          }

          return applyResult(isVisible)
        })
        .catch((error) => callback(error))
    } else {
      return applyResult(isVisible)
    }
  }

  // Handles RosterGroup and RosterMatrix
  // The visibility of the Rosters are similar to questions, the extra logic is for handling the children
  // The logic is a bit more tricky when a rosterId is set. It uses that other roster data for calculating the visibility of its children.
  processRoster(
    rosterGroup: RosterGroup | RosterMatrix,
    forceToInvisible: boolean,
    data: ResponseData,
    responseRow: ResponseRow,
    visibilityStructure: VisibilityStructure,
    prefix: any,
    callback: (error: any, visibilityStructure?: VisibilityStructure) => void
  ) {
    let isVisible: any
    if (rosterGroup._type !== "RosterGroup" && rosterGroup._type !== "RosterMatrix") {
      throw new Error("Should be a RosterGroup or RosterMatrix")
    }

    const applyResult = (isVisible: any) => {
      let dataId: any
      visibilityStructure[rosterGroup._id] = isVisible

      // The data used (and passed down to sub items) is the one specified by rosterId if set
      if (rosterGroup.rosterId != null) {
        dataId = rosterGroup.rosterId
        // Else the RosterGroup uses its own data
      } else {
        dataId = rosterGroup._id
      }
      const subData = data[dataId] as RosterData | undefined

      if (subData != null) {
        // Get subrows
        return responseRow
          .followJoin(`data:${dataId}`)
          .then((rosterRows: any) => {
            // For each entry of roster
            return async.forEachOf(
              subData,
              (entry, index, cb) => {
                return async.each(
                  rosterGroup.contents as any[],
                  (item: BasicItem | MatrixColumn, cb2) => {
                    const newPrefix = `${dataId}.${index}.`

                    // Data is actually stored in .data subfield
                    return this.processItem(
                      item,
                      isVisible === false,
                      entry.data,
                      rosterRows[index],
                      visibilityStructure,
                      newPrefix,
                      cb2
                    )
                  },
                  cb
                )
              },
              callback
            )
          })
          .catch(callback)
      } else {
        return callback(null)
      }
    }

    if (forceToInvisible) {
      isVisible = false
    } else if (rosterGroup.conditions != null && rosterGroup.conditions.length > 0) {
      const conditions = conditionUtils.compileConditions(rosterGroup.conditions)
      isVisible = conditions(data)
    } else {
      isVisible = true
    }

    // Apply conditionExpr
    if (rosterGroup.conditionExpr) {
      return new PromiseExprEvaluator({ schema: this.schema })
        .evaluate(rosterGroup.conditionExpr, { row: responseRow })
        .then((value) => {
          // Null or false is not visible
          if (!value) {
            isVisible = false
          }

          return applyResult(isVisible)
        })
        .catch((error) => callback(error))
    } else {
      return applyResult(isVisible)
    }
  }
}

/** Non-rosters are just referenced by id: e.g. { "somequestionid": true }
 * Unless it is a matrix, in which case it is referenced by "questionid.itemid.columnid"
 * Rosters are referenced by entry index: e.g. { "somerosterid.2.somequestionid": true }
 */
export interface VisibilityStructure {
  [key: string]: boolean
}
