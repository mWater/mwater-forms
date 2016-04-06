formUtils = require './formUtils'

# TODO: Name needs to be changed
module.exports = class CleaningEntity

  setStickyData: (design, data, stickyStorage, previousVisibilityStructure, newVisibilityStructure) ->
    # NOTE: Always remember that data is immutable
    newData = _.cloneDeep data
    # TODO: Find all the sticky questions
    questions = []
    formUtils.extractQuestions design.contents, questions
    for question in questions
      questionId = question._id
      if question.sticky
        # Uses stickyStorage.get(questionId) to find any sticky value
        stickyValue = stickyStorage.get(questionId)
        if stickyValue? and stickyValue != ''
          # TODO: Test if value is not set AND no alternate has been set
          dataEntry = data[questionId]
          # If not already answered
          if not dataEntry?
            # If the question just became visible
            if not previousVisibilityStructure[questionId] and newVisibilityStructure[questionId]
              data[questionId] = {answer: {value: stickyValue}}

    return newData