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
    @state = {quantity: @getSelectedQuantity(props.answer), selectedUnits: @getSelectedUnit(props.answer)}

  componentWillReceiveProps: (nextProps) ->
    @setState(quantity: @getSelectedQuantity(nextProps.answer), selectedUnits: @getSelectedUnit(nextProps.answer))

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
    @changed(val.target.value, @state.selectedUnits)

  handleUnitChange: (val) =>
    @changed(@state.quantity, val.target.value)

  changed: (quantity, unit) ->
    if quantity == null or quantity == ''
      quantity = null
    else
      quantity = if @props.decimal then parseFloat(quantity) else parseInt(quantity)
    unit = if unit then unit else @props.defaultUnits

    if isNaN(quantity)
      quantity = null

    @props.onValueChange({quantity: quantity, units: unit})

  getSelectedUnit: (answer) ->
    if answer.value?
      return answer.value.units

    if @props.defaultUnits?
      return @props.defaultUnits

    return null

  getSelectedQuantity: (answer) ->
    if answer.value?.quantity?
      return answer.value.quantity
    return null

  createNumberInput: ->
    return H.td null,
      H.input {
        id: 'quantity'
        className: "form-control",
        type: "number"
        lang: "en"
        step: "any",
        style: {width: "12em"},
        onBlur: @handleValueBlur,
        onChange: @handleValueChange,
        value: if @state.quantity? then @state.quantity else ""
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
                value: if @state.selectedUnits == null then '' else @state.selectedUnits
              },
              if not @props.defaultUnits
                H.option value: "",
                  "Select units"
              for unit in @props.units
                H.option key: unit.id, value:unit.id,
                  formUtils.localizeString(unit.label, @context.locale)
          if @props.prefix
            @createNumberInput()
