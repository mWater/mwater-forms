var React;

React = require('react');

module.exports = {
  selectEntity: React.PropTypes.func,
  editEntity: React.PropTypes.func,
  renderEntitySummaryView: React.PropTypes.func.isRequired,
  renderEntityListItemView: React.PropTypes.func.isRequired,
  canEditEntity: React.PropTypes.func,
  getEntityById: React.PropTypes.func,
  getEntityByCode: React.PropTypes.func,
  locationFinder: React.PropTypes.object,
  displayMap: React.PropTypes.func,
  stickyStorage: React.PropTypes.object,
  scanBarcode: React.PropTypes.func,
  getAdminRegionPath: React.PropTypes.func.isRequired,
  getSubAdminRegions: React.PropTypes.func.isRequired,
  findAdminRegionByLatLng: React.PropTypes.func.isRequired,
  imageManager: React.PropTypes.object.isRequired,
  imageAcquirer: React.PropTypes.object
};
