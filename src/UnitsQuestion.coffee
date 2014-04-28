Question = require './Question'
_ = require 'underscore'

# Question that must be answered with units
# Set units and defaultUnit if desired.

module.exports = class UnitsQuestion extends Question
  events:
    "change #quantity": "changed"
    "change #units": "changed"

  renderAnswer: (answerEl) ->
    # Convert units to maps
    units = _.map @options.units, (item) => { id: item.id, value: item.label }

    answerEl.html require('./templates/UnitsQuestion.hbs')(
      units: units, prefix: @options.unitsPosition == "prefix",
      defaultUnits: @options.defaultUnits)

  updateAnswer: (answerEl) ->
    val = @getAnswerValue() || {}
    answerEl.find("#quantity").val(val.quantity)
    answerEl.find("#units").val(val.units || @options.defaultUnits)

  isAnswered: ->
    val = @getAnswerValue()
    if not val?
      return false

    if not val.quantity? or not val.units
      return false

    return true

  setUnits: (units) ->
    @options.units = units
    @render()

  changed: ->
    quantity = if @options.decimal then parseFloat(@$("#quantity").val()) else parseInt(@$("#quantity").val())
    units = @$("#units").val()
    units = if units then units else @options.defaultUnits

    if isNaN(quantity)
      quantity = null

    # Set answer
    @setAnswerValue { units: units, quantity: quantity }

  validateInternal: ->
    quantity = @$("#quantity").val()
    if @options.decimal and quantity.length > 0
      if isNaN(parseFloat(quantity))
        return true # TODO localize
    else if quantity.length > 0
      if not quantity.match(/^-?\d+$/)
        return true # TODO localize

    if quantity and not @$("#units").val()
      return true # TODO localize
    return null
