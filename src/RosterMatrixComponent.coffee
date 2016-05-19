_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require './formUtils'
conditionsUtils = require './conditionsUtils'
NumberAnswerComponent = require './answers/NumberAnswerComponent'
UnitsAnswerComponent = require './answers/UnitsAnswerComponent'
AnswerValidator = require './answers/AnswerValidator'

# Rosters are repeated information, such as asking questions about household members N times.
# A roster matrix is a list of column-type questions with one row for each entry in the roster
module.exports = class RosterMatrixComponent extends React.Component
  @contextTypes:
    locale: React.PropTypes.string
    T: React.PropTypes.func.isRequired  # Localizer to use

  @propTypes:
    rosterMatrix: React.PropTypes.object.isRequired # Design of roster matrix. See schema
    data: React.PropTypes.object      # Current data of response. 
    onDataChange: React.PropTypes.func.isRequired   # Called when data changes
    isVisible: React.PropTypes.func.isRequired # (id) tells if an item is visible or not
    formExprEvaluator: React.PropTypes.object.isRequired # FormExprEvaluator for rendering strings with expression

  constructor: ->
    super

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

        if column.required and (not entry.data[column._id]?.value or entry.data[column._id]?.value == '')
          foundInvalid = true
          validationErrors[key] = true

        if column.validations and column.validations.length > 0
          validationError = new AnswerValidator().compileValidations(column.validations)(entry.data[column._id])
          if validationError
            foundInvalid = true
            validationErrors[key] = validationError

    # Save state
    @setState(validationErrors: validationErrors)

    # Scroll into view
    if foundInvalid and scrollToFirstInvalid
      @refs.prompt.scrollIntoView()

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

  handleCellChange: (entryIndex, columnId, value) =>
    data = @getAnswer()[entryIndex].data
    change = {}
    change[columnId] = { value: value }
    data = _.extend({}, data, change)

    @handleEntryDataChange(entryIndex, data)

  renderName: ->
    H.h3 key: "prompt", ref: "prompt",
      formUtils.localizeString(@props.rosterMatrix.name, @context.locale)

  renderColumnHeader: (column, index) ->
    H.th key: column._id,
      formUtils.localizeString(column.text, @context.locale)

      # Required star
      if column.required
        H.span className: "required", "*"

  renderHeader: ->
    H.thead null,
      H.tr null,
        _.map(@props.rosterMatrix.contents, (column, index) => @renderColumnHeader(column, index))
        # Extra for remove button
        if @props.rosterMatrix.allowRemove
          H.th(null)

  areConditionsValid: (choice) ->
    if not choice.conditions?
      return true
    return conditionsUtils.compileConditions(choice.conditions)(@props.data)

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
        elem = R UnitsAnswerComponent, {
          small: true
          decimal: column.decimal
          prefix: column.unitsPosition == 'prefix'
          answer: answer
          units: column.units
          defaultUnits: column.defaultUnits
          onValueChange: (val) => @handleCellChange(entryIndex, column._id, val)
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

  renderAdd: ->
    if @props.rosterMatrix.allowAdd
      H.div key: "add", style: { marginTop: 10 },
        H.button type: "button", className: "btn btn-default btn-sm", onClick: @handleAdd,
          H.span className: "glyphicon glyphicon-plus"
          " " + @context.T("Add")

  render: ->
    H.div style: { padding: 5, marginBottom: 20 },
      @renderName()
      H.table className: "table",
        @renderHeader()
        H.tbody null,
          _.map(@getAnswer(), (entry, index) => @renderEntry(entry, index))

      # Display message if none
      if @getAnswer().length == 0
        H.div(style: { paddingLeft: 20 }, H.i(null, @context.T("None")))

      @renderAdd() 