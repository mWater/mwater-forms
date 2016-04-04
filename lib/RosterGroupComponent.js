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
    this.handleRemove = bind(this.handleRemove, this);
    this.handleAdd = bind(this.handleAdd, this);
    this.handleDataChange = bind(this.handleDataChange, this);
    return RosterGroupComponent.__super__.constructor.apply(this, arguments);
  }

  RosterGroupComponent.contextTypes = {
    locale: React.PropTypes.string,
    isVisible: React.PropTypes.func.isRequired
  };

  RosterGroupComponent.propTypes = {
    rosterGroup: React.PropTypes.object.isRequired,
    answer: React.PropTypes.arrayOf(React.PropTypes.object.isRequired),
    onAnswerChange: React.PropTypes.func.isRequired
  };

  RosterGroupComponent.prototype.handleDataChange = function(index, data) {
    var answer;
    answer = (this.props.answer || []).slice();
    answer[index] = data;
    return this.props.onAnswerChange(answer);
  };

  RosterGroupComponent.prototype.handleAdd = function() {
    var answer;
    answer = (this.props.answer || []).slice();
    answer.push({});
    return this.props.onAnswerChange(answer);
  };

  RosterGroupComponent.prototype.handleRemove = function(index) {
    var answer;
    answer = (this.props.answer || []).slice();
    answer.splice(index, 1);
    return this.props.onAnswerChange(answer);
  };

  RosterGroupComponent.prototype.scrollToInvalid = function(alreadyFoundFirst) {
    return false;
  };

  RosterGroupComponent.prototype.renderName = function() {
    return H.h4({
      key: "prompt"
    }, formUtils.localizeString(this.props.rosterGroup.name, this.context.locale));
  };

  RosterGroupComponent.prototype.renderEntry = function(entry, index) {
    var ItemListComponent;
    ItemListComponent = require('./ItemListComponent');
    return H.div({
      key: index,
      className: "panel panel-default"
    }, H.div({
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
      contents: this.props.rosterGroup.contents,
      data: this.props.answer[index],
      onDataChange: this.handleDataChange.bind(null, index)
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
      }), " " + T("Add")));
    }
  };

  RosterGroupComponent.prototype.render = function() {
    return H.div({
      style: {
        padding: 5,
        marginBottom: 20
      }
    }, this.renderName(), _.map(this.props.answer, (function(_this) {
      return function(entry, index) {
        return _this.renderEntry(entry, index);
      };
    })(this)), !this.props.answer || this.props.answer.length === 0 ? H.div({
      style: {
        paddingLeft: 20
      }
    }, H.i(null, T("None"))) : void 0, this.renderAdd());
  };

  return RosterGroupComponent;

})(React.Component);
