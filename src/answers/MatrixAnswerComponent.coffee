_ = require 'lodash'
PropTypes = require('prop-types')
React = require 'react'
R = React.createElement

formUtils = require '../formUtils'
MatrixColumnCellComponent = require '../MatrixColumnCellComponent'

ValidationCompiler = require './ValidationCompiler'

# Matrix with columns and items
module.exports = class MatrixAnswerComponent extends React.Component
  @contextTypes:
    locale: PropTypes.string  # Current locale (e.g. "en")

  @propTypes:
    items: PropTypes.arrayOf(PropTypes.shape({
      # Unique (within the question) id of the item. Cannot be "na" or "dontknow" as they are reserved for alternates
      id: PropTypes.string.isRequired

      # Label of the choice, localized
      label: PropTypes.object.isRequired

      # Hint associated with a choice
      hint: PropTypes.object
    })).isRequired

    # Array of matrix columns
    columns: PropTypes.array.isRequired

    value: PropTypes.object                    # See answer format
    onValueChange: PropTypes.func.isRequired
    alternate: PropTypes.string                # Alternate value if selected

    data: PropTypes.object      # Current data of response (for roster entry if in roster)
    responseRow: PropTypes.object    # ResponseRow object (for roster entry if in roster)
    schema: PropTypes.object.isRequired  # Schema to use, including form

  constructor: (props) ->
    super(props)

    @state = {
      validationErrors: {}  # Map of "<item.id>_<column.id>" to validation error
    }

  focus: () ->
    # TODO
    null

  # Validate a matrix answer. Returns true if invalid was found, false otherwise
  validate: ->
    # Alternate selected means cannot be invalid
    if @props.alternate
      return false

    validationErrors = {}

    # Important to let know the caller if something has been found (so it can scrollToFirst properly)
    foundInvalid = false

    # For each entry
    for item, rowIndex in @props.items
      # For each column
      for column, columnIndex in @props.columns
        key = "#{item.id}_#{column._id}"

        data = @props.value?[item.id]?[column._id]

        if column.required and (not data?.value? or data?.value == '')
          foundInvalid = true
          validationErrors[key] = true
          continue

        if column.validations and column.validations.length > 0
          validationError = new ValidationCompiler(@context.locale).compileValidations(column.validations)(data)
          if validationError
            foundInvalid = true
            validationErrors[key] = validationError

    # Save state
    @setState(validationErrors: validationErrors)

    return foundInvalid

  handleCellChange: (item, column, answer) =>
    matrixValue = @props.value or {}

    # Get data of the item, which is indexed by item id in the answer
    itemData = matrixValue[item.id] or {}

    # Set column in item
    change = {}
    change[column._id] = answer
    itemData = _.extend({}, itemData, change)

    # Set item data within value
    change = {}
    change[item.id] = itemData
    matrixValue = _.extend({}, matrixValue, change)

    @props.onValueChange(matrixValue)

  renderColumnHeader: (column, index) ->
    R 'th', key: "header:#{column._id}",
      formUtils.localizeString(column.text, @context.locale)

      # Required star
      if column.required
        R 'span', className: "required", "*"

  # Render the header row
  renderHeader: ->
    R 'thead', null,
      R 'tr', null,
        # First item
        R('th', null)
        _.map(@props.columns, (column, index) => @renderColumnHeader(column, index))

  renderCell: (item, itemIndex, column, columnIndex) ->
    matrixValue = @props.value or {}

    # Get data of the item, which is indexed by item id in the answer
    itemData = matrixValue[item.id] or {}

    # Get cell answer which is inside the item data, indexed by column id
    cellAnswer = itemData[column._id] or {}

    # Determine if invalid
    key = "#{item.id}_#{column._id}"
    invalid = @state.validationErrors[key]

    # Render cell
    return R MatrixColumnCellComponent, 
      key: column._id
      column: column
      data: @props.data
      responseRow: @props.responseRow
      answer: cellAnswer
      onAnswerChange: @handleCellChange.bind(null, item, column)
      invalid: invalid?
      schema: @props.schema

  renderItem: (item, index) ->
    R 'tr', key: index,
      R 'td', key: "_item", 
        R 'label', null, formUtils.localizeString(item.label, @context.locale)
        if item.hint
          [
            R('br')
            R 'div', className: "text-muted", formUtils.localizeString(item.hint, @context.locale)
          ]
      _.map @props.columns, (column, columnIndex) => @renderCell(item, index, column, columnIndex)

  render: ->
    # Create table
    # borderCollapse is set to separate (overriding bootstrap table value), so that we can properly see the validation
    # error borders (or else the top one of the first row is missing since it's being collapsed with the th border)
    R 'table', className: "table", style: {borderCollapse: 'separate'},
      @renderHeader()
      R 'tbody', null,
        _.map(@props.items, (item, index) => @renderItem(item, index))
