import _ from "lodash"
import React from "react"
import moment, { Moment } from "moment"
import { DateTime, Namespace, TempusDominus } from "@eonasdan/tempus-dominus"

import "@eonasdan/tempus-dominus/dist/css/tempus-dominus.css"

export interface DateTimePickerComponentProps {
  /** date format. */
  format?: string

  /** True to show timepicker. Only if no format */
  timepicker?: boolean

  /** Show the today button */
  showTodayButton?: boolean

  /** Show the clear button */
  showClear: boolean

  /** callback on date change (argument: moment date) */
  onChange: (date: Moment | null) => void

  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void

  /** date as moment */
  date?: Moment | null

  placeholder?: string
}

export default class DateTimePickerComponent extends React.Component<DateTimePickerComponentProps> {
  static defaultProps = { timepicker: false }

  control: TempusDominus
  textRef: HTMLInputElement | null

  getFormat() {
    if (!this.props.format) {
      return this.props.timepicker ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD"
    }
    return this.props.format
  }

  componentDidUpdate(prevProps: DateTimePickerComponentProps) {
    if (!prevProps.date && !this.props.date) {
      return
    }

    // If changed
    const current = this.control.dates.lastPicked ? moment(this.control.dates.lastPicked) : null
    if (current && !this.props.date || 
      !current && this.props.date ||
      (current && this.props.date && !current.isSame(this.props.date))) {
      // If different than current
      if (this.props.date) {
        this.control.dates.setValue(DateTime.convert(this.props.date.toDate()))
      }
      else {
        this.control.clear()
      }
    }
  }

  inputRef = (elem: HTMLDivElement | null) => {
    const format = this.getFormat()

    if (elem) {
      this.control = new TempusDominus(elem, {
        display: {
          buttons: {
            clear: this.props.showClear,
            today: this.props.showTodayButton,
          },
          components: {
            date: format.includes("DD") || format.includes("ll") || format.includes("LL"),
            month: format.includes("MM") || format.includes("ll") || format.includes("LL"),
            year: true,
            decades: true,
            clock: format.includes("HH") || format.includes("lll") || format.includes("LLL"),
            hours: format.includes("HH") || format.includes("lll") || format.includes("LLL"),
            minutes: format.includes("mm") || format.includes("lll") || format.includes("LLL"),
            seconds: format.includes("ss") || format.includes("lll") || format.includes("LLL"),
            useTwentyfourHour: true
          },
          icons: {
            time: "fas fa-clock",
            date: "fas fa-calendar",
            up: "fas fa-arrow-up",
            down: "fas fa-arrow-down",
            next: "fas fa-arrow-right",
            previous: "fas fa-arrow-left",
            today: "fas fa-calendar-check",
            clear: "fas fa-trash",
            close: "fas fa-times"
          }
        }
      })

      // Override to use moment format
      this.control.dates.formatInput = (date) => date ? moment(date).format(format) : ""
      this.control.dates.setFromInput = (value, index) => {
        const parsedValue = moment(value, format)
        if (parsedValue.isValid()) {
          this.control.dates.setValue(new DateTime(parsedValue.toDate()), index)
          this.control.hide()
        } else {
          this.control.dates.clear()
        }
      }
      if (this.props.date) {
        this.control.dates.setFromInput(this.props.date.format(format), 0)
      }

      this.control.subscribe(Namespace.events.change, e => {
        this.props.onChange(e.date ? moment(e.date) : null)
      })
    }
    else {
      if (this.control) {
        this.control.dispose()
      }
    }
  }

  render() {
    return (
      <div className="input-group" ref={this.inputRef}>
        <input 
          type="text" 
          className="form-control" 
          placeholder={this.props.placeholder} 
          ref={c => { this.textRef = c }}
          onChange={ev => {}}
          onKeyDown={this.props.onKeyDown}
          />
        <span className="input-group-text"><i className="fas fa-calendar"/></span>
      </div>
    )
  }
}