PropTypes = require('prop-types')
React = require 'react'
R = React.createElement

formUtils = require '../formUtils'

moment = require('moment')

DateTimePickerComponent = require '../DateTimePickerComponent'

module.exports = class DateAnswerComponent extends React.Component
  @propTypes:
    value: PropTypes.string
    onValueChange: PropTypes.func.isRequired
    format: PropTypes.string
    placeholder: PropTypes.string
    onNextOrComments: PropTypes.func

  @defaultProps:
    format: "YYYY-MM-DD"

  constructor: (props) ->
    super(props)
    @updateState(props)

  componentWillReceiveProps: (nextProps) =>
    @updateState(nextProps)
    
  updateState: (props) =>
    format = props.format
    isoFormat = null
    if format.match /ss|LLL|lll/
      detailLevel = 5
    else if format.match /m/
      detailLevel = 4
    else if format.match /h|H/
      detailLevel = 3
    else if format.match /D|l|L/
      detailLevel = 2
      isoFormat = "YYYY-MM-DD"
    else if format.match /M/
      detailLevel = 1
      isoFormat = "YYYY-MM"
    else if format.match /Y/
      detailLevel = 0
      isoFormat = "YYYY"
    else
      throw new Error("Invalid format: " + format)

    # Set placeholder if not set
    placeholder = null
    if props.placeholder?
      placeholder =  props.placeholder
    else
      # Can't set for full dates
      if not format.match /l|L/
        placeholder = format
      else
        placeholder = '...'

    if @state
      @setState({detailLevel: detailLevel, isoFormat: isoFormat, placeholder: placeholder})
    else 
      # This is a weird lifecycle quirk of it being called on the constructor
      @state = {detailLevel: detailLevel, isoFormat: isoFormat, placeholder: placeholder}

  focus: () ->
    datetimepicker = @datetimepicker
    if datetimepicker.focus?
      datetimepicker.focus()

  handleKeyDown: (ev) =>
    if @props.onNextOrComments?
      # When pressing ENTER or TAB
      if ev.keyCode == 13 or ev.keyCode == 9
        @props.onNextOrComments(ev)
        # It's important to prevent the default behavior when handling tabs (or else the tab is applied after the focus change)
        ev.preventDefault()

  handleChange: (date) =>
    # Get date
    if not date
      @props.onValueChange(null)
      return

    # Get iso format (if date, use format to avoid timezone wrapping)
    if @state.isoFormat
      date = date.format(@isoFormat)
    else
      date = date.toISOString()

    # Trim to detail level
    switch @state.detailLevel
      when 0 then date = date.substring(0,4)
      when 1 then date = date.substring(0,7)
      when 2 then date = date.substring(0,10)
      when 3 then date = date.substring(0,13) + "Z"
      when 4 then date = date.substring(0,16) + "Z"
      when 5 then date = date.substring(0,19) + "Z"
      else
        throw new Error("Invalid detail level")

    @props.onValueChange(date)

  render: ->
    value = @props.value
    if value
      if @state.isoFormat
        value = moment(value, @state.isoFormat)
      else
        value = moment(value, moment.ISO_8601)

    return R DateTimePickerComponent, {
      ref: (c) => @datetimepicker = c
      onChange: @handleChange
      date: value
      format: @props.format
      placeholder: @state.placeholder
      showTodayButton: true
      showClear: true
      onKeyDown: @handleKeyDown
    }
