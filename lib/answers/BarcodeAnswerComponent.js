"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var BarcodeAnswerComponent,
    PropTypes,
    R,
    React,
    formUtils,
    boundMethodCheck = function boundMethodCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
};

PropTypes = require('prop-types');
React = require('react');
R = React.createElement;
formUtils = require('../formUtils'); // Functional? I haven't tried this one yet
// Not tested

module.exports = BarcodeAnswerComponent = function () {
  var BarcodeAnswerComponent = /*#__PURE__*/function (_React$Component) {
    (0, _inherits2["default"])(BarcodeAnswerComponent, _React$Component);

    var _super = _createSuper(BarcodeAnswerComponent);

    function BarcodeAnswerComponent() {
      var _this;

      (0, _classCallCheck2["default"])(this, BarcodeAnswerComponent);
      _this = _super.apply(this, arguments);
      _this.handleValueChange = _this.handleValueChange.bind((0, _assertThisInitialized2["default"])(_this));
      _this.handleScanClick = _this.handleScanClick.bind((0, _assertThisInitialized2["default"])(_this));
      _this.handleClearClick = _this.handleClearClick.bind((0, _assertThisInitialized2["default"])(_this));
      return _this;
    }

    (0, _createClass2["default"])(BarcodeAnswerComponent, [{
      key: "focus",
      value: function focus() {
        // Nothing to focus
        return null;
      }
    }, {
      key: "handleValueChange",
      value: function handleValueChange() {
        boundMethodCheck(this, BarcodeAnswerComponent);
        return this.props.onValueChange(!this.props.value);
      }
    }, {
      key: "handleScanClick",
      value: function handleScanClick() {
        var _this2 = this;

        boundMethodCheck(this, BarcodeAnswerComponent);
        return this.context.scanBarcode({
          success: function success(text) {
            return _this2.props.onValueChange(text);
          }
        });
      }
    }, {
      key: "handleClearClick",
      value: function handleClearClick() {
        boundMethodCheck(this, BarcodeAnswerComponent);
        return this.props.onValueChange(null);
      }
    }, {
      key: "render",
      value: function render() {
        var supported;
        supported = this.context.scanBarcode != null;

        if (this.props.value) {
          return R('div', null, R('pre', null, R('p', null, this.props.value)), R('div', null, R('button', {
            className: "btn btn-default",
            onClick: this.handleClearClick,
            type: "button"
          }, R('span', {
            className: "glyphicon glyphicon-remove"
          }, this.context.T("Clear")))));
        } else {
          if (supported) {
            return R('div', null, R('button', {
              className: "btn btn-default",
              onClick: this.handleScanClick,
              type: "button"
            }, R('span', {
              className: "glyphicon glyphicon-qrcode"
            }), this.context.T("Scan")));
          } else {
            return R('div', {
              className: "text-warning"
            }, this.context.T("Barcode scanning not supported on this platform"));
          }
        }
      }
    }]);
    return BarcodeAnswerComponent;
  }(React.Component);

  ;
  BarcodeAnswerComponent.contextTypes = {
    scanBarcode: PropTypes.func,
    T: PropTypes.func.isRequired // Localizer to use

  };
  BarcodeAnswerComponent.propTypes = {
    value: PropTypes.string,
    onValueChange: PropTypes.func.isRequired
  };
  return BarcodeAnswerComponent;
}.call(void 0);