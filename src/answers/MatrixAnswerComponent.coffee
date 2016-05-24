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

    data: React.PropTypes.object            # Current data of response. Data of roster entry if in a roster
    parentData: React.PropTypes.object      # Data of overall response if in a roster

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

  renderCell: (item, itemIndex, column, columnIndex) ->
    matrixValue = @props.answer?.value or {}

    # Get data of the item, which is indexed by item id in the answer
    itemData = matrixValue[item.id] or {}

    # Get cell answer which is inside the item data, indexed by column id
    cellAnswer = itemData[column._id] or {}

    # Determine if invalid TODO
    # key = "#{entryIndex}_#{column._id}"
    # invalid = @state.validationErrors[key]
    invalid = false # TODO

    # Render cell
    return R MatrixColumnCellComponent, 
      key: column._id
      column: column
      data: @props.data
      parentData: @props.parentData
      answer: cellAnswer
      onAnswerChange: @handleCellChange.bind(null, item, column._id)
      formExprEvaluator: @props.formExprEvaluator
      invalid: invalid

  renderItem: (item, index) ->
    H.tr key: index,
      _.map @props.contents, (column, columnIndex) => @renderCell(item, index, column, columnIndex)

  render: ->
    # Create table of 
    H.table className: "table",
      @renderHeader()
      H.tbody null,
        _.map(@props.items, (item, index) => @renderItem(item, index))
