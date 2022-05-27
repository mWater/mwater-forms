import _ from "lodash"
import * as siteCodes from "../siteCodes"
import { PromiseExprEvaluator, Schema } from "mwater-expressions"
import ValidationCompiler from "./ValidationCompiler"
import * as formUtils from "../formUtils"
import { Answer, AquagenxCBTAnswerValue, DropdownQuestion, LikertQuestion, Question, ResponseRow, UnitsAnswerValue } from ".."
import { MatrixColumn, MatrixColumnQuestion } from "../formDesign"

// AnswerValidator gets called when a form is submitted (or on next)
// Only the validate method is not internal
export default class AnswerValidator {
  schema: Schema
  responseRow: ResponseRow
  locale: string

  constructor(schema: Schema, responseRow: ResponseRow, locale: string) {
    this.schema = schema
    this.responseRow = responseRow
    this.locale = locale
  }

  // It returns null if everything is fine
  // It makes sure required questions are properly answered
  // It checks answer type specific validations
  // It checks custom validations
  async validate(question: Question | MatrixColumnQuestion, answer: Answer) {
    // If it has an alternate value, it cannot be invalid
    if (answer.alternate) {
      return null
    }

    if (formUtils.isQuestion(question) && question.disabled) {
      return null
    }

    // Check required and answered
    if (question.required) {
      if (answer.value == null || answer.value === "") {
        return true
      }

      // Handle specify
      if ((question as DropdownQuestion).choices) {
        // MulticheckQuestion
        if (_.isArray(answer.value)) {
          const specifyChoices = (question as DropdownQuestion).choices.filter((c: any) => c.specify).map((c: any) => c.id)
          const selectedSpecifyChoicecs = _.intersection(specifyChoices, answer.value)

          if (selectedSpecifyChoicecs.length > 0) {
            for (let selectedChoice of selectedSpecifyChoicecs) {
              if (!answer.specify?.[selectedChoice]) {
                return true
              }
            }
          }
        } else {
          // RadioQuestion
          const choiceOption = _.find((question as DropdownQuestion).choices, { specify: true })
          if (choiceOption && answer.value === choiceOption.id && !answer.specify) {
            return true
          }
        }
      }

      // Handling empty string for Units values
      if (question._type == "UnitsQuestion") {
        if (answer.value != null && (answer.value as UnitsAnswerValue).quantity == null) {
          return true
        }
      }
      // A required LikertQuestion needs an answer for all items
      if (question._type === "LikertQuestion") {
        for (let item of (question as LikertQuestion).items) {
          if (answer.value[item.id] == null) {
            return true
          }
        }
      }
      if (question._type === "AquagenxCBTQuestion") {
        if ((answer.value as AquagenxCBTAnswerValue).cbt == null) {
          return true
        }
      }
    }

    // Check internal validation
    const specificValidation = this.validateSpecificAnswerType(question, answer)
    if (specificValidation != null) {
      return specificValidation
    }

    // Skip validation if value is not set
    if (answer.value == null || answer.value === "") {
      return null
    }

    // Check custom validation
    if (question.validations != null) {
      const result = new ValidationCompiler(this.locale).compileValidations(question.validations)(answer)
      if (result) {
        return result
      }
    }

    if (formUtils.isQuestion(question) && question.advancedValidations != null && this.responseRow) {
      for (let { expr, message } of question.advancedValidations) {
        if (expr) {
          // Evaluate expression
          const exprEvaluator = new PromiseExprEvaluator({ schema: this.schema })
          const value = await exprEvaluator.evaluate(expr, { row: this.responseRow })
          if (value !== true) {
            return formUtils.localizeString(message, this.locale) || true
          }
        }
      }
    }

    return null
  }

  validateSpecificAnswerType(question: any, answer: any) {
    switch (question._type) {
      case "TextQuestion":
        return this.validateTextQuestion(question, answer)
      case "UnitsQuestion":
        return this.validateUnitsQuestion(question, answer)
      case "NumbersQuestion":
        return this.validateNumberQuestion(question, answer)
      case "SiteQuestion":
        return this.validateSiteQuestion(question, answer)
      case "LikertQuestion":
        return this.validateLikertQuestion(question, answer)
      case "MatrixQuestion":
        return this.validateMatrixQuestion(question, answer)
      default:
        return null
    }
  }

  // Valid if null or empty
  // Valid if code is valid (checksum)
  validateSiteQuestion(question: any, answer: any) {
    if (!answer.value) {
      return null
    }

    if (!answer.value?.code) {
      return true
    }

    if (siteCodes.isValid(answer.value.code)) {
      return null
    } else {
      return "Invalid code"
    }
  }

  // Valid if null or empty
  // Valid if not email or url format
  // Else a match is performed on the anser value
  validateTextQuestion(question: any, answer: any) {
    if (answer.value == null || answer.value === "") {
      return null
    }

    if (question.format === "email") {
      if (
        answer.value.match(
          /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        )
      ) {
        return null
      } else {
        return "Invalid format"
      }
    } else if (question.format === "url") {
      if (
        answer.value.match(
          /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
        )
      ) {
        return null
      } else {
        return "Invalid format"
      }
    }

    return null
  }

  // Valid if null or empty
  // Valid if quantity is not set
  // Invalid if quantity is set but not units
  validateUnitsQuestion(question: any, answer: any) {
    if (answer.value == null || answer.value === "") {
      return null
    }

    if (answer.value.quantity != null && answer.value.quantity !== "") {
      if (answer.value.units == null || answer.value.units === "") {
        return "units field is required when a quantity is set"
      }
    }

    return null
  }

  // Valid if null or empty
  // Valid if quantity is not set
  // Invalid if quantity is set but not units
  validateLikertQuestion(question: any, answer: any) {
    if (answer.value == null || answer.value === "") {
      return null
    }

    for (let item in answer.value) {
      const choiceId = answer.value[item]
      if (_.findWhere(question.choices, { id: choiceId }) == null) {
        return "Invalid choice"
      }
    }

    return null
  }

  // Valid if null or empty
  validateNumberQuestion(question: any, answer: any) {
    if (answer.value == null || answer.value === "") {
      return null
    }

    return null
  }

  validateMatrixQuestion(question: any, answer: any) {
    const validationErrors = {}

    // For each entry
    for (let rowIndex = 0; rowIndex < question.items.length; rowIndex++) {
      // For each column
      const item = question.items[rowIndex]
      for (let columnIndex = 0; columnIndex < question.columns.length; columnIndex++) {
        const column = question.columns[columnIndex]
        const key = `${item.id}_${column._id}`

        const data = answer.value?.[item.id]?.[column._id]

        if (column.required && (data?.value == null || data?.value === "")) {
          return true
        }

        if (column.validations && column.validations.length > 0) {
          const validationError = new ValidationCompiler(this.locale).compileValidations(column.validations)(data)
          if (validationError) {
            return validationError
          }
        }
      }
    }

    return null
  }
}
