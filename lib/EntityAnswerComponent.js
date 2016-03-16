var AsyncLoadComponent, EntityAnswerComponent, EntityDisplayComponent, H, React, _,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require('lodash');

React = require('react');

H = React.DOM;

EntityDisplayComponent = require('./EntityDisplayComponent');

AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent');

module.exports = EntityAnswerComponent = (function(superClass) {
  extend(EntityAnswerComponent, superClass);

  function EntityAnswerComponent() {
    this.handleEditEntity = bind(this.handleEditEntity, this);
    this.handleClearEntity = bind(this.handleClearEntity, this);
    this.handleSelectEntity = bind(this.handleSelectEntity, this);
    return EntityAnswerComponent.__super__.constructor.apply(this, arguments);
  }

  EntityAnswerComponent.propTypes = {
    value: React.PropTypes.string,
    entityType: React.PropTypes.string.isRequired,
    onValueChange: React.PropTypes.func.isRequired,
    selectEntity: React.PropTypes.func,
    editEntity: React.PropTypes.func,
    renderEntitySummaryView: React.PropTypes.func.isRequired,
    getEntityById: React.PropTypes.func,
    canEditEntity: React.PropTypes.func
  };

  EntityAnswerComponent.prototype.isLoadNeeded = function(newProps, oldProps) {
    return newProps.entityType !== oldProps.entityType || newProps.value !== oldProps.value;
  };

  EntityAnswerComponent.prototype.load = function(props, prevProps, callback) {
    if (!props.value) {
      callback({
        entity: null
      });
      return;
    }
    return this.props.getEntityById(props.entityType, props.value, (function(_this) {
      return function(entity) {
        return callback({
          entity: entity
        });
      };
    })(this));
  };

  EntityAnswerComponent.prototype.handleSelectEntity = function() {
    if (!this.props.selectEntity) {
      return alert(this.T("Not supported on this platform"));
    }
    return this.props.selectEntity({
      entityType: this.props.entityType,
      callback: (function(_this) {
        return function(value) {
          _this.props.onValueChange(value);
          return _this.loadLinkedAnswers(value);
        };
      })(this)
    });
  };

  EntityAnswerComponent.prototype.handleClearEntity = function() {
    return this.props.onValueChange(null);
  };

  EntityAnswerComponent.prototype.handleEditEntity = function() {
    if (!this.props.editEntity) {
      return alert(this.T("Not supported on this platform"));
    }
    return this.props.editEntity(this.props.entityType, this.props.value, (function(_this) {
      return function() {
        _this.props.onValueChange(null);
        _this.props.onValueChange(value);
        return _this.loadLinkedAnswers(value);
      };
    })(this));
  };

  EntityAnswerComponent.prototype.renderEntityButtons = function() {
    return H.div(null, H.button({
      type: "button",
      className: "btn btn-link btn-sm",
      onClick: this.handleSelectEntity
    }, H.span({
      className: "glyphicon glyphicon-ok"
    }), " ", T("Change Selection")), H.button({
      type: "button",
      className: "btn btn-link btn-sm",
      onClick: this.handleClearEntity
    }, H.span({
      className: "glyphicon glyphicon-remove"
    }), " ", T("Clear Selection")), (this.props.editEntity != null) && this.props.canEditEntity(this.props.entityType, this.state.entity) ? H.button({
      type: "button",
      className: "btn btn-link btn-sm",
      onClick: this.handleEditEntity
    }, H.span({
      className: "glyphicon glyphicon-pencil"
    }), " ", T("Edit Selection")) : void 0);
  };

  EntityAnswerComponent.prototype.render = function() {
    if (this.state.loading) {
      return H.div({
        className: "alert alert-info"
      }, T("Loading..."));
    }
    if (!this.props.value) {
      return H.button({
        type: "button",
        className: "btn btn-default btn-sm",
        onClick: this.handleSelectEntity
      }, H.span({
        className: "glyphicon glyphicon-ok"
      }), " ", T("Select"));
    }
    if (!this.state.entity) {
      return H.div({
        className: "alert alert-danger"
      }, T("Not found"));
    }
    return H.div(null, this.renderEntityButtons(), H.div({
      className: "well well-sm"
    }, this.props.renderEntitySummaryView(this.props.entityType, this.state.entity)));
  };

  return EntityAnswerComponent;

})(AsyncLoadComponent);
