PropTypes = require('prop-types')
_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require './formUtils'

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

module.exports = class TimerComponent extends React.Component
  @contextTypes:
    T: PropTypes.func.isRequired  # Localizer to use
    locale: PropTypes.string

  @propTypes:
    timer: PropTypes.object.isRequired # Design of instructions. See schema

  constructor: (props) ->
    super
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

  # Stops the timer
  handleStopClick: () =>
    clearInterval(@state.timerId) # stop the running timer
    @setState(timerId: null)

  # Stops timer and resets @elapsedTicks to 0
  handleResetClick: () =>
    clearInterval(@state.timerId)
    @setState(elapsedTicks: null, timerId: null)

  render: ->
    isRunning = @state.timerId?
    timeLeft = @props.timer.duration - @state.elapsedTicks
    if timeLeft < 0
      timeLeft = null # To display -- : --
    H.div {className: 'timer'},
      H.div className: "prompt", ref: 'prompt',
        formUtils.localizeString(@props.timer.text, @context.locale)
      if @props.timer.hint
        H.div className: "text-muted", formUtils.localizeString(@props.timer.hint, @context.locale)
      H.h1 {style: {fontFamily: 'monospace'}}, getDisplayValue(timeLeft)
      H.div {className: 'btn-toolbar', role: 'toolbar'},
        H.div {className: 'btn-group', role: 'group'},
          H.button {className: 'btn btn-success', onClick: @handleStartClick, disabled: isRunning}, @context.T("Start")
          H.button {className: 'btn btn-danger', onClick: @handleStopClick, disabled: !isRunning}, @context.T("Stop")
          H.button {className: 'btn btn-default', onClick: @handleResetClick, disabled: !@state.elapsedTicks}, @context.T("Reset")
