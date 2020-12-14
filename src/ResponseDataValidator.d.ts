import { Schema } from "mwater-expressions"
import { ResponseRow } from "."
import { FormDesign } from "./formDesign"
import { ResponseData } from "./response"
import { VisibilityStructure } from "./VisibilityCalculator"

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
  validate(formDesign: FormDesign, visibilityStructure: VisibilityStructure, data: ResponseData, schema: Schema, responseRow: ResponseRow): Promise<ResponseDataValidatorError | null>
}
