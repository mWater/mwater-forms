import React from "react"
const R = React.createElement

import moment, { Moment } from "moment"
import DateTimePickerComponent from "../DateTimePickerComponent"

export interface DateAnswerComponentProps {
  value?: string
  onValueChange: any
  format?: string
  placeholder?: string
  onNextOrComments?: (ev: any) => void
}

interface DateAnswerComponentState {
  isoFormat: any
  detailLevel: any
  placeholder: any
}

export default class DateAnswerComponent extends React.Component<DateAnswerComponentProps, DateAnswerComponentState> {
  static defaultProps = { format: "YYYY-MM-DD" }
  datetimepicker: DateTimePickerComponent | null

  constructor(props: any) {
    super(props)
    this.updateState(props)
  }

  componentWillReceiveProps = (nextProps: any) => {
    return this.updateState(nextProps)
  }

  updateState = (props: any) => {
    let detailLevel
    const { format } = props
    let isoFormat = null
    if (format.match(/ss|LLL|lll/)) {
      detailLevel = 5
    } else if (format.match(/m/)) {
      detailLevel = 4
    } else if (format.match(/h|H/)) {
      detailLevel = 3
    } else if (format.match(/D|l|L/)) {
      detailLevel = 2
      isoFormat = "YYYY-MM-DD"
    } else if (format.match(/M/)) {
      detailLevel = 1
      isoFormat = "YYYY-MM"
    } else if (format.match(/Y/)) {
      detailLevel = 0
      isoFormat = "YYYY"
    } else {
      throw new Error("Invalid format: " + format)
    }

    // Set placeholder if not set
    let placeholder = null
    if (props.placeholder != null) {
      ;({ placeholder } = props)
    } else {
      // Can't set for full dates
      if (!format.match(/l|L/)) {
        placeholder = format.replace("HH", "hh")
      } else {
        placeholder = "..."
      }
    }

    if (this.state) {
      this.setState({ detailLevel, isoFormat, placeholder })
    } else {
      // This is a weird lifecycle quirk of it being called on the constructor
      this.state = { detailLevel, isoFormat, placeholder }
    }
  }

  focus() {
    const { datetimepicker } = this
    if (datetimepicker && (datetimepicker as any).focus != null) {
      (datetimepicker as any).focus()
    }
  }

  handleKeyDown = (ev: any) => {
    if (this.props.onNextOrComments != null) {
      // When pressing ENTER or TAB
      if (ev.keyCode === 13 || ev.keyCode === 9) {
        this.props.onNextOrComments(ev)
        // It's important to prevent the default behavior when handling tabs (or else the tab is applied after the focus change)
        return ev.preventDefault()
      }
    }
  }

  handleChange = (date: any) => {
    // Get date
    if (!date) {
      this.props.onValueChange(null)
      return
    }

    // Get iso format (if date, use format to avoid timezone wrapping)
    if (this.state.isoFormat) {
      date = date.format(this.state.isoFormat)
    } else {
      date = date.toISOString()
    }

    // Trim to detail level
    switch (this.state.detailLevel) {
      case 0:
        date = date.substring(0, 4)
        break
      case 1:
        date = date.substring(0, 7)
        break
      case 2:
        date = date.substring(0, 10)
        break
      case 3:
        date = date.substring(0, 13) + "Z"
        break
      case 4:
        date = date.substring(0, 16) + "Z"
        break
      case 5:
        date = date.substring(0, 19) + "Z"
        break
      default:
        throw new Error("Invalid detail level")
    }

    return this.props.onValueChange(date)
  }

  render() {
    let value: Moment | null = null
    if (this.props.value) {
      if (this.state.isoFormat) {
        value = moment(this.props.value, this.state.isoFormat)
      } else {
        value = moment(this.props.value, moment.ISO_8601)
      }
    }

    return R("div", { style: { maxWidth: "30em" } },
      R(DateTimePickerComponent, {
        onChange: this.handleChange,
        date: value,
        format: this.props.format,
        placeholder: this.state.placeholder,
        showTodayButton: true,
        showClear: true,
        onKeyDown: this.handleKeyDown,
        ref: (c) => {
          this.datetimepicker = c
        },
      })
   )
  }
}
