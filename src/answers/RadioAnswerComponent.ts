import _ from "lodash"
import PropTypes from "prop-types"
import React from "react"
const R = React.createElement

import * as formUtils from "../formUtils"
import * as conditionUtils from "../conditionUtils"

interface RadioAnswerComponentProps {
  choices: any,
  onAnswerChange: any,
  /** See answer format */
answer: any,
  data: any
}

export default class RadioAnswerComponent extends React.Component<RadioAnswerComponentProps> {
  static initClass() {
    this.contextTypes = { locale: PropTypes.string } // Current locale (e.g. "en")
  }

  focus() {
    // Nothing to focus
    return null
  }

  handleValueChange = (choice: any) => {
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
  renderSpecify(choice: any) {
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

  areConditionsValid(choice: any) {
    if (choice.conditions == null) {
      return true
    }
    return conditionUtils.compileConditions(choice.conditions)(this.props.data)
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
  }

  renderVerticalChoice(choice: any) {
    if (this.areConditionsValid(choice)) {
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
          if (this.areConditionsValid(choice)) {
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
                className: this.props.answer.value === choice.id ? "btn btn-primary active" : "btn btn-default"
              },
              text
            )
          }
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
};


RadioAnswerComponent.initClass()
