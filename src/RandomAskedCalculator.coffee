formUtils = require './formUtils'

# The RandomAskedCalculator sets the randomAsked property of visible answers, determining if the question will be visible.
# If question has randomAskProbability, it is visible unless randomAsked is set to false, which this class determines.
module.exports = class RandomAskedCalculator
  constructor: (formDesign) ->
    @formDesign = formDesign

  calculateRandomAsked: (data, visibilityStructure) ->
    # NOTE: Always remember that data is immutable
    newData = _.cloneDeep(data)

    # Index all items by _id
    items = _.indexBy(formUtils.allItems(@formDesign), "_id")

    # For each item in visibility structure
    for key, visible of visibilityStructure
      # Do nothing with invisible
      if not visible
        continue

      parts = key.split(".")

      # If simple key
      if parts.length == 1
        item = items[parts[0]]
        if not item
          continue

        if item.randomAskProbability?
          newData[item._id] = newData[item._id] or {}
          if not newData[item._id].randomAsked?
            newData[item._id].randomAsked = @generateRandomValue(item.randomAskProbability)

      else 
        # If not roster, skip
        if not parts[1].match(/^\d+$/)
          continue

        # Lookup question in roster
        item = items[parts[2]]
        if not item
          continue

        # Get roster index
        entryIndex = parseInt(parts[1])

        if item.randomAskProbability?
          # Get enty data
          entryData = newData[parts[0]][entryIndex].data

          # Create structure
          entryData[item._id] = entryData[item._id] or {}

          # Set randomAsked
          if not entryData[item._id].randomAsked?
            entryData[item._id].randomAsked = @generateRandomValue(item.randomAskProbability)

    return newData

  # Randomly determine asked
  generateRandomValue: (probability) ->
    return Math.random() < probability