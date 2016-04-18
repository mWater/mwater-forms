React = require 'react'

# Context types for forms. Use in @contextTypes for all form operations
# TODO unify wiht docs/Forms Context.md here
module.exports = {
  locale: React.PropTypes.string
  selectEntity: React.PropTypes.func
  editEntity: React.PropTypes.func
  renderEntitySummaryView: React.PropTypes.func.isRequired
  canEditEntity: React.PropTypes.func

  getEntityById: React.PropTypes.func     # Gets an entity by id (entityType, entityId, callback)
  getEntityByCode: React.PropTypes.func   # Gets an entity by code (entityType, entityCode, callback)

  locationFinder: React.PropTypes.object
  displayMap: React.PropTypes.func # Takes location ({ latitude, etc.}) and callback (called back with new location)
  # storage: React.PropTypes.object   # Storage object for saving location

  stickyStorage: React.PropTypes.object
  scanBarcode: React.PropTypes.func
  
  getAdminRegionPath: React.PropTypes.func.isRequired # Call with (id, callback). Callback (error, [{ id:, level: <e.g. 1>, name: <e.g. Manitoba>, type: <e.g. Province>}] in level ascending order)
  getSubAdminRegions: React.PropTypes.func.isRequired # Call with (id, callback). Callback (error, [{ id:, level: <e.g. 1>, name: <e.g. Manitoba>, type: <e.g. Province>}] of admin regions directly under the specified id)
  findAdminRegionByLatLng: React.PropTypes.func.isRequired # Call with (lat, lng, callback). Callback (error, id)

  imageManager: React.PropTypes.object.isRequired
  imageAcquirer: React.PropTypes.object
}
