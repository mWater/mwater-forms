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
    StopwatchAnswerComponent,
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
React = require('react');
R = React.createElement;

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
}; // Creates a stopwatch timer component on the form, can be start/stop/reset


module.exports = StopwatchAnswerComponent = function () {
  var StopwatchAnswerComponent = /*#__PURE__*/function (_React$Component) {
    (0, _inherits2["default"])(StopwatchAnswerComponent, _React$Component);

    var _super = _createSuper(StopwatchAnswerComponent);

    function StopwatchAnswerComponent(props) {
      var _this;

      (0, _classCallCheck2["default"])(this, StopwatchAnswerComponent);
      var ticks;
      _this = _super.call(this, props); // Starts a timer to update @elapsedTicks every 10 ms

      _this.handleStartClick = _this.handleStartClick.bind((0, _assertThisInitialized2["default"])(_this)); // Stops the timer and persists the value

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

    (0, _createClass2["default"])(StopwatchAnswerComponent, [{
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
        boundMethodCheck(this, StopwatchAnswerComponent);
        startTime = now() - (this.state.elapsedTicks || 0); // for restarts we need to fudge the startTime

        update = function update() {
          return _this2.setState({
            elapsedTicks: now() - startTime
          });
        };

        this.setState({
          timerId: setInterval(update, 10) // create a timer and store its id\

        });
        return this.props.onValueChange(null);
      } // Stores the value in seconds

    }, {
      key: "persistValue",
      value: function persistValue(ticks) {
        return this.props.onValueChange(toSeconds(ticks));
      }
    }, {
      key: "handleStopClick",
      value: function handleStopClick() {
        boundMethodCheck(this, StopwatchAnswerComponent);
        clearInterval(this.state.timerId); // stop the running timer

        this.setState({
          timerId: null
        });
        return this.persistValue(this.state.elapsedTicks);
      }
    }, {
      key: "handleResetClick",
      value: function handleResetClick() {
        boundMethodCheck(this, StopwatchAnswerComponent);
        clearInterval(this.state.timerId);
        this.setState({
          elapsedTicks: null,
          timerId: null
        });
        return this.props.onValueChange(null);
      }
    }, {
      key: "render",
      value: function render() {
        var isRunning;
        isRunning = this.state.timerId != null;
        return R('div', {}, R('h1', {
          style: {
            fontFamily: 'monospace'
          }
        }, getDisplayValue(this.state.elapsedTicks)), R('div', {
          className: 'btn-toolbar',
          role: 'toolbar'
        }, R('div', {
          className: 'btn-group',
          role: 'group'
        }, R('button', {
          className: 'btn btn-success',
          onClick: this.handleStartClick,
          disabled: isRunning
        }, this.props.T("Start")), R('button', {
          className: 'btn btn-danger',
          onClick: this.handleStopClick,
          disabled: !isRunning
        }, this.props.T("Stop")), R('button', {
          className: 'btn btn-default',
          onClick: this.handleResetClick,
          disabled: !this.state.elapsedTicks
        }, this.props.T("Reset")))));
      }
    }]);
    return StopwatchAnswerComponent;
  }(React.Component);

  ;
  StopwatchAnswerComponent.propTypes = {
    onValueChange: PropTypes.func.isRequired,
    value: PropTypes.number,
    T: PropTypes.func.isRequired // Localizer to use

  };
  return StopwatchAnswerComponent;
}.call(void 0);