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
      editing: false
      editTicks: 0

  handleStartClick: () =>
    startTime = now() - @state.elapsedTicks
    update = () => @setState(elapsedTicks: now() - startTime)
    @setState(timerId: setInterval(update, 10))
    @props.onValueChange(null)

  saveTicks: (ticks) ->
    @props.onValueChange(ticks / 1000)


  handleStopClick: () =>
    clearInterval(@state.timerId)
    @setState(timerId: 0)
    @saveTicks(@state.elapsedTicks)

  handleResetClick: () =>
    clearInterval(@state.timerId)
    @setState(timerId: 0, elapsedTicks: 0)
    @props.onValueChange(null)

  handleEditClick: () =>
    @setState(editing: true, editTicks: @state.elapsedTicks)

  handleSaveEditClick: () =>
    @setState(editing: false, elapsedTicks: @state.editTicks)
    @saveTicks(@state.editTicks)

  handleCancelEditClick: () =>
    @setState(editing: false)

  handleTextChange: (ev) =>
    @setState(editTicks: ev.target.value * 1000)

  displayValue: () ->
    ticks = if @state.editing then @state.editTicks else @state.elapsedTicks
    elapsedSeconds = ticks / 1000
    elapsedSeconds.toFixed(1)

  render: ->
    H.div {},
      H.input {
        className: "form-control"
        id: 'input'
        ref: 'input'
        type: "number"
        step: "0.1"
        value: @displayValue()
        disabled: !@state.editing
        onChange: @handleTextChange
      }
      if !@state.editing
        isRunning = @state.timerId != 0
        H.span {},
          H.button {class: 'btn btn-default', onClick: @handleStartClick, disabled: isRunning}, "Start"
          H.button {class: 'btn btn-default', onClick: @handleStopClick, disabled: !isRunning}, "Stop"
          H.button {class: 'btn btn-default', onClick: @handleResetClick, disabled: @state.elapsedTicks == 0}, "Reset"
          H.button {class: 'btn btn-default', onClick: @handleEditClick, disabled: isRunning}, "Edit"
      else
        H.span {},
          H.button {class: 'btn btn-default', onClick: @handleSaveEditClick}, "Save"
          H.button {class: 'btn btn-default', onClick: @handleCancelEditClick}, "Cancel"