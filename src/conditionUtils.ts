// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
let compileCondition: any
import _ from "lodash"
import * as formUtils from "./formUtils"

// Helpful utilities when building conditions
const allOps = [
  { id: "present", text: "was answered" },
  { id: "!present", text: "was not answered" },
  { id: "contains", text: "contains text" },
  { id: "!contains", text: "does not contain text" },
  { id: "=", text: "is equal to" },
  { id: ">", text: "is greater than" },
  { id: "<", text: "is less than" },
  { id: "!=", text: "is not equal to" },
  { id: "is", text: "is" },
  { id: "isnt", text: "isn't" },
  { id: "includes", text: "includes" },
  { id: "!includes", text: "does not include" },
  { id: "isoneof", text: "is one of" },
  { id: "isntoneof", text: "isn't one of" },
  { id: "before", text: "is before" },
  { id: "after", text: "is after" },
  { id: "true", text: "is checked" },
  { id: "false", text: "is not checked" }
]

// This code has been copied from FromCompiler, only getValue and getAlternate have been changed
let _compileCondition = (compileCondition = (cond: any) => {
  const getValue = (data: any) => {
    const answer = data[cond.lhs.question] || {}
    return answer.value
  }

  const getAlternate = (data: any) => {
    const answer = data[cond.lhs.question] || {}
    return answer.alternate
  }

  switch (cond.op) {
    case "present":
      return (data: any) => {
        const value = getValue(data)
        const present = value != null && value !== "" && !(value instanceof Array && value.length === 0)
        if (!present) {
          return false
          // If present, let's make sure that at least one field is set if it's an object
        } else {
          if (value instanceof Object) {
            for (let key in value) {
              const v = value[key]
              if (v != null) {
                return true
              }
            }
            // Not present, since the object has no set fields
            return false
          } else {
            return true
          }
        }
      };
    case "!present":
      return (data: any) => {
        const value = getValue(data)
        const notPresent = value == null || value === "" || (value instanceof Array && value.length === 0)
        if (notPresent) {
          return true
          // If present, let's make sure that at least one field is set if it's an object
        } else {
          if (value instanceof Object) {
            for (let key in value) {
              const v = value[key]
              if (v != null) {
                return false
              }
            }
            // Not present, since the object has no set fields
            return true
          } else {
            return false
          }
        }
      };
    case "contains":
      return (data: any) => {
        return (getValue(data) || "").indexOf(cond.rhs.literal) !== -1
      };
    case "!contains":
      return (data: any) => {
        return (getValue(data) || "").indexOf(cond.rhs.literal) === -1
      };
    case "=":
      return (data: any) => {
        return getValue(data) === cond.rhs.literal
      };
    case ">":
    case "after":
      return (data: any) => {
        return getValue(data) > cond.rhs.literal
      };
    case "<":
    case "before":
      return (data: any) => {
        return getValue(data) < cond.rhs.literal
      };
    case "!=":
      return (data: any) => {
        return getValue(data) !== cond.rhs.literal
      };
    case "includes":
      return (data: any) => {
        return _.contains(getValue(data) || [], cond.rhs.literal) || cond.rhs.literal === getAlternate(data)
      };
    case "!includes":
      return (data: any) => {
        return !_.contains(getValue(data) || [], cond.rhs.literal) && cond.rhs.literal !== getAlternate(data)
      };
    case "is":
      return (data: any) => {
        return getValue(data) === cond.rhs.literal || getAlternate(data) === cond.rhs.literal
      };
    case "isnt":
      return (data: any) => {
        return getValue(data) !== cond.rhs.literal && getAlternate(data) !== cond.rhs.literal
      };
    case "isoneof":
      return (data: any) => {
        const value = getValue(data)
        if (_.isArray(value)) {
          return _.intersection(cond.rhs.literal, value).length > 0 || _.contains(cond.rhs.literal, getAlternate(data))
        } else {
          return _.contains(cond.rhs.literal, value) || _.contains(cond.rhs.literal, getAlternate(data))
        }
      };
    case "isntoneof":
      return (data: any) => {
        const value = getValue(data)
        if (_.isArray(value)) {
          return (
            _.intersection(cond.rhs.literal, value).length === 0 && !_.contains(cond.rhs.literal, getAlternate(data))
          )
        } else {
          return !_.contains(cond.rhs.literal, value) && !_.contains(cond.rhs.literal, getAlternate(data))
        }
      };
    case "true":
      return (data: any) => {
        return getValue(data) === true
      };
    case "false":
      return (data: any) => {
        return getValue(data) !== true
      };
    default:
      throw new Error("Unknown condition op " + cond.op)
  }
})

export { _compileCondition as compileCondition }

// This code has been copied from FromCompiler
export let compileConditions = (conds: any) => {
  const compConds = _.map(conds, compileCondition)
  return (data: any) => {
    for (let compCond of compConds) {
      if (!compCond(data)) {
        return false
      }
    }

    return true
  };
}

// Maps op id to complete op info
function getOpDetails(op: any) {
  const opDetail = _.findWhere(allOps, { id: op })
  if (!opDetail) {
    throw new Error(`Unknown op ${op}`)
  }
  return opDetail
}

// Gets list of applicable operators for a lhs question
// Return includes id and text for each one, suitable for a select2 control
export function applicableOps(lhsQuestion: any) {
  let ops = (() => {
    switch (lhsQuestion._type) {
      case "TextQuestion":
      case "TextColumnQuestion":
        return ["present", "!present", "contains", "!contains"]
      case "NumberQuestion":
      case "NumberColumnQuestion":
      case "StopwatchQuestion":
        return ["present", "!present", "=", "!=", ">", "<"]
      case "DropdownQuestion":
      case "DropdownColumnQuestion":
        return ["present", "!present", "is", "isnt", "isoneof", "isntoneof"]
      case "RadioQuestion":
        return ["present", "!present", "is", "isnt", "isoneof", "isntoneof"]
      case "MulticheckQuestion":
        return ["present", "!present", "includes", "!includes", "isoneof", "isntoneof"]
      case "DateQuestion":
      case "DateColumnQuestion":
        return ["present", "!present", "before", "after"]
      case "CheckQuestion":
      case "CheckColumnQuestion":
        return ["true", "false"]
      // TODO: ???
      case "LikertQuestion":
        return []
      case "MatrixQuestion":
        return []
      default:
        return ["present", "!present"]
    }
  })()

  // Add is, etc if alternates present, since we can do "is N/A"
  if (_.keys(lhsQuestion.alternates).length > 0) {
    // is/isn't is not applicable to Multicheck
    if (lhsQuestion._type !== "MulticheckQuestion") {
      ops = _.union(ops, ["is", "isnt", "isoneof", "isntoneof"])
    }
  }

  return _.map(ops, getOpDetails)
}

// Gets rhs type for a question and operator.
// Can be null (for unary), "text", "number", "choice", "choices", "date", "datetime"
function _rhsType(lhsQuestion: any, op: any) {
  switch (op) {
    case "present":
    case "!present":
    case "true":
    case "false":
      return null
    case "contains":
    case "!contains":
      return "text"
    case "=":
    case "!=":
      return "number"
    case ">":
    case "<":
      return "number"
    case "is":
    case "isnt":
      return "choice"
    case "isoneof":
    case "isntoneof":
      return "choices"
    case "includes":
    case "!includes":
      return "choice"
    case "before":
    case "after":
      return "date"

    default:
      throw new Error("Unknown op")
  }
}

export { _rhsType as rhsType }

// In the case of choice, returns choices for rhs (returns base localization)
// Return includes id and text for each one, suitable for a select2 control
export function rhsChoices(lhsQuestion: any, op: any) {
  // Doesn't apply to LikertQuestions/MatrixQuestions since simple conditions don't apply to them
  let choices: any
  if (!["LikertQuestion", "MatrixQuestion"].includes(lhsQuestion._type)) {
    choices = _.map(lhsQuestion.choices, (choice) => ({
      id: choice.id,
      text: choice.label[choice.label._base || "en"]
    }))
  } else {
    choices = []
  }

  // Add alternates
  if (lhsQuestion.alternates && lhsQuestion.alternates.dontknow) {
    choices.push({ id: "dontknow", text: "Don't Know" })
  }
  if (lhsQuestion.alternates && lhsQuestion.alternates.na) {
    choices.push({ id: "na", text: "Not Applicable" })
  }

  return choices
}

// Checks if condition is valid. True for yes, false for no
export function validateCondition(cond: any, formDesign: any) {
  // Check if lhs
  if (cond.lhs == null || !cond.lhs.question) {
    return false
  }

  const lhsQuestion = formUtils.findItem(formDesign, cond.lhs.question)
  if (!lhsQuestion) {
    return false
  }

  // Check op
  if (!cond.op) {
    return false
  }

  if (!_.contains(_.pluck(exports.applicableOps(lhsQuestion), "id"), cond.op)) {
    return false
  }

  // Check rhs
  const rhsType = exports.rhsType(lhsQuestion, cond.op)

  if (rhsType) {
    if (!cond.rhs || cond.rhs.literal == null) {
      return false
    }

    // Check type
    switch (rhsType) {
      case "number":
        if (!(typeof cond.rhs.literal === "number")) {
          return false
        }
        break
      case "choice":
        if (!_.findWhere(lhsQuestion.choices, { id: cond.rhs.literal })) {
          // Check alternates
          if (lhsQuestion.alternates && lhsQuestion.alternates[cond.rhs.literal]) {
            return true
          }
          return false
        }
        break
      case "choices":
        return _.all(cond.rhs.literal, function (c) {
          if (!_.findWhere(lhsQuestion.choices, { id: c })) {
            // Check alternates
            if (lhsQuestion.alternates && lhsQuestion.alternates[c]) {
              return true
            }
            return false
          }
          return true
        })
        break
      default:
        if (!(typeof cond.rhs.literal === "string")) {
          return false
        }
    }
  }

  return true
}

export function summarizeConditions(conditions = [], formDesign: any, locale: any) {
  return _.map(conditions, (cond) => exports.summarizeCondition(cond, formDesign, locale)).join(" and ")
}

export function summarizeCondition(cond: any, formDesign: any, locale: any) {
  if (!cond.lhs?.question) {
    return ""
  }

  const lhsQuestion = formUtils.findItem(formDesign, cond.lhs.question)
  if (!lhsQuestion) {
    return ""
  }

  let str = formUtils.localizeString(lhsQuestion.text, locale)
  str += " " + getOpDetails(cond.op)?.text

  const rhsType = exports.rhsType(lhsQuestion, cond.op)

  switch (rhsType) {
    case "text":
    case "number":
      str += ` ${cond.rhs.literal}`
      break
    case "choice":
      var choices = exports.rhsChoices(lhsQuestion, cond.op)
      str += " " + _.findWhere(choices, { id: cond.rhs.literal })?.text
      break
    case "choices":
      choices = exports.rhsChoices(lhsQuestion, cond.op)
      str += " "
      str += _.map(cond.rhs.literal, (choice) => _.findWhere(choices, { id: choice })?.text).join(", ")
      break
    case "date":
    case "datetime":
      // TODO prettier
      str += ` ${cond.rhs.literal}`
      break
  }

  return str
}
