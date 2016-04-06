
# TODO: Name needs to be changed
module.exports = class CleaningEntity

  # Returns an array containing the cleaned data
  cleanData: (design, data, visibilityStructure) ->
    # NOTE: Always remember that data is immutable
    # Creates a copy of the data and cleans it
    newData = _.clone data

    # TODO: Support the case where 2 roster groups (one master, one pointing to it) are not both visible/invisible

    # Remove data entries for all the invisible questions
    for key, value of data
      if not visibilityStructure[key]
        delete newData[key]

    return newData