var H, R, React, StopwatchAnswerComponent, getDisplayValue, integerDiv, now, toSeconds, toTicks, zeroPad,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

H = React.DOM;

R = React.createElement;

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

module.exports = StopwatchAnswerComponent = (function(superClass) {
  extend(StopwatchAnswerComponent, superClass);

  StopwatchAnswerComponent.propTypes = {
    onValueChange: React.PropTypes.func.isRequired,
    value: React.PropTypes.number
  };

  function StopwatchAnswerComponent(props) {
    this.handleResetClick = bind(this.handleResetClick, this);
    this.handleStopClick = bind(this.handleStopClick, this);
    this.handleStartClick = bind(this.handleStartClick, this);
    var ticks;
    StopwatchAnswerComponent.__super__.constructor.apply(this, arguments);
    ticks = toTicks(props.value);
    this.state = {
      elapsedTicks: ticks,
      timerId: null
    };
  }

  StopwatchAnswerComponent.prototype.componentWillReceiveProps = function(nextProps) {
    if (this.state.timerId !== null) {
      return this.setState({
        elapsedTicks: toTicks(nextProps.value)
      });
    }
  };

  StopwatchAnswerComponent.prototype.handleStartClick = function() {
    var startTime, update;
    startTime = now() - (this.state.elapsedTicks || 0);
    update = (function(_this) {
      return function() {
        return _this.setState({
          elapsedTicks: now() - startTime
        });
      };
    })(this);
    this.setState({
      timerId: setInterval(update, 10)
    });
    return this.props.onValueChange(null);
  };

  StopwatchAnswerComponent.prototype.persistValue = function(ticks) {
    return this.props.onValueChange(toSeconds(ticks));
  };

  StopwatchAnswerComponent.prototype.handleStopClick = function() {
    clearInterval(this.state.timerId);
    this.setState({
      timerId: null
    });
    return this.persistValue(this.state.elapsedTicks);
  };

  StopwatchAnswerComponent.prototype.handleResetClick = function() {
    clearInterval(this.state.timerId);
    this.setState({
      elapsedTicks: null,
      timerId: null
    });
    return this.props.onValueChange(null);
  };

  StopwatchAnswerComponent.prototype.render = function() {
    var isRunning;
    isRunning = this.state.timerId != null;
    return H.div({}, H.h1({
      style: {
        fontFamily: 'monospace'
      }
    }, getDisplayValue(this.state.elapsedTicks)), H.div({
      className: 'btn-toolbar',
      role: 'toolbar'
    }, H.div({
      className: 'btn-group',
      role: 'group'
    }, H.button({
      className: 'btn btn-success',
      onClick: this.handleStartClick,
      disabled: isRunning
    }, "Start"), H.button({
      className: 'btn btn-danger',
      onClick: this.handleStopClick,
      disabled: !isRunning
    }, "Stop"), H.button({
      className: 'btn btn-default',
      onClick: this.handleResetClick,
      disabled: !this.state.elapsedTicks
    }, "Reset"))));
  };

  return StopwatchAnswerComponent;

})(React.Component);
