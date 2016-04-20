var GroupComponent, H, InstructionsComponent, ItemListComponent, QuestionComponent, R, React, RosterGroupComponent, RosterMatrixComponent, _, formUtils,
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

module.exports = ItemListComponent = (function(superClass) {
  extend(ItemListComponent, superClass);

  function ItemListComponent() {
    this.renderItem = bind(this.renderItem, this);
    this.handleAnswerChange = bind(this.handleAnswerChange, this);
    return ItemListComponent.__super__.constructor.apply(this, arguments);
  }

  ItemListComponent.propTypes = {
    contents: React.PropTypes.array.isRequired,
    data: React.PropTypes.object,
    parentData: React.PropTypes.object,
    onDataChange: React.PropTypes.func.isRequired,
    onNext: React.PropTypes.func,
    isVisible: React.PropTypes.func.isRequired,
    formExprEvaluator: React.PropTypes.object.isRequired
  };

  ItemListComponent.prototype.validate = function(scrollToFirstInvalid) {
    var foundInvalid, i, item, len, ref, ref1;
    foundInvalid = false;
    ref = this.props.contents;
    for (i = 0, len = ref.length; i < len; i++) {
      item = ref[i];
      if ((ref1 = this.refs[item._id]) != null ? typeof ref1.validate === "function" ? ref1.validate(scrollToFirstInvalid && !foundInvalid) : void 0 : void 0) {
        foundInvalid = true;
      }
    }
    return foundInvalid;
  };

  ItemListComponent.prototype.handleNext = function(index) {
    var ref;
    index++;
    if (index >= this.props.contents.length) {
      return this.props.onNext();
    } else {
      return (ref = this.refs[this.props.contents[index]._id]) != null ? typeof ref.focus === "function" ? ref.focus() : void 0 : void 0;
    }
  };

  ItemListComponent.prototype.handleAnswerChange = function(id, answer) {
    var change;
    change = {};
    change[id] = answer;
    return this.props.onDataChange(_.extend({}, this.props.data, change));
  };

  ItemListComponent.prototype.renderItem = function(item, index) {
    var component;
    if (!this.props.isVisible(item._id) || item.disabled) {
      return null;
    }
    if (formUtils.isQuestion(item)) {
      return component = R(QuestionComponent, {
        key: item._id,
        ref: item._id,
        question: item,
        onAnswerChange: this.handleAnswerChange.bind(null, item._id),
        data: this.props.data,
        parentData: this.props.parentData,
        onNext: this.handleNext.bind(this, index),
        formExprEvaluator: this.props.formExprEvaluator
      });
    } else if (item._type === "Instructions") {
      return R(InstructionsComponent, {
        key: item._id,
        ref: item._id,
        instructions: item,
        data: this.props.data,
        parentData: this.props.parentData,
        formExprEvaluator: this.props.formExprEvaluator
      });
    } else if (item._type === "Group") {
      return R(GroupComponent, {
        key: item._id,
        ref: item._id,
        group: item,
        data: this.props.data,
        parentData: this.props.parentData,
        onDataChange: this.props.onDataChange,
        isVisible: this.props.isVisible,
        formExprEvaluator: this.props.formExprEvaluator,
        onNext: this.handleNext.bind(this, index)
      });
    } else if (item._type === "RosterGroup") {
      return R(RosterGroupComponent, {
        key: item._id,
        ref: item._id,
        rosterGroup: item,
        data: this.props.data,
        onDataChange: this.props.onDataChange,
        isVisible: this.props.isVisible,
        formExprEvaluator: this.props.formExprEvaluator
      });
    } else if (item._type === "RosterMatrix") {
      return R(RosterMatrixComponent, {
        key: item._id,
        ref: item._id,
        rosterMatrix: item,
        data: this.props.data,
        onDataChange: this.props.onDataChange,
        isVisible: this.props.isVisible,
        formExprEvaluator: this.props.formExprEvaluator
      });
    } else {
      throw new Error("Unknown item of type " + item._type);
    }
  };

  ItemListComponent.prototype.render = function() {
    return H.div(null, _.map(this.props.contents, this.renderItem));
  };

  return ItemListComponent;

})(React.Component);
