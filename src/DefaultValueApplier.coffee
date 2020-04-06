_ = require 'lodash'
moment = require 'moment'
formUtils = require './formUtils'

# The DefaultValueApplier applies a value stored in the stickyStorage as a default answer to a question.
# It uses the following logic:
#    - The question needs to be newly visible
#    - The question needs to have a default value
#    - The data for that question needs to be undefined or null, alternate needs to be null or undefined
module.exports = class DefaultValueApplier
  # entity is an object
  # entityType is a string
  constructor: (formDesign, stickyStorage, entity, entityType) ->
    @formDesign = formDesign
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
        else if values.length == 3 # Roster
          questionId = values[2]
        else
          continue

        if values.length == 1
          dataEntry = data[questionId]
        else
          # Get roster
          dataEntry = data[values[0]]
          if not dataEntry
            continue
          
          # Get data for item
          dataEntry = dataEntry[parseInt(values[1])]
          if not dataEntry
            continue

          dataEntry = data[questionId]

        # The data for that question needs to be undefined or null
        # Alternate for that question needs to be undefined or null
        if not dataEntry? or (not dataEntry.value? and not dataEntry.alternate?)
          defaultValue = @getHighestPriorityDefaultValue(questionId)
          # Makes sure that a defaultValue has been found
          if defaultValue? and defaultValue != ''
            # Create the dataEntry if not present
            if not dataEntry?
              if values.length == 1
                newData[questionId] = dataEntry = {}
              else 
                newData[values[0]][parseInt(values[1])].data[questionId] = dataEntry = {}
            dataEntry.value = defaultValue

    return newData

  # 3 different sources exist for default values.
  # This function returns the one with highest priority:
  # - entityType/entity
  # - sticky with a stored sticky value
  # - defaultValue
  getHighestPriorityDefaultValue: (questionId) ->
    question = formUtils.findItem(@formDesign, questionId)

    if not question?
      return null

    if @entityType? and @entity? and (question._type == 'SiteQuestion' or question._type == 'EntityQuestion')
      if question._type == 'SiteQuestion'
        siteType = (if question.siteTypes then question.siteTypes[0]) or "water_point"
        entityType = siteType.toLowerCase().replace(new RegExp(' ', 'g'), "_")
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

    # Handle defaultNow
    if (question._type == "DateQuestion" or question._type == "DateColumnQuestion") and question.defaultNow
      # If datetime
      if question.format.match /ss|LLL|lll|m|h|H/
        return new Date().toISOString()
      else
        return moment().format("YYYY-MM-DD")

    return question.defaultValue
