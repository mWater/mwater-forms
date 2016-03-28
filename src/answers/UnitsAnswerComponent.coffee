React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require '../formUtils'

# Not tested

module.exports = class UnitsAnswerComponent extends React.Component
  @contextTypes:
    locale: React.PropTypes.string  # Current locale (e.g. "en")

  @propTypes:
    answer: React.PropTypes.object.isRequired
    onValueChange: React.PropTypes.func.isRequired
    units: React.PropTypes.array.isRequired
    defaultUnits: React.PropTypes.string
    prefix: React.PropTypes.bool.isRequired
    decimal: React.PropTypes.bool.isRequired

  constructor: (props) ->
    @state = {quantity: @getSelectedQuantity(props.answer)}

  componentWillReceiveProps: (nextProps) ->
    @setState(quantity: @getSelectedQuantity(nextProps.answer))

  # onChange callback only set the quantity state or else typing '1.' results in NaN and is then replaced with an empty string
  handleValueChange: (val) =>
    @setState(quantity: val.target.value)

  # Uses onBlur for updating the value instead of onChange (look at the justification above)
  handleValueBlur: (val) =>
    @changed(val.target.value, @getSelectedUnit())

  handleUnitChange: (val) =>
    @changed(@state.quantity, val.target.value)

  changed: (quantity, unit) ->
    quantity = if @props.decimal then parseFloat(quantity) else parseInt(quantity)
    unit = if unit then unit else @props.defaultUnits

    if isNaN(quantity)
      quantity = null

    @props.onValueChange({quantity: quantity, unit: unit})

  getSelectedUnit: ->
    answer = @props.answer
    if answer.value?
      if answer.value.quantity?
        return answer.value.unit
      else
        return answer.unit
    return null

  getSelectedQuantity: (answer) ->
    answer = answer
    if answer.value?
      if answer.value.quantity?
        return answer.value.quantity
      else
        return answer.value
    return null

  createNumberInput: ->
    return H.td null,
      H.input {
        id: 'quantity'
        className: "form-control",
        type: "number",
        step: "any",
        style: {width: "12em"},
        onBlur: @handleValueBlur,
        onChange: @handleValueChange,
        value: @state.quantity
      }

  render: ->
    H.table null,
      H.tbody null,
        H.tr null,
          if not @props.prefix
            @createNumberInput()
          H.td null,
            H.select {id: "units", className: "form-control", style: {width: "auto"}, onChange: @handleUnitChange},
              if not @props.defaultUnits
                H.option value: "",
                  "Select units"
              for unit in @props.units
                H.option key: unit.id, value:unit.id,
                  formUtils.localizeString(unit.label, @context.locale)
          if @props.prefix
            H.td null,
              @createNumberInput()
