import _ from "lodash"
import PropTypes from "prop-types"
import React from "react"
const R = React.createElement

import * as formUtils from "../formUtils"

export interface LikertAnswerComponentProps {
  choices: any
  onAnswerChange: any
  /** See answer format */
  answer: any
  data: any
}

export default class LikertAnswerComponent extends React.Component<LikertAnswerComponentProps> {
  static contextTypes = { locale: PropTypes.string }

  focus() {
    // Nothing to focus
    return null
  }

  handleValueChange = (choice: any, item: any) => {
    let newValue
    if (this.props.answer.value != null) {
      newValue = _.clone(this.props.answer.value)
    } else {
      newValue = {}
    }
    if (newValue[item.id] === choice.id) {
      delete newValue[item.id]
    } else {
      newValue[item.id] = choice.id
    }

    return this.props.onAnswerChange(_.extend({}, this.props.answer, { value: newValue }))
  }

  renderChoice(item: any, choice: any) {
    let value
    const id = `${item.id}:${choice.id}`
    if (this.props.answer.value != null) {
      value = this.props.answer.value[item.id]
    } else {
      value = null
    }
    return R(
      "td",
      { key: id },
      // id is used for testing
      R(
        "div",
        {
          className: `touch-radio ${value === choice.id ? "checked" : ""}`,
          id,
          onClick: this.handleValueChange.bind(null, choice, item)
        },
        formUtils.localizeString(choice.label, this.context.locale)
      )
    )
  }

  // IN CASE WE DECIDE TO DISPLAY THE CHOICES AT THE TOP (INSTEAD OF REPEATING THEM)
  //renderChoiceLabel: (choice) ->
  //  R 'td', key: "label#{choice.id}",
  //    formUtils.localizeString(choice.label, @context.locale)

  renderItem(item: any) {
    return R(
      "tr",
      null,
      R(
        "td",
        null,
        R("b", null, formUtils.localizeString(item.label, this.context.locale)),
        item.hint
          ? R(
              "div",
              null,
              R(
                "span",
                { className: "", style: { color: "#888" } },
                formUtils.localizeString(item.hint, this.context.locale)
              )
            )
          : undefined
      ),
      _.map(this.props.choices, (choice) => this.renderChoice(item, choice))
    )
  }

  render() {
    return R(
      "table",
      { className: "", style: { width: "100%" } },
      // IN CASE WE DECIDE TO DISPLAY THE CHOICES AT THE TOP (INSTEAD OF REPEATING THEM)
      //R 'thead', null,
      //  R 'tr', null,
      //    R('td'),
      //    _.map @props.choices, (choice) =>
      //      @renderChoiceLabel(choice)
      R(
        "tbody",
        null,
        _.map(this.props.items, (item) => this.renderItem(item))
      )
    )
  }
}
