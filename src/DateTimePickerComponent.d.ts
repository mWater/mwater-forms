import { Moment } from "moment"
import React from "react"

export default class DateTimePickerComponent extends React.Component<{
  /** date format */
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
}> {}
