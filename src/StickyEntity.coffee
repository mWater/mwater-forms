

# TODO: Name needs to be changed
module.exports = class CleaningEntity

  setStickyData: (design, data, stickyStorage, previousVisibilityStructure, newVisibilityStructure) ->
    # NOTE: Always remember that data is immutable
    # TODO: Find all the sticky questions
    # TODO: Test if value is not set AND no alternate has been set
    # TODO: Look if the question just became visible
    # TODO: Use the context stickyStorage.get(questionId) to find any set the sticky value
    return data