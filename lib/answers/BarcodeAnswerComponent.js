'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BarcodeAnswerComponent,
    H,
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

H = React.DOM;

R = React.createElement;

formUtils = require('../formUtils');

// Functional? I haven't tried this one yet
// Not tested
module.exports = BarcodeAnswerComponent = function () {
  var BarcodeAnswerComponent = function (_React$Component) {
    _inherits(BarcodeAnswerComponent, _React$Component);

    function BarcodeAnswerComponent() {
      _classCallCheck(this, BarcodeAnswerComponent);

      var _this = _possibleConstructorReturn(this, (BarcodeAnswerComponent.__proto__ || Object.getPrototypeOf(BarcodeAnswerComponent)).apply(this, arguments));

      _this.handleValueChange = _this.handleValueChange.bind(_this);
      _this.handleScanClick = _this.handleScanClick.bind(_this);
      _this.handleClearClick = _this.handleClearClick.bind(_this);
      return _this;
    }

    _createClass(BarcodeAnswerComponent, [{
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
          return H.div(null, H.pre(null, H.p(null, this.props.value)), H.div(null, H.button({
            className: "btn btn-default",
            onClick: this.handleClearClick,
            type: "button"
          }, H.span({
            className: "glyphicon glyphicon-remove"
          }, this.context.T("Clear")))));
        } else {
          if (supported) {
            return H.div(null, H.button({
              className: "btn btn-default",
              onClick: this.handleScanClick,
              type: "button"
            }, H.span({
              className: "glyphicon glyphicon-qrcode"
            }), this.context.T("Scan")));
          } else {
            return H.div({
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