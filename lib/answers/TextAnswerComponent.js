'use strict';

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var H,
    PropTypes,
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

H = React.DOM;

R = React.createElement;

module.exports = TextAnswerComponent = function () {
  var TextAnswerComponent = function (_React$Component) {
    (0, _inherits3.default)(TextAnswerComponent, _React$Component);

    function TextAnswerComponent(props) {
      (0, _classCallCheck3.default)(this, TextAnswerComponent);

      var _this = (0, _possibleConstructorReturn3.default)(this, (TextAnswerComponent.__proto__ || (0, _getPrototypeOf2.default)(TextAnswerComponent)).call(this, props));

      _this.handleKeyDown = _this.handleKeyDown.bind(_this);
      _this.handleBlur = _this.handleBlur.bind(_this);
      _this.state = {
        text: props.value
      };
      return _this;
    }

    (0, _createClass3.default)(TextAnswerComponent, [{
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        // If different, override text
        if (nextProps.value !== this.props.value) {
          return this.setState({
            text: nextProps.value != null ? nextProps.value : ""
          });
        }
      }
    }, {
      key: 'focus',
      value: function focus() {
        return this.refs.input.focus();
      }
    }, {
      key: 'handleKeyDown',
      value: function handleKeyDown(ev) {
        boundMethodCheck(this, TextAnswerComponent);
        if (this.props.onNextOrComments != null) {
          // When pressing ENTER or TAB
          if (ev.keyCode === 13 || ev.keyCode === 9) {
            this.props.onNextOrComments(ev);
            // It's important to prevent the default behavior when handling tabs (or else the tab is applied after the focus change)
            return ev.preventDefault();
          }
        }
      }
    }, {
      key: 'handleBlur',
      value: function handleBlur(ev) {
        boundMethodCheck(this, TextAnswerComponent);
        return this.props.onValueChange(ev.target.value ? ev.target.value : null);
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        if (this.props.format === "multiline") {
          return H.textarea({
            className: "form-control",
            id: 'input',
            ref: 'input',
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
          return H.input({
            className: "form-control",
            id: 'input',
            ref: 'input',
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
}.call(undefined);