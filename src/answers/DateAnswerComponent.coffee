React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require '../formUtils'

moment = require('moment')

DateTimePickerComponent = require '../DateTimePickerComponent'

# Functional (but not exactly the same yet)
# Not tested
# TODO: Handle readOnly properly

module.exports = class DateAnswerComponent extends React.Component
  @propTypes:
    value: React.PropTypes.string
    onValueChange: React.PropTypes.func.isRequired
    format: React.PropTypes.string
    placeholder: React.PropTypes.string
    readOnly: React.PropTypes.bool

  @defaultProps:
    format: "YYYY-MM-DD"

  constructor: (props) ->
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

    @state = {detailLevel: detailLevel, isoFormat: isoFormat, placeholder: placeholder}

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

    # Handle readonly case
    if @props.readonly
      #TODO: handle readonly
      #if value
      #  @$("#date_input").val(value.format(@options.format))
      #else
      #  @$("#date_input").val("")
      return H.div()
    else
      return R DateTimePickerComponent, {
        onChange: @handleChange
        date: value
        format: @props.format
        placeholder: @state.placeholder
        displayCalendarButton: true
      }
