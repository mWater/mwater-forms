React = require 'react'
H = React.DOM
R = React.createElement

now = () -> new Date().getTime()

module.exports = class StopwatchAnswerComponent extends React.Component
  @propTypes:
    onValueChange: React.PropTypes.func.isRequired

  constructor: (props) ->
    super
    now = now()
    @state =
      timerId: 0
      startTime: now
      stopTime: now

  handleStartClick: (ev) =>
    update = () => @forceUpdate()
    existingTicks = @state.stopTime - @state.startTime
    @setState(timerId: setInterval(update, 10), startTime: now() - existingTicks)

  handleStopClick: (ev) =>
    clearInterval(@state.timerId)
    stopTime = now()
    @setState(timerId: 0, stopTime: stopTime)
    seconds = (stopTime - @state.startTime) / 1000
    @props.onValueChange(seconds)

  handleResetClick: (ev) =>
    clearInterval(@state.timerId)
    now = now()
    @setState(timerId: 0, startTime: now, stopTime: now)
    @props.onValueChange(null)

  isRunning: () -> @state.timerId != 0

  displayValue: () ->
    endTime = if @isRunning() then now() else @state.stopTime
    elapsedSeconds = (endTime - @state.startTime) / 1000
    elapsedSeconds.toFixed(1)

  render: ->
    H.div {},
      H.button {class: 'btn btn-default', onClick: @handleStartClick, disabled: @isRunning()}, "Start"
      H.button {class: 'btn btn-default', onClick: @handleStopClick, disabled: !@isRunning()}, "Stop"
      H.button {class: 'btn btn-default', onClick: @handleResetClick}, "Reset"
      H.input {
        className: "form-control"
        id: 'input'
        ref: 'input'
        type: "text"
        value: @displayValue()
        onChange: (ev) => @setState(text: ev.target.value)
      }