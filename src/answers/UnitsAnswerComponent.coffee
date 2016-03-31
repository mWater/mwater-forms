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
    onNextOrComments: React.PropTypes.func

  constructor: (props) ->
    super
    @state = {quantity: @getSelectedQuantity(props.answer)}

  componentWillReceiveProps: (nextProps) ->
    @setState(quantity: @getSelectedQuantity(nextProps.answer))

  focus: () ->
    if @props.prefix
      @refs.quantity.focus()
    else
      @refs.units.focus()

  handleKeyDown: (ev) =>
    if @props.onNextOrComments?
      # When pressing ENTER or TAB
      if ev.keyCode == 13 or ev.keyCode == 9
        @props.onNextOrComments(ev)
        # It's important to prevent the default behavior when handling tabs (or else the tab is applied after the focus change)
        ev.preventDefault()

  handleInternalNext: (ev) =>
    # When pressing ENTER or TAB
    if ev.keyCode == 13 or ev.keyCode == 9
      if @props.prefix
        @refs.quantity.focus()
      else
        @refs.units.focus()
      # It's important to prevent the default behavior when handling tabs (or else the tab is applied after the focus change)
      ev.preventDefault()

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
        ref: 'quantity'
        onKeyDown: if @props.prefix then @handleKeyDown else @handleInternalNext
      }

  render: ->
    H.table null,
      H.tbody null,
        H.tr null,
          if not @props.prefix
            @createNumberInput()
          H.td null,
            H.select {
                id: "units"
                ref: "units"
                className: "form-control"
                style: {width: "auto"}
                onChange: @handleUnitChange
                #onKeyDown: if @props.prefix then @handleInternalNext else @handleKeyDown
              },
              if not @props.defaultUnits
                H.option value: "",
                  "Select units"
              for unit in @props.units
                H.option key: unit.id, value:unit.id,
                  formUtils.localizeString(unit.label, @context.locale)
          if @props.prefix
            H.td null,
              @createNumberInput()
