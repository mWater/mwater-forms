import PropTypes from "prop-types"
import _ from "lodash"
import React from "react"
const R = React.createElement

import * as formUtils from "./formUtils"

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

export interface TimerComponentProps {
  timer: any
}

interface TimerComponentState {
  timerId: any
  elapsedTicks: any
}

export default class TimerComponent extends React.Component<TimerComponentProps, TimerComponentState> {
  static contextTypes = {
    T: PropTypes.func.isRequired, // Localizer to use
    locale: PropTypes.string
  }

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
    return this.setState({ timerId: setInterval(update, 10) }) // create a timer and store its id\
  }

  // Stops the timer
  handleStopClick = () => {
    clearInterval(this.state.timerId) // stop the running timer
    return this.setState({ timerId: null })
  }

  // Stops timer and resets @elapsedTicks to 0
  handleResetClick = () => {
    clearInterval(this.state.timerId)
    return this.setState({ elapsedTicks: null, timerId: null })
  }

  render() {
    const isRunning = this.state.timerId != null
    let timeLeft = this.props.timer.duration - this.state.elapsedTicks
    if (timeLeft < 0) {
      timeLeft = null // To display -- : --
    }
    return R(
      "div",
      { className: "timer" },
      R("div", { className: "prompt" }, formUtils.localizeString(this.props.timer.text, this.context.locale)),
      this.props.timer.hint
        ? R("div", { className: "text-muted" }, formUtils.localizeString(this.props.timer.hint, this.context.locale))
        : undefined,
      R("h1", { style: { fontFamily: "monospace" } }, getDisplayValue(timeLeft)),
      R(
        "div",
        { className: "", role: "toolbar" },
        R(
          "div",
          { className: "btn-group", role: "group" },
          R(
            "button",
            { className: "btn btn-success", onClick: this.handleStartClick, disabled: isRunning },
            this.context.T("Start")
          ),
          R(
            "button",
            { className: "btn btn-danger", onClick: this.handleStopClick, disabled: !isRunning },
            this.context.T("Stop")
          ),
          R(
            "button",
            { className: "btn btn-secondary", onClick: this.handleResetClick, disabled: !this.state.elapsedTicks },
            this.context.T("Reset")
          )
        )
      )
    )
  }
}
