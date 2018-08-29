'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AsyncLoadComponent, EntityDisplayComponent, H, PropTypes, React;

PropTypes = require('prop-types');

React = require('react');

H = React.DOM;

AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent');

// Loads and displays an entity
module.exports = EntityDisplayComponent = function () {
  var EntityDisplayComponent = function (_AsyncLoadComponent) {
    _inherits(EntityDisplayComponent, _AsyncLoadComponent);

    function EntityDisplayComponent() {
      _classCallCheck(this, EntityDisplayComponent);

      return _possibleConstructorReturn(this, (EntityDisplayComponent.__proto__ || Object.getPrototypeOf(EntityDisplayComponent)).apply(this, arguments));
    }

    _createClass(EntityDisplayComponent, [{
      key: 'isLoadNeeded',


      // Override to determine if a load is needed. Not called on mounting
      value: function isLoadNeeded(newProps, oldProps) {
        return newProps.entityType !== oldProps.entityType || newProps.entityId !== oldProps.entityId || newProps.entityCode !== oldProps.entityCode;
      }

      // Call callback with state changes

    }, {
      key: 'load',
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
      key: 'render',
      value: function render() {
        if (this.state.loading) {
          return H.div({
            className: "alert alert-info"
          }, this.props.T("Loading..."));
        }
        if (!this.props.entityId && !this.props.entityCode) {
          return null;
        }
        if (!this.state.entity) {
          return H.div({
            className: "alert alert-danger"
          }, this.props.T("Either site has been deleted or you do not have permission to view it"));
        }
        return H.div({
          className: this.props.displayInWell ? "well well-sm" : void 0
        }, this.props.renderEntityView(this.props.entityType, this.state.entity));
      }
    }]);

    return EntityDisplayComponent;
  }(AsyncLoadComponent);

  ;

  EntityDisplayComponent.propTypes = {
    entityType: PropTypes.string.isRequired, // _id of entity
    entityId: PropTypes.string, // _id of entity
    entityCode: PropTypes.string, // code of entity if _id not present
    displayInWell: PropTypes.bool, // True to render in well if present
    getEntityById: PropTypes.func, // Gets an entity by id (entityType, entityId, callback). Required if entityId
    getEntityByCode: PropTypes.func, // Gets an entity by code (entityType, entityCode, callback). Required if entityCode
    renderEntityView: PropTypes.func.isRequired,
    T: PropTypes.func.isRequired // Localizer to use
  };

  return EntityDisplayComponent;
}.call(undefined);