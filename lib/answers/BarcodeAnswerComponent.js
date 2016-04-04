var BarcodeAnswerComponent, H, R, React, formUtils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('../formUtils');

module.exports = BarcodeAnswerComponent = (function(superClass) {
  extend(BarcodeAnswerComponent, superClass);

  function BarcodeAnswerComponent() {
    this.handleClearClick = bind(this.handleClearClick, this);
    this.handleScanClick = bind(this.handleScanClick, this);
    this.handleValueChange = bind(this.handleValueChange, this);
    return BarcodeAnswerComponent.__super__.constructor.apply(this, arguments);
  }

  BarcodeAnswerComponent.contextTypes = {
    locale: React.PropTypes.string,
    scanBarcode: React.PropTypes.func
  };

  BarcodeAnswerComponent.propTypes = {
    value: React.PropTypes.string,
    onValueChange: React.PropTypes.func.isRequired
  };

  BarcodeAnswerComponent.prototype.focus = function() {
    return null;
  };

  BarcodeAnswerComponent.prototype.handleValueChange = function() {
    return this.props.onValueChange(!this.props.value);
  };

  BarcodeAnswerComponent.prototype.handleScanClick = function() {
    return this.context.scanBarcode({
      success: (function(_this) {
        return function(text) {
          return _this.props.onValueChange(text);
        };
      })(this)
    });
  };

  BarcodeAnswerComponent.prototype.handleClearClick = function() {
    return this.props.onValueChange(null);
  };

  BarcodeAnswerComponent.prototype.render = function() {
    var supported;
    supported = this.context.scanBarcode != null;
    if (this.props.value) {
      return H.div(null, H.pre(null, H.p(null, this.props.value)), H.div(null, H.button({
        className: "btn btn-default",
        onClick: this.handleClearClick,
        type: "button"
      }, H.span({
        className: "glyphicon glyphicon-remove"
      }, T("Clear")))));
    } else {
      if (supported) {
        return H.div(null, H.button({
          className: "btn btn-default",
          onClick: this.handleScanClick,
          type: "button"
        }, H.span({
          className: "glyphicon glyphicon-qrcode"
        }), T("Scan")));
      } else {
        return H.div({
          className: "text-warning"
        }, T("Barcode scanning not supported on this platform"));
      }
    }
  };

  return BarcodeAnswerComponent;

})(React.Component);
