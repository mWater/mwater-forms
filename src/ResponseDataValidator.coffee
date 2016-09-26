AnswerValidator = require './answers/AnswerValidator'
formUtils = require './formUtils'
VisibilityCalculator = require './VisibilityCalculator'

# ResponseDataValidator checks whether the entire data is valid for a response
module.exports = class ResponseDataValidator
  # It returns null if everything is fine
  # It makes sure required questions are properly answered
  # It checks custom validations
  # It returns the id of the question that caused the error, the error and a message which is includes the error and question
  # e.g. { questionId: someid, error: true for required, message otherwise, message: complete message including question text }
  #     If the question causing the error is nested (like a Matrix), the questionId is separated by a .
  #     RosterMatrix   -> matrixId.index.columnId
  #     RosterGroup   -> rosterGroupId.index.questionId
  #     QuestionMatrix -> matrixId.itemId.columnId
  validate: (formDesign, data) ->
    # Compute visibility
    visibilityCalculator = new VisibilityCalculator(formDesign)
    visibilityStructure = visibilityCalculator.createVisibilityStructure(data)

    return @validateParentItem(formDesign, visibilityStructure, data, "")

  # Validates an parent row
  #   keyPrefix: the part before the row id in the visibility structure. For rosters
  validateParentItem: (parentItem, visibilityStructure, data, keyPrefix) ->
    # Create validator
    answerValidator = new AnswerValidator()

    # For each item
    for item in parentItem.contents
      # If not visible, ignore
      if not visibilityStructure["#{keyPrefix}#{item._id}"]
        continue

      if item._type == "Section" or item._type == "Group"
        result = @validateParentItem(item, visibilityStructure, data, keyPrefix)
        if result?
          return result

      if item._type in ["RosterGroup", "RosterMatrix"]
        answerId = item.rosterId or item._id
        rosterData = data[answerId] or []

        for entry, index in rosterData
          # Key prefix is itemid.indexinroster.
          result = @validateParentItem(item, visibilityStructure, entry.data, "#{keyPrefix}#{answerId}.#{index}.")
          if result?
            return { 
              questionId: "#{item._id}.#{index}.#{result.questionId}"
              error: result.error
              message: formUtils.localizeString(item.name) + " (#{index + 1})" + result.message 
            }

      if formUtils.isQuestion(item)
        answer = data[item._id] or {}

        if item._type == 'MatrixQuestion'
          for row, rowIndex in item.items
            # For each column
            for column, columnIndex in item.columns
              key = "#{row.id}.#{column._id}"
              completedId = item._id + '.' + key

              data = answer[row.id]?[column._id]

              if column.required and not data?.value? or data?.value == ''
                return { 
                  questionId: completedId
                  error: true
                  message: formUtils.localizeString(item.text) + " (#{index + 1}) " + formUtils.localizeString(column.text) + " is required"
                }

              if column.validations and column.validations.length > 0
                validationError = answerValidator.compileValidations(column.validations)(data)
                if validationError
                  return { 
                    questionId: completedId
                    error: validationError
                    message: formUtils.localizeString(item.text) + " (#{index + 1})" + formUtils.localizeString(column.text) + " #{validationError}"
                  }
                  return [completedId, validationError]
        else
          error = answerValidator.validate(item, answer)
          if error?
            return {
              questionId: item._id
              error: error
              message: formUtils.localizeString(item.text) + " " + (if error == true then "is required" else error)
            }

    return null