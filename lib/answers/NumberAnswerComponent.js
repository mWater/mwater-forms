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

var H, NumberAnswerComponent, PropTypes, R, React, _, ui;

PropTypes = require('prop-types');

_ = require('lodash');

React = require('react');

R = React.createElement;

H = React.DOM;

ui = require('react-library/lib/bootstrap');

// Number input component that handles parsing and maintains state when number is invalid
module.exports = NumberAnswerComponent = function () {
  var NumberAnswerComponent = function (_React$Component) {
    (0, _inherits3.default)(NumberAnswerComponent, _React$Component);

    function NumberAnswerComponent() {
      (0, _classCallCheck3.default)(this, NumberAnswerComponent);
      return (0, _possibleConstructorReturn3.default)(this, (NumberAnswerComponent.__proto__ || (0, _getPrototypeOf2.default)(NumberAnswerComponent)).apply(this, arguments));
    }

    (0, _createClass3.default)(NumberAnswerComponent, [{
      key: 'focus',
      value: function focus() {
        var ref;
        return (ref = this.input) != null ? ref.focus() : void 0;
      }
    }, {
      key: 'validate',
      value: function validate() {
        if (!this.input.isValid()) {
          return "Invalid number";
        }
        return null;
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        return R(ui.NumberInput, {
          ref: function ref(c) {
            return _this2.input = c;
          },
          decimal: this.props.decimal,
          value: this.props.value,
          onChange: this.props.onChange,
          size: this.props.small ? "sm" : void 0,
          onTab: this.props.onNextOrComments,
          onEnter: this.props.onNextOrComments
        });
      }
    }]);
    return NumberAnswerComponent;
  }(React.Component);

  ;

  NumberAnswerComponent.propTypes = {
    decimal: PropTypes.bool.isRequired,
    value: PropTypes.number,
    onChange: PropTypes.func,
    style: PropTypes.object, // Will be merged with style of input box
    small: PropTypes.bool, // True to render with input-sm
    onNextOrComments: PropTypes.func
  };

  return NumberAnswerComponent;
}.call(undefined);