_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require './formUtils'
conditionsUtils = require './conditionsUtils'
NumberAnswerComponent = require './answers/NumberAnswerComponent'
UnitsAnswerComponent = require './answers/UnitsAnswerComponent'

# Cell of a matrix column
module.exports = class MatrixColumnCellComponent extends React.Component
  @propTypes: 
    column: React.PropTypes.object.isRequired       # Column. See designSchema
    data: React.PropTypes.object.isRequired         # Data of the response. Used for text columns to render expressions and to evaluate conditional choices
    parentData: React.PropTypes.object              # Parent data if in a roster
    answer: React.PropTypes.object                  # Answer of the cell
    onAnswerChange: React.PropTypes.func.isRequired   # Called with new answer of cell
    formExprEvaluator: React.PropTypes.object.isRequired # FormExprEvaluator for rendering strings with expression
    invalid: React.PropTypes.bool                   # True if invalid

  @contextTypes:
    locale: React.PropTypes.string

  handleValueChange: (value) =>
    @props.onAnswerChange(_.extend({}, @props.answer, value: value))

  areConditionsValid: (choice) ->
    if not choice.conditions?
      return true
    return conditionsUtils.compileConditions(choice.conditions)(@props.data)

  render: ->
    column = @props.column
    value = @props.answer?.value

    # Create element
    switch column._type
      when "TextColumn"
        cellText = @props.formExprEvaluator.renderString(column.cellText, column.cellTextExprs, @props.data, @props.parentData, @context.locale)
        elem = H.label null, cellText
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
        elem = H.input type: "text", className: "form-control input-sm", value: value or "", onChange: (ev) => @handleValueChange(ev.target.value)
      when "NumberColumnQuestion"
        elem = R NumberAnswerComponent, small: true, style: { maxWidth: "10em"}, decimal: column.decimal, value: value, onChange: @handleValueChange
      when "CheckColumnQuestion"
        elem = H.div 
          className: "touch-checkbox #{if value then "checked" else ""}"
          onClick: => @handleValueChange(not value)
          style: { display: "inline-block" }, 
            "\u200B" # ZWSP
      when "DropdownColumnQuestion"
        elem = H.select 
          className: "form-control input-sm"
          style: { width: "auto" }
          value: value
          onChange: ((ev) => @handleValueChange(if ev.target.value then ev.target.value else null)),
            H.option key: "__none__", value: ""
            _.map column.choices, (choice) =>
              if @areConditionsValid(choice)
                text = formUtils.localizeString(choice.label, @context.locale)
                return H.option key: choice.id, value: choice.id, text

    if @props.invalid
      className = "invalid"

    return H.td className: className,
      elem
