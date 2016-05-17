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
      timerId: 0       # ID of the running JS timer
      elapsedTicks: 0  # Tick count
      editing: false   # True if in edit mode
      editTicks: 0     # Temporary store for manual-mode tick count

  # Starts a timer to update @elapsedTicks every 10 ms
  handleStartClick: () =>
    startTime = now() - @state.elapsedTicks # for restarts we need to fudge the startTime
    update = () => @setState(elapsedTicks: now() - startTime)
    @setState(timerId: setInterval(update, 10)) # create a timer and store its id in state
    @props.onValueChange(null)

  # Stores the value in seconds
  persistValue: (ticks) -> props.onValueChange(ticks / 1000)

  # Stops the timer and persists the value
  handleStopClick: () =>
    clearInterval(@state.timerId) # stop the running timer
    @setState(timerId: 0)
    @persistValue(@state.elapsedTicks)

  # Stops timer and resets @elapsedTicks to 0
  handleResetClick: () =>
    clearInterval(@state.timerId)
    @setState(timerId: 0, elapsedTicks: 0)
    @props.onValueChange(null)

  # Enters manual edit mode, with the current value
  handleEditClick: () =>
    @setState(editing: true, editTicks: @state.elapsedTicks)

  # Stores @editTicks into @elapsedTicks, persists, and leaves edit mode
  handleSaveEditClick: () =>
    @setState(editing: false, elapsedTicks: @state.editTicks)
    @persistValue(@state.editTicks)

  # Exits edit mode without changes
  handleCancelEditClick: () => setState(editing: false)

  # Updates @editTicks with the value from the textbox
  handleTextChange: (ev) =>
    if @state.editing
      @setState(editTicks: ev.target.value * 1000)

  # Grabs the tick count from the relevant state variable and formats it
  getDisplayValue: () ->
    ticks = if @state.editing then @state.editTicks else @state.elapsedTicks
    elapsedSeconds = ticks / 1000
    elapsedSeconds.toFixed(1)

  render: ->
    H.div {},
      H.input {
        className: "form-control"
        id: 'input'
        ref: 'input'
        type: 'number'
        step: '0.1'
        value: @getDisplayValue()
        disabled: !@state.editing
        onChange: @handleTextChange # update the @editTicks value
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