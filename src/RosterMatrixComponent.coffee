_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require './formUtils'
NumberAnswerComponent = require './answers/NumberAnswerComponent'

# Rosters are repeated information, such as asking questions about household members N times.
# A roster matrix is a list of columns with one row for each entry in the roster
# TODO add validation of columns
# TODO add required columns support
# TODO Add to schema
module.exports = class RosterMatrixComponent extends React.Component
  @contextTypes:
    locale: React.PropTypes.string

  @propTypes:
    rosterMatrix: React.PropTypes.object.isRequired # Design of roster matrix. See schema
    answer: React.PropTypes.arrayOf(React.PropTypes.object.isRequired)      # Current answer. Contains { value: <some value> } usually. See docs/Answer Formats.md
    onAnswerChange: React.PropTypes.func.isRequired

  handleDataChange: (index, data) =>
    answer = (@props.answer or []).slice()
    answer[index] = data
    @props.onAnswerChange(answer)

  handleAdd: =>
    answer = (@props.answer or []).slice()
    answer.push({})
    @props.onAnswerChange(answer)

  handleRemove: (index) =>
    answer = (@props.answer or []).slice()
    answer.splice(index, 1)
    @props.onAnswerChange(answer)

  handleCellChange: (entryIndex, columnId, value) =>
    data = @props.answer[entryIndex]
    change = {}
    change[columnId] = value
    data = _.extend({}, data, change)

    @handleDataChange(entryIndex, data)


  renderName: ->
    H.h3 key: "prompt",
      formUtils.localizeString(@props.rosterMatrix.name, @context.locale)

  renderColumnHeader: (column, index) ->
    H.th key: column._id,
      formUtils.localizeString(column.name, @context.locale)

      # Required star
      if column.required
        H.span className: "required", "*"

  renderHeader: ->
    H.thead null,
      H.tr null,
        _.map(@props.rosterMatrix.columns, (column, index) => @renderColumnHeader(column, index))
        # Extra for remove button
        if @props.rosterMatrix.allowRemove
          H.th(null)

  renderCell: (entry, entryIndex, column, columnIndex) ->
    value = @props.answer[entryIndex][column._id]

    # Create element
    switch column._type
      when "Text"
        elem = H.input type: "text", className: "form-control input-sm", value: value, onChange: (ev) => @handleCellChange(entryIndex, column._id, ev.target.value)
      when "Number"
        elem = R NumberAnswerComponent, small: true, style: { maxWidth: "10em"}, value: value, onChange: (val) => @handleCellChange(entryIndex, column._id, val)
      # TODO
      when "Checkbox"
        elem = H.div 
          className: "touch-checkbox #{if value then "checked" else ""}"
          onClick: => @handleCellChange(entryIndex, column._id, not value)
          style: { display: "inline-block" }, 
            "\u200B" # ZWSP
      when "Dropdown"
        elem = H.select 
          className: "form-control input-sm"
          style: { width: "auto" }
          value: value
          onChange: ((ev) => @handleCellChange(entryIndex, column._id, if ev.target.value then ev.target.value else null)),
            H.option key: "__none__", value: ""
            _.map column.choices, (choice) =>
              text = formUtils.localizeString(choice.label, @context.locale)
              return H.option key: choice.id, value: choice.id, text

    return H.td null, elem

  renderEntry: (entry, index) ->
    H.tr key: index,
      _.map @props.rosterMatrix.columns, (column, columnIndex) => @renderCell(entry, index, column, columnIndex)
      if @props.rosterMatrix.allowRemove
        H.td key: "_remove",
          H.button type: "button", className: "btn btn-sm btn-link", onClick: @handleRemove.bind(null, index),
            H.span className: "glyphicon glyphicon-remove"  

  renderAdd: ->
    if @props.rosterMatrix.allowAdd
      H.div key: "add", style: { marginTop: 10 },
        H.button type: "button", className: "btn btn-default btn-sm", onClick: @handleAdd,
          H.span className: "glyphicon glyphicon-plus"
          " " + T("Add")

  render: ->
    H.div style: { padding: 5, marginBottom: 20 },
      @renderName()
      H.table className: "table",
        @renderHeader()
        H.tbody null,
          _.map(@props.answer, (entry, index) => @renderEntry(entry, index))

      # Display message if none
      if not @props.answer or @props.answer.length == 0
        H.div(style: { paddingLeft: 20 }, H.i(null, T("None")))

      @renderAdd() 