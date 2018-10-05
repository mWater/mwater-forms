PropTypes = require('prop-types')
_ = require 'lodash'
React = require 'react'
R = React.createElement

formUtils = require './formUtils'
conditionUtils = require './conditionUtils'
NumberAnswerComponent = require './answers/NumberAnswerComponent'
DateAnswerComponent = require './answers/DateAnswerComponent'
UnitsAnswerComponent = require './answers/UnitsAnswerComponent'
SiteColumnAnswerComponent = require './answers/SiteColumnAnswerComponent'
TextExprsComponent = require './TextExprsComponent'

# Cell of a matrix column
module.exports = class MatrixColumnCellComponent extends React.Component
  @propTypes: 
    column: PropTypes.object.isRequired       # Column. See designSchema
    data: PropTypes.object      # Current data of response (for roster entry if in roster)
    responseRow: PropTypes.object    # ResponseRow object (for roster entry if in roster)
    answer: PropTypes.object                  # Answer of the cell
    onAnswerChange: PropTypes.func.isRequired   # Called with new answer of cell
    invalid: PropTypes.bool                   # True if invalid
    schema: PropTypes.object.isRequired  # Schema to use, including form

  @contextTypes:
    locale: PropTypes.string

  handleValueChange: (value) =>
    @props.onAnswerChange(_.extend({}, @props.answer, value: value))

  areConditionsValid: (choice) ->
    if not choice.conditions?
      return true
    return conditionUtils.compileConditions(choice.conditions)(@props.data)

  render: ->
    column = @props.column
    value = @props.answer?.value

    # Create element
    switch column._type
      when "TextColumn"
        elem = R 'label', key: column._id, 
          R TextExprsComponent,
            localizedStr: column.cellText
            exprs: column.cellTextExprs
            schema: @props.schema
            responseRow: @props.responseRow
            locale: @context.locale
      when "UnitsColumnQuestion"
        answer = data?[column._id]
        elem = R UnitsAnswerComponent, {
          small: true
          decimal: column.decimal
          prefix: column.unitsPosition == 'prefix'
          answer: @props.answer or {}
          units: column.units
          defaultUnits: column.defaultUnits
          onValueChange: @handleValueChange
        }
      when "TextColumnQuestion"
        elem = R 'input', type: "text", className: "form-control input-sm", value: value or "", onChange: (ev) => @handleValueChange(ev.target.value)
      when "NumberColumnQuestion"
        elem = R NumberAnswerComponent, small: true, style: { maxWidth: "10em"}, decimal: column.decimal, value: value, onChange: @handleValueChange
      when "CheckColumnQuestion"
        elem = R 'div', 
          className: "touch-checkbox #{if value then "checked" else ""}"
          onClick: => @handleValueChange(not value)
          style: { display: "inline-block" }, 
            "\u200B" # ZWSP
      when "DropdownColumnQuestion"
        elem = R 'select', 
          className: "form-control input-sm"
          style: { width: "auto" }
          value: value
          onChange: ((ev) => @handleValueChange(if ev.target.value then ev.target.value else null)),
            R 'option', key: "__none__", value: ""
            _.map column.choices, (choice) =>
              if @areConditionsValid(choice)
                text = formUtils.localizeString(choice.label, @context.locale)
                return R 'option', key: choice.id, value: choice.id, text
      when "SiteColumnQuestion"
        elem = R SiteColumnAnswerComponent,
          value: value
          onValueChange: @handleValueChange
          siteType: column.siteType
      when "DateColumnQuestion"
        elem = R 'div', style: {maxWidth: "18em"},
          R DateAnswerComponent, {format: column.format, placeholder: column.placeholder, value: value, onValueChange: @handleValueChange}

    if @props.invalid
      className = "invalid"

    return R 'td', className: className,
      elem
