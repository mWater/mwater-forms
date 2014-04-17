Question = require './Question'
_ = require 'underscore'

# Question that must be answered with units
# Set units and defaultUnit if desired.

module.exports = class UnitsQuestion extends Question
  events:
    "change #value": "changed"
    "change #units": "changed"

  renderAnswer: (answerEl) ->
    # Convert units to maps
    units = _.map @options.units, (item) => { id: item.id, value: item.label }

    answerEl.html require('./templates/UnitsQuestion.hbs')(
      units: units, prefix: @options.unitsPosition == "prefix",
      defaultUnits: @options.defaultUnits)

  updateAnswer: (answerEl) ->
    answerEl.find("#value").val(@getAnswerValue())
    answerEl.find("#units").val(@getAnswerField("units") || @options.defaultUnits)

  setUnits: (units) ->
    @options.units = units
    @render()

  changed: (e) ->
    val = if @options.decimal then parseFloat(@$("#value").val()) else parseInt(@$("#value").val())
    units = @$("#units").val()

    if isNaN(val)
      val = null
    @setAnswerValue(val)

    # Set answer
    @setAnswerValue(val)
    @setAnswerField("units", if units then units else @options.defaultUnits)

  validateInternal: ->
    val = @$("#value").val()
    if @options.decimal and val.length > 0
      if isNaN(parseFloat(val))
        return true # TODO localize
    else if val.length > 0
      if not val.match(/^-?\d+$/)
        return true # TODO localize

    if val and not @$("#units").val()
      return true # TODO localize
    return null
