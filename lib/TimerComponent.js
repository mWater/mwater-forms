"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var PropTypes,
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

    var _integerDiv2 = (0, _slicedToArray2["default"])(_integerDiv, 2);

    minutes = _integerDiv2[0];
    remainder = _integerDiv2[1];

    var _integerDiv3 = integerDiv(remainder, 1000);

    var _integerDiv4 = (0, _slicedToArray2["default"])(_integerDiv3, 2);

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
  var TimerComponent = /*#__PURE__*/function (_React$Component) {
    (0, _inherits2["default"])(TimerComponent, _React$Component);

    var _super = _createSuper(TimerComponent);

    function TimerComponent(props) {
      var _this;

      (0, _classCallCheck2["default"])(this, TimerComponent);
      var ticks;
      _this = _super.call(this, props); // Starts a timer to update @elapsedTicks every 10 ms

      _this.handleStartClick = _this.handleStartClick.bind((0, _assertThisInitialized2["default"])(_this)); // Stops the timer

      _this.handleStopClick = _this.handleStopClick.bind((0, _assertThisInitialized2["default"])(_this)); // Stops timer and resets @elapsedTicks to 0

      _this.handleResetClick = _this.handleResetClick.bind((0, _assertThisInitialized2["default"])(_this));
      ticks = toTicks(props.value);
      _this.state = {
        elapsedTicks: ticks,
        // Tick count
        timerId: null
      };
      return _this;
    }

    (0, _createClass2["default"])(TimerComponent, [{
      key: "componentWillReceiveProps",
      value: function componentWillReceiveProps(nextProps) {
        if (this.state.timerId !== null) {
          // Don't update elapsedTicks if timer is active
          return this.setState({
            elapsedTicks: toTicks(nextProps.value)
          });
        }
      }
    }, {
      key: "handleStartClick",
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
      key: "handleStopClick",
      value: function handleStopClick() {
        boundMethodCheck(this, TimerComponent);
        clearInterval(this.state.timerId); // stop the running timer

        return this.setState({
          timerId: null
        });
      }
    }, {
      key: "handleResetClick",
      value: function handleResetClick() {
        boundMethodCheck(this, TimerComponent);
        clearInterval(this.state.timerId);
        return this.setState({
          elapsedTicks: null,
          timerId: null
        });
      }
    }, {
      key: "render",
      value: function render() {
        var isRunning, timeLeft;
        isRunning = this.state.timerId != null;
        timeLeft = this.props.timer.duration - this.state.elapsedTicks;

        if (timeLeft < 0) {
          timeLeft = null; // To display -- : --
        }

        return R('div', {
          className: 'timer'
        }, R('div', {
          className: "prompt"
        }, formUtils.localizeString(this.props.timer.text, this.context.locale)), this.props.timer.hint ? R('div', {
          className: "text-muted"
        }, formUtils.localizeString(this.props.timer.hint, this.context.locale)) : void 0, R('h1', {
          style: {
            fontFamily: 'monospace'
          }
        }, getDisplayValue(timeLeft)), R('div', {
          className: 'btn-toolbar',
          role: 'toolbar'
        }, R('div', {
          className: 'btn-group',
          role: 'group'
        }, R('button', {
          className: 'btn btn-success',
          onClick: this.handleStartClick,
          disabled: isRunning
        }, this.context.T("Start")), R('button', {
          className: 'btn btn-danger',
          onClick: this.handleStopClick,
          disabled: !isRunning
        }, this.context.T("Stop")), R('button', {
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
    T: PropTypes.func.isRequired,
    // Localizer to use
    locale: PropTypes.string
  };
  TimerComponent.propTypes = {
    timer: PropTypes.object.isRequired // Design of instructions. See schema

  };
  return TimerComponent;
}.call(void 0);