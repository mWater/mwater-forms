var H, NumberInputComponent, React, _,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require('lodash');

React = require('react');

H = React.DOM;

module.exports = NumberInputComponent = (function(superClass) {
  extend(NumberInputComponent, superClass);

  function NumberInputComponent() {
    this.handleBlur = bind(this.handleBlur, this);
    NumberInputComponent.__super__.constructor.apply(this, arguments);
    this.state = {
      inputText: this.props.value != null ? "" + this.props.value : ""
    };
  }

  NumberInputComponent.propTypes = {
    decimal: React.PropTypes.bool.isRequired,
    value: React.PropTypes.number,
    onChange: React.PropTypes.func.isRequired,
    style: React.PropTypes.object,
    small: React.PropTypes.bool
  };

  NumberInputComponent.prototype.componentWillReceiveProps = function(nextProps) {
    if (nextProps.value !== this.props.value) {
      return this.setState({
        inputText: nextProps.value != null ? "" + nextProps.value : ""
      });
    }
  };

  NumberInputComponent.prototype.handleBlur = function() {
    var val;
    if (this.isValid()) {
      val = this.props.decimal ? parseFloat(this.state.inputText) : parseInt(this.state.inputText);
      if (isNaN(val)) {
        return this.props.onChange(null);
      } else {
        return this.props.onChange(val);
      }
    }
  };

  NumberInputComponent.prototype.isValid = function() {
    if (this.state.inputText.length === 0) {
      return true;
    }
    if (this.props.decimal) {
      return this.state.inputText.match(/^-?[0-9]*\.?[0-9]+$/) && !isNaN(parseFloat(this.state.inputText));
    } else {
      return this.state.inputText.match(/^-?\d+$/);
    }
  };

  NumberInputComponent.prototype.render = function() {
    var style;
    style = _.clone(this.props.style || {});
    if (!this.isValid()) {
      style.borderColor = "#a94442";
      style.boxShadow = "inset 0 1px 1px rgba(0,0,0,.075)";
      style.backgroundColor = "rgba(132, 53, 52, 0.12)";
    }
    return H.input({
      type: "text",
      className: "form-control " + (this.props.small ? "input-sm" : ""),
      style: style,
      value: this.state.inputText,
      onChange: (function(_this) {
        return function(ev) {
          return _this.setState({
            inputText: ev.target.value
          });
        };
      })(this),
      onBlur: this.handleBlur
    });
  };

  return NumberInputComponent;

})(React.Component);
