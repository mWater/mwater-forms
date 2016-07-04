var EntityDisplayComponent, H, R, React, SiteColumnAnswerComponent, formUtils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

H = React.DOM;

R = React.createElement;

EntityDisplayComponent = require('../EntityDisplayComponent');

formUtils = require('../formUtils');

module.exports = SiteColumnAnswerComponent = (function(superClass) {
  extend(SiteColumnAnswerComponent, superClass);

  function SiteColumnAnswerComponent() {
    this.handleClearClick = bind(this.handleClearClick, this);
    this.handleSelectClick = bind(this.handleSelectClick, this);
    return SiteColumnAnswerComponent.__super__.constructor.apply(this, arguments);
  }

  SiteColumnAnswerComponent.contextTypes = {
    selectEntity: React.PropTypes.func,
    getEntityById: React.PropTypes.func.isRequired,
    getEntityByCode: React.PropTypes.func.isRequired,
    renderEntityListItemView: React.PropTypes.func.isRequired,
    T: React.PropTypes.func.isRequired
  };

  SiteColumnAnswerComponent.propTypes = {
    value: React.PropTypes.object,
    onValueChange: React.PropTypes.func.isRequired,
    siteType: React.PropTypes.string.isRequired
  };

  SiteColumnAnswerComponent.prototype.handleSelectClick = function() {
    return this.context.selectEntity({
      entityType: this.props.siteType,
      callback: (function(_this) {
        return function(entityId) {
          return _this.context.getEntityById(_this.props.siteType, entityId, function(entity) {
            return _this.props.onValueChange({
              code: entity.code
            });
          });
        };
      })(this)
    });
  };

  SiteColumnAnswerComponent.prototype.handleClearClick = function() {
    return this.props.onValueChange(null);
  };

  SiteColumnAnswerComponent.prototype.render = function() {
    var ref, ref1;
    if ((ref = this.props.value) != null ? ref.code : void 0) {
      return H.div(null, H.button({
        className: "btn btn-link pull-right",
        onClick: this.handleClearClick
      }, H.span({
        className: "glyphicon glyphicon-remove"
      })), R(EntityDisplayComponent, {
        entityType: this.props.siteType,
        entityCode: (ref1 = this.props.value) != null ? ref1.code : void 0,
        getEntityByCode: this.context.getEntityByCode,
        renderEntityView: this.context.renderEntityListItemView,
        T: this.context.T
      }));
    } else {
      return H.button({
        className: "btn btn-link",
        onClick: this.handleSelectClick
      }, this.context.T("Select..."));
    }
  };

  return SiteColumnAnswerComponent;

})(React.Component);
