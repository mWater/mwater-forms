import PropTypes from "prop-types"
import _ from "lodash"
import React from "react"
const R = React.createElement

import ui from "react-library/lib/bootstrap"

interface NumberAnswerComponentProps {
  decimal: boolean,
  value?: number,
  onChange?: any,
  /** Will be merged with style of input box */
style?: any,
  /** True to render with input-sm */
small?: boolean,
  onNextOrComments?: any
}

// Number input component that handles parsing and maintains state when number is invalid
export default class NumberAnswerComponent extends React.Component<NumberAnswerComponentProps> {
  focus() {
    return this.input?.focus()
  }

  validate() {
    if (!this.input.isValid()) {
      return "Invalid number"
    }
    return null
  }

  render() {
    return R(ui.NumberInput, {
      ref: (c) => {
        return (this.input = c)
      },
      decimal: this.props.decimal,
      value: this.props.value,
      onChange: this.props.onChange,
      size: this.props.small ? "sm" : undefined,
      onTab: this.props.onNextOrComments,
      onEnter: this.props.onNextOrComments
    })
  }
};
