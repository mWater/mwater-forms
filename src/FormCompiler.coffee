TextQuestion = require './TextQuestion'
NumberQuestion = require './NumberQuestion'
RadioQuestion = require './RadioQuestion'
DropdownQuestion = require './DropdownQuestion'
MulticheckQuestion = require './MulticheckQuestion'
_ = require 'underscore'

module.exports = class FormCompiler
  constructor: (options) ->
    @model = options.model
    @locale = options.locale

  compileString: (str) ->
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


  compileValidations: (vals) ->
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

  compileQuestion: (q) ->
    # Compile validations
    compiledValidations = @compileValidations(q.validations)

    options = {
      model: @model
      id: q._id
      required: q.required
      prompt: @compileString(q.text)
      hint: @compileString(q.hint)
      validate: =>
        # Get answer
        answer = @model.get(q._id)
        return compiledValidations(answer)
    }
    
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

    throw new Error("Unknown question type")