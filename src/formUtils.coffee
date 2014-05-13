_ = require 'lodash'
localizations = require '../localizations.json'

# Create ~ 128-bit uid that starts with c, d, e or f
exports.createUid = -> 
  'zxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace /[xyz]/g, (c) ->
    r = Math.random()*16|0
    v = if c == 'x' then r else if c == 'y' then (r&0x3|0x8) else (r|0xC)
    return v.toString(16)

# Create short unique id, with ~42 bits randomness to keep unique amoung a few choices
exports.createShortUid = ->
    chrs = "abcdefghjklmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789"
    loop 
      id = ""
      for i in [1..7]
        id = id + chrs[_.random(0, chrs.length - 1)]
      if not _.find(@model, { id: id })? then break
    return id

# Create a base32 time code to write on forms
exports.createBase32TimeCode = (date) ->
  # Characters to use (skip 1, I, 0, O)
  chars = "23456789ABCDEFGHJLKMNPQRSTUVWXYZ"

  # Subtract date from July 1, 2013
  base = new Date(2013, 6, 1, 0, 0, 0, 0)

  # Get seconds since
  diff = Math.floor((date.getTime() - base.getTime()) / 1000)

  # Convert to array of base 32 characters
  code = ""

  while diff >= 1
    num = diff % 32
    diff = Math.floor(diff / 32)
    code = chars[num] + code

  return code

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
# refItem can be null for all questions
# TODO should handle arbitrary nesting
exports.priorQuestions = (form, refItem) ->
  # List contents until current
  priors = []
  for item in form.contents
    # If ids match
    if refItem? and item._id == refItem._id
      return priors

    if exports.isQuestion(item)
      priors.push(item)

    if item._type == "Section"
      for item2 in item.contents
        # If ids match
        if refItem? and item2._id == refItem._id
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
    'required', 'hint', 'help', 'alternates', 'commentsField', 'recordLocation', 'recordTimestamp', 'sticky']

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

# Gets type of the answer: text, number, choice, choices, date, units, boolean, location, image, images, texts, site
exports.getAnswerType = (q) ->
  switch q._type
    when "TextQuestion"
      return "text"
    when "NumberQuestion"
      return "number"
    when "DropdownQuestion", "RadioQuestion"
      return "choice"
    when "MulticheckQuestion"
      return "choices"
    when "DateQuestion" # , "DateTimeQuestion"??
      return "date"
    when "UnitsQuestion"
      return "units"
    when "CheckQuestion"
      return "boolean"
    when "LocationQuestion"
      return "location"
    when "ImageQuestion"
      return "image"
    when "ImagesQuestion"
      return "images"
    when "TextListQuestion"
      return "texts"
    when "SiteQuestion"
      return "site"
    else throw new Error("Unknown question type")

# Check if a form is all sections
exports.isSectioned = (form) ->
  return form.contents.length > 0 and _.every form.contents, (item) -> item._type == "Section"

# Duplicates an item (form design, section or question)
exports.duplicateItem = (item) ->
  dup = _.cloneDeep(item)

  # Set up id
  if dup._id
    dup._basedOn = dup._id
    dup._id = exports.createUid()

  # Duplicate contents
  if dup.contents
    dup.contents = _.map dup.contents, exports.duplicateItem

  return dup

exports.updateLocalizations = (form) ->
  form.localizedStrings = form.localizedStrings or []

  # Map existing ones in form
  existing = {}
  for str in form.localizedStrings
    if str.en
      existing[str.en] = true

  # Add new localizations
  for str in localizations.strings
    if str.en and not existing[str.en]
      form.localizedStrings.push str
      existing[str.en] = true

