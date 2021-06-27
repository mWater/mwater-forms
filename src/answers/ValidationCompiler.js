_ = require 'lodash'

# Compiles validations
module.exports = class ValidationCompiler
  constructor: (locale) -> 
    @locale = locale

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