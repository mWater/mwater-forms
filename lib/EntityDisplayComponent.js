"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var AsyncLoadComponent, EntityDisplayComponent, PropTypes, R, React;
PropTypes = require('prop-types');
React = require('react');
R = React.createElement;
AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent'); // Loads and displays an entity

module.exports = EntityDisplayComponent = function () {
  var EntityDisplayComponent =
  /*#__PURE__*/
  function (_AsyncLoadComponent) {
    (0, _inherits2.default)(EntityDisplayComponent, _AsyncLoadComponent);

    function EntityDisplayComponent() {
      (0, _classCallCheck2.default)(this, EntityDisplayComponent);
      return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(EntityDisplayComponent).apply(this, arguments));
    }

    (0, _createClass2.default)(EntityDisplayComponent, [{
      key: "isLoadNeeded",
      // Override to determine if a load is needed. Not called on mounting
      value: function isLoadNeeded(newProps, oldProps) {
        return newProps.entityType !== oldProps.entityType || newProps.entityId !== oldProps.entityId || newProps.entityCode !== oldProps.entityCode;
      } // Call callback with state changes

    }, {
      key: "load",
      value: function load(props, prevProps, callback) {
        if (!props.entityId && !props.entityCode) {
          callback({
            entity: null
          });
          return;
        }

        if (props.entityId) {
          return this.props.getEntityById(props.entityType, props.entityId, function (entity) {
            return callback({
              entity: entity
            });
          });
        } else {
          return this.props.getEntityByCode(props.entityType, props.entityCode, function (entity) {
            return callback({
              entity: entity
            });
          });
        }
      }
    }, {
      key: "render",
      value: function render() {
        if (this.state.loading) {
          return R('div', {
            className: "alert alert-info"
          }, this.props.T("Loading..."));
        }

        if (!this.props.entityId && !this.props.entityCode) {
          return null;
        }

        if (!this.state.entity) {
          return R('div', {
            className: "alert alert-danger"
          }, this.props.T("Either site has been deleted or you do not have permission to view it"));
        }

        return R('div', {
          className: this.props.displayInWell ? "well well-sm" : void 0
        }, this.props.renderEntityView(this.props.entityType, this.state.entity));
      }
    }]);
    return EntityDisplayComponent;
  }(AsyncLoadComponent);

  ;
  EntityDisplayComponent.propTypes = {
    entityType: PropTypes.string.isRequired,
    // _id of entity
    entityId: PropTypes.string,
    // _id of entity
    entityCode: PropTypes.string,
    // code of entity if _id not present
    displayInWell: PropTypes.bool,
    // True to render in well if present
    getEntityById: PropTypes.func,
    // Gets an entity by id (entityType, entityId, callback). Required if entityId
    getEntityByCode: PropTypes.func,
    // Gets an entity by code (entityType, entityCode, callback). Required if entityCode
    renderEntityView: PropTypes.func.isRequired,
    T: PropTypes.func.isRequired // Localizer to use

  };
  return EntityDisplayComponent;
}.call(void 0);