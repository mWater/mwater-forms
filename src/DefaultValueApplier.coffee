formUtils = require './formUtils'

# The DefaultValueApplier applies a value stored in the stickyStorage as a default answer to a question.
# It uses the following logic:
#    - The question needs to be newly visible
#    - The question needs to be sticky
#    - An entry for that question needs to be present in the stickyStorage or it needs to have a defaultValue
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

        # If it's a sticky question or if it has a defaultValue
        # Tries to use a sticky value if possible, if not it tries to use the defaultValue field
        if question? and (question.sticky or question.defaultValue?)
          # Uses stickyStorage.get(questionId) to find any sticky value
          if question.sticky
            defaultValue = stickyStorage.get(questionId)
          # If a sticky value couldn't be found
          if not defaultValue? or defaultValue == ''
            defaultValue = question.defaultValue
          # Makes sure that a defaultValue has been found
          if defaultValue? and defaultValue != ''
            dataEntry = data[questionId]
            # The data for that question needs to be undefined or null
            # Alternate for that question needs to be undefined or null
            if not dataEntry? or (not dataEntry.value? and not dataEntry.alternate?)
                # Create the dataEntry if not present
                if not dataEntry?
                  newData[questionId] = dataEntry = {}
                dataEntry.value = defaultValue

    return newData