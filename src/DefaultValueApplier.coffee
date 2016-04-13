formUtils = require './formUtils'

# The DefaultValueApplier applies a value stored in the stickyStorage as a default answer to a question.
# It uses the following logic:
#    - The question needs to be newly visible
#    - The question needs to be sticky
#    - An entry for that question needs to be present in the stickyStorage
#    - The data for that question needs to be undefined or null, alternate needs to be null or undefined
# The DefaultValueApplier is not a substitute for regular exercise :)

module.exports = class DefaultValueApplier
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
          # An entry for that question needs to be present in the stickyStorage
          if stickyValue? and stickyValue != ''
            dataEntry = data[questionId]
            # The data for that question needs to be undefined or null
            # Alternate for that question needs to be undefined or null
            if not dataEntry? or (not dataEntry.value? and not dataEntry.alternate?)
                # Create the dataEntry if not present
                if not dataEntry?
                  newData[questionId] = dataEntry = {}
                dataEntry.value = stickyValue

    return newData