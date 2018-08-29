'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var H,
    PropTypes,
    R,
    React,
    TimerComponent,
    _,
    formUtils,
    getDisplayValue,
    integerDiv,
    now,
    toSeconds,
    toTicks,
    zeroPad,
    boundMethodCheck = function boundMethodCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
};

PropTypes = require('prop-types');

_ = require('lodash');

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('./formUtils');

now = function now() {
  return new Date().getTime();
};

toSeconds = function toSeconds(ticks) {
  if (ticks != null) {
    return ticks / 1000;
  } else {
    return null;
  }
};

toTicks = function toTicks(seconds) {
  if (seconds != null) {
    return seconds * 1000;
  } else {
    return null;
  }
};

integerDiv = function integerDiv(dividend, divisor) {
  return [Math.floor(dividend / divisor), dividend % divisor];
};

zeroPad = function zeroPad(val, length) {
  var numPads;
  val += '';
  numPads = length - val.length;
  if (numPads > 0) {
    return new Array(numPads + 1).join('0') + val;
  } else {
    return val;
  }
};

getDisplayValue = function getDisplayValue(ticks) {
  var minutes, remainder, seconds;
  if (ticks != null) {
    var _integerDiv = integerDiv(ticks, 60000);

    var _integerDiv2 = _slicedToArray(_integerDiv, 2);

    minutes = _integerDiv2[0];
    remainder = _integerDiv2[1];

    var _integerDiv3 = integerDiv(remainder, 1000);

    var _integerDiv4 = _slicedToArray(_integerDiv3, 2);

    seconds = _integerDiv4[0];
    remainder = _integerDiv4[1];

    minutes = zeroPad(minutes, 2);
    seconds = zeroPad(seconds, 2);
    return minutes + ":" + seconds;
  } else {
    return "--:--";
  }
};

module.exports = TimerComponent = function () {
  var TimerComponent = function (_React$Component) {
    _inherits(TimerComponent, _React$Component);

    function TimerComponent(props) {
      _classCallCheck(this, TimerComponent);

      var ticks;

      // Starts a timer to update @elapsedTicks every 10 ms
      var _this = _possibleConstructorReturn(this, (TimerComponent.__proto__ || Object.getPrototypeOf(TimerComponent)).call(this, props));

      _this.handleStartClick = _this.handleStartClick.bind(_this);

      // Stops the timer
      _this.handleStopClick = _this.handleStopClick.bind(_this);
      // Stops timer and resets @elapsedTicks to 0
      _this.handleResetClick = _this.handleResetClick.bind(_this);
      ticks = toTicks(props.value);
      _this.state = {
        elapsedTicks: ticks, // Tick count
        timerId: null
      };
      return _this;
    }

    _createClass(TimerComponent, [{
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        if (this.state.timerId !== null) {
          // Don't update elapsedTicks if timer is active
          return this.setState({
            elapsedTicks: toTicks(nextProps.value)
          });
        }
      }
    }, {
      key: 'handleStartClick',
      value: function handleStartClick() {
        var _this2 = this;

        var startTime, update;
        boundMethodCheck(this, TimerComponent);
        startTime = now() - (this.state.elapsedTicks || 0); // for restarts we need to fudge the startTime
        update = function update() {
          return _this2.setState({
            elapsedTicks: now() - startTime
          });
        };
        return this.setState({
          timerId: setInterval(update, 10) // create a timer and store its id\
        });
      }
    }, {
      key: 'handleStopClick',
      value: function handleStopClick() {
        boundMethodCheck(this, TimerComponent);
        clearInterval(this.state.timerId); // stop the running timer
        return this.setState({
          timerId: null
        });
      }
    }, {
      key: 'handleResetClick',
      value: function handleResetClick() {
        boundMethodCheck(this, TimerComponent);
        clearInterval(this.state.timerId);
        return this.setState({
          elapsedTicks: null,
          timerId: null
        });
      }
    }, {
      key: 'render',
      value: function render() {
        var isRunning, timeLeft;
        isRunning = this.state.timerId != null;
        timeLeft = this.props.timer.duration - this.state.elapsedTicks;
        if (timeLeft < 0) {
          timeLeft = null; // To display -- : --
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
      }
    }]);

    return TimerComponent;
  }(React.Component);

  ;

  TimerComponent.contextTypes = {
    T: PropTypes.func.isRequired, // Localizer to use
    locale: PropTypes.string
  };

  TimerComponent.propTypes = {
    timer: PropTypes.object.isRequired // Design of instructions. See schema
  };

  return TimerComponent;
}.call(undefined);