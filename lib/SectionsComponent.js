var H, ItemListComponent, R, React, SectionsComponent, _, formUtils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require('lodash');

React = require('react');

H = React.DOM;

R = React.createElement;

ItemListComponent = require('./ItemListComponent');

formUtils = require('./formUtils');

module.exports = SectionsComponent = (function(superClass) {
  extend(SectionsComponent, superClass);

  SectionsComponent.contextTypes = {
    locale: React.PropTypes.string
  };

  SectionsComponent.propTypes = {
    contents: React.PropTypes.array.isRequired,
    data: React.PropTypes.object,
    onDataChange: React.PropTypes.func.isRequired,
    onSubmit: React.PropTypes.func.isRequired,
    onSaveLater: React.PropTypes.func,
    onDiscard: React.PropTypes.func.isRequired
  };

  function SectionsComponent() {
    this.handleNext = bind(this.handleNext, this);
    this.handleBack = bind(this.handleBack, this);
    this.handleSubmit = bind(this.handleSubmit, this);
    SectionsComponent.__super__.constructor.apply(this, arguments);
    this.state = {
      sectionNum: 0
    };
  }

  SectionsComponent.prototype.handleSubmit = function() {
    return this.props.onSubmit();
  };

  SectionsComponent.prototype.handleBack = function() {
    return this.setState({
      sectionNum: this.state.sectionNum - 1
    });
  };

  SectionsComponent.prototype.handleNext = function() {
    return this.setState({
      sectionNum: this.state.sectionNum + 1
    });
  };

  SectionsComponent.prototype.renderBreadcrumbs = function() {
    return null;
  };

  SectionsComponent.prototype.renderSection = function() {
    var section;
    section = this.props.contents[this.state.sectionNum];
    return H.div({
      key: section._id
    }, H.h3(null, formUtils.localizeString(section.name, this.context.locale)), R(ItemListComponent, {
      contents: section.contents,
      data: this.props.data,
      onDataChange: this.props.onDataChange
    }));
  };

  SectionsComponent.prototype.renderButtons = function() {
    return H.div({
      className: "form-controls"
    }, this.state.sectionNum > 0 ? [
      H.button({
        type: "button",
        className: "btn btn-default",
        onClick: this.handleBack
      }, H.span({
        className: "glyphicon glyphicon-backward"
      }), " " + T("Back")), "\u00A0"
    ] : void 0, this.state.sectionNum < this.props.contents.length - 1 ? H.button({
      type: "button",
      className: "btn btn-primary",
      onClick: this.handleNext
    }, T("Next") + " ", H.span({
      className: "glyphicon glyphicon-forward"
    })) : H.button({
      type: "button",
      className: "btn btn-primary",
      onClick: this.handleSubmit
    }, T("Submit")), "\u00A0", this.props.onSaveLater ? [
      H.button({
        type: "button",
        className: "btn btn-default",
        onClick: this.props.onSaveLater
      }, T("Save for Later")), "\u00A0"
    ] : void 0, H.button({
      type: "button",
      className: "btn btn-default",
      onClick: this.props.onDiscard
    }, H.span({
      className: "glyphicon glyphicon-trash"
    }), " " + T("Discard")));
  };

  SectionsComponent.prototype.render = function() {
    return H.div(null, this.renderBreadcrumbs(), H.div({
      className: "sections"
    }, this.renderSection()), this.renderButtons());
  };

  return SectionsComponent;

})(React.Component);
