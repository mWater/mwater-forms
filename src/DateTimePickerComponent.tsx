import _ from "lodash"
import React from "react"
import moment, { Moment } from "moment"
import { TempusDominus, Namespace, DateTime } from "@eonasdan/tempus-dominus"

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
        // TODO beta 4 issues
        ;(this.control.dates as any).setValue(this.props.date.toDate())
      }
      else {
        // Text needs to be cleared from some reason too
        this.textRef!.value = ""
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
          }
        }
      })

      // TODO beta 5 issues
      ;(this.control.dates as any).formatInput = (date: any) => date ? moment(date).format(format) : ""
      ;(this.control.dates as any).setFromInput = (value: any, index: any) => {
        const parsedValue = moment(value, format)
        if (parsedValue.isValid()) {
          ;(this.control.dates as any).setValue(new DateTime(parsedValue.toDate()), index)
        } else {
          ;(this.control.dates as any).setValue(null, index)
        }
      }
      // this.control.dates.setFromInput
      // hooks: {
      //   inputFormat: (context, date) => { return date ? moment(date).format(format) : "" },
      //   inputParse: (context, value) => { 
      //     const parsedValue = moment(value, format)
      //     if (parsedValue.isValid()) {
      //       return new DateTime(parsedValue.toDate()) 
      //     } else {
      //       return "" as any
      //     }
      //   }
      // },

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
    const defaultValue = this.props.date ? moment(this.props.date).format(this.getFormat()) : ""
    return (
      <div className="input-group" ref={this.inputRef}>
        <input 
          type="text" 
          className="form-control" 
          placeholder={this.props.placeholder} 
          defaultValue={defaultValue} 
          ref={c => { this.textRef = c }}
          />
        <span className="input-group-text"><i className="fas fa-calendar"/></span>
      </div>
    )
  }
}