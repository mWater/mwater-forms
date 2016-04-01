

# TODO: Name needs to be changed
module.exports = class CleaningEntity
  cleanData: (design, data, visibilityStructure) ->
    # Creates a copy of the data and cleans it
    # TODO: remove data entries for all the invisible questions
    return data