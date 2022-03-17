import React from "react"
const R = React.createElement

export interface CheckAnswerComponentProps {
  value?: boolean
  onValueChange: any
}

// This one is very different from the other AnswerComponents since it's displayed before the title (passed has children)
// TODO: SurveyorPro: Fix checkbox title size

export default class CheckAnswerComponent extends React.Component<CheckAnswerComponentProps> {
  static defaultProps = { value: false }
  checkbox: HTMLElement | null

  focus() {
    return this.checkbox?.focus()
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
          this.checkbox = c
        }
      },
      this.props.children
    )
  }
}
