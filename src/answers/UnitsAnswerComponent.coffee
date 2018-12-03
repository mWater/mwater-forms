PropTypes = require('prop-types')
React = require 'react'
R = React.createElement

formUtils = require '../formUtils'
ui = require 'react-library/lib/bootstrap'

# Not tested
module.exports = class UnitsAnswerComponent extends React.Component
  @contextTypes:
    locale: PropTypes.string  # Current locale (e.g. "en")

  @propTypes:
    answer: PropTypes.object.isRequired
    onValueChange: PropTypes.func.isRequired
    units: PropTypes.array.isRequired
    defaultUnits: PropTypes.string
    prefix: PropTypes.bool.isRequired
    decimal: PropTypes.bool.isRequired
    onNextOrComments: PropTypes.func

  constructor: (props) ->
    super(props)
    @state = {quantity: @getSelectedQuantity(props.answer), selectedUnits: @getSelectedUnit(props.answer)}

  componentWillReceiveProps: (nextProps) ->
    @setState(quantity: @getSelectedQuantity(nextProps.answer), selectedUnits: @getSelectedUnit(nextProps.answer))

  focus: () ->
    if @props.prefix
      @quantity.focus()
    else
      @units.focus()

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
        @quantity.focus()
      else
        @units.focus()
      # It's important to prevent the default behavior when handling tabs (or else the tab is applied after the focus change)
      ev.preventDefault()

  handleValueChange: (val) =>
    @changed(val, @state.selectedUnits)

  handleUnitChange: (val) =>
    @changed(@state.quantity, val.target.value)

  changed: (quantity, unit) ->
    unit = if unit then unit else @props.defaultUnits
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
    return R 'td', null,
      R ui.NumberInput,
        ref: (c) => @quantity = c
        decimal: @props.decimal
        value: if @state.quantity? then @state.quantity
        onChange: @handleValueChange
        onTab: if @props.prefix then @props.onNextOrComments else @handleInternalNext
        onEnter: if @props.prefix then @props.onNextOrComments else @handleInternalNext

  render: ->
    R 'table', null,
      R 'tbody', null,
        R 'tr', null,
          if not @props.prefix
            @createNumberInput()
          R 'td', null,
            R 'select', {
              id: "units"
              ref: (c) => @units = c
              className: "form-control"
              style: {width: "auto"}
              onChange: @handleUnitChange
              value: if @state.selectedUnits == null then '' else @state.selectedUnits
            },
              if not @props.defaultUnits
                R 'option', value: "",
                  "Select units"
              for unit in @props.units
                R 'option', key: unit.id, value:unit.id,
                  formUtils.localizeString(unit.label, @context.locale)
          if @props.prefix
            @createNumberInput()
