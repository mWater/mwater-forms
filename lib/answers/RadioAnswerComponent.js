var H, PropTypes, R, RadioAnswerComponent, React, conditionUtils, formUtils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

PropTypes = require('prop-types');

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('../formUtils');

conditionUtils = require('../conditionUtils');

module.exports = RadioAnswerComponent = (function(superClass) {
  extend(RadioAnswerComponent, superClass);

  function RadioAnswerComponent() {
    this.handleSpecifyChange = bind(this.handleSpecifyChange, this);
    this.handleValueChange = bind(this.handleValueChange, this);
    return RadioAnswerComponent.__super__.constructor.apply(this, arguments);
  }

  RadioAnswerComponent.contextTypes = {
    locale: PropTypes.string
  };

  RadioAnswerComponent.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.object.isRequired,
      hint: PropTypes.object,
      specify: PropTypes.bool
    })).isRequired,
    onAnswerChange: PropTypes.func.isRequired,
    answer: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired
  };

  RadioAnswerComponent.prototype.focus = function() {
    return null;
  };

  RadioAnswerComponent.prototype.handleValueChange = function(choice) {
    if (choice.id === this.props.answer.value) {
      return this.props.onAnswerChange({
        value: null,
        specify: null
      });
    } else {
      return this.props.onAnswerChange({
        value: choice.id,
        specify: null
      });
    }
  };

  RadioAnswerComponent.prototype.handleSpecifyChange = function(id, ev) {
    var change, specify;
    change = {};
    change[id] = ev.target.value;
    specify = _.extend({}, this.props.answer.specify, change);
    return this.props.onAnswerChange({
      value: this.props.answer.value,
      specify: specify
    });
  };

  RadioAnswerComponent.prototype.renderSpecify = function(choice) {
    var value;
    if (this.props.answer.specify != null) {
      value = this.props.answer.specify[choice.id];
    } else {
      value = '';
    }
    return H.input({
      className: "form-control specify-input",
      type: "text",
      value: value,
      onChange: this.handleSpecifyChange.bind(null, choice.id)
    });
  };

  RadioAnswerComponent.prototype.areConditionsValid = function(choice) {
    if (choice.conditions == null) {
      return true;
    }
    return conditionUtils.compileConditions(choice.conditions)(this.props.data);
  };

  RadioAnswerComponent.prototype.renderChoice = function(choice) {
    if (this.areConditionsValid(choice)) {
      return H.div({
        key: choice.id
      }, H.div({
        className: "touch-radio " + (this.props.answer.value === choice.id ? "checked" : ""),
        id: choice.id,
        onClick: this.handleValueChange.bind(null, choice)
      }, formUtils.localizeString(choice.label, this.context.locale), choice.hint ? H.span({
        className: "radio-choice-hint"
      }, " " + formUtils.localizeString(choice.hint, this.context.locale)) : void 0), choice.specify && this.props.answer.value === choice.id ? this.renderSpecify(choice) : void 0);
    }
  };

  RadioAnswerComponent.prototype.render = function() {
    return H.div({
      className: "touch-radio-group"
    }, _.map(this.props.choices, (function(_this) {
      return function(choice) {
        return _this.renderChoice(choice);
      };
    })(this)));
  };

  return RadioAnswerComponent;

})(React.Component);
