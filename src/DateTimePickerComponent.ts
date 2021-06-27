// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
let DateTimePickerComponent
import _ from "lodash"
import PropTypes from "prop-types"
import React from "react"
const R = React.createElement
import moment from "moment"
import $ from "jquery"

// This only works in browser. Load datetime picker
import "eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js"

import "eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css"

export default DateTimePickerComponent = (function () {
  DateTimePickerComponent = class DateTimePickerComponent extends React.Component {
    static initClass() {
      this.propTypes = {
        // date format
        format: PropTypes.string,

        // do we need time picker?  (Only useful if format is not set)
        timepicker: PropTypes.bool,

        showTodayButton: PropTypes.bool, // Show the today button
        showClear: PropTypes.bool, // Show the clear button

        // callback on date change (argument: moment date)
        onChange: PropTypes.func,

        // date as moment
        date: PropTypes.object,

        // default date as moment
        defaultDate: PropTypes.object
      }

      this.defaultProps = { timepicker: false }
    }

    onChange = (event: any) => {
      return this.props.onChange?.(event.date)
    }

    componentDidMount() {
      return this.createNativeComponent(this.props)
    }

    componentWillUnmount() {
      return this.destroyNativeComponent()
    }

    destroyNativeComponent() {
      return $(this.datetimepicker).data("DateTimePicker").destroy()
    }

    createNativeComponent(props: any) {
      const pickerOptions = { showClear: props.showClear, useStrict: true, focusOnShow: false }

      if (props.format != null) {
        pickerOptions.format = props.format
      } else if (props.timepicker) {
        pickerOptions.format = "YYYY-MM-DD HH-mm-ss"
      } else {
        pickerOptions.format = "YYYY-MM-DD"
      }

      if (props.defaultDate) {
        pickerOptions.defaultDate = props.defaultDate
      }

      pickerOptions.showTodayButton = props.showTodayButton

      const node = this.datetimepicker
      const picker = $(node).datetimepicker(pickerOptions)

      $(node)
        .data("DateTimePicker")
        .date(props.date || null)
      return $(node).on("dp.change", this.onChange)
    }

    componentWillReceiveProps(nextProps: any) {
      // If format changed, recreate
      if (nextProps.format !== this.props.format) {
        this.destroyNativeComponent()
        _.defer(() => {
          return this.createNativeComponent(nextProps)
        })
        return
      }

      // If unchanged
      if (nextProps.date === null && this.props.date === null) {
        return
      }
      if (nextProps.date != null && this.props.date != null && nextProps.date.isSame(this.props.date)) {
        return
      }

      const node = this.datetimepicker
      $(node).off("dp.change", this.onChange)
      $(node)
        .data("DateTimePicker")
        .date(nextProps.date || null)
      return $(node).on("dp.change", this.onChange)
    }

    handleInputFocus = () => {
      const node = this.datetimepicker
      return $(node).data("DateTimePicker").show()
    }

    render() {
      // Override z-index due to bootstrap oddness
      const input = R("input", {
        type: "text",
        className: "form-control",
        placeholder: this.props.placeholder,
        onFocus: this.handleInputFocus,
        style: { zIndex: "inherit", minWidth: "12em" }
      })

      return R(
        "div",
        {
          className: "input-group date",
          ref: (c) => {
            return (this.datetimepicker = c)
          }
        },
        input,
        R(
          "span",
          { className: "input-group-addon", onClick: this.handleCalendarClick },
          R("span", { className: "glyphicon glyphicon-calendar" })
        )
      )
    }
  }
  DateTimePickerComponent.initClass()
  return DateTimePickerComponent
})()
