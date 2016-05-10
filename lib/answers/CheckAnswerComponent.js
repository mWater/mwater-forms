var CheckAnswerComponent, H, R, React, formUtils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('../formUtils');

module.exports = CheckAnswerComponent = (function(superClass) {
  extend(CheckAnswerComponent, superClass);

  function CheckAnswerComponent() {
    this.handleValueChange = bind(this.handleValueChange, this);
    return CheckAnswerComponent.__super__.constructor.apply(this, arguments);
  }

  CheckAnswerComponent.contextTypes = {
    locale: React.PropTypes.string
  };

  CheckAnswerComponent.propTypes = {
    value: React.PropTypes.bool,
    onValueChange: React.PropTypes.func.isRequired,
    label: React.PropTypes.object.isRequired
  };

  CheckAnswerComponent.defaultProps = {
    value: false
  };

  CheckAnswerComponent.prototype.focus = function() {
    return this.refs.checkbox.focus();
  };

  CheckAnswerComponent.prototype.handleValueChange = function() {
    return this.props.onValueChange(!this.props.value);
  };

  CheckAnswerComponent.prototype.render = function() {
    return H.div({
      className: "choice touch-checkbox " + (this.props.value ? "checked" : ""),
      onClick: this.handleValueChange,
      ref: 'checkbox'
    }, this.props.children);
  };

  return CheckAnswerComponent;

})(React.Component);
