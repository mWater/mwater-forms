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

  SiteAnswerComponent.contextTypes = {
    selectEntity: React.PropTypes.func,
    getEntityById: React.PropTypes.func,
    getEntityByCode: React.PropTypes.func,
    renderEntitySummaryView: React.PropTypes.func,
    onNextOrComments: React.PropTypes.func
  };

  SiteAnswerComponent.propTypes = {
    value: React.PropTypes.object,
    onValueChange: React.PropTypes.func.isRequired,
    siteTypes: React.PropTypes.array
  };

  SiteAnswerComponent.defaultProps = {
    value: false
  };

  function SiteAnswerComponent(props) {
    this.handleSelectClick = bind(this.handleSelectClick, this);
    this.handleKeyDown = bind(this.handleKeyDown, this);
    SiteAnswerComponent.__super__.constructor.apply(this, arguments);
    this.state = {
      shownEntity: false
    };
  }

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
    entityType = siteType.toLowerCase().replace(' ', "_");
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
            _this.props.onValueChange({
              code: entity.code
            });
            return _this.setState({
              shownEntityCode: entity.code
            });
          });
        };
      })(this)
    });
  };

  SiteAnswerComponent.prototype.renderEntityDisplayComponent = function() {
    var entityType, formCtx;
    entityType = this.getEntityType();
    formCtx = {
      getEntityById: this.context.getEntityById,
      getEntityByCode: this.context.getEntityByCode,
      renderEntitySummaryView: this.context.renderEntitySummaryView
    };
    return R(EntityDisplayComponent, {
      formCtx: formCtx,
      displayInWell: true,
      entityCode: this.state.shownEntityCode,
      entityType: entityType
    });
  };

  SiteAnswerComponent.prototype.render = function() {
    return H.div(null, H.div({
      className: "input-group"
    }, H.input({
      id: "input",
      type: "tel",
      className: "form-control",
      onKeyDown: this.handleKeyDown,
      ref: 'input'
    }), H.span({
      className: "input-group-btn"
    }, H.button({
      className: "btn btn-default",
      disabled: this.context.selectEntity == null,
      type: "button",
      onClick: this.handleSelectClick
    }, T("Select")))), H.br(), this.state.shownEntityCode ? this.renderEntityDisplayComponent() : void 0);
  };

  return SiteAnswerComponent;

})(React.Component);
