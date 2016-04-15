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
    isVisible: React.PropTypes.func.isRequired,
    formExprEvaluator: React.PropTypes.object.isRequired,
    onSubmit: React.PropTypes.func.isRequired,
    onSaveLater: React.PropTypes.func,
    onDiscard: React.PropTypes.func.isRequired
  };

  function SectionsComponent() {
    this.handleBreadcrumbClick = bind(this.handleBreadcrumbClick, this);
    this.handleNext = bind(this.handleNext, this);
    this.handleBack = bind(this.handleBack, this);
    this.handleSubmit = bind(this.handleSubmit, this);
    SectionsComponent.__super__.constructor.apply(this, arguments);
    this.state = {
      sectionNum: 0
    };
  }

  SectionsComponent.prototype.handleSubmit = function() {
    if (!this.refs.itemListComponent.validate(true)) {
      return this.props.onSubmit();
    }
  };

  SectionsComponent.prototype.hasPrevious = function() {
    return this.nextVisibleIndex(this.state.sectionNum - 1, -1) !== -1;
  };

  SectionsComponent.prototype.hasNext = function() {
    return this.nextVisibleIndex(this.state.sectionNum + 1, 1) !== -1;
  };

  SectionsComponent.prototype.nextVisibleIndex = function(index, increment) {
    var isVisible, section;
    if (index < 0) {
      return -1;
    }
    if (index >= this.props.contents.length) {
      return -1;
    }
    section = this.props.contents[index];
    isVisible = this.props.isVisible(section._id);
    if (isVisible) {
      return index;
    } else {
      return this.nextVisibleIndex(index + increment, increment);
    }
  };

  SectionsComponent.prototype.handleBack = function() {
    var previousVisibleIndex;
    previousVisibleIndex = this.nextVisibleIndex(this.state.sectionNum - 1, -1);
    if (previousVisibleIndex !== -1) {
      return this.setState({
        sectionNum: previousVisibleIndex
      });
    }
  };

  SectionsComponent.prototype.handleNext = function() {
    var nextVisibleIndex;
    nextVisibleIndex = this.nextVisibleIndex(this.state.sectionNum + 1, 1);
    if (nextVisibleIndex !== -1) {
      return this.setState({
        sectionNum: nextVisibleIndex
      });
    }
  };

  SectionsComponent.prototype.handleBreadcrumbClick = function(index) {
    return this.setState({
      sectionNum: index
    });
  };

  SectionsComponent.prototype.renderBreadcrumbs = function() {
    var breadcrumbs, currentSectionName, index, section, visible;
    breadcrumbs = [];
    index = 0;
    while (index < this.state.sectionNum) {
      section = this.props.contents[index];
      visible = this.props.isVisible(section._id);
      breadcrumbs.push(H.li({
        key: index
      }, H.b(null, visible ? H.a({
        className: "section-crumb",
        disabled: !visible,
        onClick: this.handleBreadcrumbClick.bind(this, index)
      }, (index + 1) + ".") : (index + 1) + ".")));
      index++;
    }
    currentSectionName = this.props.contents[this.state.sectionNum].name;
    currentSectionName = currentSectionName[currentSectionName._base];
    breadcrumbs.push(H.li({
      key: this.state.sectionNum
    }, H.b(null, (this.state.sectionNum + 1) + ". " + currentSectionName)));
    return H.ul({
      className: "breadcrumb"
    }, breadcrumbs);
  };

  SectionsComponent.prototype.renderSection = function() {
    var section;
    section = this.props.contents[this.state.sectionNum];
    return H.div({
      key: section._id
    }, H.h3(null, formUtils.localizeString(section.name, this.context.locale)), R(ItemListComponent, {
      ref: 'itemListComponent',
      contents: section.contents,
      data: this.props.data,
      onDataChange: this.props.onDataChange,
      isVisible: this.props.isVisible,
      formExprEvaluator: this.props.formExprEvaluator
    }));
  };

  SectionsComponent.prototype.renderButtons = function() {
    return H.div({
      className: "form-controls"
    }, this.hasPrevious() ? [
      H.button({
        key: "back",
        type: "button",
        className: "btn btn-default",
        onClick: this.handleBack
      }, H.span({
        className: "glyphicon glyphicon-backward"
      }), " " + T("Back")), "\u00A0"
    ] : void 0, this.hasNext() ? H.button({
      key: "next",
      type: "button",
      className: "btn btn-primary",
      onClick: this.handleNext
    }, T("Next") + " ", H.span({
      className: "glyphicon glyphicon-forward"
    })) : H.button({
      key: "submit",
      type: "button",
      className: "btn btn-primary",
      onClick: this.handleSubmit
    }, T("Submit")), "\u00A0", this.props.onSaveLater ? [
      H.button({
        key: "saveLater",
        type: "button",
        className: "btn btn-default",
        onClick: this.props.onSaveLater
      }, T("Save for Later")), "\u00A0"
    ] : void 0, H.button({
      key: "discard",
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
