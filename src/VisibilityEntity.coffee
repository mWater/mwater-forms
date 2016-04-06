formUtils = require './formUtils'

# TODO: Name needs to be changed
module.exports = class VisibilityEntity
  constructor: (form) ->
    @form = form
    @visibilityStructure = {}

  createVisibilityStructure: (data) ->
    @visibilityStructure = {}
    @processForm(data)
    # Creates a dictionary with one entry for each question (with sub structure for RosterQuestions)
    return @visibilityStructure

  processForm: (data) ->
    if @form._type != 'Form'
      throw new Error('Should be a form')

    if @form.contents[0] and @form.contents[0]._type == "Section"
      for content in @form.contents
        @processSection(content, data)
    else
      for content in @form.contents
        @processItem(content, data, '')

  processSection: (section, data) ->
    if section._type != 'Section'
      throw new Error('Should be a section')

    if section.conditions? and section.conditions.length > 0
      compileConditions(section.conditions, forms)
      isVisible = conditions(data)
    else
      isVisible = true
    @visibilityStructure[section._id] = isVisible

    for content in section.contents
      @processItem(content, isVisible == false, data, '')

  processItem: (item, forceToInvisible, data, prefix) ->
    if formUtils.isQuestion(item)
      #console.log 'Question'
      #console.log item
      @processQuestion(item, forceToInvisible, data, prefix)
    else if item._type == "Instructions"
      @processInstruction(item, forceToInvisible, data, prefix)
    else if item._type == "RosterGroup"
      console.log 'RosterGroup'
      @processRosterGroup(item, forceToInvisible, data)
    else if item._type == "RosterMatrix"
      console.log 'RosterMaxtrix'
      @processRosterMatrix(item, forceToInvisible, data, prefix)
    else
      throw new Error('Unknow item type')

  processQuestion: (question, forceToInvisible, data, prefix) ->
    if forceToInvisible
      isVisible = false
    else if question.conditions? and question.conditions.length > 0
      console.log 'has condition'
      conditions = @compileConditions(question.conditions, @form)
      console.log data
      isVisible = conditions(data)
    else
      isVisible = true
    @visibilityStructure[prefix + question._id] = isVisible

  processInstruction: (instruction, forceToInvisible, data, prefix) ->
    @processQuestion(instruction, forceToInvisible, data, prefix)

  processRosterGroup: (rosterGroup, forceToInvisible, data, prefix) ->
    if rosterGroup._type != 'RosterGroup'
      throw new Error('Should be a RosterGroup')

    if forceToInvisible
      isVisible = false
    else if rosterGroup.conditions? and rosterGroup.conditions.length > 0
      compileConditions(rosterGroup.conditions, @forms)
      isVisible = conditions(data)
    else
      isVisible = true
    @visibilityStructure[rosterGroup._id] = isVisible

    if data[rosterGroup._id]?
      for rosterGroupData, index in data[rosterGroup._id]
        for content in rosterGroup.contents
          newPrefix = "#{rosterGroup._id}.#{index}."
          @processItem(content, isVisible == false, rosterGroupData, newPrefix)

  processRosterMatrix: (question, forceToInvisible, data, prefix) ->
    # TODO: implement visibility logic
    # IF rosterId is set, use that data
    null

  compileCondition: (cond) =>
    getValue = (data) =>
      answer = data[cond.lhs.question] || {}
      console.log data
      console.log cond.lhs.question
      console.log answer.value
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
        return () =>
          value = getValue(data)
          if _.isArray(value)
            return _.intersection(cond.rhs.literal, value).length == 0 and not _.contains(cond.rhs.literal, getAlternate(data))
          else
            return not _.contains(cond.rhs.literal, value) and not _.contains(cond.rhs.literal, getAlternate(data))
      when "true"
        return (data) =>
          console.log 'true condition'
          return getValue(data) == true
      when "false"
        return (data) =>
          return getValue(data) != true
      else
        throw new Error("Unknown condition op " + cond.op)

  compileConditions: (conds, form) =>
    compConds = _.map(conds, @compileCondition)
    return (data) =>
      for compCond in compConds
        if not compCond(data)
          return false

      return true