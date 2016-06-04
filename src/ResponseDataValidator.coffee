AnswerValidator = require './answers/AnswerValidator'
formUtils = require './formUtils'


# ResponseDataValidator checks whether the entire data is valid for a response
module.exports = class ResponseDataValidator
  # It returns null if everything is fine
  # It makes sure required questions are properly answered
  # It checks custom validations
  # It returns the id of the question that caused the error, the error and a message which is includes the error and question
  #     If the question causing the error is nested (like a Matrix), the questionId is separated by a :
  #     RosterMatrix   -> matrixId_index_columnId
  #     RosterGroup   -> rosterGroupId_index_questionId
  #     QuestionMatrix -> matrixId_itemId_columnId

  # TODO validate required only if visible!
  validate: (formDesign, data) ->
    answerValidator = new AnswerValidator()

    for content in formDesign.contents
      if content._type == "Section" or content._type == "Group"
        return @validate(content, data)

      if content._type in ["RosterGroup", "RosterMatrix"]
        answerId = content.rosterId or content._id
        rosterData = data[answerId] or []

        for entry, index in rosterData
          result = @validate(content, entry.data)
          if result?
            return { 
              questionId: "#{content._id}.#{index}.#{result.questionId}"
              error: result.error
              message: formUtils.localizeString(content.name) + " (#{index + 1})" + result.message 
            }

      if formUtils.isQuestion(content)
        answer = data[content._id] or {}

        if content._type == 'MatrixQuestion'
          for item, rowIndex in content.items
            # For each column
            for column, columnIndex in content.columns
              key = "#{item.id}.#{column._id}"
              completedId = content._id + '.' + key

              data = answer[item.id]?[column._id]

              if column.required and not data?.value? or data?.value == ''
                return { 
                  questionId: completedId
                  error: true
                  message: formUtils.localizeString(content.text) + " (#{index + 1}) " + formUtils.localizeString(column.text) + " is required"
                }

              if column.validations and column.validations.length > 0
                validationError = answerValidator.compileValidations(column.validations)(data)
                if validationError
                  return { 
                    questionId: completedId
                    error: validationError
                    message: formUtils.localizeString(content.text) + " (#{index + 1})" + formUtils.localizeString(column.text) + " #{validationError}"
                  }
                  return [completedId, validationError]
        else
          error = answerValidator.validate(content, answer)
          if error?
            return {
              questionId: content._id
              error: error
              message: formUtils.localizeString(content.text) + " " + (if error == true then "is required" else error)
            }

    return null