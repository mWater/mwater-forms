

module.exports = class AnswerValidator
  validate: (question, answer) ->
    if question._type == "TextQuestion"
      return true
    return null