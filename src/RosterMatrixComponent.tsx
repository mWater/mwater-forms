import PropTypes from "prop-types"
import _ from "lodash"
import React from "react"
const R = React.createElement

import * as formUtils from "./formUtils"
import ValidationCompiler from "./answers/ValidationCompiler"
import ReorderableListComponent from "react-library/lib/reorderable/ReorderableListComponent"
import MatrixColumnCellComponent from "./MatrixColumnCellComponent"
import { RosterMatrix } from "./formDesign"
import { ResponseData, RosterData, RosterEntry } from "./response"
import { Schema } from "mwater-expressions"
import ResponseRow from "./ResponseRow"

export interface RosterMatrixComponentProps {
  rosterMatrix: RosterMatrix
  /** Current data of response */
  data: ResponseData
  onDataChange: (data: ResponseData) => void
  /** (id) tells if an item is visible or not */
  isVisible: (id: string) => boolean 
  schema: Schema
  responseRow: ResponseRow
}

interface RosterMatrixComponentState {
  /** Map of "<rowindex>_<columnid>" to validation error */
  validationErrors: { [id: string]: string | true }
}

// Rosters are repeated information, such as asking questions about household members N times.
// A roster matrix is a list of column-type questions with one row for each entry in the roster
export default class RosterMatrixComponent extends React.Component<RosterMatrixComponentProps, RosterMatrixComponentState> {
  static contextTypes = {
    locale: PropTypes.string,
    T: PropTypes.func.isRequired // Localizer to use
  }
  prompt: HTMLHeadingElement | null

  constructor(props: RosterMatrixComponentProps) {
    super(props)

    this.state = {
      validationErrors: {} 
    }
  }

  // Gets the id that the answer is stored under
  getAnswerId() {
    // Prefer rosterId if specified, otherwise use id.
    return this.props.rosterMatrix.rosterId || this.props.rosterMatrix._id
  }

  // Get the current answer value
  getAnswer(): RosterData {
    return (this.props.data[this.getAnswerId()] || []) as RosterData
  }

  validate(scrollToFirstInvalid: any) {
    const validationErrors = {}

    // For each entry
    let foundInvalid = false
    const iterable = this.getAnswer()
    for (let rowIndex = 0; rowIndex < iterable.length; rowIndex++) {
      // For each column
      const entry = iterable[rowIndex]
      for (let columnIndex = 0; columnIndex < this.props.rosterMatrix.contents.length; columnIndex++) {
        const column = this.props.rosterMatrix.contents[columnIndex]
        if (!formUtils.isQuestionOrMatrixColumnQuestion(column)) {
          continue
        }
        
        const key = `${rowIndex}_${column._id}`

        if (column.required && (entry.data[column._id]?.value == null || entry.data[column._id]?.value === "")) {
          foundInvalid = true
          validationErrors[key] = true
        }

        if (column.validations && column.validations.length > 0) {
          const validationError = new ValidationCompiler(this.context.locale).compileValidations(column.validations)(
            entry.data[column._id]
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

    // Scroll into view
    if (foundInvalid && scrollToFirstInvalid) {
      this.prompt!.scrollIntoView()
    }

    return foundInvalid
  }

  // Propagate an answer change to the onDataChange
  handleAnswerChange = (answer: any) => {
    const change = {}
    change[this.getAnswerId()] = answer
    return this.props.onDataChange(_.extend({}, this.props.data, change))
  }

  // Handles a change in data of a specific entry of the roster
  handleEntryDataChange = (index: any, data: any) => {
    const answer = this.getAnswer().slice()
    answer[index] = _.extend({}, answer[index], { data })
    return this.handleAnswerChange(answer)
  }

  handleAdd = () => {
    const answer = this.getAnswer().slice()
    answer.push({ _id: formUtils.createUid(), data: {} })
    return this.handleAnswerChange(answer)
  }

  handleRemove = (index: any) => {
    const answer = this.getAnswer().slice()
    answer.splice(index, 1)
    return this.handleAnswerChange(answer)
  }

  handleCellChange = (entryIndex: any, columnId: any, answer: any) => {
    let { data } = this.getAnswer()[entryIndex]
    const change = {}
    change[columnId] = answer
    data = _.extend({}, data, change)

    return this.handleEntryDataChange(entryIndex, data)
  }

  handleSort = (column: any, order: any) => {
    let answer = this.getAnswer()
    answer = _.sortByOrder(answer, [(item) => item.data[column._id]?.value], [order])
    return this.handleAnswerChange(answer)
  }

  renderName() {
    return R(
      "h4",
      {
        key: "prompt",
        ref: (c: HTMLHeadingElement | null) => {
          this.prompt = c
        }
      },
      formUtils.localizeString(this.props.rosterMatrix.name, this.context.locale)
    )
  }

  renderColumnHeader(column: any, index: any) {
    return R(
      "th",
      { key: column._id },
      formUtils.localizeString(column.text, this.context.locale),

      // Required star
      column.required ? R("span", { className: "required" }, "*") : undefined,

      // Allow sorting
      ["TextColumnQuestion", "NumberColumnQuestion", "DateColumnQuestion"].includes(column._type)
        ? R(
            "div",
            { style: { float: "right" } },
            R("span", {
              className: "table-sort-controls fas fa-caret-up",
              style: { cursor: "pointer" },
              onClick: this.handleSort.bind(null, column, "asc")
            }),
            R("span", {
              className: "table-sort-controls fas fa-caret-down",
              style: { cursor: "pointer" },
              onClick: this.handleSort.bind(null, column, "desc")
            })
          )
        : undefined
    )
  }

  renderHeader() {
    return R(
      "thead",
      null,
      R(
        "tr",
        null,
        _.map(this.props.rosterMatrix.contents, (column, index) => this.renderColumnHeader(column, index)),
        // Extra for remove button
        this.props.rosterMatrix.allowRemove ? R("th", null) : undefined
      )
    )
  }

  renderCell(entry: any, entryIndex: any, column: any, columnIndex: any) {
    // Get data of the entry
    const entryData = this.getAnswer()[entryIndex].data

    // Determine if invalid
    const key = `${entryIndex}_${column._id}`
    const invalid = this.state.validationErrors[key]

    // Render cell
    return R(MatrixColumnCellComponent, {
      key: column._id,
      column,
      data: entryData,
      responseRow: this.props.responseRow.getRosterResponseRow(this.getAnswerId(), entryIndex),
      answer: entryData?.[column._id] || {},
      onAnswerChange: this.handleCellChange.bind(null, entryIndex, column._id),
      invalid: !!invalid,
      invalidMessage: typeof invalid == "string" ? invalid : undefined,
      schema: this.props.schema
    })
  }

  renderEntry = (entry: any, index: any, connectDragSource: any, connectDragPreview: any, connectDropTarget: any) => {
    const elem = R(
      "tr",
      { key: index },
      _.map(this.props.rosterMatrix.contents, (column, columnIndex) =>
        this.renderCell(entry, index, column, columnIndex)
      ),
      this.props.rosterMatrix.allowRemove
        ? R(
            "td",
            { key: "_remove" },
            R(
              "button",
              { type: "button", className: "btn btn-sm btn-link", onClick: this.handleRemove.bind(null, index) },
              R("span", { className: "fas fa-times" })
            )
          )
        : undefined
    )

    return connectDropTarget(connectDragPreview(connectDragSource(elem)))
  }

  renderAdd() {
    if (this.props.rosterMatrix.allowAdd) {
      return R(
        "div",
        { key: "add", style: { marginTop: 10 } },
        R(
          "button",
          { type: "button", className: "btn btn-primary", onClick: this.handleAdd },
          R("span", { className: "fas fa-plus" }),
          " " + this.context.T("Add")
        )
      )
    }
    return null
  }

  renderBody() {
    return R(ReorderableListComponent, {
      items: this.getAnswer(),
      onReorder: this.handleAnswerChange,
      renderItem: this.renderEntry,
      getItemId: (entry: RosterEntry) => entry._id,
      element: R("tbody", null)
    })
  }

  renderEmptyPrompt() {
    return R(
      "div",
      { style: { fontStyle: "italic" } },
      formUtils.localizeString(this.props.rosterMatrix.emptyPrompt, this.context.locale) ||
        this.context.T("Click +Add to add an item")
    )
  }

  render() {
    return R(
      "div",
      { style: { padding: 5, marginBottom: 20, overflowX: 'auto' } },
      this.renderName(),
      R("table", { className: "table" }, this.renderHeader(), this.renderBody()),

      // Display message if none and can add
      this.getAnswer().length === 0 && this.props.rosterMatrix.allowAdd ? this.renderEmptyPrompt() : undefined,

      this.renderAdd()
    )
  }
}
