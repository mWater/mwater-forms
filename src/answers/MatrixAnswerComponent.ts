import _ from "lodash"
import PropTypes from "prop-types"
import React from "react"
const R = React.createElement

import * as formUtils from "../formUtils"
import MatrixColumnCellComponent from "../MatrixColumnCellComponent"
import { ResponseData } from "../response"
import ResponseRow from "../ResponseRow"
import ValidationCompiler from "./ValidationCompiler"

export interface MatrixAnswerComponentProps {
  items: any
  /** Array of matrix columns */
  columns: any
  /** See answer format */
  value?: any
  onValueChange: any
  /** Alternate value if selected */
  alternate?: string
  /** Current data of response (for roster entry if in roster) */
  data: ResponseData
  /** ResponseRow object (for roster entry if in roster) */
  responseRow: ResponseRow
  schema: any
}

interface MatrixAnswerComponentState {
  validationErrors: any
}

// Matrix with columns and items
export default class MatrixAnswerComponent extends React.Component<
  MatrixAnswerComponentProps,
  MatrixAnswerComponentState
> {
  static contextTypes = { locale: PropTypes.string }

  constructor(props: any) {
    super(props)

    this.state = {
      validationErrors: {} // Map of "<item.id>_<column.id>" to validation error
    }
  }

  focus() {
    // TODO
    return null
  }

  // Validate a matrix answer. Returns true if invalid was found, false otherwise
  validate() {
    // Alternate selected means cannot be invalid
    if (this.props.alternate) {
      return false
    }

    const validationErrors = {}

    // Important to let know the caller if something has been found (so it can scrollToFirst properly)
    let foundInvalid = false

    // For each entry
    for (let rowIndex = 0; rowIndex < this.props.items.length; rowIndex++) {
      // For each column
      const item = this.props.items[rowIndex]
      for (let columnIndex = 0; columnIndex < this.props.columns.length; columnIndex++) {
        const column = this.props.columns[columnIndex]
        const key = `${item.id}_${column._id}`

        const data = this.props.value?.[item.id]?.[column._id]

        if (column.required && (data?.value == null || data?.value === "")) {
          foundInvalid = true
          validationErrors[key] = true
          continue
        }

        if (column.validations && column.validations.length > 0) {
          const validationError = new ValidationCompiler(this.context.locale).compileValidations(column.validations)(
            data
          )
          if (validationError) {
            foundInvalid = true
            validationErrors[key] = validationError
          }
        }
      }
    }

    // Save state
    this.setState({ validationErrors })

    return foundInvalid
  }

  handleCellChange = (item: any, column: any, answer: any) => {
    let matrixValue = this.props.value || {}

    // Get data of the item, which is indexed by item id in the answer
    let itemData = matrixValue[item.id] || {}

    // Set column in item
    let change = {}
    change[column._id] = answer
    itemData = _.extend({}, itemData, change)

    // Set item data within value
    change = {}
    change[item.id] = itemData
    matrixValue = _.extend({}, matrixValue, change)

    return this.props.onValueChange(matrixValue)
  }

  renderColumnHeader(column: any, index: any) {
    return R(
      "th",
      { key: `header:${column._id}` },
      formUtils.localizeString(column.text, this.context.locale),

      // Required star
      column.required ? R("span", { className: "required" }, "*") : undefined
    )
  }

  // Render the header row
  renderHeader() {
    return R(
      "thead",
      null,
      R(
        "tr",
        null,
        // First item
        R("th", null),
        _.map(this.props.columns, (column, index) => this.renderColumnHeader(column, index))
      )
    )
  }

  renderCell(item: any, itemIndex: any, column: any, columnIndex: any) {
    const matrixValue = this.props.value || {}

    // Get data of the item, which is indexed by item id in the answer
    const itemData = matrixValue[item.id] || {}

    // Get cell answer which is inside the item data, indexed by column id
    const cellAnswer = itemData[column._id] || {}

    // Determine if invalid
    const key = `${item.id}_${column._id}`
    const invalid = this.state.validationErrors[key]

    // Render cell
    return R(MatrixColumnCellComponent, {
      key: column._id,
      column,
      data: this.props.data,
      responseRow: this.props.responseRow,
      answer: cellAnswer,
      onAnswerChange: this.handleCellChange.bind(null, item, column),
      invalid: invalid != null,
      invalidMessage: invalid != null ? invalid : undefined,
      schema: this.props.schema
    })
  }

  renderItem(item: any, index: any) {
    return R(
      "tr",
      { key: index },
      R(
        "td",
        { key: "_item" },
        R("label", null, formUtils.localizeString(item.label, this.context.locale)),
        item.hint
          ? [R("br"), R("div", { className: "text-muted" }, formUtils.localizeString(item.hint, this.context.locale))]
          : undefined
      ),
      _.map(this.props.columns, (column, columnIndex) => this.renderCell(item, index, column, columnIndex))
    )
  }

  render() {
    // Create table
    return R(
      "table",
      { className: "table" },
      this.renderHeader(),
      R(
        "tbody",
        null,
        _.map(this.props.items, (item, index) => this.renderItem(item, index))
      )
    )
  }
}
