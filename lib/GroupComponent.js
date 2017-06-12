var GroupComponent, H, PropTypes, R, React, _, formUtils,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

PropTypes = require('prop-types');

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
    locale: PropTypes.string
  };

  GroupComponent.propTypes = {
    group: PropTypes.object.isRequired,
    data: PropTypes.object,
    responseRow: PropTypes.object,
    onDataChange: PropTypes.func.isRequired,
    isVisible: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
    schema: PropTypes.object.isRequired
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
      responseRow: this.props.responseRow,
      onDataChange: this.props.onDataChange,
      isVisible: this.props.isVisible,
      onNext: this.props.onNext,
      schema: this.props.schema
    })));
  };

  return GroupComponent;

})(React.Component);
