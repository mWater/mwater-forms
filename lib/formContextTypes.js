'use strict';

var PropTypes, React;

PropTypes = require('prop-types');

React = require('react');

// Context types for forms
// TODO unify wiht docs/Forms Context.md here
module.exports = {
  selectEntity: PropTypes.func,
  editEntity: PropTypes.func,
  renderEntitySummaryView: PropTypes.func.isRequired,
  renderEntityListItemView: PropTypes.func.isRequired,
  canEditEntity: PropTypes.func,
  getEntityById: PropTypes.func, // Gets an entity by id (entityType, entityId, callback)
  getEntityByCode: PropTypes.func, // Gets an entity by code (entityType, entityCode, callback)
  locationFinder: PropTypes.object,
  displayMap: PropTypes.func, // Takes location ({ latitude, etc.}) and callback (called back with new location)
  stickyStorage: PropTypes.object,
  scanBarcode: PropTypes.func,
  getAdminRegionPath: PropTypes.func.isRequired, // Call with (id, callback). Callback (error, [{ id:, level: <e.g. 1>, name: <e.g. Manitoba>, type: <e.g. Province>}] in level ascending order)
  getSubAdminRegions: PropTypes.func.isRequired, // Call with (id, callback). Callback (error, [{ id:, level: <e.g. 1>, name: <e.g. Manitoba>, type: <e.g. Province>}] of admin regions directly under the specified id)
  findAdminRegionByLatLng: PropTypes.func.isRequired, // Call with (lat, lng, callback). Callback (error, id)
  imageManager: PropTypes.object.isRequired,
  imageAcquirer: PropTypes.object
};