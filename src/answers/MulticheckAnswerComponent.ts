import _ from "lodash"
import PropTypes from "prop-types"
import React from "react"
const R = React.createElement

import * as formUtils from "../formUtils"
import * as conditionUtils from "../conditionUtils"

interface MulticheckAnswerComponentProps {
  choices: any,
  /** See answer format */
answer: any,
  onAnswerChange: any,
  data: any
}

// Multiple checkboxes where more than one can be checked
export default class MulticheckAnswerComponent extends React.Component<MulticheckAnswerComponentProps> {
  static initClass() {
    this.contextTypes = { locale: PropTypes.string } // Current locale (e.g. "en")
  }

  focus() {
    // Nothing to focus
    return null
  }

  handleValueChange = (choice: any) => {
    let specify
    const ids = this.props.answer.value || []
    if (ids.includes(choice.id)) {
      if (this.props.answer.specify != null) {
        specify = _.clone(this.props.answer.specify)
        if (specify[choice.id] != null) {
          delete specify[choice.id]
        }
      } else {
        specify = null
      }
      return this.props.onAnswerChange({ value: _.difference(ids, [choice.id]), specify })
    } else {
      return this.props.onAnswerChange({ value: _.union(ids, [choice.id]), specify: this.props.answer.specify })
    }
  }

  handleSpecifyChange = (id: any, ev: any) => {
    const change = {}
    change[id] = ev.target.value
    const specify = _.extend({}, this.props.answer.specify, change)
    return this.props.onAnswerChange({ value: this.props.answer.value, specify })
  }

  areConditionsValid(choice: any) {
    if (choice.conditions == null) {
      return true
    }
    return conditionUtils.compileConditions(choice.conditions)(this.props.data)
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

  renderChoice(choice: any) {
    if (!this.areConditionsValid(choice)) {
      return null
    }

    const selected = _.isArray(this.props.answer.value) && this.props.answer.value.includes(choice.id)

    return R(
      "div",
      { key: choice.id },
      // id is used for testing
      R(
        "div",
        {
          className: `choice touch-checkbox ${selected ? "checked" : ""}`,
          id: choice.id,
          onClick: this.handleValueChange.bind(null, choice)
        },
        formUtils.localizeString(choice.label, this.context.locale),
        choice.hint
          ? R(
              "span",
              { className: "checkbox-choice-hint" },
              formUtils.localizeString(choice.hint, this.context.locale)
            )
          : undefined
      ),

      choice.specify && selected ? this.renderSpecify(choice) : undefined
    )
  }

  render() {
    return R(
      "div",
      null,
      _.map(this.props.choices, (choice) => this.renderChoice(choice))
    )
  }
};


MulticheckAnswerComponent.initClass()
