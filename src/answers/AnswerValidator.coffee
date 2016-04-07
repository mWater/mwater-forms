

module.exports = class AnswerValidator
  validate: (question, answer) ->
    # If it has an alternate value, it cannot be invalid
    if answer.alternate?
      return null

    # Check required and answered
    if question.required
      if not answer.value? or answer.value == ''
        return true
      # Handling empty string for Units values
      if answer.value? and answer.value.quantity? and answer.value.quantity == ''
        return true

    # Check internal validation
    specificValidation = @validateSpecificAnswerType(question, answer)
    if specificValidation?
      return specificValidation

    # Check custom validation
    if question.validations?
      return @compileValidations(question.validations)(answer)

    return null

  validateSpecificAnswerType: (question, answer) ->
    switch question._type
      when "TextQuestion"
        return @validateTextQuestion(question, answer)
      when "UnitsQuestion"
        return @validateUnitsQuestion(question, answer)
      else
        return null

  # Valid if null or empty
  # Valid if not email or url format
  # Else a match is performed on the anser value
  validateTextQuestion: (question, answer) ->
    if not answer.value? or answer.value == ''
      return null

    if question.format == "email"
      if answer.value.match /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        return null
      else
        return T("Invalid format")
    else if question.format == "url"
      if answer.value.match /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
        return null
      else
        return T("Invalid format")

    return null

  # Valid if null or empty
  # Valid if not email or url format
  # Else a match is performed on the anser value
  validateUnitsQuestion: (question, answer) ->
    if not answer.value? or answer.value == ''
      return null

    if answer.value.quantity? and answer.value.quantity != ''
      if not answer.value.unit? or answer.value.unit == ''
        return 'Unit is required when a quantity is set'

    return null

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

