var AsyncLoadComponent, EntityAnswerComponent, EntityDisplayComponent, EntityQuestion, H, Question, React, ReactDOM, _,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Question = require('./Question');

_ = require('lodash');

React = require('react');

ReactDOM = require('react-dom');

H = React.DOM;

EntityDisplayComponent = require('./EntityDisplayComponent');

AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent');

module.exports = EntityQuestion = (function(superClass) {
  extend(EntityQuestion, superClass);

  function EntityQuestion() {
    this.shouldBeVisible = bind(this.shouldBeVisible, this);
    this.editEntity = bind(this.editEntity, this);
    this.clearEntity = bind(this.clearEntity, this);
    this.selectEntity = bind(this.selectEntity, this);
    this.loadLinkedAnswers = bind(this.loadLinkedAnswers, this);
    return EntityQuestion.__super__.constructor.apply(this, arguments);
  }

  EntityQuestion.prototype.events = {
    'click #change_entity_button': 'selectEntity',
    'click #select_entity_button': 'selectEntity',
    'click #clear_entity_button': 'clearEntity',
    'click #edit_entity_button': 'editEntity'
  };

  EntityQuestion.prototype.loadLinkedAnswers = function(entityId) {
    return this.ctx.getEntityById(this.options.entityType, entityId, (function(_this) {
      return function(entity) {
        if (entity && _this.options.loadLinkedAnswers) {
          return _this.options.loadLinkedAnswers(entity);
        }
      };
    })(this));
  };

  EntityQuestion.prototype.selectEntity = function() {
    if (!this.ctx.selectEntity) {
      return alert(this.T("Not supported on this platform"));
    }
    return this.ctx.selectEntity({
      entityType: this.options.entityType,
      filter: this.options.entityFilter,
      callback: (function(_this) {
        return function(entityId) {
          _this.setAnswerValue(entityId);
          return _this.loadLinkedAnswers(entityId);
        };
      })(this)
    });
  };

  EntityQuestion.prototype.clearEntity = function() {
    return this.setAnswerValue(null);
  };

  EntityQuestion.prototype.editEntity = function() {
    var entityId;
    if (!this.ctx.editEntity) {
      return alert(this.T("Not supported on this platform"));
    }
    entityId = this.getAnswerValue();
    return this.ctx.editEntity(this.options.entityType, entityId, (function(_this) {
      return function() {
        _this.setAnswerValue(null);
        _this.setAnswerValue(entityId);
        return _this.loadLinkedAnswers(entityId);
      };
    })(this));
  };

  EntityQuestion.prototype.shouldBeVisible = function() {
    if (this.options.hidden) {
      return false;
    }
    return EntityQuestion.__super__.shouldBeVisible.call(this);
  };

  EntityQuestion.prototype.updateAnswer = function(answerEl) {
    var elem, entityId;
    this.answerEl = answerEl;
    if (this.ctx.getEntityById == null) {
      elem = H.div({
        className: "text-warning"
      }, this.T("Not supported on this platform"));
    } else {
      entityId = this.getAnswerValue();
      elem = React.createElement(EntityAnswerComponent, {
        entityType: this.options.entityType,
        entityId: entityId,
        onSelectEntity: this.selectEntity,
        onClearEntity: this.clearEntity,
        onEditEntity: this.editEntity,
        formCtx: this.ctx,
        T: this.T
      });
    }
    return ReactDOM.render(elem, answerEl.get(0));
  };

  EntityQuestion.prototype.remove = function() {
    if (this.answerEl) {
      ReactDOM.unmountComponentAtNode(this.answerEl.get(0));
    }
    return EntityQuestion.__super__.remove.apply(this, arguments);
  };

  return EntityQuestion;

})(Question);

EntityAnswerComponent = (function(superClass) {
  extend(EntityAnswerComponent, superClass);

  function EntityAnswerComponent() {
    return EntityAnswerComponent.__super__.constructor.apply(this, arguments);
  }

  EntityAnswerComponent.propTypes = {
    entityId: React.PropTypes.string,
    entityType: React.PropTypes.string.isRequired,
    onSelectEntity: React.PropTypes.func.isRequired,
    onClearEntity: React.PropTypes.func.isRequired,
    onEditEntity: React.PropTypes.func.isRequired,
    formCtx: React.PropTypes.object.isRequired,
    T: React.PropTypes.func.isRequired
  };

  EntityAnswerComponent.prototype.isLoadNeeded = function(newProps, oldProps) {
    return newProps.entityType !== oldProps.entityType || newProps.entityId !== oldProps.entityId;
  };

  EntityAnswerComponent.prototype.load = function(props, prevProps, callback) {
    if (!props.entityId) {
      callback({
        entity: null
      });
      return;
    }
    return props.formCtx.getEntityById(props.entityType, props.entityId, (function(_this) {
      return function(entity) {
        return callback({
          entity: entity
        });
      };
    })(this));
  };

  EntityAnswerComponent.prototype.renderEntityButtons = function() {
    return H.div(null, H.button({
      type: "button",
      className: "btn btn-link btn-sm",
      onClick: this.props.onSelectEntity
    }, H.span({
      className: "glyphicon glyphicon-ok"
    }), " ", this.props.T("Change Selection")), H.button({
      type: "button",
      className: "btn btn-link btn-sm",
      onClick: this.props.onClearEntity
    }, H.span({
      className: "glyphicon glyphicon-remove"
    }), " ", this.props.T("Clear Selection")), (this.props.formCtx.editEntity != null) && this.props.formCtx.canEditEntity(this.props.entityType, this.state.entity) ? H.button({
      type: "button",
      className: "btn btn-link btn-sm",
      onClick: this.props.onEditEntity
    }, H.span({
      className: "glyphicon glyphicon-pencil"
    }), " ", this.props.T("Edit Selection")) : void 0);
  };

  EntityAnswerComponent.prototype.render = function() {
    if (this.state.loading) {
      return H.div({
        className: "alert alert-info"
      }, T("Loading..."));
    }
    if (!this.props.entityId) {
      return H.button({
        type: "button",
        className: "btn btn-default btn-sm",
        onClick: this.props.onSelectEntity
      }, H.span({
        className: "glyphicon glyphicon-ok"
      }), " ", this.props.T("Select"));
    }
    if (!this.state.entity) {
      return H.div({
        className: "alert alert-danger"
      }, T("Not found"));
    }
    return H.div(null, this.renderEntityButtons(), H.div({
      className: "well well-sm"
    }, this.props.formCtx.renderEntitySummaryView(this.props.entityType, this.state.entity)));
  };

  return EntityAnswerComponent;

})(AsyncLoadComponent);
