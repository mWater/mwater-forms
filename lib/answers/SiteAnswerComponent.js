var EntityDisplayComponent, H, R, React, SiteAnswerComponent, formUtils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('../formUtils');

EntityDisplayComponent = require('../EntityDisplayComponent');

module.exports = SiteAnswerComponent = (function(superClass) {
  extend(SiteAnswerComponent, superClass);

  function SiteAnswerComponent() {
    this.handleChange = bind(this.handleChange, this);
    this.handleSelectClick = bind(this.handleSelectClick, this);
    this.handleKeyDown = bind(this.handleKeyDown, this);
    return SiteAnswerComponent.__super__.constructor.apply(this, arguments);
  }

  SiteAnswerComponent.contextTypes = {
    selectEntity: React.PropTypes.func,
    getEntityById: React.PropTypes.func,
    getEntityByCode: React.PropTypes.func,
    renderEntitySummaryView: React.PropTypes.func,
    T: React.PropTypes.func.isRequired
  };

  SiteAnswerComponent.propTypes = {
    value: React.PropTypes.object,
    onValueChange: React.PropTypes.func.isRequired,
    siteTypes: React.PropTypes.array
  };

  SiteAnswerComponent.prototype.focus = function() {
    return this.refs.input.focus();
  };

  SiteAnswerComponent.prototype.handleKeyDown = function(ev) {
    if (this.props.onNextOrComments != null) {
      if (ev.keyCode === 13 || ev.keyCode === 9) {
        this.props.onNextOrComments(ev);
        return ev.preventDefault();
      }
    }
  };

  SiteAnswerComponent.prototype.getEntityType = function() {
    var entityType, siteType;
    siteType = (this.props.siteTypes ? this.props.siteTypes[0] : void 0) || "Water point";
    entityType = siteType.toLowerCase().replace(new RegExp(' ', 'g'), "_");
    return entityType;
  };

  SiteAnswerComponent.prototype.handleSelectClick = function() {
    var entityType;
    entityType = this.getEntityType();
    return this.context.selectEntity({
      entityType: entityType,
      callback: (function(_this) {
        return function(entityId) {
          return _this.context.getEntityById(entityType, entityId, function(entity) {
            return _this.props.onValueChange({
              code: entity.code
            });
          });
        };
      })(this)
    });
  };

  SiteAnswerComponent.prototype.handleChange = function(ev) {
    if (ev.target.value) {
      return this.props.onValueChange({
        code: ev.target.value
      });
    } else {
      return this.props.onValueChange(null);
    }
  };

  SiteAnswerComponent.prototype.render = function() {
    var ref, ref1;
    return H.div(null, H.div({
      className: "input-group"
    }, H.input({
      type: "tel",
      className: "form-control",
      onKeyDown: this.handleKeyDown,
      ref: 'input',
      value: ((ref = this.props.value) != null ? ref.code : void 0) || "",
      onChange: this.handleChange
    }), H.span({
      className: "input-group-btn"
    }, H.button({
      className: "btn btn-default",
      disabled: this.context.selectEntity == null,
      type: "button",
      onClick: this.handleSelectClick
    }, this.context.T("Select")))), H.br(), R(EntityDisplayComponent, {
      displayInWell: true,
      entityType: this.getEntityType(),
      entityCode: (ref1 = this.props.value) != null ? ref1.code : void 0
    }));
  };

  return SiteAnswerComponent;

})(React.Component);
