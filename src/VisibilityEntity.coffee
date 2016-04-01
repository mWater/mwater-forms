conditionUtils = require './conditionUtils'
formUtils = require './formUtils'

# TODO: Name needs to be changed
module.exports = class VisibilityEntity
  constructor: (form) ->
    @form = form

  createVisibilityStructure: (data) ->
    @data = data
    @visibilityStructure = {}
    @parseForm()
    # Creates a dictionary with one entry for each question (with sub structure for RosterQuestions)
    return @visibilityStructure

  parseForm: () ->
    if @form._type != 'Form'
      throw new Error('Should be a form')

    if @form.contents[0] and @form.contents[0]._type == "Section"
      for content in @form.contents
        @parseSection(content)
    else
      for content in @form.contents
        @parseItem(content)

  parseSection: (section) ->
    if section._type != 'Section'
      throw new Error('Should be a section')

    if section.conditions? and section.conditions.length > 0
      compileConditions(section.conditions, forms)
      @visibilityStructure[section._id] = conditions()
    else
      @visibilityStructure[section._id] = true

    for content in section.contents
      @parseItem(content)

  parseItem: (item) ->
    if formUtils.isQuestion(item)
      @parseQuestion(item)
    else if @props.item._type == "Instructions"
      @parseInstruction(item)
    else if @props.item._type == "RosterGroup"
      @parseRosterGroup(item)
    else if @props.item._type == "RosterMatrix"
      @parseRosterMatrix(item)
    else
      throw new Error('Unknow item type')

  parseQuestion: (question) ->
    if question.conditions? and question.conditions.length > 0
      conditions = @compileConditions(question.conditions, @form)
      @visibilityStructure[question._id] = conditions()
    else
      @visibilityStructure[question._id] = true


  parseInstruction: (instruction) ->
    @parseQuestion(instruction)

  parseRosterGroup: (question) ->
    # TODO: implement visibility logic
    null

  parseRosterMatrix: (question) ->
    # TODO: implement visibility logic
    null

  getQuestionData: (questionId) ->
    return @data[questionId]

  compileCondition: (cond) =>
    getValue = =>
      answer = @getQuestionData(cond.lhs.question) || {}
      return answer.value

    getAlternate = =>
      answer = @getQuestion(cond.lhs.question) || {}
      return answer.alternate

    switch cond.op
      when "present"
        return () =>
          value = getValue()
          return not(not value) and not (value instanceof Array and value.length == 0)
      when "!present"
        return () =>
          value = getValue()
          return (not value) or (value instanceof Array and value.length == 0)
      when "contains"
        return () =>
          return (getValue() or "").indexOf(cond.rhs.literal) != -1
      when "!contains"
        return () =>
          return (getValue() or "").indexOf(cond.rhs.literal) == -1
      when "="
        return () =>
          return getValue() == cond.rhs.literal
      when ">", "after"
        return () =>
          return getValue() > cond.rhs.literal
      when "<", "before"
        return () =>
          return getValue() < cond.rhs.literal
      when "!="
        return () =>
          return getValue() != cond.rhs.literal
      when "includes"
        return () =>
          return _.contains(getValue() or [], cond.rhs.literal) or cond.rhs.literal == getAlternate()
      when "!includes"
        return () =>
          return not _.contains(getValue() or [], cond.rhs.literal) and cond.rhs.literal != getAlternate()
      when "is"
        return () =>
          return getValue() == cond.rhs.literal or getAlternate() == cond.rhs.literal
      when "isnt"
        return () =>
          return getValue() != cond.rhs.literal and getAlternate() != cond.rhs.literal
      when "isoneof"
        return () =>
          value = getValue()
          if _.isArray(value)
            return _.intersection(cond.rhs.literal, value).length > 0 or _.contains(cond.rhs.literal, getAlternate())
          else
            return _.contains(cond.rhs.literal, value) or _.contains(cond.rhs.literal, getAlternate())
      when "isntoneof"
        return () =>
          value = getValue()
          if _.isArray(value)
            return _.intersection(cond.rhs.literal, value).length == 0 and not _.contains(cond.rhs.literal, getAlternate())
          else
            return not _.contains(cond.rhs.literal, value) and not _.contains(cond.rhs.literal, getAlternate())
      when "true"
        return () =>
          return getValue() == true
      when "false"
        return () =>
          return getValue() != true
      else
        throw new Error("Unknown condition op " + cond.op)

  compileConditions: (conds, form) =>
    # Only use valid conditions
    if form?
      conds = _.filter conds, (cond) -> conditionUtils.validateCondition(cond, form)
    compConds = _.map(conds, @compileCondition)
    return =>
      for compCond in compConds
        if not compCond()
          return false

      return true