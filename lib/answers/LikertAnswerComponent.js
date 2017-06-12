var H, LikertAnswerComponent, PropTypes, R, React, formUtils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

PropTypes = require('prop-types');

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('../formUtils');

module.exports = LikertAnswerComponent = (function(superClass) {
  extend(LikertAnswerComponent, superClass);

  function LikertAnswerComponent() {
    this.handleValueChange = bind(this.handleValueChange, this);
    return LikertAnswerComponent.__super__.constructor.apply(this, arguments);
  }

  LikertAnswerComponent.contextTypes = {
    locale: PropTypes.string
  };

  LikertAnswerComponent.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.object.isRequired,
      hint: PropTypes.object
    })).isRequired,
    choices: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.object.isRequired,
      hint: PropTypes.object
    })).isRequired,
    onAnswerChange: PropTypes.func.isRequired,
    answer: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired
  };

  LikertAnswerComponent.prototype.focus = function() {
    return null;
  };

  LikertAnswerComponent.prototype.handleValueChange = function(choice, item) {
    var newValue;
    if (this.props.answer.value != null) {
      newValue = _.clone(this.props.answer.value);
    } else {
      newValue = {};
    }
    if (newValue[item.id] === choice.id) {
      delete newValue[item.id];
    } else {
      newValue[item.id] = choice.id;
    }
    return this.props.onAnswerChange(_.extend({}, this.props.answer, {
      value: newValue
    }));
  };

  LikertAnswerComponent.prototype.renderChoice = function(item, choice) {
    var id, value;
    id = item.id + ":" + choice.id;
    if (this.props.answer.value != null) {
      value = this.props.answer.value[item.id];
    } else {
      value = null;
    }
    return H.td({
      key: id
    }, H.div({
      className: "touch-radio " + (value === choice.id ? "checked" : ""),
      id: id,
      onClick: this.handleValueChange.bind(null, choice, item)
    }, formUtils.localizeString(choice.label, this.context.locale)));
  };

  LikertAnswerComponent.prototype.renderItem = function(item) {
    return H.tr(null, H.td(null, H.b(null, formUtils.localizeString(item.label, this.context.locale)), item.hint ? H.div(null, H.span({
      className: "",
      style: {
        color: '#888'
      }
    }, formUtils.localizeString(item.hint, this.context.locale))) : void 0), _.map(this.props.choices, (function(_this) {
      return function(choice) {
        return _this.renderChoice(item, choice);
      };
    })(this)));
  };

  LikertAnswerComponent.prototype.render = function() {
    return H.table({
      className: "",
      style: {
        width: '100%'
      }
    }, H.tbody(null, _.map(this.props.items, (function(_this) {
      return function(item) {
        return _this.renderItem(item);
      };
    })(this))));
  };

  return LikertAnswerComponent;

})(React.Component);
