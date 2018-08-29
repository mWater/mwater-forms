'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
    _inherits(TextAnswerComponent, _React$Component);

    function TextAnswerComponent(props) {
      _classCallCheck(this, TextAnswerComponent);

      var _this = _possibleConstructorReturn(this, (TextAnswerComponent.__proto__ || Object.getPrototypeOf(TextAnswerComponent)).call(this, props));

      _this.handleKeyDown = _this.handleKeyDown.bind(_this);
      _this.handleBlur = _this.handleBlur.bind(_this);
      _this.state = {
        text: props.value
      };
      return _this;
    }

    _createClass(TextAnswerComponent, [{
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