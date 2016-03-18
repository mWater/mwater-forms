React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require '../formUtils'

DateTimePickerComponent = require '../DateTimePickerComponent'

module.exports = class DateAnswerComponent extends React.Component
  @contextTypes:
    locale: React.PropTypes.string  # Current locale (e.g. "en")

  @propTypes:
    value: React.PropTypes.bool
    onValueChange: React.PropTypes.func.isRequired
    format: React.PropTypes.string
    placeholder: React.PropTypes.string
    readOnly: React.PropTypes.bool

  @defaultProps:
    format: "YYYY-MM-DD"

  constructor: (props) ->
    @state = {detailLevel: 2, isoFormat: null, placeholder: null}

  componentDidMount: ->
    format = @props.format
    if format.match /ss|LLL|lll/
      @setState detailLevel: 5
    else if format.match /m/
      @setState detailLevel: 4
    else if format.match /h|H/
      @setState detailLevel: 3
    else if format.match /D|l|L/
      @setState detailLevel: 2, isoFormat: "YYYY-MM-DD"
    else if format.match /M/
      @setState detailLevel: 1, isoFormat: "YYYY-MM"
    else if format.match /Y/
      @setState detailLevel: 0, isoFormat: "YYYY"
    else
      throw new Error("Invalid format: " + format)

    # Set placeholder if not set
    if @props.placeholder?
      @setState placeholder: @props.placeholder
    else
      # Can't set for full dates
      if not format.match /l|L/
        @setState placeholder: format
      else
        @setState placeholder: '...'

    # Make the Date picker work
    #if not @props.readOnly
    #  pickerOptions = {
    #    format: format
    #    useCurrent: false
    #    showTodayButton: true
    #    focusOnShow: false
    #  }
    #
    #  $('#datetimepicker').datetimepicker(pickerOptions)

  handleValueChange: () =>
    null

  render: ->
    H DateTimePickerComponent, {}
