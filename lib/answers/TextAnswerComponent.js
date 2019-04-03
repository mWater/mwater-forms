"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var PropTypes,
    R,
    React,
    TextAnswerComponent,
    boundMethodCheck = function boundMethodCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
};

PropTypes = require('prop-types');
React = require('react');
R = React.createElement;

module.exports = TextAnswerComponent = function () {
  var TextAnswerComponent =
  /*#__PURE__*/
  function (_React$Component) {
    (0, _inherits2["default"])(TextAnswerComponent, _React$Component);

    function TextAnswerComponent(props) {
      var _this;

      (0, _classCallCheck2["default"])(this, TextAnswerComponent);
      _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(TextAnswerComponent).call(this, props));
      _this.handleKeyDown = _this.handleKeyDown.bind((0, _assertThisInitialized2["default"])(_this));
      _this.handleBlur = _this.handleBlur.bind((0, _assertThisInitialized2["default"])(_this));
      _this.state = {
        text: props.value
      };
      return _this;
    }

    (0, _createClass2["default"])(TextAnswerComponent, [{
      key: "componentWillReceiveProps",
      value: function componentWillReceiveProps(nextProps) {
        // If different, override text
        if (nextProps.value !== this.props.value) {
          return this.setState({
            text: nextProps.value != null ? nextProps.value : ""
          });
        }
      }
    }, {
      key: "focus",
      value: function focus() {
        return this.input.focus();
      }
    }, {
      key: "handleKeyDown",
      value: function handleKeyDown(ev) {
        boundMethodCheck(this, TextAnswerComponent);

        if (this.props.onNextOrComments != null) {
          // When pressing ENTER or TAB
          if (ev.keyCode === 13 || ev.keyCode === 9) {
            this.props.onNextOrComments(ev); // It's important to prevent the default behavior when handling tabs (or else the tab is applied after the focus change)

            return ev.preventDefault();
          }
        }
      }
    }, {
      key: "handleBlur",
      value: function handleBlur(ev) {
        boundMethodCheck(this, TextAnswerComponent);
        return this.props.onValueChange(ev.target.value ? ev.target.value : null);
      }
    }, {
      key: "render",
      value: function render() {
        var _this2 = this;

        if (this.props.format === "multiline") {
          return R('textarea', {
            className: "form-control",
            id: 'input',
            ref: function ref(c) {
              return _this2.input = c;
            },
            value: this.state.text || "",
            rows: "5",
            readOnly: this.props.readOnly,
            onBlur: this.handleBlur,
            onChange: function onChange(ev) {
              return _this2.setState({
                text: ev.target.value
              });
            }
          });
        } else {
          return R('input', {
            className: "form-control",
            id: 'input',
            ref: function ref(c) {
              return _this2.input = c;
            },
            type: "text",
            value: this.state.text || "",
            readOnly: this.props.readOnly,
            onKeyDown: this.handleKeyDown,
            onBlur: this.handleBlur,
            onChange: function onChange(ev) {
              return _this2.setState({
                text: ev.target.value
              });
            }
          });
        }
      }
    }]);
    return TextAnswerComponent;
  }(React.Component);

  ;
  TextAnswerComponent.propTypes = {
    value: PropTypes.string,
    format: PropTypes.string.isRequired,
    readOnly: PropTypes.bool,
    onValueChange: PropTypes.func.isRequired,
    onNextOrComments: PropTypes.func
  };
  TextAnswerComponent.defaultProps = {
    readOnly: false
  };
  return TextAnswerComponent;
}.call(void 0);