"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var NumberAnswerComponent, PropTypes, R, React, _, ui;

PropTypes = require('prop-types');
_ = require('lodash');
React = require('react');
R = React.createElement;
ui = require('react-library/lib/bootstrap'); // Number input component that handles parsing and maintains state when number is invalid

module.exports = NumberAnswerComponent = function () {
  var NumberAnswerComponent =
  /*#__PURE__*/
  function (_React$Component) {
    (0, _inherits2["default"])(NumberAnswerComponent, _React$Component);

    function NumberAnswerComponent() {
      (0, _classCallCheck2["default"])(this, NumberAnswerComponent);
      return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(NumberAnswerComponent).apply(this, arguments));
    }

    (0, _createClass2["default"])(NumberAnswerComponent, [{
      key: "focus",
      value: function focus() {
        var ref;
        return (ref = this.input) != null ? ref.focus() : void 0;
      }
    }, {
      key: "validate",
      value: function validate() {
        if (!this.input.isValid()) {
          return "Invalid number";
        }

        return null;
      }
    }, {
      key: "render",
      value: function render() {
        var _this = this;

        return R(ui.NumberInput, {
          ref: function ref(c) {
            return _this.input = c;
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
    style: PropTypes.object,
    // Will be merged with style of input box
    small: PropTypes.bool,
    // True to render with input-sm
    onNextOrComments: PropTypes.func
  };
  return NumberAnswerComponent;
}.call(void 0);