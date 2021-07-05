import PropTypes from "prop-types"
import _ from "lodash"
import React from "react"
const R = React.createElement

import * as formUtils from "./formUtils"
import * as conditionUtils from "./conditionUtils"
import NumberAnswerComponent from "./answers/NumberAnswerComponent"
import DateAnswerComponent from "./answers/DateAnswerComponent"
import UnitsAnswerComponent from "./answers/UnitsAnswerComponent"
import SiteColumnAnswerComponent from "./answers/SiteColumnAnswerComponent"
import TextExprsComponent from "./TextExprsComponent"

interface MatrixColumnCellComponentProps {
  /** Column. See designSchema */
  column: any
  /** Current data of response (for roster entry if in roster) */
  data?: any
  /** ResponseRow object (for roster entry if in roster) */
  responseRow?: any
  /** Answer of the cell */
  answer?: any
  /** Called with new answer of cell */
  onAnswerChange: any
  /** True if invalid */
  invalid?: boolean
  /** Schema to use, including form */
  schema: any
}

// Cell of a matrix column
export default class MatrixColumnCellComponent extends React.Component<MatrixColumnCellComponentProps> {
  static contextTypes = { locale: PropTypes.string }

  handleValueChange = (value: any) => {
    return this.props.onAnswerChange(_.extend({}, this.props.answer, { value }))
  }

  areConditionsValid(choice: any) {
    if (choice.conditions == null) {
      return true
    }
    return conditionUtils.compileConditions(choice.conditions)(this.props.data)
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
            exprs: [column.expr],
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
          className: "form-control input-sm",
          value: value || "",
          onChange: (ev) => this.handleValueChange(ev.target.value)
        })
        break
      case "NumberColumnQuestion":
        elem = R(NumberAnswerComponent, {
          small: true,
          style: { maxWidth: "10em" },
          decimal: column.decimal,
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
            className: "form-control input-sm",
            style: { width: "auto" },
            value,
            onChange: (ev) => this.handleValueChange(ev.target.value ? ev.target.value : null)
          },
          R("option", { key: "__none__", value: "" }),
          _.map(column.choices, (choice) => {
            if (this.areConditionsValid(choice)) {
              const text = formUtils.localizeString(choice.label, this.context.locale)
              return R("option", { key: choice.id, value: choice.id }, text)
            }
          })
        )
        break
      case "SiteColumnQuestion":
        elem = R(SiteColumnAnswerComponent, {
          value,
          onValueChange: this.handleValueChange,
          siteType: column.siteType
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

    return R("td", { className }, elem)
  }
}
