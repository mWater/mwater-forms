_ = require 'lodash'
localizations = require '../localizations.json'
uuid = require 'node-uuid'

# Create ~ 128-bit uid without dashes
exports.createUid = -> uuid.v4().replace(/-/g, "")

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
  # If null, return empty string
  if not str? 
    return ""

  # Return for locale if present
  if str[locale || "en"]
    return str[locale || "en"]

  # Return base if present
  if str._base
    return str[str._base] || ""
    
  return ""

# Gets all questions in form before reference item specified
# refItem can be null for all questions
# rosterId is the rosterId to use. null for only top-level
exports.priorQuestions = (formDesign, refItem = null, rosterId = null) ->
  questions = []

  # Append all child items
  appendChildren = (parentItem, currentRosterId) ->
    for child in parentItem.contents
      # If ids match, abort
      if refItem? and child._id == refItem._id
        return true

      if currentRosterId == rosterId and exports.isQuestion(child)
        questions.push(child)

      if child.contents
        if child._type in ["RosterGroup", "RosterMatrix"]
          if appendChildren(child, child.rosterId or child._id)
            return true
        else
          if appendChildren(child, currentRosterId)
            return true

    return false

  appendChildren(formDesign, null)
  return questions

exports.getRosterIds = (formDesign) ->
  rosterIds = []

  recurse = (item) ->
    if item._type in ["RosterGroup", "RosterMatrix"]
      rosterIds.push(item.rosterId or item._id)
    if item.contents
      for subitem in item.contents
        recurse(subitem)

  recurse(formDesign)

  return _.uniq(rosterIds)

# Finds an item by id in a form
exports.findItem = (formDesign, itemId) ->
  for item in formDesign.contents
    # If ids match
    if item._id == itemId
      return item

    if item.contents
      found = exports.findItem(item, itemId)
      if found
        return found

# All items under an item including self
exports.allItems = (rootItem) ->
  items = []
  items.push(rootItem)
  if rootItem.contents
    for item in rootItem.contents
      items = items.concat(exports.allItems(item))

  return items

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
    when "NumberQuestion", "NumberColumnQuestion"
      _.defaults q, { decimal: true }
    when "DropdownQuestion", "RadioQuestion", "MulticheckQuestion", "DropdownColumnQuestion"
      _.defaults q, { choices: [] }
    when "DateQuestion" # , "DateTimeQuestion"??
      _.defaults q, { format: "YYYY-MM-DD" }
    when "UnitsQuestion", "UnitsColumnQuestion"
      _.defaults q, { units: [], defaultUnits: null, unitsPosition: "suffix", decimal: true  }
    when "CheckQuestion"
      _.defaults q, { label: {} }
    when "EntityQuestion"
      _.defaults q, { entityFilter: {}, displayProperties: [], selectionMode: "external", selectProperties: [], selectText: { _base: "en", en: "Select" }, propertyLinks: [] }

  # Get known fields
  knownFields = ['_id', '_type', 'text', 'textExprs', 'conditions', 'validations', 
    'required', 'code', 'hint', 'help', 'alternates', 'commentsField', 'recordLocation', 'recordTimestamp', 'sticky', 'exportId']

  switch q._type
    when "TextQuestion", "DateQuestion" #, "DateTimeQuestion"
      knownFields.push "format"
    when "NumberQuestion", "NumberColumnQuestion"
      knownFields.push "decimal"
    when "DropdownQuestion", "RadioQuestion", "MulticheckQuestion", "DropdownColumnQuestion"
      knownFields.push "choices"
    when "UnitsQuestion", "UnitsColumnQuestion"
      knownFields.push "decimal"
      knownFields.push "units"
      knownFields.push "defaultUnits"
      knownFields.push "unitsPosition"
    when "CheckQuestion"
      knownFields.push "label"
    when "SiteQuestion"
      knownFields.push "siteTypes"
    when "ImageQuestion", "ImagesQuestion"
      knownFields.push "consentPrompt"
    when "EntityQuestion"
      knownFields.push "entityType"
      knownFields.push "entityFilter"
      knownFields.push "displayProperties"
      knownFields.push "selectionMode"
      knownFields.push "selectProperties"
      knownFields.push "mapProperty"
      knownFields.push "selectText"
      knownFields.push "propertyLinks"
      knownFields.push "hidden"
      knownFields.push "createEntity"
    when "AdminRegionQuestion"
      knownFields.push "defaultValue"

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

# Gets type of the answer: text, number, choice, choices, date, units, boolean, location, image, images, texts, site, entity, admin_region
exports.getAnswerType = (q) ->
  switch q._type
    when "TextQuestion", "TextColumnQuestion"
      return "text"
    when "NumberQuestion", "NumberColumnQuestion"
      return "number"
    when "DropdownQuestion", "RadioQuestion", "DropdownColumnQuestion"
      return "choice"
    when "MulticheckQuestion"
      return "choices"
    when "DateQuestion" # , "DateTimeQuestion"??
      return "date"
    when "UnitsQuestion", "UnitsColumnQuestion"
      return "units"
    when "CheckQuestion", "CheckColumnQuestion"
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
    when "BarcodeQuestion"
      return "text"
    when "EntityQuestion"
      return "entity"
    when "AdminRegionQuestion"
      return "admin_region"
    else throw new Error("Unknown question type")

# Check if a form is all sections
exports.isSectioned = (form) ->
  return form.contents.length > 0 and _.every form.contents, (item) -> item._type == "Section"

# Duplicates an item (form design, section or question)
# idMap is a map of old _ids to new _ids. If any not present, new uid will be used
exports.duplicateItem = (item, idMap) ->
  # If form or section and ids not mapped, map ids
  if not idMap 
    idMap = {}

  if item._type in ["Form", "Section"]
    for question in exports.priorQuestions(item)
      # Map non-mapped ones
      if not idMap[question._id]
        idMap[question._id] = exports.createUid()

  dup = _.cloneDeep(item)

  # Set up id
  if dup._id
    dup._basedOn = dup._id
    if idMap and idMap[dup._id]
      dup._id = idMap[dup._id]
    else
      dup._id = exports.createUid()

  # Fix condition references, or remove conditions
  if dup.conditions
    dup.conditions = _.filter dup.conditions, (cond) =>
      if cond.lhs and cond.lhs.question
        # Check if in id
        if idMap and idMap[cond.lhs.question]
          # Map id
          cond.lhs.question = idMap[cond.lhs.question]
          return true
        # Could not be mapped
        return false

      # For future AND and OR TODO
      return true

  if dup.propertyLinks
    dup.propertyLinks = _.filter dup.propertyLinks, (link) =>
      if link.questionId
        # Check if in id
        if idMap and idMap[link.questionId]
          # Map id
          link.questionId = idMap[link.questionId]
          return true
        # Could not be mapped
        return false

      # For future AND and OR TODO
      return true


  # Duplicate contents
  if dup.contents
    dup.contents = _.map dup.contents, (item) =>
      exports.duplicateItem(item, idMap)

  return dup

# Finds all localized strings in an object
exports.extractLocalizedStrings = (obj) ->
  if not obj?
    return []
    
  # Return self if string
  if obj._base?
    return [obj]

  strs = []

  # If array, concat each
  if _.isArray(obj)
    for item in obj
      strs = strs.concat(@extractLocalizedStrings(item))
  else if _.isObject(obj)
    for key, value of obj
      strs = strs.concat(@extractLocalizedStrings(value))

  return strs

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

# Determines if has at least one localization in locale
exports.hasLocalizations = (obj, locale) ->
  strs = exports.extractLocalizedStrings(obj)
  return _.any(strs, (str) -> str[locale])

# Finds an entity question of the specified type, or a legacy site question
exports.findEntityQuestion = (form, entityType) ->
  question = _.find exports.priorQuestions(form), (q) -> 
    if q._type == "EntityQuestion" and q.entityType == entityType
      return q

    if q._type == "SiteQuestion" 
      # Get site type (use only first one)
      if q.siteTypes and q.siteTypes[0]
        siteType = q.siteTypes[0]
      else
        siteType = "Water point"

      # Convert to entity type
      questionEntityType = siteType.toLowerCase().replace(new RegExp(' ', 'g'), "_")
      if questionEntityType == entityType
        return q
    return
  return question
