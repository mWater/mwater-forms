formUtils = require './formUtils'

# The DefaultValueApplier applies a value stored in the stickyStorage as a default answer to a question.
# It uses the following logic:
#    - The question needs to be newly visible
#    - The question needs to have a default value
#    - The data for that question needs to be undefined or null, alternate needs to be null or undefined
# The DefaultValueApplier is not a substitute for regular exercise :)

module.exports = class DefaultValueApplier
  # entity is an object
  # entityType is a string
  constructor: (form, stickyStorage, entity, entityType) ->
    @form = form
    @stickyStorage = stickyStorage
    @entity = entity
    @entityType = entityType

  setStickyData: (data, previousVisibilityStructure, newVisibilityStructure) ->
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

        dataEntry = data[questionId]
        # The data for that question needs to be undefined or null
        # Alternate for that question needs to be undefined or null
        if not dataEntry? or (not dataEntry.value? and not dataEntry.alternate?)
          defaultValue = @getHighestPriorityDefaultValue(questionId)
          # Makes sure that a defaultValue has been found
          if defaultValue? and defaultValue != ''
            # Create the dataEntry if not present
            if not dataEntry?
              newData[questionId] = dataEntry = {}
            dataEntry.value = defaultValue

    return newData

  # 3 different sources exist for default values.
  # This function returns the one with highest priority:
  # - entityType/entity
  # - sticky with a stored sticky value
  # - defaultValue
  getHighestPriorityDefaultValue: (questionId) ->
    question = formUtils.findItem(@form, questionId)

    if not question?
      return null

    if @entityType? and @entity? and (question._type == 'SiteQuestion' or question._type == 'EntityQuestion')
      if question._type == 'SiteQuestion'
        siteType = (if question.siteTypes then question.siteTypes[0]) or "Water point"
        entityType = siteType.toLowerCase().replace(' ', "_")
      else
        entityType = question.entityType

      if entityType == @entityType
        if question._type == 'SiteQuestion'
          return {code: @entity.code}
        else
          return @entity._id

    # If it's a sticky question or if it has a defaultValue
    # Tries to use a sticky value if possible, if not it tries to use the defaultValue field
    if question.sticky
      # Uses stickyStorage.get(questionId) to find any sticky value
      return @stickyStorage.get(questionId)

    return question.defaultValue
