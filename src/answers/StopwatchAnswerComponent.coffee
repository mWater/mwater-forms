React = require 'react'
H = React.DOM
R = React.createElement

now = () -> new Date().getTime()

module.exports = class StopwatchAnswerComponent extends React.Component
  @propTypes:
    onValueChange: React.PropTypes.func.isRequired

  constructor: (props) ->
    super
    @state =
      timerId: 0
      elapsedTicks: 0

  handleStartClick: (ev) =>
    startTime = now() - @state.elapsedTicks
    update = () => @setState(elapsedTicks: now() - startTime)
    @setState(timerId: setInterval(update, 10))

  handleStopClick: (ev) =>
    clearInterval(@state.timerId)
    @setState(timerId: 0)
    seconds = @state.elapsedTicks / 1000
    @props.onValueChange(seconds)

  handleResetClick: (ev) =>
    clearInterval(@state.timerId)
    @setState(timerId: 0, elapsedTicks: 0)
    @props.onValueChange(null)

  isRunning: () -> @state.timerId != 0

  displayValue: () ->
    elapsedSeconds = @state.elapsedTicks / 1000
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