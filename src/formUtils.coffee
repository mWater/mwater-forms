_ = require 'underscore'

# Create uid that starts with c, d, e or f
exports.createUid = -> 
  'zxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace /[xyz]/g, (c) ->
    r = Math.random()*16|0
    v = if c == 'x' then r else if c == 'y' then (r&0x3|0x8) else (r|0xC)
    return v.toString(16)

exports.isQuestion = (item) ->
  return item._type? and item._type.match(/Question$/)

exports.localizeString = (str, locale) ->
  # If no base or null, return empty string
  if not str? or not str._base
    return ""

  # Return for locale if present
  if str[locale || "en"]
    return str[locale || "en"]

  # Return base if present
  return str[str._base] || ""

# Gets all questions in form before reference item specified
# TODO should handle arbitrary nesting
exports.priorQuestions = (form, refItem) ->
  # List contents until current
  priors = []
  for item in form.contents
    # If ids match
    if item._id == refItem._id
      return priors

    if exports.isQuestion(item)
      priors.push(item)

    if item._type == "Section"
      for item2 in item.contents
        # If ids match
        if item2._id == refItem._id
          return priors

        if exports.isQuestion(item2)
          priors.push(item2)

  return priors

# Finds an item by id in a form
# TODO should handle arbitrary nesting
exports.findItem = (form, questionId) ->
  for item in form.contents
    # If ids match
    if item._id == questionId
      return item

    if item._type == "Section"
      for item2 in item.contents
        # If ids match
        if item2._id == questionId
          return item2

# Fills question with default values and removes extraneous fields
exports.prepareQuestion = (q) ->
  _.defaults q, {
    _id: exports.createUid()
    text: {}
    conditions: []
    validations: []
    required: false
  }

  switch q._type
    when "TextQuestion"
      _.defaults q, { format: "singleline" }
    when "NumberQuestion"
      _.defaults q, { decimal: true }
    when "DropdownQuestion", "RadioQuestion", "MulticheckQuestion"
      _.defaults q, { choices: [] }
    when "DateQuestion" # , "DateTimeQuestion"??
      _.defaults q, { format: "YYYY-MM-DD" }
    when "UnitsQuestion"
      _.defaults q, { units: [], defaultUnits: null, unitsPosition: "suffix", decimal: true  }
    when "CheckQuestion"
      _.defaults q, { label: {} }

  # Get known fields
  knownFields = ['_id', '_type', 'text', 'conditions', 'validations', 
    'required', 'hint', 'help', 'commentsField', 'recordLocation', 'recordTimestamp', 'sticky']

  switch q._type
    when "TextQuestion", "DateQuestion" #, "DateTimeQuestion"
      knownFields.push "format"
    when "NumberQuestion"
      knownFields.push "decimal"
    when "DropdownQuestion", "RadioQuestion", "MulticheckQuestion"
      knownFields.push "choices"
    when "UnitsQuestion"
      knownFields.push "decimal"
      knownFields.push "units"
      knownFields.push "defaultUnits"
      knownFields.push "unitsPosition"
    when "CheckQuestion"
      knownFields.push "label"

  # Strip unknown fields
  for key in _.keys(q)
    if not _.contains(knownFields, key)
      delete q[key]

  return q

exports.changeQuestionType = (question, newType) ->
  # Clear validations (they are type specific)
  question.validations = []

  # Clear format (type specific)
  delete question.format 

  # Set type
  question._type = newType

  # Prepare question to ensure correct fields
  exports.prepareQuestion(question)

  return question
