var AdminRegionSelectComponent, DemoComponent, FormComponent, H, R, React, ReactDOM, formCtx, sampleFormDesign,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

ReactDOM = require('react-dom');

R = React.createElement;

H = React.DOM;

AdminRegionSelectComponent = require('./AdminRegionSelectComponent');

FormComponent = require('./FormComponent');

sampleFormDesign = require('./sampleFormDesign');

global.T = function(str) {
  return str;
};

formCtx = {};

DemoComponent = (function(superClass) {
  extend(DemoComponent, superClass);

  function DemoComponent() {
    DemoComponent.__super__.constructor.apply(this, arguments);
    this.state = {
      design: sampleFormDesign,
      data: {}
    };
  }

  DemoComponent.prototype.render = function() {
    return R(FormComponent, {
      formCtx: formCtx,
      design: this.state.design,
      data: this.state.data,
      onDataChange: (function(_this) {
        return function(data) {
          return _this.setState({
            data: data
          });
        };
      })(this),
      onSubmit: (function(_this) {
        return function() {
          return alert("Submit");
        };
      })(this),
      onSaveLater: (function(_this) {
        return function() {
          return alert("SaveLater");
        };
      })(this),
      onDiscard: (function(_this) {
        return function() {
          return alert("Discard");
        };
      })(this)
    });
  };

  return DemoComponent;

})(React.Component);

$(function() {
  return ReactDOM.render(R(DemoComponent), document.getElementById("main"));
});
