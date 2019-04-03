_ = require 'lodash'
PropTypes = require('prop-types')
React = require 'react'
R = React.createElement
moment = require 'moment'
$ = require 'jquery'

# This only works in browser. Load datetime picker
if process.browser
  require('eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js')
  require('eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css')
  
module.exports = class DateTimePickerComponent extends React.Component
  @propTypes:
    # date format
    format: PropTypes.string

    # do we need time picker?  (Only useful if format is not set)
    timepicker: PropTypes.bool

    showTodayButton: PropTypes.bool # Show the today button
    showClear: PropTypes.bool # Show the clear button

    # callback on date change (argument: moment date)
    onChange: PropTypes.func

    # date as moment
    date: PropTypes.object

    # default date as moment
    defaultDate: PropTypes.object

  @defaultProps:
    timepicker: false

  onChange: (event) =>
    @props.onChange?(event.date)

  componentDidMount: ->
    @createNativeComponent(@props)

  componentWillUnmount: ->
    @destroyNativeComponent()

  destroyNativeComponent: ->
    $(@datetimepicker).data("DateTimePicker").destroy()
  
  createNativeComponent: (props) ->
    pickerOptions = { showClear: props.showClear, useStrict: true, focusOnShow: false }

    if props.format?
      pickerOptions.format = props.format
    else if props.timepicker
      pickerOptions.format = "YYYY-MM-DD HH-mm-ss"
    else
      pickerOptions.format = "YYYY-MM-DD"

    if props.defaultDate
      pickerOptions.defaultDate = props.defaultDate

    pickerOptions.showTodayButton = props.showTodayButton

    node = @datetimepicker
    picker = $(node).datetimepicker(pickerOptions)

    $(node).data("DateTimePicker").date(props.date or null)
    $(node).on("dp.change", @onChange)

  componentWillReceiveProps: (nextProps) ->
    # If format changed, recreate
    if nextProps.format != @props.format
      @destroyNativeComponent()
      _.defer () =>
        @createNativeComponent(nextProps)
      return

    # If unchanged
    if nextProps.date == null and @props.date == null
      return
    if nextProps.date? and @props.date? and nextProps.date.isSame(@props.date)
      return

    node = @datetimepicker
    $(node).off("dp.change", @onChange)
    $(node).data("DateTimePicker").date(nextProps.date or null)
    $(node).on("dp.change", @onChange)

  handleInputFocus: =>
    node = @datetimepicker
    $(node).data("DateTimePicker").show()

  render: ->
    # Override z-index due to bootstrap oddness
    input = R 'input', { type: "text", className: "form-control", placeholder: @props.placeholder, onFocus: @handleInputFocus, style: { zIndex: "inherit", minWidth: "12em" } }

    R 'div', className: 'input-group date', ref: ((c) => @datetimepicker = c),
      input
      R 'span', className: "input-group-addon", onClick: @handleCalendarClick,
        R 'span', className: "glyphicon glyphicon-calendar"
