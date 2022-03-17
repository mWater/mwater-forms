import _ from "lodash"
import PropTypes from "prop-types"
import React from "react"
const R = React.createElement

import * as formUtils from "../formUtils"
import { Choice } from "../formDesign"
import { Schema } from "mwater-expressions"
import ResponseRow from "../ResponseRow"

export interface DropdownAnswerComponentProps {
  choices: Choice[]
  onAnswerChange: any
  /** See answer format */
  answer: any
  data: any

  schema: Schema
  responseRow: ResponseRow
}

export interface DropdownAnswerComponentState {
  /** Status of visibility of choices */
  choiceVisibility: { [choiceId: string]: boolean }
}

export default class DropdownAnswerComponent extends React.Component<DropdownAnswerComponentProps, DropdownAnswerComponentState> {
  static contextTypes = { locale: PropTypes.string }
  select: HTMLSelectElement | null

  constructor(props: DropdownAnswerComponentProps) {
    super(props)

    this.state = {
      choiceVisibility: {}
    }

    // Set all initially visible
    for (const choice of this.props.choices) {
      this.state.choiceVisibility[choice.id] = true
    }
  }

  componentDidMount() {
    this.calculateChoiceVisibility()
  }

  componentDidUpdate(prevProps: DropdownAnswerComponentProps) {
    // If visibility potentially changed, recalculate
    if (prevProps.data != this.props.data) {
      this.calculateChoiceVisibility()
    }
  }

  async calculateChoiceVisibility() {
    const choiceVisibility: { [choiceId: string]: boolean } = {}

    for (const choice of this.props.choices) {
      choiceVisibility[choice.id] = await formUtils.isChoiceVisible(choice, this.props.data, this.props.responseRow, this.props.schema)
    }
    this.setState({ choiceVisibility })
  }

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
    return null
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
          ref: (c: HTMLSelectElement | null) => {
            this.select = c
          }
        },
        R("option", { key: "__none__", value: "" }),
        _.map(this.props.choices, (choice) => {
          if (this.state.choiceVisibility[choice.id]) {
            let text = formUtils.localizeString(choice.label, this.context.locale)
            if (choice.hint) {
              text += " (" + formUtils.localizeString(choice.hint, this.context.locale) + ")"
            }
            return R("option", { key: choice.id, value: choice.id }, text)
          }
          return null
        })
      ),

      this.renderSpecify()
    )
  }
}
