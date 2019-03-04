"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var DateAnswerComponent,
    DateTimePickerComponent,
    PropTypes,
    R,
    React,
    formUtils,
    moment,
    boundMethodCheck = function boundMethodCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
};

PropTypes = require('prop-types');
React = require('react');
R = React.createElement;
formUtils = require('../formUtils');
moment = require('moment');
DateTimePickerComponent = require('../DateTimePickerComponent');

module.exports = DateAnswerComponent = function () {
  var DateAnswerComponent =
  /*#__PURE__*/
  function (_React$Component) {
    (0, _inherits2.default)(DateAnswerComponent, _React$Component);

    function DateAnswerComponent(props) {
      var _this;

      (0, _classCallCheck2.default)(this, DateAnswerComponent);
      _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(DateAnswerComponent).call(this, props));
      _this.componentWillReceiveProps = _this.componentWillReceiveProps.bind((0, _assertThisInitialized2.default)(_this));
      _this.updateState = _this.updateState.bind((0, _assertThisInitialized2.default)(_this));
      _this.handleKeyDown = _this.handleKeyDown.bind((0, _assertThisInitialized2.default)(_this));
      _this.handleChange = _this.handleChange.bind((0, _assertThisInitialized2.default)(_this));

      _this.updateState(props);

      return _this;
    }

    (0, _createClass2.default)(DateAnswerComponent, [{
      key: "componentWillReceiveProps",
      value: function componentWillReceiveProps(nextProps) {
        boundMethodCheck(this, DateAnswerComponent);
        return this.updateState(nextProps);
      }
    }, {
      key: "updateState",
      value: function updateState(props) {
        var detailLevel, format, isoFormat, placeholder;
        boundMethodCheck(this, DateAnswerComponent);
        format = props.format;
        isoFormat = null;

        if (format.match(/ss|LLL|lll/)) {
          detailLevel = 5;
        } else if (format.match(/m/)) {
          detailLevel = 4;
        } else if (format.match(/h|H/)) {
          detailLevel = 3;
        } else if (format.match(/D|l|L/)) {
          detailLevel = 2;
          isoFormat = "YYYY-MM-DD";
        } else if (format.match(/M/)) {
          detailLevel = 1;
          isoFormat = "YYYY-MM";
        } else if (format.match(/Y/)) {
          detailLevel = 0;
          isoFormat = "YYYY";
        } else {
          throw new Error("Invalid format: " + format);
        } // Set placeholder if not set


        placeholder = null;

        if (props.placeholder != null) {
          placeholder = props.placeholder;
        } else {
          // Can't set for full dates
          if (!format.match(/l|L/)) {
            placeholder = format;
          } else {
            placeholder = '...';
          }
        }

        if (this.state) {
          return this.setState({
            detailLevel: detailLevel,
            isoFormat: isoFormat,
            placeholder: placeholder
          });
        } else {
          // This is a weird lifecycle quirk of it being called on the constructor
          return this.state = {
            detailLevel: detailLevel,
            isoFormat: isoFormat,
            placeholder: placeholder
          };
        }
      }
    }, {
      key: "focus",
      value: function focus() {
        var datetimepicker;
        datetimepicker = this.datetimepicker;

        if (datetimepicker.focus != null) {
          return datetimepicker.focus();
        }
      }
    }, {
      key: "handleKeyDown",
      value: function handleKeyDown(ev) {
        boundMethodCheck(this, DateAnswerComponent);

        if (this.props.onNextOrComments != null) {
          // When pressing ENTER or TAB
          if (ev.keyCode === 13 || ev.keyCode === 9) {
            this.props.onNextOrComments(ev); // It's important to prevent the default behavior when handling tabs (or else the tab is applied after the focus change)

            return ev.preventDefault();
          }
        }
      }
    }, {
      key: "handleChange",
      value: function handleChange(date) {
        boundMethodCheck(this, DateAnswerComponent); // Get date

        if (!date) {
          this.props.onValueChange(null);
          return;
        } // Get iso format (if date, use format to avoid timezone wrapping)


        if (this.state.isoFormat) {
          date = date.format(this.isoFormat);
        } else {
          date = date.toISOString();
        } // Trim to detail level


        switch (this.state.detailLevel) {
          case 0:
            date = date.substring(0, 4);
            break;

          case 1:
            date = date.substring(0, 7);
            break;

          case 2:
            date = date.substring(0, 10);
            break;

          case 3:
            date = date.substring(0, 13) + "Z";
            break;

          case 4:
            date = date.substring(0, 16) + "Z";
            break;

          case 5:
            date = date.substring(0, 19) + "Z";
            break;

          default:
            throw new Error("Invalid detail level");
        }

        return this.props.onValueChange(date);
      }
    }, {
      key: "render",
      value: function render() {
        var _this2 = this;

        var value;
        value = this.props.value;

        if (value) {
          if (this.state.isoFormat) {
            value = moment(value, this.state.isoFormat);
          } else {
            value = moment(value, moment.ISO_8601);
          }
        }

        return R(DateTimePickerComponent, {
          ref: function ref(c) {
            return _this2.datetimepicker = c;
          },
          onChange: this.handleChange,
          date: value,
          format: this.props.format,
          placeholder: this.state.placeholder,
          showTodayButton: true,
          showClear: true,
          onKeyDown: this.handleKeyDown
        });
      }
    }]);
    return DateAnswerComponent;
  }(React.Component);

  ;
  DateAnswerComponent.propTypes = {
    value: PropTypes.string,
    onValueChange: PropTypes.func.isRequired,
    format: PropTypes.string,
    placeholder: PropTypes.string,
    onNextOrComments: PropTypes.func
  };
  DateAnswerComponent.defaultProps = {
    format: "YYYY-MM-DD"
  };
  return DateAnswerComponent;
}.call(void 0);