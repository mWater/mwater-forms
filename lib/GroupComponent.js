var GroupComponent, H, R, React, _, formUtils,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require('lodash');

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('./formUtils');

module.exports = GroupComponent = (function(superClass) {
  extend(GroupComponent, superClass);

  function GroupComponent() {
    return GroupComponent.__super__.constructor.apply(this, arguments);
  }

  GroupComponent.contextTypes = {
    locale: React.PropTypes.string
  };

  GroupComponent.propTypes = {
    group: React.PropTypes.object.isRequired,
    data: React.PropTypes.object,
    onDataChange: React.PropTypes.func.isRequired,
    isVisible: React.PropTypes.func.isRequired
  };

  GroupComponent.prototype.validate = function(scrollToFirstInvalid) {
    return this.refs.itemlist.validate(scrollToFirstInvalid);
  };

  GroupComponent.prototype.render = function() {
    var ItemListComponent;
    ItemListComponent = require('./ItemListComponent');
    return H.div({
      className: "panel panel-default"
    }, H.div({
      key: "header",
      className: "panel-heading"
    }, formUtils.localizeString(this.props.group.name, this.context.locale)), H.div({
      key: "body",
      className: "panel-body"
    }, R(ItemListComponent, {
      ref: "itemlist",
      contents: this.props.group.contents,
      data: this.props.data,
      onDataChange: this.props.onDataChange,
      isVisible: this.props.isVisible
    })));
  };

  return GroupComponent;

})(React.Component);
