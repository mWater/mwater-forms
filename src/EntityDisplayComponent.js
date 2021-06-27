// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
let EntityDisplayComponent;
import PropTypes from 'prop-types';
import React from 'react';
const R = React.createElement;
import AsyncLoadComponent from 'react-library/lib/AsyncLoadComponent';

// Loads and displays an entity
export default EntityDisplayComponent = (function() {
  EntityDisplayComponent = class EntityDisplayComponent extends AsyncLoadComponent {
    static initClass() {
      this.propTypes = {
        entityType: PropTypes.string.isRequired,   // _id of entity
        entityId: PropTypes.string,     // _id of entity
        entityCode: PropTypes.string,   // code of entity if _id not present
        displayInWell: PropTypes.bool,         // True to render in well if present
        getEntityById: PropTypes.func,     // Gets an entity by id (entityType, entityId, callback). Required if entityId
        getEntityByCode: PropTypes.func,   // Gets an entity by code (entityType, entityCode, callback). Required if entityCode
  
        renderEntityView: PropTypes.func.isRequired,
        T: PropTypes.func.isRequired
      };
        // Localizer to use
    }

    // Override to determine if a load is needed. Not called on mounting
    isLoadNeeded(newProps, oldProps) {
      return (newProps.entityType !== oldProps.entityType) || (newProps.entityId !== oldProps.entityId) || (newProps.entityCode !== oldProps.entityCode);
    }

    // Call callback with state changes
    load(props, prevProps, callback) {
      if (!props.entityId && !props.entityCode) {
        callback({entity: null});
        return;
      }

      if (props.entityId) {
        return this.props.getEntityById(props.entityType, props.entityId, entity => {
          return callback({entity});
        });
      } else {
        return this.props.getEntityByCode(props.entityType, props.entityCode, entity => {
          return callback({entity});
        });
      }
    }

    render() {
      if (this.state.loading) {
        return R('div', {className: "alert alert-info"}, this.props.T("Loading..."));
      }

      if (!this.props.entityId && !this.props.entityCode) {
        return null;
      }

      if (!this.state.entity) { 
        return R('div', {className: "alert alert-danger"}, this.props.T("Either site has been deleted or you do not have permission to view it"));
      }

      return R('div', {className: (this.props.displayInWell ? "well well-sm" : undefined)},
        this.props.renderEntityView(this.props.entityType, this.state.entity));
    }
  };
  EntityDisplayComponent.initClass();
  return EntityDisplayComponent;
})();
