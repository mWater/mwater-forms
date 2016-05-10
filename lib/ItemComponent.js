var GroupComponent, H, InstructionsComponent, ItemComponent, QuestionComponent, R, React, RosterGroupComponent, RosterMatrixComponent, _, formUtils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require('lodash');

React = require('react');

H = React.DOM;

R = React.createElement;

QuestionComponent = require('./QuestionComponent');

InstructionsComponent = require('./InstructionsComponent');

GroupComponent = require('./GroupComponent');

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
    data: React.PropTypes.object.isRequired,
    onDataChange: React.PropTypes.func.isRequired,
    onNext: React.PropTypes.func,
    isVisible: React.PropTypes.func.isRequired,
    formExprEvaluator: React.PropTypes.object.isRequired
  };

  ItemComponent.prototype.handleAnswerChange = function(id, answer) {
    var change;
    change = {};
    change[id] = answer;
    return this.props.onDataChange(_.extend({}, this.props.data, change));
  };

  ItemComponent.prototype.validate = function(scrollToFirstInvalid) {
    if ((this.refs.item != null) && (this.refs.item.validate != null)) {
      return this.refs.item.validate(scrollToFirstInvalid);
    }
    return false;
  };

  ItemComponent.prototype.focus = function() {
    var ref;
    if (((ref = this.refs.item) != null ? ref.focus : void 0) != null) {
      return this.refs.item.focus();
    }
    return false;
  };

  ItemComponent.prototype.render = function() {
    if (formUtils.isQuestion(this.props.item)) {
      return R(QuestionComponent, {
        ref: 'item',
        question: this.props.item,
        onAnswerChange: this.handleAnswerChange.bind(null, this.props.item._id),
        data: this.props.data,
        onNext: this.props.onNext,
        formExprEvaluator: this.props.formExprEvaluator
      });
    } else if (this.props.item._type === "Instructions") {
      return R(InstructionsComponent, {
        ref: 'item',
        instructions: this.props.item,
        data: this.props.data,
        formExprEvaluator: this.props.formExprEvaluator
      });
    } else if (this.props.item._type === "Group") {
      return R(GroupComponent, {
        ref: 'item',
        group: this.props.item,
        data: this.props.data,
        onDataChange: this.props.onDataChange,
        isVisible: this.props.isVisible,
        formExprEvaluator: this.props.formExprEvaluator,
        onNext: this.props.onNext
      });
    } else if (this.props.item._type === "RosterGroup") {
      return R(RosterGroupComponent, {
        ref: 'item',
        rosterGroup: this.props.item,
        data: this.props.data,
        onDataChange: this.props.onDataChange,
        isVisible: this.props.isVisible,
        formExprEvaluator: this.props.formExprEvaluator
      });
    } else if (this.props.item._type === "RosterMatrix") {
      return R(RosterMatrixComponent, {
        ref: 'item',
        rosterMatrix: this.props.item,
        data: this.props.data,
        onDataChange: this.props.onDataChange,
        isVisible: this.props.isVisible,
        formExprEvaluator: this.props.formExprEvaluator
      });
    } else {
      throw new Error("Unknown item of type " + this.props.item._type);
    }
  };

  return ItemComponent;

})(React.Component);
