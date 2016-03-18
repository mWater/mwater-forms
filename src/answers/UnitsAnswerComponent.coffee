React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require '../formUtils'

module.exports = class UnitsAnswerComponent extends React.Component
  @contextTypes:
    locale: React.PropTypes.string  # Current locale (e.g. "en")

  @propTypes:
    answer: React.PropTypes.object.isRequired
    onValueChange: React.PropTypes.func.isRequired
    units: React.PropTypes.array.isRequired
    defaultUnits: React.PropTypes.string
    prefix: React.PropTypes.bool.isRequired

  handleValueChange: (val) =>
    @props.onValueChange({value: val.target.value, unit: @getSelectedUnit()})

  handleUnitChange: (val) =>
    @props.onValueChange({value: @getSelectedValue(), unit: val.target.value})


  getSelectedUnit: ->
    answer = @props.answer
    if answer.value?
      if answer.value.quantity?
        return answer.value.unit
      else
        return answer.unit
    return null

  getSelectedValue: ->
    answer = @props.answer
    if answer.value?
      if answer.value.quantity?
        return answer.value.quantity
      else
        return answer.value
    return 0

  render: ->
    selectedValue = @getSelectedValue()
    H.table null,
      H.tbody null,
        H.tr null,
          if not @props.prefix
            H.td null,
              H.input {className: "form-control", type: "number", step: "any", style: {width: "12em"}, onChange: @handleValueChange, value: selectedValue}
          H.td null,
            H.select {id: "units", className: "form-control", style: {width: "auto"}},
              if not @props.defaultUnits
                H.option value: "",
                  "Select units"
              for unit in @props.units
                H.option key: unit.id, value:unit.id,
                  formUtils.localizeString(unit.label, @context.locale)
          if @props.prefix
            H.td null,
              H.input {className: "form-control", type: "number", step: "any", style: {width: "12em"}, onChange: @handleValueChange, value: selectedValue}
