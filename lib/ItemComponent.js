var H, InstructionsComponent, ItemComponent, QuestionComponent, R, React, RosterGroupComponent, RosterMatrixComponent, _, formUtils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require('lodash');

React = require('react');

H = React.DOM;

R = React.createElement;

QuestionComponent = require('./QuestionComponent');

InstructionsComponent = require('./InstructionsComponent');

RosterGroupComponent = require('./RosterGroupComponent');

RosterMatrixComponent = require('./RosterMatrixComponent');

formUtils = require('./formUtils');

module.exports = ItemComponent = (function(superClass) {
  extend(ItemComponent, superClass);

  function ItemComponent() {
    this.handleAnswerChange = bind(this.handleAnswerChange, this);
    return ItemComponent.__super__.constructor.apply(this, arguments);
  }

  ItemComponent.propTypes = {
    item: React.PropTypes.object.isRequired,
    data: React.PropTypes.object,
    onDataChange: React.PropTypes.func.isRequired
  };

  ItemComponent.prototype.handleAnswerChange = function(id, answer) {
    var change;
    change = {};
    change[id] = answer;
    return this.props.onDataChange(_.extend({}, this.props.data, change));
  };

  ItemComponent.prototype.render = function() {
    if (formUtils.isQuestion(this.props.item)) {
      return R(QuestionComponent, {
        question: this.props.item,
        answer: this.props.data[this.props.item._id],
        onAnswerChange: this.handleAnswerChange.bind(null, this.props.item._id)
      });
    } else if (this.props.item._type === "Instructions") {
      return R(InstructionsComponent, {
        instructions: this.props.item
      });
    } else if (this.props.item._type === "RosterGroup") {
      return R(RosterGroupComponent, {
        rosterGroup: this.props.item,
        answer: this.props.data[this.props.item.rosterId],
        onAnswerChange: this.handleAnswerChange.bind(null, this.props.item.rosterId)
      });
    } else if (this.props.item._type === "RosterMatrix") {
      return R(RosterMatrixComponent, {
        rosterMatrix: this.props.item,
        answer: this.props.data[this.props.item.rosterId],
        onAnswerChange: this.handleAnswerChange.bind(null, this.props.item.rosterId)
      });
    } else {
      return H.div(null, "TODO: " + this.props.item._type);
    }
  };

  return ItemComponent;

})(React.Component);
