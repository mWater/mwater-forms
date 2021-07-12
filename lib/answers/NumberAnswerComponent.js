"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var NumberAnswerComponent, PropTypes, R, React, _, ui;

PropTypes = require('prop-types');
_ = require('lodash');
React = require('react');
R = React.createElement;
ui = require('react-library/lib/bootstrap'); // Number input component that handles parsing and maintains state when number is invalid

module.exports = NumberAnswerComponent = function () {
  var NumberAnswerComponent = /*#__PURE__*/function (_React$Component) {
    (0, _inherits2["default"])(NumberAnswerComponent, _React$Component);

    var _super = _createSuper(NumberAnswerComponent);

    function NumberAnswerComponent() {
      (0, _classCallCheck2["default"])(this, NumberAnswerComponent);
      return _super.apply(this, arguments);
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