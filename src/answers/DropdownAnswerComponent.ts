import _ from "lodash"
import PropTypes from "prop-types"
import React from "react"
const R = React.createElement

import * as formUtils from "../formUtils"
import * as conditionUtils from "../conditionUtils"
import { Choice } from "../formDesign"

export interface DropdownAnswerComponentProps {
  choices: any
  onAnswerChange: any
  /** See answer format */
  answer: any
  data: any
}

export default class DropdownAnswerComponent extends React.Component<DropdownAnswerComponentProps> {
  static contextTypes = { locale: PropTypes.string }

  focus() {
    return this.select?.focus()
  }

  handleValueChange = (ev: any) => {
    if (ev.target.value != null && ev.target.value !== "") {
      return this.props.onAnswerChange({ value: ev.target.value, specify: null })
    } else {
      return this.props.onAnswerChange({ value: null, specify: null })
    }
  }

  handleSpecifyChange = (id: any, ev: any) => {
    const change = {}
    change[id] = ev.target.value
    const specify = _.extend({}, this.props.answer.specify, change)
    return this.props.onAnswerChange({ value: this.props.answer.value, specify })
  }

  // Render specify input box
  renderSpecify() {
    let value
    const choice = _.findWhere(this.props.choices, { id: this.props.answer.value })
    if (choice && choice.specify && this.props.answer.specify != null) {
      value = this.props.answer.specify[choice.id]
    } else {
      value = ""
    }
    if (choice && choice.specify) {
      return R("input", {
        className: "form-control specify-input",
        type: "text",
        value,
        onChange: this.handleSpecifyChange.bind(null, choice.id)
      })
    }
  }

  isChoiceVisible(choice: Choice) {
    if (choice.conditions == null) {
      return true
    }
    return conditionUtils.compileConditions(choice.conditions)(this.props.data)
  }

  render() {
    return R(
      "div",
      null,
      R(
        "select",
        {
          className: "form-select",
          style: { width: "auto" },
          value: this.props.answer.value,
          onChange: this.handleValueChange,
          ref: (c: any) => {
            return (this.select = c)
          }
        },
        R("option", { key: "__none__", value: "" }),
        _.map(this.props.choices, (choice) => {
          if (this.isChoiceVisible(choice)) {
            let text = formUtils.localizeString(choice.label, this.context.locale)
            if (choice.hint) {
              text += " (" + formUtils.localizeString(choice.hint, this.context.locale) + ")"
            }
            return R("option", { key: choice.id, value: choice.id }, text)
          }
        })
      ),

      this.renderSpecify()
    )
  }
}
