PropTypes = require('prop-types')
_ = require 'lodash'
React = require 'react'
R = React.createElement

formUtils = require './formUtils'
ValidationCompiler = require './answers/ValidationCompiler'

ReorderableListComponent = require("react-library/lib/reorderable/ReorderableListComponent")
MatrixColumnCellComponent = require './MatrixColumnCellComponent'

# Rosters are repeated information, such as asking questions about household members N times.
# A roster matrix is a list of column-type questions with one row for each entry in the roster
module.exports = class RosterMatrixComponent extends React.Component
  @contextTypes:
    locale: PropTypes.string
    T: PropTypes.func.isRequired  # Localizer to use

  @propTypes:
    rosterMatrix: PropTypes.object.isRequired # Design of roster matrix. See schema
    data: PropTypes.object      # Current data of response. 
    onDataChange: PropTypes.func.isRequired   # Called when data changes
    isVisible: PropTypes.func.isRequired # (id) tells if an item is visible or not
    schema: PropTypes.object.isRequired  # Schema to use, including form

  constructor: (props) ->
    super(props)

    @state = {
      validationErrors: {}  # Map of "<rowindex>_<columnid>" to validation error
    }

  # Gets the id that the answer is stored under
  getAnswerId: ->
    # Prefer rosterId if specified, otherwise use id. 
    return @props.rosterMatrix.rosterId or @props.rosterMatrix._id

  # Get the current answer value
  getAnswer: ->
    return @props.data[@getAnswerId()] or []

  validate: (scrollToFirstInvalid) ->
    validationErrors = {}

    # For each entry
    foundInvalid = false
    for entry, rowIndex in @getAnswer()
      # For each column
      for column, columnIndex in @props.rosterMatrix.contents
        key = "#{rowIndex}_#{column._id}"

        if column.required and (not entry.data[column._id]?.value? or entry.data[column._id]?.value == '')
          foundInvalid = true
          validationErrors[key] = true

        if column.validations and column.validations.length > 0
          validationError = new ValidationCompiler(@context.locale).compileValidations(column.validations)(entry.data[column._id])
          if validationError
            foundInvalid = true
            validationErrors[key] = validationError

    # Save state
    @setState(validationErrors: validationErrors)

    # Scroll into view
    if foundInvalid and scrollToFirstInvalid
      @prompt.scrollIntoView()

    return foundInvalid

  # Propagate an answer change to the onDataChange
  handleAnswerChange: (answer) =>
    change = {}
    change[@getAnswerId()] = answer
    @props.onDataChange(_.extend({}, @props.data, change))

  # Handles a change in data of a specific entry of the roster
  handleEntryDataChange: (index, data) =>
    answer = @getAnswer().slice()
    answer[index] = _.extend({}, answer[index], { data: data })
    @handleAnswerChange(answer)

  handleAdd: =>
    answer = @getAnswer().slice()
    answer.push({ _id: formUtils.createUid(), data: {} })
    @handleAnswerChange(answer)

  handleRemove: (index) =>
    answer = @getAnswer().slice()
    answer.splice(index, 1)
    @handleAnswerChange(answer)

  handleCellChange: (entryIndex, columnId, answer) =>
    data = @getAnswer()[entryIndex].data
    change = {}
    change[columnId] = answer
    data = _.extend({}, data, change)

    @handleEntryDataChange(entryIndex, data)

  handleSort: (column, order) =>
    answer = @getAnswer()
    answer = _.sortByOrder(answer, [((item) => item.data[column._id]?.value)], [order])
    @handleAnswerChange(answer)

  renderName: ->
    R 'h4', key: "prompt", ref: ((c) => @prompt = c),
      formUtils.localizeString(@props.rosterMatrix.name, @context.locale)

  renderColumnHeader: (column, index) ->
    R 'th', key: column._id,
      formUtils.localizeString(column.text, @context.locale)

      # Required star
      if column.required
        R 'span', className: "required", "*"

      # Allow sorting
      if column._type in ["TextColumnQuestion", "NumberColumnQuestion", "DateColumnQuestion"]
        R 'div', style: { float: "right" },
          R 'span', className: "table-sort-controls glyphicon glyphicon-triangle-top", style: { cursor: "pointer" }, onClick: @handleSort.bind(null, column, "asc")
          R 'span', className: "table-sort-controls glyphicon glyphicon-triangle-bottom", style: { cursor: "pointer" }, onClick: @handleSort.bind(null, column, "desc")

  renderHeader: ->
    R 'thead', null,
      R 'tr', null,
        _.map(@props.rosterMatrix.contents, (column, index) => @renderColumnHeader(column, index))
        # Extra for remove button
        if @props.rosterMatrix.allowRemove
          R('th', null)

  renderCell: (entry, entryIndex, column, columnIndex) ->
    # Get data of the entry
    entryData = @getAnswer()[entryIndex].data

    # Determine if invalid
    key = "#{entryIndex}_#{column._id}"
    invalid = @state.validationErrors[key]

    # Render cell
    return R MatrixColumnCellComponent, 
      key: column._id
      column: column
      data: entryData
      responseRow: @props.responseRow.getRosterResponseRow(@getAnswerId(), entryIndex)
      answer: entryData?[column._id] or {}
      onAnswerChange: @handleCellChange.bind(null, entryIndex, column._id)
      invalid: invalid
      schema: @props.schema

  renderEntry: (entry, index, connectDragSource, connectDragPreview, connectDropTarget) =>
    elem = R 'tr', key: index,
      _.map @props.rosterMatrix.contents, (column, columnIndex) => @renderCell(entry, index, column, columnIndex)
      if @props.rosterMatrix.allowRemove
        R 'td', key: "_remove",
          R 'button', type: "button", className: "btn btn-sm btn-link", onClick: @handleRemove.bind(null, index),
            R 'span', className: "glyphicon glyphicon-remove"  

    return connectDropTarget(connectDragPreview(connectDragSource(elem)))

  renderAdd: ->
    if @props.rosterMatrix.allowAdd
      R 'div', key: "add", style: { marginTop: 10 },
        R 'button', type: "button", className: "btn btn-primary", onClick: @handleAdd,
          R 'span', className: "glyphicon glyphicon-plus"
          " " + @context.T("Add")

  renderBody: ->
    R ReorderableListComponent,
      items: @getAnswer()
      onReorder: @handleAnswerChange
      renderItem: @renderEntry
      getItemId: (entry) => entry._id
      element: R('tbody', null)

  renderEmptyPrompt: ->
    R 'div', style: { fontStyle: "italic" }, 
      formUtils.localizeString(@props.rosterMatrix.emptyPrompt, @context.locale) or @context.T("Click +Add to add an item")

  render: ->
    R 'div', style: { padding: 5, marginBottom: 20 },
      @renderName()
      R 'table', className: "table",
        @renderHeader()
        @renderBody()

      # Display message if none and can add
      if @getAnswer().length == 0 and @props.rosterMatrix.allowAdd
        @renderEmptyPrompt()

      @renderAdd() 


