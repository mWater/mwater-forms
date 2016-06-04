AnswerValidator = require './answers/AnswerValidator'
formUtils = require './formUtils'


# ResponseDataValidator checks whether the entire data is valid for a response
module.exports = class ResponseDataValidator
  # It returns null if everything is fine
  # It makes sure required questions are properly answered
  # It checks custom validations
  # It retuns both the id of the question that caused the error and the error
  #     If the question causing the error is nested (like a Matrix), the values are separated by a _
  #     RosterMatrix   -> matrixId_index_columnId
  #     RosterGroup   -> rosterGroupId_index_questionId
  #     QuestionMatrix -> matrixId_itemId_columnId
  validate: (formDesign, data) ->
    answerValidator = new AnswerValidator()

    for content in formDesign.contents
      if content._type == "Section" or content._type == "Group"
        return @validate(content, data)

      if content._type in ["RosterGroup", "RosterMatrix"]
        answerId = content.rosterId or content._id
        rosterData = data[answerId] or []

        for entry, index in rosterData
          [resultId, result] = @validate(content, entry.data)
          if result?
            return ["#{content._id}:#{index}:#{resultId}", result]

      if formUtils.isQuestion(content)
        answer = data[content._id] or {}

        if content._type == 'MatrixQuestion'
          for item, rowIndex in content.items
            # For each column
            for column, columnIndex in content.columns
              key = "#{item.id}:#{column._id}"
              completedId = content._id + ':' + key

              data = answer[item.id]?[column._id]

              if column.required and not data?.value? or data?.value == ''
                return [completedId, true]

              if column.validations and column.validations.length > 0
                validationError = answerValidator.compileValidations(column.validations)(data)
                if validationError
                  return [completedId, validationError]
        else
          result = answerValidator.validate(content, answer)
          if result?
            return [content._id, result]

    return [null, null]

