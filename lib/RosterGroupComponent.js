var H, R, React, RosterGroupComponent, _, formUtils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require('lodash');

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('./formUtils');

module.exports = RosterGroupComponent = (function(superClass) {
  extend(RosterGroupComponent, superClass);

  function RosterGroupComponent() {
    this.isChildVisible = bind(this.isChildVisible, this);
    this.handleRemove = bind(this.handleRemove, this);
    this.handleAdd = bind(this.handleAdd, this);
    this.handleEntryDataChange = bind(this.handleEntryDataChange, this);
    this.handleAnswerChange = bind(this.handleAnswerChange, this);
    return RosterGroupComponent.__super__.constructor.apply(this, arguments);
  }

  RosterGroupComponent.contextTypes = {
    locale: React.PropTypes.string,
    T: React.PropTypes.func.isRequired
  };

  RosterGroupComponent.propTypes = {
    rosterGroup: React.PropTypes.object.isRequired,
    data: React.PropTypes.object,
    onDataChange: React.PropTypes.func.isRequired,
    isVisible: React.PropTypes.func.isRequired,
    formExprEvaluator: React.PropTypes.object.isRequired
  };

  RosterGroupComponent.prototype.getAnswerId = function() {
    return this.props.rosterGroup.rosterId || this.props.rosterGroup._id;
  };

  RosterGroupComponent.prototype.getAnswer = function() {
    return this.props.data[this.getAnswerId()] || [];
  };

  RosterGroupComponent.prototype.handleAnswerChange = function(answer) {
    var change;
    change = {};
    change[this.getAnswerId()] = answer;
    return this.props.onDataChange(_.extend({}, this.props.data, change));
  };

  RosterGroupComponent.prototype.handleEntryDataChange = function(index, data) {
    var answer;
    answer = this.getAnswer().slice();
    answer[index] = _.extend({}, answer[index], {
      data: data
    });
    return this.handleAnswerChange(answer);
  };

  RosterGroupComponent.prototype.handleAdd = function() {
    var answer;
    answer = this.getAnswer().slice();
    answer.push({
      _id: formUtils.createUid(),
      data: {}
    });
    return this.handleAnswerChange(answer);
  };

  RosterGroupComponent.prototype.handleRemove = function(index) {
    var answer;
    answer = this.getAnswer().slice();
    answer.splice(index, 1);
    return this.handleAnswerChange(answer);
  };

  RosterGroupComponent.prototype.validate = function(scrollToFirstInvalid) {
    var entry, foundInvalid, i, index, len, ref;
    foundInvalid = false;
    ref = this.getAnswer();
    for (index = i = 0, len = ref.length; i < len; index = ++i) {
      entry = ref[index];
      foundInvalid = foundInvalid || this.refs["itemlist_" + index].validate(scrollToFirstInvalid);
    }
    return foundInvalid;
  };

  RosterGroupComponent.prototype.isChildVisible = function(index, id) {
    return this.props.isVisible((this.getAnswerId()) + "." + index + "." + id);
  };

  RosterGroupComponent.prototype.renderName = function() {
    return H.h4({
      key: "prompt"
    }, formUtils.localizeString(this.props.rosterGroup.name, this.context.locale));
  };

  RosterGroupComponent.prototype.renderEntryTitle = function(entry, index) {
    return this.props.formExprEvaluator.renderString(this.props.rosterGroup.entryTitle, this.props.rosterGroup.entryTitleExprs, this.getAnswer()[index].data, this.props.data, this.context.locale);
  };

  RosterGroupComponent.prototype.renderEntry = function(entry, index) {
    var ItemListComponent;
    ItemListComponent = require('./ItemListComponent');
    return H.div({
      key: index,
      className: "panel panel-default"
    }, H.div({
      key: "header",
      className: "panel-heading",
      style: {
        fontWeight: "bold"
      }
    }, (index + 1) + ". ", this.renderEntryTitle(entry, index)), H.div({
      key: "body",
      className: "panel-body"
    }, this.props.rosterGroup.allowRemove ? H.button({
      type: "button",
      style: {
        float: "right"
      },
      className: "btn btn-sm btn-link",
      onClick: this.handleRemove.bind(null, index)
    }, H.span({
      className: "glyphicon glyphicon-remove"
    })) : void 0, R(ItemListComponent, {
      ref: "itemlist_" + index,
      contents: this.props.rosterGroup.contents,
      data: this.getAnswer()[index].data,
      parentData: this.props.data,
      onDataChange: this.handleEntryDataChange.bind(null, index),
      isVisible: this.isChildVisible.bind(null, index),
      formExprEvaluator: this.props.formExprEvaluator
    })));
  };

  RosterGroupComponent.prototype.renderAdd = function() {
    if (this.props.rosterGroup.allowAdd) {
      return H.div({
        key: "add"
      }, H.button({
        type: "button",
        className: "btn btn-default btn-sm",
        onClick: this.handleAdd
      }, H.span({
        className: "glyphicon glyphicon-plus"
      }), " " + this.context.T("Add")));
    }
  };

  RosterGroupComponent.prototype.render = function() {
    return H.div({
      style: {
        padding: 5,
        marginBottom: 20
      }
    }, this.renderName(), _.map(this.getAnswer(), (function(_this) {
      return function(entry, index) {
        return _this.renderEntry(entry, index);
      };
    })(this)), this.getAnswer().length === 0 ? H.div({
      style: {
        paddingLeft: 20
      }
    }, H.i(null, this.context.T("None"))) : void 0, this.renderAdd());
  };

  return RosterGroupComponent;

})(React.Component);
