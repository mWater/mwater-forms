formUtils = require './formUtils'
async = require 'async'
conditionUtils = require './conditionUtils'

# Uses conditions to defines the visibility status of all the Sections, Questions, Instructions, Group, RosterGroup and RosterMatrix
# The result is kept in the visibilityStructure. It contains an entry with true or false for each element (should never be null or undefined)
# A parent (like a section or a group), will always force visible to false for all their children if they are invisible.
# The usage is fairly simple. It's created with a form and then the visibilityStructure is recalculated with specify data each time it changes.

module.exports = class VisibilityCalculator
  constructor: (formDesign) ->
    @formDesign = formDesign

  # Updates the visibilityStructure dictionary with one entry for each element
  createVisibilityStructure: (data, callback) ->
    visibilityStructure = {}
    @processItem(@formDesign, false, data, visibilityStructure, "", (error) =>
      if error
        callback(error)
      else
        callback(null, visibilityStructure)
    )

  # Process a form, section or a group (they both behave the same way when it comes to determining visibility)
  processGroup: (item, forceToInvisible, data, visibilityStructure, prefix, callback) ->
    # Always visible if no condition has been set
    if forceToInvisible
      isVisible = false
    else if item.conditions? and item.conditions.length > 0
      conditions = conditionUtils.compileConditions(item.conditions, @formDesign)
      isVisible = conditions(data)
    else
      isVisible = true

    # Forms don't have an _id at design level
    if item._id
      visibilityStructure[prefix + item._id] = isVisible

    async.each item.contents, (subitem, cb) =>
      @processItem(subitem, isVisible == false, data, visibilityStructure, prefix, cb)
    , callback

  # If the parent is invisible, forceToInvisible is set to true and the item will be invisible no matter what
  # The prefix contains the info set by a RosterGroup or a RosterMatrix
  processItem: (item, forceToInvisible, data, visibilityStructure, prefix, callback) ->
    if formUtils.isQuestion(item)
      @processQuestion(item, forceToInvisible, data, visibilityStructure, prefix, callback)
    else if item._type == 'TextColumn'
      @processQuestion(item, forceToInvisible, data, visibilityStructure, prefix, callback)
    else if item._type == "Instructions"
      @processInstruction(item, forceToInvisible, data, visibilityStructure, prefix, callback)
    else if item._type == "Timer"
      @processTimer(item, forceToInvisible, data, visibilityStructure, prefix, callback)
    else if item._type == "RosterGroup" or item._type == "RosterMatrix"
      @processRoster(item, forceToInvisible, data, visibilityStructure, prefix, callback)
    else if item._type in ['Section', "Group", "Form"]
      @processGroup(item, forceToInvisible, data, visibilityStructure, prefix, callback)
    else
      callback(new Error('Unknow item type'))

  # Sets visible to false if forceToInvisible is true or the conditions and data make the question invisible
  # The prefix contains the info set by a RosterGroup or a RosterMatrix
  processQuestion: (question, forceToInvisible, data, visibilityStructure, prefix, callback) ->
    if forceToInvisible
      isVisible = false
    else if question.conditions? and question.conditions.length > 0
      conditions = conditionUtils.compileConditions(question.conditions, @formDesign)
      isVisible = conditions(data)
    else
      isVisible = true
    
    visibilityStructure[prefix + question._id] = isVisible

    if question._type == 'MatrixQuestion'
      async.each question.items, (item, cb) =>
        async.each question.columns, (column, cb2) =>
          newPrefix = "#{question._id}.#{item.id}."
          @processItem(column, isVisible == false, data, visibilityStructure, newPrefix, cb2)
        , cb
      , callback
    else
      callback(null)

  # Behaves like a question
  processInstruction: (instruction, forceToInvisible, data, visibilityStructure, prefix, callback) ->
    @processQuestion(item, forceToInvisible, data, visibilityStructure, prefix, callback)

  # Behaves like a question
  processTimer: (instruction, forceToInvisible, data, visibilityStructure, prefix, callback) ->
    @processQuestion(item, forceToInvisible, data, visibilityStructure, prefix, callback)

  # Handles RosterGroup and RosterMatrix
  # The visibility of the Rosters are similar to questions, the extra logic is for handling the children
  # The logic is a bit more tricky when a rosterId is set. It uses that other roster data for calculating the visibility of its children.
  processRoster: (rosterGroup, forceToInvisible, data, visibilityStructure, prefix, callback) ->
    if rosterGroup._type != 'RosterGroup' and rosterGroup._type != 'RosterMatrix'
      throw new Error('Should be a RosterGroup or RosterMatrix')

    if forceToInvisible
      isVisible = false
    else if rosterGroup.conditions? and rosterGroup.conditions.length > 0
      conditions = conditionUtils.compileConditions(rosterGroup.conditions, @formDesign)
      isVisible = conditions(data)
    else
      isVisible = true

    visibilityStructure[rosterGroup._id] = isVisible

    # The data used (and passed down to sub items) is the one specified by rosterId if set
    if rosterGroup.rosterId?
      dataId = rosterGroup.rosterId
    # Else the RosterGroup uses its own data
    else
      dataId = rosterGroup._id
    subData = data[dataId]

    if subData?
      async.forEachOf subData, (entry, index, cb) =>
        async.each rosterGroup.contents, (item, cb2) =>
          newPrefix = "#{dataId}.#{index}."

          # Data is actually stored in .data subfield
          @processItem(item, isVisible == false, entry.data, visibilityStructure, newPrefix, cb2)
        , cb
      , callback
    else
      callback(null)
