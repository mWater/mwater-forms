var PropTypes, React;

PropTypes = require('prop-types');

React = require('react');

module.exports = {
  selectEntity: PropTypes.func,
  editEntity: PropTypes.func,
  renderEntitySummaryView: PropTypes.func.isRequired,
  renderEntityListItemView: PropTypes.func.isRequired,
  canEditEntity: PropTypes.func,
  getEntityById: PropTypes.func,
  getEntityByCode: PropTypes.func,
  locationFinder: PropTypes.object,
  displayMap: PropTypes.func,
  stickyStorage: PropTypes.object,
  scanBarcode: PropTypes.func,
  getAdminRegionPath: PropTypes.func.isRequired,
  getSubAdminRegions: PropTypes.func.isRequired,
  findAdminRegionByLatLng: PropTypes.func.isRequired,
  imageManager: PropTypes.object.isRequired,
  imageAcquirer: PropTypes.object
};
