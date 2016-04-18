var AsyncLoadComponent, EntityDisplayComponent, H, React,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

H = React.DOM;

AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent');

module.exports = EntityDisplayComponent = (function(superClass) {
  extend(EntityDisplayComponent, superClass);

  function EntityDisplayComponent() {
    return EntityDisplayComponent.__super__.constructor.apply(this, arguments);
  }

  EntityDisplayComponent.contextTypes = {
    getEntityById: React.PropTypes.func.isRequired,
    getEntityByCode: React.PropTypes.func.isRequired,
    renderEntitySummaryView: React.PropTypes.func.isRequired
  };

  EntityDisplayComponent.propTypes = {
    entityType: React.PropTypes.string.isRequired,
    entityId: React.PropTypes.string,
    entityCode: React.PropTypes.string,
    displayInWell: React.PropTypes.bool
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
      return this.context.getEntityById(props.entityType, props.entityId, (function(_this) {
        return function(entity) {
          return callback({
            entity: entity
          });
        };
      })(this));
    } else {
      return this.context.getEntityByCode(props.entityType, props.entityCode, (function(_this) {
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
      }, T("Loading..."));
    }
    if (!this.props.entityId && !this.props.entityCode) {
      return null;
    }
    if (!this.state.entity) {
      return H.div({
        className: "alert alert-danger"
      }, T("Not found"));
    }
    return H.div({
      className: (this.props.displayInWell ? "well well-sm" : void 0)
    }, this.context.renderEntitySummaryView(this.props.entityType, this.state.entity));
  };

  return EntityDisplayComponent;

})(AsyncLoadComponent);
