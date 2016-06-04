
AnswerValidator = require './answers/AnswerValidator'
formUtils = require './formUtils'


# FormValidator
module.exports = class FormValidator
  # It returns null if everything is fine
  # It makes sure required questions are properly answered
  # It checks custom validations
  # It retuns both the id of the question that caused the error and the error
  #     If the question causing the error is nested (like a Matrix), the values are separated by a _
  #     RosterMatrix   -> matrixId_index_columnId
  #     RosterGroup   -> rosterGroupId_index_questionId
  #     QuestionMatrix -> matrixId_itemId_columnId
  validate: (form, data) ->
    answerValidator = new AnswerValidator()

    for content in form.contents
      if content._type == "Section" or content._type == "Group"
        return @validate(content, data)

      if content._type == "RosterGroup"
        answerId = content.rosterId or content._id
        rosterData = data[answerId] or []

        for entry, index in rosterData
          [resultId, result] = @validate(content, entry.data)
          if result?
            return ["#{content._id}_#{index}_#{resultId}", result]

      if content._type == "RosterMatrix"
        answerId = content.rosterId or content._id
        rosterData = data[answerId] or []

        for entry, rowIndex in rosterData
          # For each column
          for column, columnIndex in content.contents
            key = "#{rowIndex}_#{column._id}"
            completedId = content._id + '_' + key

            if column.required and (not entry.data[column._id]?.value or entry.data[column._id]?.value == '')
              return [completedId, 'column required']

            if column.validations and column.validations.length > 0
              validationError = new AnswerValidator().compileValidations(column.validations)(entry.data[column._id])
              if validationError
                return [completedId, validationError]

      if formUtils.isQuestion(content)
        answer = data[content._id] or {}

        if content._type == 'MatrixQuestion'
          for item, rowIndex in content.items
            # For each column
            for column, columnIndex in content.columns
              key = "#{item.id}_#{column._id}"
              completedId = content._id + '_' + key

              data = answer[item.id]?[column._id]

              if column.required and not data?.value? or data?.value == ''
                return [completedId, 'data required']

              if column.validations and column.validations.length > 0
                validationError = answerValidator.compileValidations(column.validations)(data)
                if validationError
                  return [completedId, validationError]
        else
          result = answerValidator.validate(content, answer)
          if result?
            return [content._id, result]

    return [null, null]

