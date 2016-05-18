React = require 'react'
H = React.DOM
R = React.createElement

now = () -> new Date().getTime()
roundToTenthsOfSecond = (ticks) -> Math.round(ticks / 100) / 10
toTicks = (seconds) -> if seconds then seconds * 1000 else null

# Creates a stopwatch timer component on the form, can be start/stop/reset and manually edited
module.exports = class StopwatchAnswerComponent extends React.Component
  @propTypes:
    onValueChange: React.PropTypes.func.isRequired
    value: React.PropTypes.number

  constructor: (props) ->
    super
    ticks = toTicks(props.value)
    @state =
      timerId: 0          # ID of the running JS timer
      elapsedTicks: ticks # Tick count
      editing: false      # True if in edit mode
      editTicks: 0        # Temporary store for manual-mode tick count

  componentWillReceiveProps: (nextProps) -> @setState(elapsedTicks: toTicks(nextProps.value))

  # Starts a timer to update @elapsedTicks every 10 ms
  handleStartClick: () =>
    startTime = now() - (@state.elapsedTicks or 0) # for restarts we need to fudge the startTime
    update = () => @setState(elapsedTicks: now() - startTime)
    @setState(timerId: setInterval(update, 10)) # create a timer and store its id in state
    @props.onValueChange(null)

  # Stores the value in seconds
  persistValue: (ticks) -> @props.onValueChange(roundToTenthsOfSecond(ticks))

  # Stops the timer and persists the value
  handleStopClick: () =>
    clearInterval(@state.timerId) # stop the running timer
    @setState(timerId: 0)
    @persistValue(@state.elapsedTicks)

  # Stops timer and resets @elapsedTicks to 0
  handleResetClick: () =>
    clearInterval(@state.timerId)
    @setState(timerId: 0, elapsedTicks: null)
    @props.onValueChange(null)

  # Enters manual edit mode, with the current value
  handleEditClick: () =>
    @setState(editing: true, editTicks: @state.elapsedTicks)

  # Stores @editTicks into @elapsedTicks, persists, and leaves edit mode
  handleSaveEditClick: () =>
    @setState(editing: false, elapsedTicks: @state.editTicks)
    @persistValue(@state.editTicks)

  # Exits edit mode without changes
  handleCancelEditClick: () => @setState(editing: false)

  # Updates @editTicks with the value from the textbox
  handleTextChange: (ev) =>
    if @state.editing
      @setState(editTicks: toTicks(ev.target.value))

  # Grabs the tick count from the relevant state variable and formats it
  getDisplayValue: () ->
    if @state.elapsedTicks == null then ""
    else
      ticks = if @state.editing then @state.editTicks else @state.elapsedTicks
      roundToTenthsOfSecond(ticks).toFixed(1)

  render: ->
    H.div {},
      H.input
        className: "form-control input-lg"
        id: 'input'
        ref: 'input'
        type: 'number'
        step: '0.1'
        value: @getDisplayValue()
        disabled: !@state.editing
        onChange: @handleTextChange # update the @editTicks value
      if !@state.editing
        isRunning = @state.timerId != 0
        H.div {className: 'btn-toolbar', role: 'toolbar'},
          H.div {className: 'btn-group', role: 'group'},
            H.button {className: 'btn btn-success', onClick: @handleStartClick, disabled: isRunning}, "Start"
            H.button {className: 'btn btn-danger', onClick: @handleStopClick, disabled: !isRunning}, "Stop"
            H.button {className: 'btn btn-default', onClick: @handleResetClick, disabled: !@state.elapsedTicks}, "Reset"
          H.div {className: 'btn-group', role: 'group'},
            H.button {className: 'btn btn-default', onClick: @handleEditClick, disabled: isRunning}, "Edit"
      else
        H.div {className: 'btn-group', role: 'group'},
          H.button {className: 'btn btn-default', onClick: @handleSaveEditClick}, "Save"
          H.button {className: 'btn btn-default', onClick: @handleCancelEditClick}, "Cancel"