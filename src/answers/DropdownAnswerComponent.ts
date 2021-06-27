// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
let DropdownAnswerComponent
import _ from "lodash"
import PropTypes from "prop-types"
import React from "react"
const R = React.createElement

import * as formUtils from "../formUtils"
import * as conditionUtils from "../conditionUtils"

export default DropdownAnswerComponent = (function () {
  DropdownAnswerComponent = class DropdownAnswerComponent extends React.Component {
    static initClass() {
      this.contextTypes = { locale: PropTypes.string } // Current locale (e.g. "en")

      this.propTypes = {
        choices: PropTypes.arrayOf(
          PropTypes.shape({
            // Unique (within the question) id of the choice. Cannot be "na" or "dontknow" as they are reserved for alternates
            id: PropTypes.string.isRequired,

            // Label of the choice, localized
            label: PropTypes.object.isRequired,

            // Hint associated with a choice
            hint: PropTypes.object,

            // True to require a text field to specify the value when selected
            // Usually used for "Other" options.
            // Value is stored in specify[id]
            specify: PropTypes.bool,

            choice: PropTypes.array
          })
        ).isRequired,
        onAnswerChange: PropTypes.func.isRequired,
        answer: PropTypes.object.isRequired, // See answer format
        data: PropTypes.object.isRequired
      }
    }

    focus() {
      return this.select?.focus()
    }

    handleValueChange = (ev) => {
      if (ev.target.value != null && ev.target.value !== "") {
        return this.props.onAnswerChange({ value: ev.target.value, specify: null })
      } else {
        return this.props.onAnswerChange({ value: null, specify: null })
      }
    }

    handleSpecifyChange = (id, ev) => {
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

    areConditionsValid(choice) {
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
            className: "form-control",
            style: { width: "auto" },
            value: this.props.answer.value,
            onChange: this.handleValueChange,
            ref: (c) => {
              return (this.select = c)
            }
          },
          R("option", { key: "__none__", value: "" }),
          _.map(this.props.choices, (choice) => {
            if (this.areConditionsValid(choice)) {
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
  DropdownAnswerComponent.initClass()
  return DropdownAnswerComponent
})()
