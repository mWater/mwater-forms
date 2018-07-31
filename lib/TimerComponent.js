var H, PropTypes, R, React, TimerComponent, _, formUtils, getDisplayValue, integerDiv, now, toSeconds, toTicks, zeroPad,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

PropTypes = require('prop-types');

_ = require('lodash');

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('./formUtils');

now = function() {
  return new Date().getTime();
};

toSeconds = function(ticks) {
  if (ticks != null) {
    return ticks / 1000;
  } else {
    return null;
  }
};

toTicks = function(seconds) {
  if (seconds != null) {
    return seconds * 1000;
  } else {
    return null;
  }
};

integerDiv = function(dividend, divisor) {
  return [Math.floor(dividend / divisor), dividend % divisor];
};

zeroPad = function(val, length) {
  var numPads;
  val += '';
  numPads = length - val.length;
  if (numPads > 0) {
    return new Array(numPads + 1).join('0') + val;
  } else {
    return val;
  }
};

getDisplayValue = function(ticks) {
  var minutes, ref, ref1, remainder, seconds;
  if (ticks != null) {
    ref = integerDiv(ticks, 60000), minutes = ref[0], remainder = ref[1];
    ref1 = integerDiv(remainder, 1000), seconds = ref1[0], remainder = ref1[1];
    minutes = zeroPad(minutes, 2);
    seconds = zeroPad(seconds, 2);
    return minutes + ":" + seconds;
  } else {
    return "--:--";
  }
};

module.exports = TimerComponent = (function(superClass) {
  extend(TimerComponent, superClass);

  TimerComponent.contextTypes = {
    T: PropTypes.func.isRequired,
    locale: PropTypes.string
  };

  TimerComponent.propTypes = {
    timer: PropTypes.object.isRequired
  };

  function TimerComponent(props) {
    this.handleResetClick = bind(this.handleResetClick, this);
    this.handleStopClick = bind(this.handleStopClick, this);
    this.handleStartClick = bind(this.handleStartClick, this);
    var ticks;
    TimerComponent.__super__.constructor.call(this, props);
    ticks = toTicks(props.value);
    this.state = {
      elapsedTicks: ticks,
      timerId: null
    };
  }

  TimerComponent.prototype.componentWillReceiveProps = function(nextProps) {
    if (this.state.timerId !== null) {
      return this.setState({
        elapsedTicks: toTicks(nextProps.value)
      });
    }
  };

  TimerComponent.prototype.handleStartClick = function() {
    var startTime, update;
    startTime = now() - (this.state.elapsedTicks || 0);
    update = (function(_this) {
      return function() {
        return _this.setState({
          elapsedTicks: now() - startTime
        });
      };
    })(this);
    return this.setState({
      timerId: setInterval(update, 10)
    });
  };

  TimerComponent.prototype.handleStopClick = function() {
    clearInterval(this.state.timerId);
    return this.setState({
      timerId: null
    });
  };

  TimerComponent.prototype.handleResetClick = function() {
    clearInterval(this.state.timerId);
    return this.setState({
      elapsedTicks: null,
      timerId: null
    });
  };

  TimerComponent.prototype.render = function() {
    var isRunning, timeLeft;
    isRunning = this.state.timerId != null;
    timeLeft = this.props.timer.duration - this.state.elapsedTicks;
    if (timeLeft < 0) {
      timeLeft = null;
    }
    return H.div({
      className: 'timer'
    }, H.div({
      className: "prompt",
      ref: 'prompt'
    }, formUtils.localizeString(this.props.timer.text, this.context.locale)), this.props.timer.hint ? H.div({
      className: "text-muted"
    }, formUtils.localizeString(this.props.timer.hint, this.context.locale)) : void 0, H.h1({
      style: {
        fontFamily: 'monospace'
      }
    }, getDisplayValue(timeLeft)), H.div({
      className: 'btn-toolbar',
      role: 'toolbar'
    }, H.div({
      className: 'btn-group',
      role: 'group'
    }, H.button({
      className: 'btn btn-success',
      onClick: this.handleStartClick,
      disabled: isRunning
    }, this.context.T("Start")), H.button({
      className: 'btn btn-danger',
      onClick: this.handleStopClick,
      disabled: !isRunning
    }, this.context.T("Stop")), H.button({
      className: 'btn btn-default',
      onClick: this.handleResetClick,
      disabled: !this.state.elapsedTicks
    }, this.context.T("Reset")))));
  };

  return TimerComponent;

})(React.Component);
