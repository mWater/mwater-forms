_ = require 'lodash'
formUtils = require './formUtils'

# Helpful utilities when building conditions

# Maps op id to complete op info
getOpDetails = (op) ->
  switch op
    when "present" then { id: "present", text: "was answered"}
    when "!present" then { id: "!present", text: "was not answered"}
    when "contains" then { id: "contains", text: "contains text"}
    when "!contains" then { id: "!contains", text: "does not contain text"}
    when "=" then { id: "=", text: "is equal to"}
    when ">" then { id: ">", text: "is greater than"}
    when "<" then { id: "<", text: "is less than"}
    when "!=" then { id: "!=", text: "is not equal to"}
    when "is" then { id: "is", text: "is"}
    when "isnt" then { id: "isnt", text: "isn't"}
    when "includes" then { id: "includes", text: "includes"}
    when "!includes" then { id: "!includes", text: "does not include"}
    when "isoneof" then { id: "isoneof", text: "is one of"}
    when "isntoneof" then { id: "isntoneof", text: "isn't one of"}
    when "before" then { id: "before", text: " is before"}
    when "after" then { id: "after", text: "is after"}
    when "true" then { id: "true", text: " is checked"}
    when "false" then { id: "false", text: "is not checked"}
    else throw new Error("Unknown op")

# Gets list of applicable operators for a lhs question
# Return includes id and text for each one, suitable for a select2 control
exports.applicableOps = (lhsQuestion) ->
  ops = switch lhsQuestion._type
    when "TextQuestion" then ['present', '!present', 'contains', '!contains']
    when "NumberQuestion" then ['present', '!present', '=', '!=', '>', '<']
    when "DropdownQuestion" then ['present', '!present', 'is', 'isnt', 'isoneof', 'isntoneof']
    when "RadioQuestion" then ['present', '!present', 'is', 'isnt', 'isoneof', 'isntoneof']
    when "MulticheckQuestion" then ['present', '!present', 'includes', '!includes', 'isoneof', 'isntoneof']
    when "DateQuestion" then ['present', '!present', 'before', 'after']
    when "CheckQuestion" then ['true', 'false']
    else ['present', '!present']

  # Add is, etc if alternates present, since we can do "is N/A"
  if _.keys(lhsQuestion.alternates).length > 0
    # is/isn't is not applicable to Multicheck
    if lhsQuestion._type != "MulticheckQuestion"
      ops = _.union(ops, ['is', 'isnt', 'isoneof', 'isntoneof'])

  return _.map(ops, getOpDetails)

# Gets rhs type for a question and operator. 
# Can be null (for unary), "text", "number", "choice", "choices", "date", "datetime"
exports.rhsType = (lhsQuestion, op) ->
  switch op
    when "present", "!present", "true", "false" then null
    when "contains", "!contains" then "text"
    when "=", "!=" 
      return "number"
    when ">", "<" then "number"
    when "is", "isnt" 
      return "choice"
    when "isoneof", "isntoneof"
      return "choices"
    when "includes", "!includes" then "choice"
    when "before", "after" 
      return "date"

    else throw new Error("Unknown op")

# In the case of choice, returns choices for rhs (returns base localization)
# Return includes id and text for each one, suitable for a select2 control
exports.rhsChoices = (lhsQuestion, op) ->
  choices = _.map lhsQuestion.choices, (choice) ->
    { id: choice.id, text: choice.label[choice.label._base || "en"]}

  # Add alternates
  if lhsQuestion.alternates and lhsQuestion.alternates.dontknow
    choices.push({ id: "dontknow", text: "Don't Know"})
  if lhsQuestion.alternates and lhsQuestion.alternates.na
    choices.push({ id: "na", text: "Not Applicable"})

  return choices

# Checks if condition is valid. True for yes, false for no
exports.validateCondition = (cond, form) ->
  # Check if lhs
  if not cond.lhs? or not cond.lhs.question
    return false

  lhsQuestion = formUtils.findItem(form, cond.lhs.question)
  if not lhsQuestion
    return false

  # Check op
  if not cond.op
    return false
  
  if not _.contains(_.pluck(exports.applicableOps(lhsQuestion), "id"), cond.op)
    return false

  # Check rhs
  rhsType = exports.rhsType(lhsQuestion, cond.op)

  if rhsType 
    if not cond.rhs or not cond.rhs.literal?
      return false

    # Check type
    switch rhsType 
      when "number"
        if not (typeof(cond.rhs.literal) == "number")
          return false
      when "choice"
        if not _.findWhere(lhsQuestion.choices, { id: cond.rhs.literal })
          # Check alternates
          if lhsQuestion.alternates and lhsQuestion.alternates[cond.rhs.literal]
            return true
          return false
      when "choices"
        return _.all cond.rhs.literal, (c) -> 
          if not _.findWhere(lhsQuestion.choices, { id: c })
            # Check alternates
            if lhsQuestion.alternates and lhsQuestion.alternates[c]
              return true
            return false
          return true
      else
        if not (typeof(cond.rhs.literal) == "string")
          return false

  return true
