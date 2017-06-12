var H, NumberAnswerComponent, PropTypes, R, React, _, ui,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

PropTypes = require('prop-types');

_ = require('lodash');

React = require('react');

R = React.createElement;

H = React.DOM;

ui = require('react-library/lib/bootstrap');

module.exports = NumberAnswerComponent = (function(superClass) {
  extend(NumberAnswerComponent, superClass);

  function NumberAnswerComponent() {
    return NumberAnswerComponent.__super__.constructor.apply(this, arguments);
  }

  NumberAnswerComponent.propTypes = {
    decimal: PropTypes.bool.isRequired,
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    style: PropTypes.object,
    small: PropTypes.bool,
    onNextOrComments: PropTypes.func
  };

  NumberAnswerComponent.prototype.focus = function() {
    var ref;
    return (ref = this.input) != null ? ref.focus() : void 0;
  };

  NumberAnswerComponent.prototype.render = function() {
    return R(ui.NumberInput, {
      ref: function(c) {
        return this.input = c;
      },
      decimal: this.props.decimal,
      value: this.props.value,
      onChange: this.props.onChange,
      size: this.props.small ? "sm" : void 0,
      onTab: this.props.onNextOrComments,
      onEnter: this.props.onNextOrComments
    });
  };

  return NumberAnswerComponent;

})(React.Component);
