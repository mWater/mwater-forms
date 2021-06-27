// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
let EntityAnswerComponent;
import PropTypes from 'prop-types';
import _ from 'lodash';
import React from 'react';
const R = React.createElement;
import EntityDisplayComponent from '../EntityDisplayComponent';
import AsyncLoadComponent from 'react-library/lib/AsyncLoadComponent';

// Allows user to select an entity
// State is needed for canEditEntity which requires entire entity
export default EntityAnswerComponent = (function() {
  EntityAnswerComponent = class EntityAnswerComponent extends AsyncLoadComponent {
    static initClass() {
      this.contextTypes = {
        selectEntity: PropTypes.func,
        editEntity: PropTypes.func,
        renderEntitySummaryView: PropTypes.func.isRequired,
        getEntityById: PropTypes.func.isRequired,     // Gets an entity by id (entityType, entityId, callback)
        canEditEntity: PropTypes.func,
        T: PropTypes.func.isRequired  // Localizer to use
      };
  
      this.propTypes = {
        value: PropTypes.string,
        entityType: PropTypes.string.isRequired,
        onValueChange: PropTypes.func.isRequired
      };
    }

    focus() {
      // Nothing to focus
      return false;
    }

    // Override to determine if a load is needed. Not called on mounting
    isLoadNeeded(newProps, oldProps) {
      return (newProps.entityType !== oldProps.entityType) || (newProps.value !== oldProps.value);
    }

    // Call callback with state changes
    load(props, prevProps, callback) {
      if (!props.value) { 
        callback({entity: null});
        return;
      }

      return this.context.getEntityById(props.entityType, props.value, entity => {
        return callback({entity});
      });
    }

    // Called to select an entity using an external mechanism (calls @ctx.selectEntity)
    handleSelectEntity = () => {
      if (!this.context.selectEntity) {
        return alert(this.context.T("Not supported on this platform"));
      }

      return this.context.selectEntity({
        entityType: this.props.entityType,
        callback: value => {
          return this.props.onValueChange(value);
        }
      });
    };

    handleClearEntity = () => {
      return this.props.onValueChange(null);
    };

    handleEditEntity = () => {
      if (!this.context.editEntity) {
        return alert(this.context.T("Not supported on this platform"));
      }

      return this.context.editEntity(this.props.entityType, this.props.value, () => {
        this.props.onValueChange(this.props.value);
        return this.forceLoad();
      });
    };

    renderEntityButtons() {
      return R('div', null,
        R('button', {type: "button", className: "btn btn-link btn-sm", onClick: this.handleSelectEntity},
          R('span', {className: "glyphicon glyphicon-ok"}),
          " ",
          this.context.T("Change Selection")),
        R('button', {type: "button", className: "btn btn-link btn-sm", onClick: this.handleClearEntity},
          R('span', {className: "glyphicon glyphicon-remove"}),
          " ",
          this.context.T("Clear Selection")),
        (this.context.editEntity != null) && this.context.canEditEntity(this.props.entityType, this.state.entity) ?
          R('button', {type: "button", className: "btn btn-link btn-sm", onClick: this.handleEditEntity},
            R('span', {className: "glyphicon glyphicon-pencil"}),
            " ",
            this.context.T("Edit Selection")) : undefined
      );
    }

    render() {
      if (this.state.loading) {
        return R('div', {className: "alert alert-info"}, this.context.T("Loading..."));
      }

      if (!this.props.value) { 
        // Render select button
        return R('button', {type: "button", className: "btn btn-default btn-sm", onClick: this.handleSelectEntity},
          R('span', {className: "glyphicon glyphicon-ok"}),
          " ",
          this.context.T("Select"));
      }

      if (!this.state.entity) { 
        return R('div', {className: "alert alert-danger"}, this.context.T("Not found"));
      }

      return R('div', null,
        this.renderEntityButtons(),
        R(EntityDisplayComponent, { 
          entityType: this.props.entityType,
          displayInWell: true,
          entityId: this.props.value,
          getEntityById: this.context.getEntityById,
          renderEntityView: this.context.renderEntitySummaryView,
          T: this.context.T
        }
        )
      );
    }
  };
  EntityAnswerComponent.initClass();
  return EntityAnswerComponent;
})();
