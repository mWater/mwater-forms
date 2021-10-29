import _ from "lodash"
import React from "react"
import { Moment } from "moment"
import DatePicker from "react-datepicker"
import ReactDOM from "react-dom"

import "react-datepicker/dist/react-datepicker.css"

interface DateTimePickerComponentProps {
  /** date format. */
  format?: string

  /** do we need time picker?  (Only useful if format is not set) */
  timepicker?: boolean

  /** Show the today button */
  showTodayButton?: boolean

  /** Show the clear button */
  showClear: boolean

  /** callback on date change (argument: moment date) */
  onChange: (date: Moment) => void

  /** date as moment */
  date?: Moment | null

  /** default date as moment */
  defaultDate?: Moment
}

export default class DateTimePickerComponent extends React.Component<DateTimePickerComponentProps> {
  static defaultProps = { timepicker: false }

  render() {
    return (
      <DatePicker
        isClearable={this.props.showClear}
        selected={this.props.date}
        onChange={this.props.onChange}
        showTimeSelect={(this.props.format && (this.props.format.includes("ss") || this.props.format == "lll" || this.props.format == "LLL")) || this.props.timepicker}
        dateFormat={this.props.format}
        className="form-control"
        popperContainer={createPopperContainer}
        showMonthDropdown
        showYearDropdown
      />
    )
  }
}

// https://github.com/Hacker0x01/react-datepicker/issues/1366
function createPopperContainer(props: { children: React.ReactNode[] }): React.ReactNode {
  return ReactDOM.createPortal(<div style={{ zIndex: 10000 }}>{props.children}</div>, document.body)
}
