formUtils = require './formUtils'

# TODO: Name needs to be changed
module.exports = class StickyEntity
  setStickyData: (form, data, stickyStorage, previousVisibilityStructure, newVisibilityStructure) ->
    # NOTE: Always remember that data is immutable
    newData = _.cloneDeep data
    questions = []

    for key, nowVisible of newVisibilityStructure
      # If it wasn't visible and it now is
      if nowVisible and not previousVisibilityStructure[key]
        values = key.split('.')
        if values.length == 1
          questionId = values[0]
        else
          questionId = values[2]

        question = formUtils.findItem(form, questionId)

        if question? and question.sticky
          # Uses stickyStorage.get(questionId) to find any sticky value
          stickyValue = stickyStorage.get(questionId)
          if stickyValue? and stickyValue != ''
            dataEntry = data[questionId]
            # If not already answered
            if not dataEntry? or not dataEntry.value?
              if not dataEntry?
                newData[questionId] = dataEntry = {}
              dataEntry.value = stickyValue

    return newData