import _ from "lodash"
import React, { forwardRef } from "react"
import { Moment } from "moment"
import DatePicker from "react-datepicker"
import ReactDOM from "react-dom"

import "react-datepicker/dist/react-datepicker.css"
import "./DateTimePickerComponent.css"

export interface DateTimePickerComponentProps {
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

  placeholder?: string
}

const CustomInput = forwardRef((props: { value?: any, onClick?: () => void, placeholder?: string }, ref) => {
  return <div className="input-group">
    <input type="text" className="form-control" placeholder={props.placeholder} onClick={props.onClick} ref={ref as any} value={props.value}/>
    <span className="input-group-text" onClick={props.onClick}><i className="fas fa-calendar-alt" /></span>
  </div>
})

export default class DateTimePickerComponent extends React.Component<DateTimePickerComponentProps> {
  static defaultProps = { timepicker: false }

  render() {
    return (
      <div className="datetimepickercomponent">
        <DatePicker
          isClearable={this.props.showClear}
          selected={this.props.date}
          onChange={this.props.onChange}
          showTimeSelect={(this.props.format && (this.props.format.includes("ss") || this.props.format == "lll" || this.props.format == "LLL")) || this.props.timepicker}
          dateFormat={this.props.format}
          placeholderText={this.props.placeholder}
          popperContainer={createPopperContainer}
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          customInput={<CustomInput/>}
          todayButton={<span><i className="fas fa-arrow-right" style={{ marginRight: 3 }} /><i className="fas fa-clock" /></span> as any}
        />
      </div>
    )
  }
}

// https://github.com/Hacker0x01/react-datepicker/issues/1366
function createPopperContainer(props: { children: React.ReactNode[] }): React.ReactNode {
  return ReactDOM.createPortal(<div style={{ zIndex: 10000 }}>{props.children}</div>, document.body)
}
