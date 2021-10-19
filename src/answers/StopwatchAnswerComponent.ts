import PropTypes from "prop-types"
import React from "react"
const R = React.createElement

function now() {
  return new Date().getTime()
}

function toSeconds(ticks: any) {
  if (ticks != null) {
    return ticks / 1000
  } else {
    return null
  }
}
function toTicks(seconds: any) {
  if (seconds != null) {
    return seconds * 1000
  } else {
    return null
  }
}

function integerDiv(dividend: any, divisor: any) {
  return [Math.floor(dividend / divisor), dividend % divisor]
}

function zeroPad(val: any, length: any) {
  val += ""
  const numPads = length - val.length
  if (numPads > 0) {
    return new Array(numPads + 1).join("0") + val
  } else {
    return val
  }
}

function getDisplayValue(ticks: any) {
  if (ticks != null) {
    let seconds
    let [minutes, remainder] = integerDiv(ticks, 60000)
    ;[seconds, remainder] = integerDiv(remainder, 1000)
    minutes = zeroPad(minutes, 2)
    seconds = zeroPad(seconds, 2)
    return minutes + ":" + seconds
  } else {
    return "--:--"
  }
}

interface StopwatchAnswerComponentProps {
  onValueChange: any
  value?: number
  T: any
}

interface StopwatchAnswerComponentState {
  timerId: any
  elapsedTicks: any
}

// Creates a stopwatch timer component on the form, can be start/stop/reset
export default class StopwatchAnswerComponent extends React.Component<
  StopwatchAnswerComponentProps,
  StopwatchAnswerComponentState
> {
  constructor(props: any) {
    super(props)
    const ticks = toTicks(props.value)
    this.state = {
      elapsedTicks: ticks, // Tick count
      timerId: null
    }
  }

  componentWillReceiveProps(nextProps: any) {
    if (this.state.timerId !== null) {
      // Don't update elapsedTicks if timer is active
      return this.setState({ elapsedTicks: toTicks(nextProps.value) })
    }
  }

  // Starts a timer to update @elapsedTicks every 10 ms
  handleStartClick = () => {
    const startTime = now() - (this.state.elapsedTicks || 0) // for restarts we need to fudge the startTime
    const update = () => this.setState({ elapsedTicks: now() - startTime })
    this.setState({ timerId: setInterval(update, 10) }) // create a timer and store its id\
    return this.props.onValueChange(null)
  }

  // Stores the value in seconds
  persistValue(ticks: any) {
    return this.props.onValueChange(toSeconds(ticks))
  }

  // Stops the timer and persists the value
  handleStopClick = () => {
    clearInterval(this.state.timerId) // stop the running timer
    this.setState({ timerId: null })
    return this.persistValue(this.state.elapsedTicks)
  }

  // Stops timer and resets @elapsedTicks to 0
  handleResetClick = () => {
    clearInterval(this.state.timerId)
    this.setState({ elapsedTicks: null, timerId: null })
    return this.props.onValueChange(null)
  }

  render() {
    const isRunning = this.state.timerId != null
    return R(
      "div",
      {},
      R("h1", { style: { fontFamily: "monospace" } }, getDisplayValue(this.state.elapsedTicks)),
      R(
        "div",
        { className: "", role: "toolbar" },
        R(
          "div",
          { className: "btn-group", role: "group" },
          R(
            "button",
            { className: "btn btn-success", onClick: this.handleStartClick, disabled: isRunning },
            this.props.T("Start")
          ),
          R(
            "button",
            { className: "btn btn-danger", onClick: this.handleStopClick, disabled: !isRunning },
            this.props.T("Stop")
          ),
          R(
            "button",
            { className: "btn btn-secondary", onClick: this.handleResetClick, disabled: !this.state.elapsedTicks },
            this.props.T("Reset")
          )
        )
      )
    )
  }
}
