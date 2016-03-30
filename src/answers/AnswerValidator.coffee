

module.exports = class AnswerValidator
  validate: (question, answer) ->
    # If it has an alternate value, it cannot be invalid
    if answer.alternate?
      return null

    # Check required and answered
    if question.required
      if not answer.value?
        return true

    # Check internal validation
    specificValidation = @validateSpecificAnswerType(question, answer)
    if specificValidation?
      return specificValidation

    # Check custom validation
    if question.validate
      return question.validate()

    return null

  validateSpecificAnswerType: (question, answer) ->
    switch question._type
      when "TextQuestion"
        return @validateTextQuestion(question, answer)
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

