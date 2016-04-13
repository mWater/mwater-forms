
module.exports = class ResponseCleaner

  # Returns an array containing the cleaned data
  cleanData: (data, visibilityStructure) ->
    # NOTE: Always remember that data is immutable
    # Creates a copy of the data and cleans it
    newData = _.clone(data)

    # Remove data entries for all the invisible questions
    for key, visible of visibilityStructure
      if not visible
        values = key.split('.')
        if values.length == 1
          delete newData[key]
        else
          rosterGroupId = values[0]
          index = parseInt(values[1])
          questionId = values[2]
          if newData[rosterGroupId]? and newData[rosterGroupId][index]?
            answerToClean = newData[rosterGroupId][index]
            delete answerToClean[questionId]

    return newData