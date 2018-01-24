formUtils = require './formUtils'
async = require 'async'
conditionUtils = require './conditionUtils'
ExprEvaluator = require('mwater-expressions').ExprEvaluator

###

Uses conditions to defines the visibility status of all the Sections, Questions, Instructions, Group, RosterGroup and RosterMatrix
The result is kept in the visibilityStructure. It contains an entry with true or false for each element (should never be null or undefined)
A parent (like a section or a group), will always force visible to false for all their children if they are invisible.
The usage is fairly simple. It's created with a form and then the visibilityStructure is recalculated with specify data each time it changes.

Visibility is based both on simple conditions (see conditionUtils), but also on conditionExpr (advanced conditions made of mwater-expressions) 
which need access to the entities which the questions may reference.

Non-rosters are just referenced by id: e.g. { "somequestionid": true }

Unless it is a matrix, in which case it is referenced by "questionid.itemid.columnid"

Rosters are referenced by entry index: e.g. { "somerosterid.2.somequestionid": true }


###
module.exports = class VisibilityCalculator
  constructor: (formDesign) ->
    @formDesign = formDesign

  # Updates the visibilityStructure dictionary with one entry for each element
  # data is the data of the response
  # responseRow is a ResponseRow which represents the same row
  createVisibilityStructure: (data, responseRow, callback) ->
    visibilityStructure = {}
    @processItem(@formDesign, false, data, responseRow, visibilityStructure, "", (error) =>
      if error
        callback(error)
      else
        callback(null, visibilityStructure)
    )

  # Process a form, section or a group (they both behave the same way when it comes to determining visibility)
  processGroup: (item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback) ->
    # Once visibility is calculated, call this
    applyResult = (isVisible) =>
      # Forms don't have an _id at design level
      if item._id
        visibilityStructure[prefix + item._id] = isVisible

      async.each item.contents, (subitem, cb) =>
        @processItem(subitem, isVisible == false, data, responseRow, visibilityStructure, prefix, -> _.defer(cb))
      , callback


    # Always visible if no condition has been set
    if forceToInvisible
      isVisible = false
    else if item.conditions? and item.conditions.length > 0
      conditions = conditionUtils.compileConditions(item.conditions, @formDesign)
      isVisible = conditions(data)
    else
      isVisible = true

    # Apply conditionExpr
    if item.conditionExpr
      new ExprEvaluator().evaluate item.conditionExpr, { row: responseRow }, (error, value) =>
        if error
          return callback(error)

        # Null or false is not visible
        if not value 
          isVisible = false

        applyResult(isVisible)
    else
      applyResult(isVisible)

  # If the parent is invisible, forceToInvisible is set to true and the item will be invisible no matter what
  # The prefix contains the info set by a RosterGroup or a RosterMatrix
  processItem: (item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback) ->
    if formUtils.isQuestion(item)
      @processQuestion(item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback)
    else if item._type == 'TextColumn'
      @processQuestion(item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback)
    else if item._type == "Instructions"
      # Behaves like a question
      @processQuestion(item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback)
    else if item._type == "Timer"
      # Behaves like a question
      @processQuestion(item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback)
    else if item._type == "RosterGroup" or item._type == "RosterMatrix"
      @processRoster(item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback)
    else if item._type in ['Section', "Group", "Form"]
      @processGroup(item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback)
    else
      callback(new Error('Unknow item type'))

  # Sets visible to false if forceToInvisible is true or the conditions and data make the question invisible
  # The prefix contains the info set by a RosterGroup or a RosterMatrix
  processQuestion: (question, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback) ->
    # Once visibility is calculated, call this
    applyResult = (isVisible) =>
      visibilityStructure[prefix + question._id] = isVisible

      if question._type == 'MatrixQuestion'
        async.each question.items, (item, cb) =>
          async.each question.columns, (column, cb2) =>
            newPrefix = "#{question._id}.#{item.id}."
            @processItem(column, isVisible == false, data, responseRow, visibilityStructure, newPrefix, -> _.defer(cb2))
          , cb
        , callback
      else
        callback(null)
  
    if forceToInvisible
      isVisible = false
    else if question.conditions? and question.conditions.length > 0
      conditions = conditionUtils.compileConditions(question.conditions, @formDesign)
      isVisible = conditions(data)
    else
      isVisible = true

    # Apply randomAsk
    if question.randomAskProbability? and data[question._id]?.randomAsked == false
      isVisible = false

    # Apply conditionExpr
    if question.conditionExpr
      new ExprEvaluator().evaluate question.conditionExpr, { row: responseRow }, (error, value) =>
        if error
          return callback(error)

        # Null or false is not visible
        if not value 
          isVisible = false

        applyResult(isVisible)
    else
      applyResult(isVisible)

  # Handles RosterGroup and RosterMatrix
  # The visibility of the Rosters are similar to questions, the extra logic is for handling the children
  # The logic is a bit more tricky when a rosterId is set. It uses that other roster data for calculating the visibility of its children.
  processRoster: (rosterGroup, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback) ->
    if rosterGroup._type != 'RosterGroup' and rosterGroup._type != 'RosterMatrix'
      throw new Error('Should be a RosterGroup or RosterMatrix')

    applyResult = (isVisible) =>
      visibilityStructure[rosterGroup._id] = isVisible

      # The data used (and passed down to sub items) is the one specified by rosterId if set
      if rosterGroup.rosterId?
        dataId = rosterGroup.rosterId
      # Else the RosterGroup uses its own data
      else
        dataId = rosterGroup._id
      subData = data[dataId]

      if subData?
        # Get subrows
        responseRow.getField "data:#{dataId}", (error, rosterRows) =>
          if error
            return callback(error)

          # For each entry of roster
          async.forEachOf subData, (entry, index, cb) =>
            async.each rosterGroup.contents, (item, cb2) =>
              newPrefix = "#{dataId}.#{index}."

              # Data is actually stored in .data subfield
              @processItem(item, isVisible == false, entry.data, rosterRows[index], visibilityStructure, newPrefix, cb2)
            , cb
          , callback
      else
        callback(null)

    if forceToInvisible
      isVisible = false
    else if rosterGroup.conditions? and rosterGroup.conditions.length > 0
      conditions = conditionUtils.compileConditions(rosterGroup.conditions, @formDesign)
      isVisible = conditions(data)
    else
      isVisible = true

    # Apply conditionExpr
    if rosterGroup.conditionExpr
      new ExprEvaluator().evaluate rosterGroup.conditionExpr, { row: responseRow }, (error, value) =>
        if error
          return callback(error)

        # Null or false is not visible
        if not value 
          isVisible = false

        applyResult(isVisible)
    else
      applyResult(isVisible)
