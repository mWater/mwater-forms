React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require '../formUtils'

# Multiple checkboxes where more than one can be checked
module.exports = class MatrixAnswerComponent extends React.Component
  @contextTypes:
    locale: React.PropTypes.string  # Current locale (e.g. "en")

  @propTypes:
    items: React.PropTypes.arrayOf(React.PropTypes.shape({
      # Unique (within the question) id of the item. Cannot be "na" or "dontknow" as they are reserved for alternates
      id: React.PropTypes.string.isRequired

      # Label of the choice, localized
      label: React.PropTypes.object.isRequired

      # Hint associated with a choice
      hint: React.PropTypes.object
    })).isRequired

    # Array of matrix columns
    contents: React.PropTypes.array.isRequired

    answer: React.PropTypes.object.isRequired # See answer format
    onAnswerChange: React.PropTypes.func.isRequired

  focus: () ->
    # TODO
    null

  renderColumnHeader: (column, index) ->
    H.th key: column._id,
      formUtils.localizeString(column.text, @context.locale)

      # Required star
      if column.required
        H.span className: "required", "*"

  # Render the header row
  renderHeader: ->
    H.thead null,
      H.tr null,
        _.map(@props.contents, (column, index) => @renderColumnHeader(column, index))

  renderCell: (entry, entryIndex, column, columnIndex) ->
    answer = @getAnswer()[entryIndex]
    data = answer.data
    value = data?[column._id]?.value

    # Create element
    switch column._type
      when "TextColumn"
        cellText = @props.formExprEvaluator.renderString(column.cellText, column.cellTextExprs, data, @props.data, @context.locale)
        elem = H.label null, cellText
      when "UnitsColumnQuestion"
        console.log column
        console.log answer
        answer = data?[column._id]
        elem = R UnitsAnswerComponent, {
          small: true
          decimal: column.decimal
          prefix: column.unitsPosition == 'prefix'
          answer: answer or {}
          units: column.units
          defaultUnits: column.defaultUnits
          onValueChange: (val) =>
            console.log('val callback')
            console.log val
            @handleCellChange(entryIndex, column._id, val)
        }
      when "TextColumnQuestion"
        elem = H.input type: "text", className: "form-control input-sm", value: value, onChange: (ev) => @handleCellChange(entryIndex, column._id, ev.target.value)
      when "NumberColumnQuestion"
        elem = R NumberAnswerComponent, small: true, style: { maxWidth: "10em"}, decimal: column.decimal, value: value, onChange: (val) => @handleCellChange(entryIndex, column._id, val)
      when "CheckColumnQuestion"
        elem = H.div 
          className: "touch-checkbox #{if value then "checked" else ""}"
          onClick: => @handleCellChange(entryIndex, column._id, not value)
          style: { display: "inline-block" }, 
            "\u200B" # ZWSP
      when "DropdownColumnQuestion"
        elem = H.select 
          className: "form-control input-sm"
          style: { width: "auto" }
          value: value
          onChange: ((ev) => @handleCellChange(entryIndex, column._id, if ev.target.value then ev.target.value else null)),
            H.option key: "__none__", value: ""
            _.map column.choices, (choice) =>
              if @areConditionsValid(choice)
                text = formUtils.localizeString(choice.label, @context.locale)
                return H.option key: choice.id, value: choice.id, text

    # Check for validation errors
    key = "#{entryIndex}_#{column._id}"
    if @state.validationErrors[key]
      className = "invalid"

    return H.td key: column._id, className: className,
      elem

  renderEntry: (entry, index) ->
    H.tr key: index,
      _.map @props.rosterMatrix.contents, (column, columnIndex) => @renderCell(entry, index, column, columnIndex)
      if @props.rosterMatrix.allowRemove
        H.td key: "_remove",
          H.button type: "button", className: "btn btn-sm btn-link", onClick: @handleRemove.bind(null, index),
            H.span className: "glyphicon glyphicon-remove"  



  render: ->
    # Create table of 
    H.table className: "table",
      @renderHeader()
      H.tbody null,
        _.map(@props.items, (item, index) => @renderItem(item, index))
