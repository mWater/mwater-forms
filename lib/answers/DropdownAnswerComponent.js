var DropdownAnswerComponent, H, PropTypes, R, React, conditionUtils, formUtils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

PropTypes = require('prop-types');

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('../formUtils');

conditionUtils = require('../conditionUtils');

module.exports = DropdownAnswerComponent = (function(superClass) {
  extend(DropdownAnswerComponent, superClass);

  function DropdownAnswerComponent() {
    this.handleSpecifyChange = bind(this.handleSpecifyChange, this);
    this.handleValueChange = bind(this.handleValueChange, this);
    return DropdownAnswerComponent.__super__.constructor.apply(this, arguments);
  }

  DropdownAnswerComponent.contextTypes = {
    locale: PropTypes.string
  };

  DropdownAnswerComponent.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.object.isRequired,
      hint: PropTypes.object,
      specify: PropTypes.bool,
      choice: PropTypes.array
    })).isRequired,
    onAnswerChange: PropTypes.func.isRequired,
    answer: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired
  };

  DropdownAnswerComponent.prototype.focus = function() {
    var ref;
    return (ref = this.refs.select) != null ? ref.focus() : void 0;
  };

  DropdownAnswerComponent.prototype.handleValueChange = function(ev) {
    if ((ev.target.value != null) && ev.target.value !== '') {
      return this.props.onAnswerChange({
        value: ev.target.value,
        specify: null
      });
    } else {
      return this.props.onAnswerChange({
        value: null,
        specify: null
      });
    }
  };

  DropdownAnswerComponent.prototype.handleSpecifyChange = function(id, ev) {
    var change, specify;
    change = {};
    change[id] = ev.target.value;
    specify = _.extend({}, this.props.answer.specify, change);
    return this.props.onAnswerChange({
      value: this.props.answer.value,
      specify: specify
    });
  };

  DropdownAnswerComponent.prototype.renderSpecify = function() {
    var choice, value;
    choice = _.findWhere(this.props.choices, {
      id: this.props.answer.value
    });
    if (choice && choice.specify && (this.props.answer.specify != null)) {
      value = this.props.answer.specify[choice.id];
    } else {
      value = '';
    }
    if (choice && choice.specify) {
      return H.input({
        className: "form-control specify-input",
        type: "text",
        value: value,
        onChange: this.handleSpecifyChange.bind(null, choice.id)
      });
    }
  };

  DropdownAnswerComponent.prototype.areConditionsValid = function(choice) {
    if (choice.conditions == null) {
      return true;
    }
    return conditionUtils.compileConditions(choice.conditions)(this.props.data);
  };

  DropdownAnswerComponent.prototype.render = function() {
    return H.div(null, H.select({
      className: "form-control",
      style: {
        width: "auto"
      },
      value: this.props.answer.value,
      onChange: this.handleValueChange,
      ref: 'select'
    }, H.option({
      key: "__none__",
      value: ""
    }), _.map(this.props.choices, (function(_this) {
      return function(choice) {
        var text;
        if (_this.areConditionsValid(choice)) {
          text = formUtils.localizeString(choice.label, _this.context.locale);
          if (choice.hint) {
            text += " (" + formUtils.localizeString(choice.hint, _this.context.locale) + ")";
          }
          return H.option({
            key: choice.id,
            value: choice.id
          }, text);
        }
      };
    })(this))), this.renderSpecify());
  };

  return DropdownAnswerComponent;

})(React.Component);
