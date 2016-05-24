React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require '../formUtils'
MatrixColumnCellComponent = require '../MatrixColumnCellComponent'

# Matrix with columns and items
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
    columns: React.PropTypes.array.isRequired

    value: React.PropTypes.object                    # See answer format
    onValueChange: React.PropTypes.func.isRequired

    data: React.PropTypes.object            # Current data of response. Data of roster entry if in a roster
    parentData: React.PropTypes.object      # Data of overall response if in a roster
    formExprEvaluator: React.PropTypes.object.isRequired # FormExprEvaluator for rendering strings with expression

  focus: () ->
    # TODO
    null

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
    H.th key: column._id,
      formUtils.localizeString(column.text, @context.locale)

      # Required star
      if column.required
        H.span className: "required", "*"

  # Render the header row
  renderHeader: ->
    H.thead null,
      H.tr null,
        # First item
        H.th(null)
        _.map(@props.columns, (column, index) => @renderColumnHeader(column, index))

  renderCell: (item, itemIndex, column, columnIndex) ->
    matrixValue = @props.value or {}

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
      onAnswerChange: @handleCellChange.bind(null, item, column)
      formExprEvaluator: @props.formExprEvaluator
      invalid: invalid

  renderItem: (item, index) ->
    H.tr key: index,
      H.td key: "_item", 
        H.label null, formUtils.localizeString(item.label, @context.locale)
        if item.hint
          [
            H.br()
            H.div className: "text-muted", formUtils.localizeString(item.hint, @context.locale)
          ]
      _.map @props.columns, (column, columnIndex) => @renderCell(item, index, column, columnIndex)

  render: ->
    # Create table of 
    H.table className: "table",
      @renderHeader()
      H.tbody null,
        _.map(@props.items, (item, index) => @renderItem(item, index))
