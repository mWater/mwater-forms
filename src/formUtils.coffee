_ = require 'lodash'
localizations = require '../localizations.json'
uuid = require 'uuid'

# Create ~ 128-bit uid without dashes
exports.createUid = -> uuid().replace(/-/g, "")

# Create short unique id, with ~42 bits randomness to keep unique amoung a few choices
exports.createShortUid = ->
  chrs = "abcdefghjklmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789"
  id = ""
  for i in [1..7]
    id = id + chrs[_.random(0, chrs.length - 1)]
  return id

# Create medium unique id, with ~58 bits randomness to keep unique amoung a 1,000,000 choices
exports.createMediumUid = ->
  chrs = "abcdefghjklmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789"
  id = ""
  for i in [1..10]
    id = id + chrs[_.random(0, chrs.length - 1)]
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

exports.isExpression = (item) ->
  return item._type? and (item._type in ["TextColumn", "Calculation"])

exports.localizeString = (str, locale) ->
  # If null, return empty string
  if not str? 
    return ""

  # Return for locale if present
  if locale and str[locale]
    return str[locale]

  # Return base if present
  if str._base and str[str._base]
    return str[str._base] || ""

  # Return english
  if str.en
    return str.en
    
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
    when "SiteColumnQuestion"
      _.defaults q, { siteType: "water_point" }
    when "LikertQuestion"
      _.defaults q, { items: [], choices: [] }
    when "DateQuestion" # , "DateTimeQuestion"??
      _.defaults q, { format: "YYYY-MM-DD" }
    when "UnitsQuestion", "UnitsColumnQuestion"
      _.defaults q, { units: [], defaultUnits: null, unitsPosition: "suffix", decimal: true  }
    when "LocationQuestion"
      _.defaults q, { calculateAdminRegion: true }
    when "CheckQuestion"
      _.defaults q, { label: {} }
    when "EntityQuestion"
      _.defaults q, { entityFilter: {}, displayProperties: [], selectionMode: "external", selectProperties: [], selectText: { _base: "en", en: "Select" }, propertyLinks: [] }
    when "LikertQuestion"
      _.defaults q, { items: [], choices: [] }
    when "MatrixQuestion"
      _.defaults q, { items: [], columns: [] }
    when "AquagenxCBTQuestion"
      _.defaults q, {  }
    when "CascadingListQuestion"
      _.defaults q, { rows: [], columns: [] }

  # Get known fields
  knownFields = ['_id', '_type', 'text', 'textExprs', 'conditions', 'conditionExpr', 'validations', 
    'required', 'code', 'hint', 'help', 'alternates', 'commentsField', 'recordLocation', 'recordTimestamp', 'sticky', 'exportId', 'disabled']

  switch q._type
    when "TextQuestion", "DateQuestion" #, "DateTimeQuestion"
      knownFields.push "format"
    when "NumberQuestion", "NumberColumnQuestion"
      knownFields.push "decimal"
    when "DropdownQuestion", "RadioQuestion", "MulticheckQuestion", "DropdownColumnQuestion"
      knownFields.push "choices"
    when "LikertQuestion"
      knownFields.push "items"
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
    when "SiteColumnQuestion" 
      knownFields.push "siteType"
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
    when "MatrixQuestion"
      knownFields.push "items"
      knownFields.push "columns"
    when "LocationQuestion"
      knownFields.push "calculateAdminRegion"
    when "CascadingListQuestion"
      knownFields.push "rows"
      knownFields.push "columns"

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

# Gets type of the answer: text, number, choice, choices, date, units, boolean, location, image, images, texts, site, entity, admin_region, items_choices, matrix, aquagenx_cbt, cascading_list
exports.getAnswerType = (q) ->
  switch q._type
    when "TextQuestion", "TextColumnQuestion"
      return "text"
    when "NumberQuestion", "NumberColumnQuestion", "StopwatchQuestion"
      return "number"
    when "DropdownQuestion", "RadioQuestion", "DropdownColumnQuestion"
      return "choice"
    when "MulticheckQuestion"
      return "choices"
    when "DateQuestion", "DateColumnQuestion" # , "DateTimeQuestion"??
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
    when "SiteQuestion", "SiteColumnQuestion"
      return "site"
    when "BarcodeQuestion"
      return "text"
    when "EntityQuestion"
      return "entity"
    when "AdminRegionQuestion"
      return "admin_region"
    when "MatrixQuestion"
      return "matrix"
    when "LikertQuestion"
      return "items_choices"
    when "AquagenxCBTQuestion"
      return "aquagenx_cbt"
    when "CascadingListQuestion"
      return "cascading_list"
    when "TextColumn", "Calculation"
      return "expr"
    else throw new Error("Unknown question type #{q._type}")

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
  else if item._id
    idMap[item._id] = exports.createUid()

  dup = _.cloneDeep(item)
  delete dup.confidential
  delete dup.confidentialRadius

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

  # Duplicate contents
  if dup.contents
    dup.contents = _.map dup.contents, (item) =>
      exports.duplicateItem(item, idMap)

  if dup.calculations
    calculations = _.map dup.calculations, (item) =>
      exports.duplicateItem(item, idMap)

    calculations = JSON.stringify(calculations)
    # Replace each part of idMap
    for key, value of idMap
      calculations = calculations.replace(new RegExp(_.escapeRegExp(key), "g"), value)

    calculations = JSON.parse(calculations)
    dup.calculations = calculations

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

exports.updateLocalizations = (formDesign) ->
  formDesign.localizedStrings = formDesign.localizedStrings or []

  # Map existing ones in form
  existing = {}
  for str in formDesign.localizedStrings
    if str.en
      existing[str.en] = true

  # Add new localizations
  for str in localizations.strings
    if str.en and not existing[str.en] and not str._unused
      formDesign.localizedStrings.push str
      existing[str.en] = true

# Determines if has at least one localization in locale
exports.hasLocalizations = (obj, locale) ->
  strs = exports.extractLocalizedStrings(obj)
  return _.any(strs, (str) -> str[locale])

# Finds an entity question of the specified type, or a legacy site question
exports.findEntityQuestion = (formDesign, entityType) ->
  question = _.find exports.priorQuestions(formDesign), (q) -> 
    if q._type == "EntityQuestion" and q.entityType == entityType
      return true

    if q._type == "SiteQuestion" 
      questionEntityType = exports.getSiteEntityType(q)
      if questionEntityType == entityType
        return true
    return false

  if question
    return question
  
  for rosterId in exports.getRosterIds(formDesign)
    question = _.find exports.priorQuestions(formDesign, null, rosterId), (q) -> 
      if q._type == "EntityQuestion" and q.entityType == entityType
        return true

      if q._type == "SiteColumnQuestion" and q.siteType == entityType
        return true

      if q._type == "SiteQuestion" 
        questionEntityType = exports.getSiteEntityType(q)
        if questionEntityType == entityType
          return true
      return false
    
    if question
      return question
    
  return null

# Finds all references to entities in a response. Returns array of: 
# {
#   question: _id of question
#   roster: _id of roster entry, null if not in roster
#   entityType: e.g. "water_point"
#   property: property code (e.g "_id" or "code") of entity that is referenced in value
#   value: value of entity property that is referenced
# }
exports.extractEntityReferences = (formDesign, responseData) ->
  results = []

  # Handle non-roster
  for question in exports.priorQuestions(formDesign)
    switch exports.getAnswerType(question)
      when "site"
        code = responseData[question._id]?.value?.code
        entityType = exports.getSiteEntityType(question)
        if code
          results.push({ question: question._id, entityType: entityType, property: "code", value: code })
      when "entity"
        value = responseData[question._id]?.value
        if value
          results.push({ question: question._id, entityType: question.entityType, property: "_id", value: value })

  for rosterId in exports.getRosterIds(formDesign)
    for question in exports.priorQuestions(formDesign, null, rosterId)
      switch exports.getAnswerType(question)
        when "site"
          for rosterEntry in (responseData[rosterId] or [])
            code = rosterEntry.data[question._id]?.value?.code
            entityType = exports.getSiteEntityType(question)
            if code
              results.push({ question: question._id, roster: rosterEntry._id, entityType: entityType, property: "code", value: code })
        when "entity"
          for rosterEntry in (responseData[rosterId] or [])
            value = rosterEntry.data[question._id]?.value
            if value
              results.push({ question: question._id, roster: rosterEntry._id, entityType: question.entityType, property: "_id", value: value })

  return results

# Gets the entity type (e.g. "water_point") for a site question
exports.getSiteEntityType = (question) ->
  entityType = if question.siteTypes and question.siteTypes[0] then _.first(question.siteTypes).toLowerCase().replace(new RegExp(' ', 'g'), "_") else "water_point"
  return entityType