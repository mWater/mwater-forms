TextQuestion = require './TextQuestion'
NumberQuestion = require './NumberQuestion'
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

  compileValidation: (val) =>
    switch val.op 
      when "lengthRange"
        return (answer) ->
          not val.rhs.literal.min? or answer.answer>= answer
    return -> null

  compileValidations: (vals) ->
    compVals = _.map(vals, @compileValidation)
    return (answer) =>
      for compVal in compVals
        result = compVal(answer)
        if result
          return result

      return null

  compileQuestion: (q) ->
    options = {
      model: @model
      id: q._id
      required: q.required
      prompt: @compileString(q.text)
      hint: @compileString(q.hint)
    }
    
    switch q._type
      when "TextQuestion"
        options.format = q.format
        return new TextQuestion(options)
      when "NumberQuestion"
        options.decimal = q.decimal
        return new NumberQuestion(options)

    throw new Error("Unknown question type")