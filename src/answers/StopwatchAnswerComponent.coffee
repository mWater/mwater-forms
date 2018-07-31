PropTypes = require('prop-types')
React = require 'react'
H = React.DOM
R = React.createElement

now = () -> new Date().getTime()
toSeconds = (ticks) -> if ticks? then ticks / 1000 else null
toTicks = (seconds) -> if seconds? then seconds * 1000 else null
integerDiv = (dividend, divisor) -> [Math.floor(dividend / divisor), dividend % divisor]
zeroPad = (val, length) ->
  val += ''
  numPads = length - val.length
  if (numPads > 0) then new Array(numPads + 1).join('0') + val else val

getDisplayValue = (ticks) ->
  if ticks?
    [minutes, remainder] = integerDiv(ticks, 60000)
    [seconds, remainder] = integerDiv(remainder, 1000)
    minutes = zeroPad(minutes, 2)
    seconds = zeroPad(seconds, 2)
    minutes + ":" + seconds
  else "--:--"

# Creates a stopwatch timer component on the form, can be start/stop/reset
module.exports = class StopwatchAnswerComponent extends React.Component
  @propTypes:
    onValueChange: PropTypes.func.isRequired
    value: PropTypes.number
    T: PropTypes.func.isRequired  # Localizer to use

  constructor: (props) ->
    super(props)
    ticks = toTicks(props.value)
    @state =
      elapsedTicks: ticks # Tick count
      timerId: null

  componentWillReceiveProps: (nextProps) ->
    if @state.timerId != null # Don't update elapsedTicks if timer is active
     @setState(elapsedTicks: toTicks(nextProps.value))

  # Starts a timer to update @elapsedTicks every 10 ms
  handleStartClick: () =>
    startTime = now() - (@state.elapsedTicks or 0) # for restarts we need to fudge the startTime
    update = () => @setState(elapsedTicks: now() - startTime)
    @setState(timerId: setInterval(update, 10)) # create a timer and store its id\
    @props.onValueChange(null)

  # Stores the value in seconds
  persistValue: (ticks) -> @props.onValueChange(toSeconds(ticks))

  # Stops the timer and persists the value
  handleStopClick: () =>
    clearInterval(@state.timerId) # stop the running timer
    @setState(timerId: null)
    @persistValue(@state.elapsedTicks)

  # Stops timer and resets @elapsedTicks to 0
  handleResetClick: () =>
    clearInterval(@state.timerId)
    @setState(elapsedTicks: null, timerId: null)
    @props.onValueChange(null)

  render: ->
    isRunning = @state.timerId?
    H.div {},
      H.h1 {style: {fontFamily: 'monospace'}}, getDisplayValue(@state.elapsedTicks)
      H.div {className: 'btn-toolbar', role: 'toolbar'},
        H.div {className: 'btn-group', role: 'group'},
          H.button {className: 'btn btn-success', onClick: @handleStartClick, disabled: isRunning}, @props.T("Start")
          H.button {className: 'btn btn-danger', onClick: @handleStopClick, disabled: !isRunning}, @props.T("Stop")
          H.button {className: 'btn btn-default', onClick: @handleResetClick, disabled: !@state.elapsedTicks}, @props.T("Reset")