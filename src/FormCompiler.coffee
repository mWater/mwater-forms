_ = require 'underscore'
markdown = require("markdown").markdown

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

Instructions = require './Instructions'

Section = require './Section'
Sections = require './Sections'
FormView = require './FormView'


module.exports = class FormCompiler
  constructor: (options) ->
    @model = options.model
    @locale = options.locale

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
      when "=", "is"
        return () =>
          return getValue() == cond.rhs.literal
      when ">", "after"
        return () =>
          return getValue() > cond.rhs.literal
      when "<", "before"
        return () =>
          return getValue() < cond.rhs.literal
      when "!=", "isnt"
        return () =>
          return getValue() != cond.rhs.literal
      when "includes"
        return () =>
          return _.contains(getValue(), cond.rhs.literal)
      when "!includes"
        return () =>
          return not _.contains(getValue(), cond.rhs.literal)
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

  # Compile a question with the given form context
  compileQuestion: (q, ctx={}) =>
    # Compile validations
    compiledValidations = @compileValidations(q.validations)

    options = {
      model: @model
      id: q._id
      required: q.required
      prompt: @compileString(q.text)
      hint: @compileString(q.hint)
      help: if @compileString(q.help) then markdown.toHTML(@compileString(q.help))
      commentsField: q.commentsField
      recordTimestamp: q.recordTimestamp
      recordLocation: q.recordLocation
      validate: =>
        # Get answer
        answer = @model.get(q._id)
        return compiledValidations(answer)
      conditional: if q.conditions and q.conditions.length > 0 then @compileConditions(q.conditions)
      ctx: ctx
    }
    
    # Add alternates
    if q.alternates and q.alternates.length > 0
      options.alternates = []
      for alternate in q.alternates
        switch alternate
          when "na"
            options.alternates.push { id: "na", label: "N/A" }  # TODO localize
          when "dontknow"
            options.alternates.push { id: "dontknow", label: "Don't know" }  # TODO localize
          else
            throw new Error("Unknown alternate")

    switch q._type
      when "TextQuestion"
        options.format = q.format
        return new TextQuestion(options)
      when "NumberQuestion"
        options.decimal = q.decimal
        return new NumberQuestion(options)
      when "RadioQuestion"
        options.choices = @compileChoices(q.choices)
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
        return new ImageQuestion(options)
      when "ImagesQuestion"
        return new ImagesQuestion(options)
      when "CheckQuestion"
        options.label = @compileString(q.label)
        return new CheckQuestion(options)
      when "TextListQuestion"
        return new TextListQuestion(options)
      when "SiteQuestion"
        return new SiteQuestion(options)

    throw new Error("Unknown question type")

  compileInstructions: (item, ctx={}) =>
    options = {
      model: @model
      id: item._id
      html: if @compileString(item.text) then markdown.toHTML(@compileString(item.text))
      conditional: if item.conditions and item.conditions.length > 0 then @compileConditions(item.conditions)
      ctx: ctx
    }
    return new Instructions(options)

  compileItem: (item, ctx={}) =>
    if formUtils.isQuestion(item)
      return @compileQuestion(item, ctx)

    if item._type == "Instructions"
      return @compileInstructions(item, ctx)

    throw new Error("Unknown item type: " + item._type)

  compileSection: (section, ctx={}) =>
    # Compile contents
    contents = _.map section.contents, @compileItem

    options = {
      model: @model
      id: section._id
      ctx: ctx
      name: @compileString(section.name)
      contents: contents
      conditional: if section.conditions and section.conditions.length > 0 then @compileConditions(section.conditions)
    }

    return new Section(options)

  compileForm: (form, ctx={}) ->
    # Compile contents
    if formUtils.isSectioned(form) 
      # Compile sections
      sections = _.map form.contents, @compileSection

      # Create Sections view
      sectionsView = new Sections({ 
        sections: sections
        model: @model
        ctx: ctx
      })
      contents = [sectionsView]

    else
      # Compile simple contents
      contents = _.map form.contents, @compileItem

    options = {
      model: @model
      id: form._id
      ctx: ctx
      name: @compileString(form.name)
      contents: contents
    }

    return new FormView(options)