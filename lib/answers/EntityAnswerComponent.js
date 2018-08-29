'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AsyncLoadComponent,
    EntityAnswerComponent,
    EntityDisplayComponent,
    H,
    PropTypes,
    R,
    React,
    _,
    boundMethodCheck = function boundMethodCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
};

PropTypes = require('prop-types');

_ = require('lodash');

React = require('react');

H = React.DOM;

R = React.createElement;

EntityDisplayComponent = require('../EntityDisplayComponent');

AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent');

// Allows user to select an entity
// State is needed for canEditEntity which requires entire entity
module.exports = EntityAnswerComponent = function () {
  var EntityAnswerComponent = function (_AsyncLoadComponent) {
    _inherits(EntityAnswerComponent, _AsyncLoadComponent);

    function EntityAnswerComponent() {
      _classCallCheck(this, EntityAnswerComponent);

      // Called to select an entity using an external mechanism (calls @ctx.selectEntity)
      var _this = _possibleConstructorReturn(this, (EntityAnswerComponent.__proto__ || Object.getPrototypeOf(EntityAnswerComponent)).apply(this, arguments));

      _this.handleSelectEntity = _this.handleSelectEntity.bind(_this);
      _this.handleClearEntity = _this.handleClearEntity.bind(_this);
      _this.handleEditEntity = _this.handleEditEntity.bind(_this);
      return _this;
    }

    _createClass(EntityAnswerComponent, [{
      key: 'focus',
      value: function focus() {
        // Nothing to focus
        return false;
      }

      // Override to determine if a load is needed. Not called on mounting

    }, {
      key: 'isLoadNeeded',
      value: function isLoadNeeded(newProps, oldProps) {
        return newProps.entityType !== oldProps.entityType || newProps.value !== oldProps.value;
      }

      // Call callback with state changes

    }, {
      key: 'load',
      value: function load(props, prevProps, callback) {
        if (!props.value) {
          callback({
            entity: null
          });
          return;
        }
        return this.context.getEntityById(props.entityType, props.value, function (entity) {
          return callback({
            entity: entity
          });
        });
      }
    }, {
      key: 'handleSelectEntity',
      value: function handleSelectEntity() {
        var _this2 = this;

        boundMethodCheck(this, EntityAnswerComponent);
        if (!this.context.selectEntity) {
          return alert(this.context.T("Not supported on this platform"));
        }
        return this.context.selectEntity({
          entityType: this.props.entityType,
          callback: function callback(value) {
            return _this2.props.onValueChange(value);
          }
        });
      }
    }, {
      key: 'handleClearEntity',
      value: function handleClearEntity() {
        boundMethodCheck(this, EntityAnswerComponent);
        return this.props.onValueChange(null);
      }
    }, {
      key: 'handleEditEntity',
      value: function handleEditEntity() {
        var _this3 = this;

        boundMethodCheck(this, EntityAnswerComponent);
        if (!this.context.editEntity) {
          return alert(this.context.T("Not supported on this platform"));
        }
        return this.context.editEntity(this.props.entityType, this.props.value, function () {
          _this3.props.onValueChange(_this3.props.value);
          return _this3.forceLoad();
        });
      }
    }, {
      key: 'renderEntityButtons',
      value: function renderEntityButtons() {
        return H.div(null, H.button({
          type: "button",
          className: "btn btn-link btn-sm",
          onClick: this.handleSelectEntity
        }, H.span({
          className: "glyphicon glyphicon-ok"
        }), " ", this.context.T("Change Selection")), H.button({
          type: "button",
          className: "btn btn-link btn-sm",
          onClick: this.handleClearEntity
        }, H.span({
          className: "glyphicon glyphicon-remove"
        }), " ", this.context.T("Clear Selection")), this.context.editEntity != null && this.context.canEditEntity(this.props.entityType, this.state.entity) ? H.button({
          type: "button",
          className: "btn btn-link btn-sm",
          onClick: this.handleEditEntity
        }, H.span({
          className: "glyphicon glyphicon-pencil"
        }), " ", this.context.T("Edit Selection")) : void 0);
      }
    }, {
      key: 'render',
      value: function render() {
        if (this.state.loading) {
          return H.div({
            className: "alert alert-info"
          }, this.context.T("Loading..."));
        }
        if (!this.props.value) {

          // Render select button
          return H.button({
            type: "button",
            className: "btn btn-default btn-sm",
            onClick: this.handleSelectEntity
          }, H.span({
            className: "glyphicon glyphicon-ok"
          }), " ", this.context.T("Select"));
        }
        if (!this.state.entity) {
          return H.div({
            className: "alert alert-danger"
          }, this.context.T("Not found"));
        }
        return H.div(null, this.renderEntityButtons(), R(EntityDisplayComponent, {
          entityType: this.props.entityType,
          displayInWell: true,
          entityId: this.props.value,
          getEntityById: this.context.getEntityById,
          renderEntityView: this.context.renderEntitySummaryView,
          T: this.context.T
        }));
      }
    }]);

    return EntityAnswerComponent;
  }(AsyncLoadComponent);

  ;

  EntityAnswerComponent.contextTypes = {
    selectEntity: PropTypes.func,
    editEntity: PropTypes.func,
    renderEntitySummaryView: PropTypes.func.isRequired,
    getEntityById: PropTypes.func.isRequired, // Gets an entity by id (entityType, entityId, callback)
    canEditEntity: PropTypes.func,
    T: PropTypes.func.isRequired // Localizer to use
  };

  EntityAnswerComponent.propTypes = {
    value: PropTypes.string,
    entityType: PropTypes.string.isRequired,
    onValueChange: PropTypes.func.isRequired
  };

  return EntityAnswerComponent;
}.call(undefined);