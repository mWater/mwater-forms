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

formUtils = require('../formUtils');

// Functional? I haven't tried this one yet
// Not tested
module.exports = BarcodeAnswerComponent = function () {
  var BarcodeAnswerComponent = function (_React$Component) {
    (0, _inherits3.default)(BarcodeAnswerComponent, _React$Component);

    function BarcodeAnswerComponent() {
      (0, _classCallCheck3.default)(this, BarcodeAnswerComponent);

      var _this = (0, _possibleConstructorReturn3.default)(this, (BarcodeAnswerComponent.__proto__ || (0, _getPrototypeOf2.default)(BarcodeAnswerComponent)).apply(this, arguments));

      _this.handleValueChange = _this.handleValueChange.bind(_this);
      _this.handleScanClick = _this.handleScanClick.bind(_this);
      _this.handleClearClick = _this.handleClearClick.bind(_this);
      return _this;
    }

    (0, _createClass3.default)(BarcodeAnswerComponent, [{
      key: 'focus',
      value: function focus() {
        // Nothing to focus
        return null;
      }
    }, {
      key: 'handleValueChange',
      value: function handleValueChange() {
        boundMethodCheck(this, BarcodeAnswerComponent);
        return this.props.onValueChange(!this.props.value);
      }
    }, {
      key: 'handleScanClick',
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
      key: 'handleClearClick',
      value: function handleClearClick() {
        boundMethodCheck(this, BarcodeAnswerComponent);
        return this.props.onValueChange(null);
      }
    }, {
      key: 'render',
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
}.call(undefined);