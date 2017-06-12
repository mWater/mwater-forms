var AsyncLoadComponent, EntityDisplayComponent, H, PropTypes, React,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

PropTypes = require('prop-types');

React = require('react');

H = React.DOM;

AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent');

module.exports = EntityDisplayComponent = (function(superClass) {
  extend(EntityDisplayComponent, superClass);

  function EntityDisplayComponent() {
    return EntityDisplayComponent.__super__.constructor.apply(this, arguments);
  }

  EntityDisplayComponent.propTypes = {
    entityType: PropTypes.string.isRequired,
    entityId: PropTypes.string,
    entityCode: PropTypes.string,
    displayInWell: PropTypes.bool,
    getEntityById: PropTypes.func,
    getEntityByCode: PropTypes.func,
    renderEntityView: PropTypes.func.isRequired,
    T: PropTypes.func.isRequired
  };

  EntityDisplayComponent.prototype.isLoadNeeded = function(newProps, oldProps) {
    return newProps.entityType !== oldProps.entityType || newProps.entityId !== oldProps.entityId || newProps.entityCode !== oldProps.entityCode;
  };

  EntityDisplayComponent.prototype.load = function(props, prevProps, callback) {
    if (!props.entityId && !props.entityCode) {
      callback({
        entity: null
      });
      return;
    }
    if (props.entityId) {
      return this.props.getEntityById(props.entityType, props.entityId, (function(_this) {
        return function(entity) {
          return callback({
            entity: entity
          });
        };
      })(this));
    } else {
      return this.props.getEntityByCode(props.entityType, props.entityCode, (function(_this) {
        return function(entity) {
          return callback({
            entity: entity
          });
        };
      })(this));
    }
  };

  EntityDisplayComponent.prototype.render = function() {
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
      className: (this.props.displayInWell ? "well well-sm" : void 0)
    }, this.props.renderEntityView(this.props.entityType, this.state.entity));
  };

  return EntityDisplayComponent;

})(AsyncLoadComponent);
