_ = require 'lodash'
formUtils = require './formUtils'

# Helpful utilities when building conditions
allOps = [
  { id: "present", text: "was answered"}
  { id: "!present", text: "was not answered"}
  { id: "contains", text: "contains text"}
  { id: "!contains", text: "does not contain text"}
  { id: "=", text: "is equal to"}
  { id: ">", text: "is greater than"}
  { id: "<", text: "is less than"}
  { id: "!=", text: "is not equal to"}
  { id: "is", text: "is"}
  { id: "isnt", text: "isn't"}
  { id: "includes", text: "includes"}
  { id: "!includes", text: "does not include"}
  { id: "isoneof", text: "is one of"}
  { id: "isntoneof", text: "isn't one of"}
  { id: "before", text: "is before"}
  { id: "after", text: "is after"}
  { id: "true", text: "is checked"}
  { id: "false", text: "is not checked"}
]

# This code has been copied from FromCompiler, only getValue and getAlternate have been changed
exports.compileCondition = compileCondition = (cond) =>
  getValue = (data) =>
    answer = data[cond.lhs.question] || {}
    return answer.value

  getAlternate = (data) =>
    answer = data[cond.lhs.question] || {}
    return answer.alternate

  switch cond.op
    when "present"
      return (data) =>
        value = getValue(data)
        present = value? and value != '' and not (value instanceof Array and value.length == 0)
        if not present
          return false
        # If present, let's make sure that at least one field is set if it's an object
        else
          if value instanceof Object
            for key,v of value
              if v?
                return true
            # Not present, since the object has no set fields
            return false
          else
            return true
    when "!present"
      return (data) =>
        value = getValue(data)
        notPresent = not value? or value == '' or (value instanceof Array and value.length == 0)
        if notPresent
          return true
        # If present, let's make sure that at least one field is set if it's an object
        else
          if value instanceof Object
            for key,v of value
              if v?
                return false
            # Not present, since the object has no set fields
            return true
          else
            return false
    when "contains"
      return (data) =>
        return (getValue(data) or "").indexOf(cond.rhs.literal) != -1
    when "!contains"
      return (data) =>
        return (getValue(data) or "").indexOf(cond.rhs.literal) == -1
    when "="
      return (data) =>
        return getValue(data) == cond.rhs.literal
    when ">", "after"
      return (data) =>
        return getValue(data) > cond.rhs.literal
    when "<", "before"
      return (data) =>
        return getValue(data) < cond.rhs.literal
    when "!="
      return (data) =>
        return getValue(data) != cond.rhs.literal
    when "includes"
      return (data) =>
        return _.contains(getValue(data) or [], cond.rhs.literal) or cond.rhs.literal == getAlternate(data)
    when "!includes"
      return (data) =>
        return not _.contains(getValue(data) or [], cond.rhs.literal) and cond.rhs.literal != getAlternate(data)
    when "is"
      return (data) =>
        return getValue(data) == cond.rhs.literal or getAlternate(data) == cond.rhs.literal
    when "isnt"
      return (data) =>
        return getValue(data) != cond.rhs.literal and getAlternate(data) != cond.rhs.literal
    when "isoneof"
      return (data) =>
        value = getValue(data)
        if _.isArray(value)
          return _.intersection(cond.rhs.literal, value).length > 0 or _.contains(cond.rhs.literal, getAlternate(data))
        else
          return _.contains(cond.rhs.literal, value) or _.contains(cond.rhs.literal, getAlternate(data))
    when "isntoneof"
      return (data) =>
        value = getValue(data)
        if _.isArray(value)
          return _.intersection(cond.rhs.literal, value).length == 0 and not _.contains(cond.rhs.literal, getAlternate(data))
        else
          return not _.contains(cond.rhs.literal, value) and not _.contains(cond.rhs.literal, getAlternate(data))
    when "true"
      return (data) =>
        return getValue(data) == true
    when "false"
      return (data) =>
        return getValue(data) != true
    else
      throw new Error("Unknown condition op " + cond.op)

# This code has been copied from FromCompiler
exports.compileConditions = (conds) =>
  compConds = _.map(conds, compileCondition)
  return (data) =>
    for compCond in compConds
      if not compCond(data)
        return false

    return true

# Maps op id to complete op info
getOpDetails = (op) ->
  opDetail = _.findWhere(allOps, id: op)
  if not opDetail
    throw new Error("Unknown op #{op}")
  return opDetail

# Gets list of applicable operators for a lhs question
# Return includes id and text for each one, suitable for a select2 control
exports.applicableOps = (lhsQuestion) ->
  ops = switch lhsQuestion._type
    when "TextQuestion", "TextColumnQuestion"  then ['present', '!present', 'contains', '!contains']
    when "NumberQuestion", "NumberColumnQuestion", "StopwatchQuestion"  then ['present', '!present', '=', '!=', '>', '<']
    when "DropdownQuestion", "DropdownColumnQuestion"  then ['present', '!present', 'is', 'isnt', 'isoneof', 'isntoneof']
    when "RadioQuestion" then ['present', '!present', 'is', 'isnt', 'isoneof', 'isntoneof']
    when "MulticheckQuestion" then ['present', '!present', 'includes', '!includes', 'isoneof', 'isntoneof']
    when "DateQuestion", "DateColumnQuestion" then ['present', '!present', 'before', 'after']
    when "CheckQuestion", "CheckColumnQuestion"  then ['true', 'false']
    # TODO: ???
    when "LikertQuestion" then []
    when "MatrixQuestion" then []
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
  # Doesn't apply to LikertQuestions/MatrixQuestions since simple conditions don't apply to them
  if lhsQuestion._type not in ["LikertQuestion", "MatrixQuestion"]
    choices = _.map lhsQuestion.choices, (choice) ->
      { id: choice.id, text: choice.label[choice.label._base || "en"]}
  else
    choices = []

  # Add alternates
  if lhsQuestion.alternates and lhsQuestion.alternates.dontknow
    choices.push({ id: "dontknow", text: "Don't Know"})
  if lhsQuestion.alternates and lhsQuestion.alternates.na
    choices.push({ id: "na", text: "Not Applicable"})

  return choices

# Checks if condition is valid. True for yes, false for no
exports.validateCondition = (cond, formDesign) ->
  # Check if lhs
  if not cond.lhs? or not cond.lhs.question
    return false

  lhsQuestion = formUtils.findItem(formDesign, cond.lhs.question)
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

exports.summarizeConditions = (conditions = [], formDesign, locale) ->
  _.map(conditions, (cond) => exports.summarizeCondition(cond, formDesign, locale)).join(" and ")

exports.summarizeCondition = (cond, formDesign, locale) ->
  if not cond.lhs?.question
    return ""

  lhsQuestion = formUtils.findItem(formDesign, cond.lhs.question)
  if not lhsQuestion
    return ""

  str = formUtils.localizeString(lhsQuestion.text, locale)
  str += " " + getOpDetails(cond.op)?.text 

  rhsType = exports.rhsType(lhsQuestion, cond.op)

  switch rhsType
    when "text", "number"
      str += " #{cond.rhs.literal}"
    when "choice"
      choices = exports.rhsChoices(lhsQuestion, cond.op)
      str += " " + _.findWhere(choices, id: cond.rhs.literal)?.text
    when "choices"
      choices = exports.rhsChoices(lhsQuestion, cond.op)
      str += " "
      str += _.map(cond.rhs.literal, (choice) => _.findWhere(choices, id: choice)?.text).join(", ")
    when "date", "datetime"
      # TODO prettier
      str += " #{cond.rhs.literal}"

  return str
