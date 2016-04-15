formUtils = require './formUtils'

# Uses conditions to defines the visibility status of all the Sections, Questions, Instructions, Group, RosterGroup and RosterMatrix
# The result is kept in the visibilityStructure. It contains an entry with true or false for each element (should never be null or undefined)
# A parent (like a section or a group), will always force visible to false for all their children if they are invisible.
# The usage is fairly simple. It's created with a form and then the visibilityStructure is recalculated with specify data each time it changes.

module.exports = class VisibilityCalculator
  constructor: (form) ->
    @form = form
    @visibilityStructure = {}

  # Updates the visibilityStructure dictionary with one entry for each element
  createVisibilityStructure: (data) ->
    @visibilityStructure = {}
    @processForm(data)
    return @visibilityStructure

  # Process the whole form
  processForm: (data) ->
    if @form._type != 'Form'
      throw new Error('Should be a form')

    if @form.contents[0] and @form.contents[0]._type == "Section"
      for content in @form.contents
        @processGroupOrSection(content, data)
    else
      for content in @form.contents
        @processItem(content, false, data, '')

  # Process a section or a group (they both behave the same way when it comes to determining visibility)
  processGroupOrSection: (groupOrSection, data) ->
    if groupOrSection._type != 'Section' and  groupOrSection._type != 'Group'
      throw new Error('Should be a section or a group')

    # Always visible if no condition has been set
    if groupOrSection.conditions? and groupOrSection.conditions.length > 0
      conditions = @compileConditions(groupOrSection.conditions, @forms)
      isVisible = conditions(data)
    else
      isVisible = true
    @visibilityStructure[groupOrSection._id] = isVisible

    for content in groupOrSection.contents
      @processItem(content, isVisible == false, data, '')

  # If the parent is invisible, forceToInvisible is set to true and the item will be invisible no matter what
  # The prefix contains the info set by a RosterGroup or a RosterMatrix
  processItem: (item, forceToInvisible, data, prefix) ->
    if formUtils.isQuestion(item)
      @processQuestion(item, forceToInvisible, data, prefix)
    else if item._type == "Instructions"
      @processInstruction(item, forceToInvisible, data, prefix)
    else if item._type == "RosterGroup" or item._type == "RosterMatrix"
      @processRoster(item, forceToInvisible, data, prefix)
    else if item._type == "Group"
      @processGroupOrSection(item, forceToInvisible, data)
    else
      throw new Error('Unknow item type')

  # Sets visible to false if forceToInvisible is true or the conditions and data make the question invisible
  # The prefix contains the info set by a RosterGroup or a RosterMatrix
  processQuestion: (question, forceToInvisible, data, prefix) ->
    if forceToInvisible
      isVisible = false
    else if question.conditions? and question.conditions.length > 0
      conditions = @compileConditions(question.conditions, @form)
      isVisible = conditions(data)
    else
      isVisible = true
    @visibilityStructure[prefix + question._id] = isVisible

  # Behaves like a question
  processInstruction: (instruction, forceToInvisible, data, prefix) ->
    @processQuestion(instruction, forceToInvisible, data, prefix)

  # Handles RosterGroup and RosterMatrix
  # The visibility of the Rosters are similar to questions, the extra logic is for handling the children
  # The logic is a bit more tricky when a rosterId is set. It uses that other roster data for calculating the visibility of its children.
  processRoster: (rosterGroup, forceToInvisible, data, prefix) ->
    if rosterGroup._type != 'RosterGroup' and rosterGroup._type != 'RosterMatrix'
      throw new Error('Should be a RosterGroup or RosterMatrix')

    if forceToInvisible
      isVisible = false
    else if rosterGroup.conditions? and rosterGroup.conditions.length > 0
      conditions = @compileConditions(rosterGroup.conditions, @forms)
      isVisible = conditions(data)
    else
      isVisible = true
    @visibilityStructure[rosterGroup._id] = isVisible

    # The data used (and passed down to sub items) is the one specified by rosterId if set
    if rosterGroup.rosterId?
      dataId = rosterGroup.rosterId
    # Else the RosterGroup uses its own data
    else
      dataId = rosterGroup._id
    subData = data[dataId]

    if subData?
      for rosterGroupData, index in subData
        for content in rosterGroup.contents
          newPrefix = "#{dataId}.#{index}."
          @processItem(content, isVisible == false, rosterGroupData, newPrefix)

  # This code has been copied from FromCompiler, only getValue and getAlternate have been changed
  compileCondition: (cond) =>
    getValue = (data) =>
      answer = data[cond.lhs.question] || {}
      return answer.value

    getAlternate = (data) =>
      answer = data[cond.lhs.question] || {}
      return answer.alternate

    switch cond.op
      when "present"
        return (data) =>
          value = getValue(data)
          return not(not value) and not (value instanceof Array and value.length == 0)
      when "!present"
        return (data) =>
          value = getValue(data)
          return (not value) or (value instanceof Array and value.length == 0)
      when "contains"
        return (data) =>
          return (getValue(data) or "").indexOf(cond.rhs.literal) != -1
      when "!contains"
        return (data) =>
          return (getValue(data) or "").indexOf(cond.rhs.literal) == -1
      when "="
        return (data) =>
          return getValue(data) == cond.rhs.literal
      when ">", "after"
        return (data) =>
          return getValue(data) > cond.rhs.literal
      when "<", "before"
        return (data) =>
          return getValue(data) < cond.rhs.literal
      when "!="
        return (data) =>
          return getValue(data) != cond.rhs.literal
      when "includes"
        return (data) =>
          return _.contains(getValue(data) or [], cond.rhs.literal) or cond.rhs.literal == getAlternate(data)
      when "!includes"
        return (data) =>
          return not _.contains(getValue(data) or [], cond.rhs.literal) and cond.rhs.literal != getAlternate(data)
      when "is"
        return (data) =>
          return getValue(data) == cond.rhs.literal or getAlternate(data) == cond.rhs.literal
      when "isnt"
        return (data) =>
          return getValue(data) != cond.rhs.literal and getAlternate(data) != cond.rhs.literal
      when "isoneof"
        return (data) =>
          value = getValue(data)
          if _.isArray(value)
            return _.intersection(cond.rhs.literal, value).length > 0 or _.contains(cond.rhs.literal, getAlternate(data))
          else
            return _.contains(cond.rhs.literal, value) or _.contains(cond.rhs.literal, getAlternate(data))
      when "isntoneof"
        return (data) =>
          value = getValue(data)
          if _.isArray(value)
            return _.intersection(cond.rhs.literal, value).length == 0 and not _.contains(cond.rhs.literal, getAlternate(data))
          else
            return not _.contains(cond.rhs.literal, value) and not _.contains(cond.rhs.literal, getAlternate(data))
      when "true"
        return (data) =>
          return getValue(data) == true
      when "false"
        return (data) =>
          return getValue(data) != true
      else
        throw new Error("Unknown condition op " + cond.op)

  # This code has been copied from FromCompiler
  compileConditions: (conds) =>
    compConds = _.map(conds, @compileCondition)
    return (data) =>
      for compCond in compConds
        if not compCond(data)
          return false

      return true