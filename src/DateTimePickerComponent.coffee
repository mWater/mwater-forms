React = require 'react'
R = React.createElement
H = React.DOM
ReactDOM = require 'react-dom'
moment = require 'moment'

# This only works in browser. Load datetime picker
if process.browser
  require('eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js')

module.exports = class DateTimePickerComponent extends React.Component
  @propTypes:
    # date format
    format: React.PropTypes.string

    # do we need time picker?  (Only useful if format is not set)
    timepicker: React.PropTypes.bool

    showTodayButton: React.PropTypes.bool # Show the today button
    showClear: React.PropTypes.bool # Show the clear button

    # callback on date change
    # argument: {date: moment object for currently selected datetime, oldDate: moment object for previous datetime}
    onChange: React.PropTypes.func

    # date as moment
    date: React.PropTypes.object

    # default date as moment
    defaultDate: React.PropTypes.object

  @defaultProps:
    timepicker: false

  onChange: (event) =>
    @props.onChange?(event.date)

  componentDidMount: ->
    pickerOptions = { showClear: @props.showClear, useStrict: true, focusOnShow: false }

    if @props.format?
      pickerOptions.format = @props.format
    else if @props.timepicker
      pickerOptions.format = "YYYY-MM-DD HH-mm-ss"
    else
      pickerOptions.format = "YYYY-MM-DD"

    if @props.defaultDate
      pickerOptions.defaultDate = @props.defaultDate

    pickerOptions.showTodayButton = @props.showTodayButton

    node = @refs.datetimepicker
    picker = $(node).datetimepicker(pickerOptions)

    $(node).data("DateTimePicker").date(@props.date or null)
    $(node).on("dp.change", @onChange)

  componentWillReceiveProps: (nextProps) ->
    # If unchanged
    if nextProps.date == null and @props.date == null
      return
    if nextProps.date? and @props.date? and nextProps.date.isSame(@props.date)
      return

    node = @refs.datetimepicker
    $(node).off("dp.change", @onChange)
    $(node).data("DateTimePicker").date(nextProps.date or null)
    $(node).on("dp.change", @onChange)

  componentWillUnmount: ->
    $(@refs.datetimepicker).data("DateTimePicker").destroy()

  handleInputFocus: =>
    node = @refs.datetimepicker
    $(node).data("DateTimePicker").show()

  render: ->
    input = H.input { type: "text", className: "form-control", placeholder: @props.placeholder, onFocus: @handleInputFocus }

    H.div className: 'input-group date', ref: "datetimepicker",
      input
      H.span className: "input-group-addon", onClick: @handleCalendarClick,
        H.span className: "glyphicon glyphicon-calendar"
