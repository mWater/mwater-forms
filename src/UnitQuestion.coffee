Question = require './Question'
_ = require 'underscore'

# Question that must be answered with units
# Set units and defaultUnit if desired.

module.exports = Question.extend
  events:
    "change": "changed"

  renderAnswer: (answerEl) ->
    # Convert units to maps
    units = _.map @options.units, (item) => { id: item[0], value: item[1] }

    answerEl.html require('./templates/UnitQuestion.hbs')(
      units: units, prefix: @options.prefix,
      defaultUnit: @options.defaultUnit)

    # Set values
    @update()

  update: ->
    answer = @model.get @id
    
    @$("#value").val(if answer? and answer.value? then answer.value else "")
    @$("#unit").val(if answer? and answer.unit? then answer.unit else @options.defaultUnit)

  setUnits: (units) ->
    @options.units = units
    @render()

  changed: (e) ->
    value = @$("#value").val()
    unit = @$("#unit").val()

    value = parseFloat(value)
    if isNaN(value)
      value = null

    # Set answer
    answer = 
      value: value
      unit: if unit then unit else null

    @model.set @id, answer

  validateInternal: ->
    value = @$("#value").val()
    if value.length > 0
      if isNaN(parseFloat(value))
        return "Invalid decimal number"

    if value and not @$("#unit").val()
      return "Specify units"

    return null
