import PropTypes from "prop-types"
import _ from "lodash"
import React from "react"
const R = React.createElement

import * as formUtils from "./formUtils"
import NumberAnswerComponent from "./answers/NumberAnswerComponent"
import DateAnswerComponent from "./answers/DateAnswerComponent"
import UnitsAnswerComponent from "./answers/UnitsAnswerComponent"
import SiteColumnAnswerComponent from "./answers/SiteColumnAnswerComponent"
import TextExprsComponent from "./TextExprsComponent"
import { Choice, MatrixColumn } from "./formDesign"
import { Schema } from "mwater-expressions"
import ResponseRow from "./ResponseRow"

export interface MatrixColumnCellComponentProps {
  /** Column. See designSchema */
  column: MatrixColumn
  /** Current data of response (for roster entry if in roster) */
  data?: any
  /** ResponseRow object (for roster entry if in roster) */
  responseRow: ResponseRow
  /** Answer of the cell */
  answer?: any
  /** Called with new answer of cell */
  onAnswerChange: any
  /** True if invalid */
  invalid?: boolean
  /** Validation message */
  invalidMessage?: string
  /** Schema to use, including form */
  schema: Schema
}

export interface MatrixColumnCellComponentState {
  /** Status of visibility of choices */
  choiceVisibility: { [choiceId: string]: boolean }
}

// Cell of a matrix column
export default class MatrixColumnCellComponent extends React.Component<MatrixColumnCellComponentProps, MatrixColumnCellComponentState> {
  static contextTypes = { locale: PropTypes.string }

  constructor(props: MatrixColumnCellComponentProps) {
    super(props)

    this.state = {
      choiceVisibility: {}
    }

    // Set all initially visible
    if (this.props.column._type == "DropdownColumnQuestion") {
      for (const choice of this.props.column.choices!) {
        this.state.choiceVisibility[choice.id] = true
      }
    }
  }

  componentDidMount() {
    this.calculateChoiceVisibility()
  }

  componentDidUpdate(prevProps: MatrixColumnCellComponentProps) {
    // If visibility potentially changed, recalculate
    if (prevProps.data != this.props.data) {
      this.calculateChoiceVisibility()
    }
  }

  async calculateChoiceVisibility() {
    if (this.props.column._type != "DropdownColumnQuestion") {
      return
    }

    const choiceVisibility: { [choiceId: string]: boolean } = {}

    for (const choice of this.props.column.choices!) {
      choiceVisibility[choice.id] = await formUtils.isChoiceVisible(choice, this.props.data, this.props.responseRow, this.props.schema)
    }
    this.setState({ choiceVisibility })
  }

  handleValueChange = (value: any) => {
    return this.props.onAnswerChange(_.extend({}, this.props.answer, { value }))
  }

  render() {
    let className, elem
    const { column } = this.props
    const value = this.props.answer?.value

    // Create element
    switch (column._type) {
      case "Calculation":
        elem = R(
          "label",
          { key: column._id },
          R(TextExprsComponent, {
            localizedStr: { _base: "en", en: "{0}" }, // This does not need to be translated, so en as base should be fine
            exprs: [column.expr || null],
            format: column.format,
            schema: this.props.schema,
            responseRow: this.props.responseRow,
            locale: this.context.locale
          })
        )
        break
      case "TextColumn":
        elem = R(
          "label",
          { key: column._id },
          R(TextExprsComponent, {
            localizedStr: column.cellText,
            exprs: column.cellTextExprs,
            schema: this.props.schema,
            responseRow: this.props.responseRow,
            locale: this.context.locale
          })
        )
        break
      case "UnitsColumnQuestion":
        var answer = value ? value[column._id] : null
        elem = R(UnitsAnswerComponent, {
          small: true,
          decimal: column.decimal,
          prefix: column.unitsPosition === "prefix",
          answer: this.props.answer || {},
          units: column.units,
          defaultUnits: column.defaultUnits,
          onValueChange: this.handleValueChange
        })
        break
      case "TextColumnQuestion":
        elem = R("input", {
          type: "text",
          className: "form-control form-control-sm",
          value: value || "",
          onChange: (ev) => this.handleValueChange(ev.target.value || null)
        })
        break
      case "NumberColumnQuestion":
        elem = R(NumberAnswerComponent, {
          small: true,
          style: { maxWidth: "10em" },
          decimal: column.decimal!,
          value,
          onChange: this.handleValueChange
        })
        break
      case "CheckColumnQuestion":
        elem = R(
          "div",
          {
            className: `touch-checkbox ${value ? "checked" : ""}`,
            onClick: () => this.handleValueChange(!value),
            style: { display: "inline-block" }
          },
          "\u200B"
        ) // ZWSP
        break
      case "DropdownColumnQuestion":
        elem = R(
          "select",
          {
            className: "form-select form-select-sm",
            style: { width: "auto" },
            value,
            onChange: (ev) => this.handleValueChange(ev.target.value ? ev.target.value : null)
          },
          R("option", { key: "__none__", value: "" }),
          _.map(column.choices!, (choice) => {
            if (this.state.choiceVisibility[choice.id]) {
              const text = formUtils.localizeString(choice.label, this.context.locale)
              return R("option", { key: choice.id, value: choice.id }, text)
            }
            return null
          })
        )
        break
      case "SiteColumnQuestion":
        elem = R(SiteColumnAnswerComponent, {
          value,
          onValueChange: this.handleValueChange,
          siteType: column.siteType!
        })
        break
      case "DateColumnQuestion":
        elem = R(
          "div",
          { style: { maxWidth: "18em" } },
          R(DateAnswerComponent, {
            format: column.format,
            placeholder: column.placeholder,
            value,
            onValueChange: this.handleValueChange
          })
        )
        break
    }

    if (this.props.invalid) {
      className = "invalid"
    }

    return R(
      "td",
      { className },
      elem,
      this.props.invalid && !!this.props.invalidMessage
        ? R("small", { style: { color: "#C43B1D" } }, this.props.invalidMessage)
        : undefined
    )
  }
}
