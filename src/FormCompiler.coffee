_ = require 'underscore'
markdown = require("markdown").markdown
ezlocalize = require 'ez-localize'

formUtils = require './formUtils'

TextQuestion = require './TextQuestion'
NumberQuestion = require './NumberQuestion'
RadioQuestion = require './RadioQuestion'
DropdownQuestion = require './DropdownQuestion'
MulticheckQuestion = require './MulticheckQuestion'
DateQuestion = require './DateQuestion'
UnitsQuestion = require './UnitsQuestion'
LocationQuestion = require './LocationQuestion'
ImageQuestion = require './ImageQuestion'
ImagesQuestion = require './ImagesQuestion'
CheckQuestion = require './CheckQuestion'
TextListQuestion = require './TextListQuestion'
SiteQuestion = require './SiteQuestion'
EntityQuestion = require './EntityQuestion'

Instructions = require './Instructions'

Section = require './Section'
Sections = require './Sections'
FormView = require './FormView'
FormControls = require './FormControls'

# Compiles from Form JSON to a form control. 
# Constructor must be passed:
# 'model': <Backbone.Model> to use for storing responses
# 'locale': optional locale to use (e.g. "en")
# 'ctx': context for forms. See docs/Forms Context.md
# Items returned do not need @render() called. The constructor does it automatically
module.exports = class FormCompiler
  constructor: (options) ->
    @model = options.model
    @locale = options.locale or "en"
    @ctx = options.ctx or {}

  compileString: (str) =>
    # If no base or null, return null
    if not str? or not str._base
      return null

    # Return for locale if present
    if str[@locale || "en"]
      return str[@locale || "en"]

    # Return base if present
    return str[str._base] || ""

  compileValidationMessage: (val) =>
    str = @compileString(val.message)
    if str
      return str
    return true

  compileValidation: (val) =>
    switch val.op 
      when "lengthRange"
        return (answer) =>
          value = if answer? and answer.value? then answer.value else ""
          len = value.length
          if val.rhs.literal.min? and len < val.rhs.literal.min
            return @compileValidationMessage(val)
          if val.rhs.literal.max? and len > val.rhs.literal.max
            return @compileValidationMessage(val)
          return null
      when "regex"
        return (answer) =>
          value = if answer? and answer.value? then answer.value else ""
          if value.match(val.rhs.literal)
            return null
          return @compileValidationMessage(val)
      when "range"
        return (answer) =>
          value = if answer? and answer.value? then answer.value else 0
          # For units question, get quantity
          if value.quantity?
            value = value.quantity
            
          if val.rhs.literal.min? and value < val.rhs.literal.min
            return @compileValidationMessage(val)
          if val.rhs.literal.max? and value > val.rhs.literal.max
            return @compileValidationMessage(val)
          return null
      else
        throw new Error("Unknown validation op " + val.op)

  compileValidations: (vals) =>
    compVals = _.map(vals, @compileValidation)
    return (answer) =>
      for compVal in compVals
        result = compVal(answer)
        if result
          return result

      return null

  compileChoice: (choice) =>
    return {
      id: choice.id
      label: @compileString(choice.label)
      hint: @compileString(choice.hint)
      specify: choice.specify
    }

  compileChoices: (choices) ->
    return _.map choices, @compileChoice

  compileCondition: (cond) =>
    getValue = =>
      answer = @model.get(cond.lhs.question) || {}
      return answer.value

    getAlternate = =>
      answer = @model.get(cond.lhs.question) || {}
      return answer.alternate

    switch cond.op
      when "present"
        return () =>
          value = getValue()
          return not(not value) and not (value instanceof Array and value.length == 0)
      when "!present"
        return () =>
          value = getValue()
          return (not value) or (value instanceof Array and value.length == 0)
      when "contains"
        return () =>
          return getValue().indexOf(cond.rhs.literal) != -1
      when "!contains"
        return () =>
          return getValue().indexOf(cond.rhs.literal) == -1
      when "="
        return () =>
          return getValue() == cond.rhs.literal
      when ">", "after"
        return () =>
          return getValue() > cond.rhs.literal
      when "<", "before"
        return () =>
          return getValue() < cond.rhs.literal
      when "!="
        return () =>
          return getValue() != cond.rhs.literal
      when "includes"
        return () =>
          return _.contains(getValue(), cond.rhs.literal)
      when "!includes"
        return () =>
          return not _.contains(getValue(), cond.rhs.literal)
      when "is"
        return () =>
          return getValue() == cond.rhs.literal or getAlternate() == cond.rhs.literal
      when "isnt"
        return () =>
          return getValue() != cond.rhs.literal and getAlternate() != cond.rhs.literal
      when "isoneof"
        return () =>
          return _.contains(cond.rhs.literal, getValue()) or _.contains(cond.rhs.literal, getAlternate()) 
      when "isntoneof"
        return () =>
          return not _.contains(cond.rhs.literal, getValue()) and not _.contains(cond.rhs.literal, getAlternate())
      when "true"
        return () =>
          return getValue() == true
      when "false"
        return () =>
          return getValue() == false
      else
        throw new Error("Unknown condition op " + cond.op)

  compileConditions: (conds) =>
    compConds = _.map(conds, @compileCondition)
    return =>
      for compCond in compConds
        if not compCond()
          return false

      return true

  # Compile property links into a function that loads answers
  compileLoadLinkedAnswers: (propertyLinks) ->
    return (entity) =>
      if not propertyLinks
        return

      for propLink in propertyLinks
        # Only if direction is "load" or "both"
        if not propLink.direction in ["load", "both"]
          continue

        switch propLink.type
          when "direct"
            val = entity[propLink.property.code]
            if not val?
              continue

            # Get old answer
            answer = @model.get(propLink.question) or {}

            # Copy property to question value if not set
            if answer.value == "" or not answer.value?
              # Handle by type
              switch propLink.property.type
                when "geometry"
                  if val.type == "Point"
                    answer.value = { latitude: val.coordinates[1], longitude: val.coordinates[0] }
                else
                  answer.value = val
              @model.set(propLink.question, answer)
          when "enum:choice"
            val = entity[propLink.property.code]
            if not val?
              continue

            # Find the from value
            mapping = _.findWhere(propLink.mappings, { from: val })
            if mapping
              # Get old answer
              answer = @model.get(propLink.question) or {}

              # Copy property to question value if not set
              if answer.value == "" or not answer.value?
                answer.value = mapping.to
                @model.set(propLink.question, answer)
          when "boolean:choices"
            val = entity[propLink.property.code]
            if not val?
              continue

            # Get old answer
            answer = @model.get(propLink.question) or {}
            answer.value = answer.value or []

            # Make sure choice is selected
            if val == true
              if not _.contains(answer.value, propLink.choice)
                answer.value.push(propLink.choice)
                @model.set(propLink.question, answer)
            else 
              if _.contains(answer.value, propLink.choice)
                answer.value = _.without(answer.value, propLink.choice)
                @model.set(propLink.question, answer)
          when "measurement:units"
            val = entity[propLink.property.code]
            if not val?
              continue

            # Find the from value
            mapping = _.findWhere(propLink.mappings, { from: val.unit })
            if mapping
              # Get old answer
              answer = @model.get(propLink.question) or {}

              # Copy property to question value if not set
              if answer.value == "" or not answer.value?
                answer.value = { quantity: val.magnitude, units: mapping.to }
                @model.set(propLink.question, answer)
          when "text:specify"
            val = entity[propLink.property.code]
            if not val?
              continue

            # Get old answer
            answer = @model.get(propLink.question) or {}

            # Copy property to question specify if not set
            answer.specify = answer.specify or {}
            if not answer.specify[propLink.choice]
              answer.specify[propLink.choice] = val
              @model.set(propLink.question, answer)
          else
            throw new Error("Unknown link type #{propLink.type}")

  # Compile property links into a function that sa
  compileSaveLinkedAnswers: (propertyLinks, form) ->
    return () =>
      entity = {}

      for propLink in propertyLinks
        # Only if direction is "save" or "both"
        if not propLink.direction in ["save", "both"]
          continue

        # Check if question is visible if form provided
        if form
          question = formUtils.findItem(form, propLink.question)
          if not @compileConditions(question.conditions)()
            continue

        switch propLink.type
          when "direct"
            # Get answer
            answer = @model.get(propLink.question) or {}
            if answer.value? 
              # Handle by type
              switch propLink.property.type
                when "geometry"
                  entity[propLink.property.code] = { type: "Point", coordinates: [answer.value.longitude, answer.value.latitude] }
                else
                  entity[propLink.property.code] = answer.value

          when "enum:choice"
            # Get answer
            answer = @model.get(propLink.question) or {}
            # Find the to value
            mapping = _.findWhere(propLink.mappings, { to: answer.value })
            if mapping
              # Set the property
              entity[propLink.property.code] = mapping.from

          when "boolean:choices"
            # Get answer
            answer = @model.get(propLink.question) or {}

            # Check if choice present
            if _.isArray(answer.value)
              entity[propLink.property.code] = _.contains(answer.value, propLink.choice)

          when "measurement:units"
            # Get answer
            answer = @model.get(propLink.question) or {}
            if answer.value?
              # Find the to value
              mapping = _.findWhere(propLink.mappings, { to: answer.value.units })
              if mapping
                # Set the property
                entity[propLink.property.code] = { magnitude: answer.value.quantity, unit: mapping.from }

          when "text:specify"
            # Get answer
            answer = @model.get(propLink.question) or {}

            # Check if choice present
            if answer.specify and answer.specify[propLink.choice]?
              entity[propLink.property.code] = answer.specify[propLink.choice]

          else
            throw new Error("Unknown link type #{propLink.type}")

      return entity

  # Compile a question with the given form context
  compileQuestion: (q, T, form) =>
    T = T or ezlocalize.defaultT

    # Compile validations
    compiledValidations = @compileValidations(q.validations)

    options = {
      model: @model
      id: q._id
      required: q.required
      prompt: @compileString(q.text)
      code: q.code
      hint: @compileString(q.hint)
      help: if @compileString(q.help) then markdown.toHTML(@compileString(q.help))
      commentsField: q.commentsField
      recordTimestamp: q.recordTimestamp
      recordLocation: q.recordLocation
      sticky: q.sticky
      validate: =>
        # Get answer
        answer = @model.get(q._id)
        return compiledValidations(answer)
      conditional: if q.conditions and q.conditions.length > 0 then @compileConditions(q.conditions)
      ctx: @ctx
      T: T
    }
    
    # Add alternates
    if q.alternates 
      options.alternates = []
      if q.alternates.na
        options.alternates.push { id: "na", label: T("Not Applicable") } 
      if q.alternates.dontknow
        options.alternates.push { id: "dontknow", label: T("Don't know") } 

    switch q._type
      when "TextQuestion"
        options.format = q.format
        return new TextQuestion(options)
      when "NumberQuestion"
        options.decimal = q.decimal
        return new NumberQuestion(options)
      when "RadioQuestion"
        options.choices = @compileChoices(q.choices)
        options.radioAlternates = true  # Use radio button
        return new RadioQuestion(options)
      when "DropdownQuestion"
        options.choices = @compileChoices(q.choices)
        return new DropdownQuestion(options)
      when "MulticheckQuestion"
        options.choices = @compileChoices(q.choices)
        return new MulticheckQuestion(options)
      when "DateQuestion"
        options.format = q.format
        return new DateQuestion(options)
      when "UnitsQuestion"
        options.decimal = q.decimal
        options.units = @compileChoices(q.units)
        options.defaultUnits = q.defaultUnits
        options.unitsPosition = q.unitsPosition
        return new UnitsQuestion(options)
      when "LocationQuestion"
        return new LocationQuestion(options)
      when "ImageQuestion"
        if q.consentPrompt
          options.consentPrompt = @compileString(q.consentPrompt)

        return new ImageQuestion(options)
      when "ImagesQuestion"
        if q.consentPrompt
          options.consentPrompt = @compileString(q.consentPrompt)

        return new ImagesQuestion(options)
      when "CheckQuestion"
        options.label = @compileString(q.label)
        return new CheckQuestion(options)
      when "TextListQuestion"
        return new TextListQuestion(options)
      when "SiteQuestion"
        options.siteTypes = q.siteTypes
        return new SiteQuestion(options)
      when "EntityQuestion"
        options.locale = @locale
        options.entityType = q.entityType
        options.entityFilter = q.entityFilter
        options.displayProperties = q.displayProperties
        options.selectionMode = q.selectionMode
        options.selectProperties = q.selectProperties
        options.mapProperty = q.mapProperty
        options.selectText = @compileString(q.selectText)
        options.loadLinkedAnswers = @compileLoadLinkedAnswers(q.propertyLinks)
        return new EntityQuestion(options)

    throw new Error("Unknown question type")

  compileInstructions: (item, T) =>
    T = T or ezlocalize.defaultT

    options = {
      model: @model
      id: item._id
      html: if @compileString(item.text) then markdown.toHTML(@compileString(item.text))
      conditional: if item.conditions and item.conditions.length > 0 then @compileConditions(item.conditions)
      ctx: @ctx
      T: T
    }
    return new Instructions(options)

  compileItem: (item, T, form) =>
    if formUtils.isQuestion(item)
      return @compileQuestion(item, T, form)

    if item._type == "Instructions"
      return @compileInstructions(item, T, form)

    throw new Error("Unknown item type: " + item._type)

  compileSection: (section, T, form) =>
    T = T or ezlocalize.defaultT

    # Compile contents
    contents = _.map section.contents, (item) => @compileItem(item, T, form)

    options = {
      model: @model
      id: section._id
      ctx: @ctx
      T: T
      name: @compileString(section.name)
      contents: contents
      conditional: if section.conditions and section.conditions.length > 0 then @compileConditions(section.conditions)
    }

    return new Section(options)

  compileForm: (form) ->
    # Check schema version
    if not form._schema
      form._schema = require('./index').schemaVersion # TODO remove this and prev line by Sept 2014
    if form._schema < require('./index').minSchemaVersion
      throw new Error("Schema version too low")
    if form._schema > require('./index').schemaVersion
      throw new Error("Schema version too high")

    # Create localizer
    localizedStrings = form.localizedStrings or []
    localizerData = {
      locales: form.locales
      strings: localizedStrings
    }
    T = new ezlocalize.Localizer(localizerData, @locale).T

    # Compile contents
    if formUtils.isSectioned(form) 
      # Compile sections
      sections = _.map form.contents, (item) => @compileSection(item, T, form)

      # Create Sections view
      sectionsView = new Sections({ 
        sections: sections
        model: @model
        ctx: @ctx
        T: T
      })
      contents = [sectionsView]

    else
      # Compile into FormControls
      contents = _.map form.contents, (item) => @compileItem(item, T, form)
      formControls = new FormControls({
        contents: contents
        model: @model
        ctx: @ctx
        T: T
        })
      contents = [formControls]

    options = {
      model: @model
      id: form._id
      ctx: @ctx
      T: T
      name: @compileString(form.name)
      contents: contents
    }

    # Entity of form
    formViewEntity = null

    # If form-level entity, setup setEntity
    options.setEntity = (entity) =>
      # Save entity
      formViewEntity = entity

      # Load into form level linked answers
      if form.entitySettings
        @compileLoadLinkedAnswers(form.entitySettings.propertyLinks)(entity)
      else
        throw new Error("No entity settings")

    options.getEntityCreates = () =>
      # If no entity was set (then it would be update, not create) and is set to create entity
      if form.entitySettings and not formViewEntity?
        entity = { type: form.entitySettings.entityType }
        _.extend(entity, @compileSaveLinkedAnswers(form.entitySettings.propertyLinks)())

        return [entity]
      else
        return []

    options.getEntityUpdates = () =>
      updates = []
      # If entity was set 
      if form.entitySettings and formViewEntity?
        updates.push({ 
          _id: formViewEntity._id, 
          updates: @compileSaveLinkedAnswers(form.entitySettings.propertyLinks)()
        })

      # Go through all entity questions
      for question in formUtils.priorQuestions(form)
        # If entity question with property links
        if question._type == "EntityQuestion" and question.propertyLinks
          # If value is set
          if @model.get(question._id) and @model.get(question._id).value
            # Get updates from that entity question
            updates.push({
              _id: @model.get(question._id).value,
              updates: @compileSaveLinkedAnswers(question.propertyLinks)()
            })
      return updates

    return new FormView(options)