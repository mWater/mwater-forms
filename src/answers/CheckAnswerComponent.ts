import PropTypes from "prop-types"
import React from "react"
const R = React.createElement

import * as formUtils from "../formUtils"

interface CheckAnswerComponentProps {
  value?: boolean
  onValueChange: any
  label: any
}

// This one is very different from the other AnswerComponents since it's displayed before the title (passed has children)
// TODO: SurveyorPro: Fix checkbox title size

export default class CheckAnswerComponent extends React.Component<CheckAnswerComponentProps> {
  static defaultProps = { value: false }

  focus() {
    return this.checkbox.focus()
  }

  handleValueChange = () => {
    return this.props.onValueChange(!this.props.value)
  }

  render() {
    return R(
      "div",
      {
        className: `choice touch-checkbox ${this.props.value ? "checked" : ""}`,
        onClick: this.handleValueChange,
        ref: (c) => {
          return (this.checkbox = c)
        }
      },
      this.props.children
    )
  }
}
