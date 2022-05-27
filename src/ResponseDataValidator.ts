import { Schema } from "mwater-expressions"
import { ResponseRow } from "."
import { FormDesign, Group, RosterGroup, RosterMatrix, Section } from "./formDesign"
import { Answer, ResponseData, RosterData } from "./response"
import { VisibilityStructure } from "./VisibilityCalculator"
import AnswerValidator from "./answers/AnswerValidator"
import ValidationCompiler from "./answers/ValidationCompiler"
import * as formUtils from "./formUtils"

export interface ResponseDataValidatorError {
  /** _id of the question causing error */
  questionId: string

  /** true for required, message otherwise */
  error: string | true

  /** complete message including question text */
  message: string
}

/** ResponseDataValidator checks whether the entire data is valid for a response */
export default class ResponseDataValidator {
  /** It returns null if everything is fine
   * It makes sure required questions are properly answered
   * It checks custom validations
   * It returns the id of the question that caused the error, the error and a message which is includes the error and question
   * e.g. { questionId: someid, error: true for required, message otherwise, message: complete message including question text }
   *     If the question causing the error is nested (like a Matrix), the questionId is separated by a .
   *     RosterMatrix   -> matrixId.index.columnId
   *     RosterGroup   -> rosterGroupId.index.questionId
   *     QuestionMatrix -> matrixId.itemId.columnId
   */
  validate(
    formDesign: FormDesign,
    visibilityStructure: VisibilityStructure,
    data: ResponseData,
    schema: Schema,
    responseRow: ResponseRow
  ): Promise<ResponseDataValidatorError | null> {
    return this.validateParentItem(formDesign, visibilityStructure, data, schema, responseRow, "")
  }

  // Validates an parent row
  //   keyPrefix: the part before the row id in the visibility structure. For rosters
  async validateParentItem(
    parentItem: Section | Group | RosterGroup | RosterMatrix | FormDesign,
    visibilityStructure: VisibilityStructure,
    data: ResponseData,
    schema: Schema,
    responseRow: ResponseRow,
    keyPrefix: string
  ): Promise<ResponseDataValidatorError | null> {
    // Create validator
    const answerValidator = new AnswerValidator(schema, responseRow, "en")

    // For each item
    for (let item of parentItem.contents) {
      // If not visible, ignore
      var result
      if (!visibilityStructure[`${keyPrefix}${item._id}`]) {
        continue
      }

      if (item._type === "Section" || item._type === "Group") {
        result = await this.validateParentItem(item, visibilityStructure, data, schema, responseRow, keyPrefix)
        if (result != null) {
          return result
        }
      }

      if (item._type == "RosterGroup" || item._type == "RosterMatrix") {
        const answerId = item.rosterId || item._id
        const rosterData = (data[answerId] || []) as RosterData
        const rosterResponseRows = (await responseRow.followJoin(`data:${answerId}`)) as ResponseRow[]

        for (let index = 0; index < rosterData.length; index++) {
          // Key prefix is itemid.indexinroster.
          const entry = rosterData[index]
          result = await this.validateParentItem(
            item,
            visibilityStructure,
            entry.data,
            schema,
            rosterResponseRows[index],
            `${keyPrefix}${answerId}.${index}.`
          )
          if (result != null) {
            return {
              questionId: `${item._id}.${index}.${result.questionId}`,
              error: result.error,
              message: formUtils.localizeString(item.name) + ` (${index + 1})` + result.message
            }
          }
        }
      }

      if (formUtils.isQuestionOrMatrixColumnQuestion(item)) {
        const answer = (data[item._id] || {}) as Answer

        if (item._type === "MatrixQuestion") {
          for (let rowIndex = 0; rowIndex < item.items.length; rowIndex++) {
            // For each column
            const row = item.items[rowIndex]
            for (let columnIndex = 0; columnIndex < item.columns.length; columnIndex++) {
              const column = item.columns[columnIndex]
              const key = `${row.id}.${column._id}`
              const completedId = item._id + "." + key

              const cellData = answer.value?.[row.id]?.[column._id]

              if (formUtils.isQuestionOrMatrixColumnQuestion(column) && column.required && (cellData?.value == null || cellData?.value === "")) {
                return {
                  questionId: completedId,
                  error: true,
                  message:
                    formUtils.localizeString(item.text) +
                    ` (${rowIndex + 1}) ` +
                    formUtils.localizeString(column.text) +
                    " is required"
                }
              }

              if (formUtils.isQuestionOrMatrixColumnQuestion(column) && column.validations && column.validations.length > 0) {
                const validationError = new ValidationCompiler("en").compileValidations(column.validations)(cellData)
                if (validationError) {
                  return {
                    questionId: completedId,
                    error: validationError,
                    message:
                      formUtils.localizeString(item.text) +
                      ` (${rowIndex + 1})` +
                      formUtils.localizeString(column.text) +
                      ` ${validationError}`
                  }
                }
              }
            }
          }
        } else {
          const error = await answerValidator.validate(item, answer)
          if (error != null) {
            return {
              questionId: item._id,
              error,
              message: formUtils.localizeString(item.text) + " " + (error === true ? "is required" : error)
            }
          }
        }
      }
    }

    return null
  }
}
