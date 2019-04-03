"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var AsyncLoadComponent,
    EntityAnswerComponent,
    EntityDisplayComponent,
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
R = React.createElement;
EntityDisplayComponent = require('../EntityDisplayComponent');
AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent'); // Allows user to select an entity
// State is needed for canEditEntity which requires entire entity

module.exports = EntityAnswerComponent = function () {
  var EntityAnswerComponent =
  /*#__PURE__*/
  function (_AsyncLoadComponent) {
    (0, _inherits2["default"])(EntityAnswerComponent, _AsyncLoadComponent);

    function EntityAnswerComponent() {
      var _this;

      (0, _classCallCheck2["default"])(this, EntityAnswerComponent);
      _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(EntityAnswerComponent).apply(this, arguments)); // Called to select an entity using an external mechanism (calls @ctx.selectEntity)

      _this.handleSelectEntity = _this.handleSelectEntity.bind((0, _assertThisInitialized2["default"])(_this));
      _this.handleClearEntity = _this.handleClearEntity.bind((0, _assertThisInitialized2["default"])(_this));
      _this.handleEditEntity = _this.handleEditEntity.bind((0, _assertThisInitialized2["default"])(_this));
      return _this;
    }

    (0, _createClass2["default"])(EntityAnswerComponent, [{
      key: "focus",
      value: function focus() {
        // Nothing to focus
        return false;
      } // Override to determine if a load is needed. Not called on mounting

    }, {
      key: "isLoadNeeded",
      value: function isLoadNeeded(newProps, oldProps) {
        return newProps.entityType !== oldProps.entityType || newProps.value !== oldProps.value;
      } // Call callback with state changes

    }, {
      key: "load",
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
      key: "handleSelectEntity",
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
      key: "handleClearEntity",
      value: function handleClearEntity() {
        boundMethodCheck(this, EntityAnswerComponent);
        return this.props.onValueChange(null);
      }
    }, {
      key: "handleEditEntity",
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
      key: "renderEntityButtons",
      value: function renderEntityButtons() {
        return R('div', null, R('button', {
          type: "button",
          className: "btn btn-link btn-sm",
          onClick: this.handleSelectEntity
        }, R('span', {
          className: "glyphicon glyphicon-ok"
        }), " ", this.context.T("Change Selection")), R('button', {
          type: "button",
          className: "btn btn-link btn-sm",
          onClick: this.handleClearEntity
        }, R('span', {
          className: "glyphicon glyphicon-remove"
        }), " ", this.context.T("Clear Selection")), this.context.editEntity != null && this.context.canEditEntity(this.props.entityType, this.state.entity) ? R('button', {
          type: "button",
          className: "btn btn-link btn-sm",
          onClick: this.handleEditEntity
        }, R('span', {
          className: "glyphicon glyphicon-pencil"
        }), " ", this.context.T("Edit Selection")) : void 0);
      }
    }, {
      key: "render",
      value: function render() {
        if (this.state.loading) {
          return R('div', {
            className: "alert alert-info"
          }, this.context.T("Loading..."));
        }

        if (!this.props.value) {
          // Render select button
          return R('button', {
            type: "button",
            className: "btn btn-default btn-sm",
            onClick: this.handleSelectEntity
          }, R('span', {
            className: "glyphicon glyphicon-ok"
          }), " ", this.context.T("Select"));
        }

        if (!this.state.entity) {
          return R('div', {
            className: "alert alert-danger"
          }, this.context.T("Not found"));
        }

        return R('div', null, this.renderEntityButtons(), R(EntityDisplayComponent, {
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
    getEntityById: PropTypes.func.isRequired,
    // Gets an entity by id (entityType, entityId, callback)
    canEditEntity: PropTypes.func,
    T: PropTypes.func.isRequired // Localizer to use

  };
  EntityAnswerComponent.propTypes = {
    value: PropTypes.string,
    entityType: PropTypes.string.isRequired,
    onValueChange: PropTypes.func.isRequired
  };
  return EntityAnswerComponent;
}.call(void 0);