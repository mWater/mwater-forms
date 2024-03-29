import _ from "lodash"
import PropTypes from "prop-types"
import React from "react"
const R = React.createElement

import * as formUtils from "../formUtils"
import { Choice } from "../formDesign"
import { Schema } from "mwater-expressions"
import ResponseRow from "../ResponseRow"

export interface RadioAnswerComponentProps {
  choices: Choice[]
  onAnswerChange: any
  /** See answer format */
  answer: any
  data: any
  displayMode?: "vertical" | "toggle"

  schema: Schema
  responseRow: ResponseRow
}

export interface RadioAnswerComponentState {
  /** Status of visibility of choices */
  choiceVisibility: { [choiceId: string]: boolean }
}

export default class RadioAnswerComponent extends React.Component<RadioAnswerComponentProps, RadioAnswerComponentState> {
  static contextTypes = { locale: PropTypes.string }

  constructor(props: RadioAnswerComponentProps) {
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

  componentDidUpdate(prevProps: RadioAnswerComponentProps) {
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
    // Nothing to focus
    return null
  }

  handleValueChange = (choice: Choice) => {
    if (choice.id === this.props.answer.value) {
      return this.props.onAnswerChange({ value: null, specify: null })
    } else {
      return this.props.onAnswerChange({ value: choice.id, specify: null })
    }
  }

  handleSpecifyChange = (id: any, ev: any) => {
    const change = {}
    change[id] = ev.target.value
    const specify = _.extend({}, this.props.answer.specify, change)
    return this.props.onAnswerChange({ value: this.props.answer.value, specify })
  }

  // Render specify input box
  renderSpecify(choice: Choice) {
    let value
    if (this.props.answer.specify != null) {
      value = this.props.answer.specify[choice.id]
    } else {
      value = ""
    }
    return R("input", {
      className: "form-control specify-input",
      type: "text",
      value,
      onChange: this.handleSpecifyChange.bind(null, choice.id)
    })
  }

  // Render general specify input box (without choice specified)
  renderGeneralSpecify() {
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

  renderVerticalChoice(choice: Choice) {
    if (this.state.choiceVisibility[choice.id]) {
      return R(
        "div",
        { key: choice.id },
        // id is used for testing
        R(
          "div",
          {
            className: `touch-radio ${this.props.answer.value === choice.id ? "checked" : ""}`,
            id: choice.id,
            onClick: this.handleValueChange.bind(null, choice)
          },
          formUtils.localizeString(choice.label, this.context.locale),
          choice.hint
            ? R(
                "span",
                { className: "radio-choice-hint" },
                " " + formUtils.localizeString(choice.hint, this.context.locale)
              )
            : undefined
        ),

        choice.specify && this.props.answer.value === choice.id ? this.renderSpecify(choice) : undefined
      )
    }
    return null
  }

  renderAsVertical() {
    return R(
      "div",
      { className: "touch-radio-group" },
      _.map(this.props.choices, (choice) => this.renderVerticalChoice(choice))
    )
  }

  // Render as toggle
  renderAsToggle() {
    return R(
      "div",
      null,
      R(
        "div",
        { className: "btn-group", key: "toggle" },
        _.map(this.props.choices, (choice) => {
          if (this.state.choiceVisibility[choice.id]) {
            let text = formUtils.localizeString(choice.label, this.context.locale)
            if (choice.hint) {
              text += " (" + formUtils.localizeString(choice.hint, this.context.locale) + ")"
            }
            return R(
              "button",
              {
                key: choice.id,
                type: "button",
                onClick: () =>
                  this.props.onAnswerChange({
                    value: choice.id === this.props.answer.value ? null : choice.id,
                    specify: null
                  }),
                className: this.props.answer.value === choice.id ? "btn btn-primary active" : "btn btn-outline-primary"
              },
              text
            )
          }
          return null
        })
      ),

      this.renderGeneralSpecify()
    )
  }

  render() {
    if ((this.props.displayMode || "vertical") === "vertical") {
      return this.renderAsVertical()
    } else if (this.props.displayMode === "toggle") {
      return this.renderAsToggle()
    }
    return null
  }
}
