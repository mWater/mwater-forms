let TimerComponent;
import PropTypes from 'prop-types';
import _ from 'lodash';
import React from 'react';
const R = React.createElement;

import formUtils from './formUtils';

const now = () => new Date().getTime();
const toSeconds = function(ticks) { if (ticks != null) { return ticks / 1000; } else { return null; } };
const toTicks = function(seconds) { if (seconds != null) { return seconds * 1000; } else { return null; } };
const integerDiv = (dividend, divisor) => [Math.floor(dividend / divisor), dividend % divisor];
const zeroPad = function(val, length) {
  val += '';
  const numPads = length - val.length;
  if (numPads > 0) { return new Array(numPads + 1).join('0') + val; } else { return val; }
};

const getDisplayValue = function(ticks) {
  if (ticks != null) {
    let seconds;
    let [minutes, remainder] = integerDiv(ticks, 60000);
    [seconds, remainder] = integerDiv(remainder, 1000);
    minutes = zeroPad(minutes, 2);
    seconds = zeroPad(seconds, 2);
    return minutes + ":" + seconds;
  } else { return "--:--"; }
};

export default TimerComponent = (function() {
  TimerComponent = class TimerComponent extends React.Component {
    static initClass() {
      this.contextTypes = {
        T: PropTypes.func.isRequired,  // Localizer to use
        locale: PropTypes.string
      };
  
      this.propTypes =
        {timer: PropTypes.object.isRequired};
       // Design of instructions. See schema
    }

    constructor(props) {
      this.handleStartClick = this.handleStartClick.bind(this);
      this.handleStopClick = this.handleStopClick.bind(this);
      this.handleResetClick = this.handleResetClick.bind(this);
      super(props);
      const ticks = toTicks(props.value);
      this.state = {
        elapsedTicks: ticks, // Tick count
        timerId: null
      };
    }

    componentWillReceiveProps(nextProps) {
      if (this.state.timerId !== null) { // Don't update elapsedTicks if timer is active
        return this.setState({elapsedTicks: toTicks(nextProps.value)});
      }
    }

    // Starts a timer to update @elapsedTicks every 10 ms
    handleStartClick() {
      const startTime = now() - (this.state.elapsedTicks || 0); // for restarts we need to fudge the startTime
      const update = () => this.setState({elapsedTicks: now() - startTime});
      return this.setState({timerId: setInterval(update, 10)}); // create a timer and store its id\
    }

    // Stops the timer
    handleStopClick() {
      clearInterval(this.state.timerId); // stop the running timer
      return this.setState({timerId: null});
    }

    // Stops timer and resets @elapsedTicks to 0
    handleResetClick() {
      clearInterval(this.state.timerId);
      return this.setState({elapsedTicks: null, timerId: null});
    }

    render() {
      const isRunning = (this.state.timerId != null);
      let timeLeft = this.props.timer.duration - this.state.elapsedTicks;
      if (timeLeft < 0) {
        timeLeft = null; // To display -- : --
      }
      return R('div', {className: 'timer'},
        R('div', {className: "prompt"},
          formUtils.localizeString(this.props.timer.text, this.context.locale)),
        this.props.timer.hint ?
          R('div', {className: "text-muted"}, formUtils.localizeString(this.props.timer.hint, this.context.locale)) : undefined,
        R('h1', {style: {fontFamily: 'monospace'}}, getDisplayValue(timeLeft)),
        R('div', {className: 'btn-toolbar', role: 'toolbar'},
          R('div', {className: 'btn-group', role: 'group'},
            R('button', {className: 'btn btn-success', onClick: this.handleStartClick, disabled: isRunning}, this.context.T("Start")),
            R('button', {className: 'btn btn-danger', onClick: this.handleStopClick, disabled: !isRunning}, this.context.T("Stop")),
            R('button', {className: 'btn btn-default', onClick: this.handleResetClick, disabled: !this.state.elapsedTicks}, this.context.T("Reset")))
        )
      );
    }
  };
  TimerComponent.initClass();
  return TimerComponent;
})();
