PropTypes = require('prop-types')
React = require 'react'
R = React.createElement
AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent')

# Loads and displays an entity
module.exports = class EntityDisplayComponent extends AsyncLoadComponent
  @propTypes:
    entityType: PropTypes.string.isRequired   # _id of entity
    entityId: PropTypes.string     # _id of entity
    entityCode: PropTypes.string   # code of entity if _id not present
    displayInWell: PropTypes.bool         # True to render in well if present
    getEntityById: PropTypes.func     # Gets an entity by id (entityType, entityId, callback). Required if entityId
    getEntityByCode: PropTypes.func   # Gets an entity by code (entityType, entityCode, callback). Required if entityCode

    renderEntityView: PropTypes.func.isRequired
    T: PropTypes.func.isRequired  # Localizer to use

  # Override to determine if a load is needed. Not called on mounting
  isLoadNeeded: (newProps, oldProps) ->
    return newProps.entityType != oldProps.entityType or newProps.entityId != oldProps.entityId or newProps.entityCode != oldProps.entityCode

  # Call callback with state changes
  load: (props, prevProps, callback) ->
    if not props.entityId and not props.entityCode
      callback(entity: null)
      return

    if props.entityId
      @props.getEntityById(props.entityType, props.entityId, (entity) =>
        callback(entity: entity)
      )
    else
      @props.getEntityByCode(props.entityType, props.entityCode, (entity) =>
        callback(entity: entity)
      )

  render: ->
    if @state.loading
      return R 'div', className: "alert alert-info", @props.T("Loading...")

    if not @props.entityId and not @props.entityCode
      return null

    if not @state.entity 
      return R 'div', className: "alert alert-danger", @props.T("Either site has been deleted or you do not have permission to view it")

    R 'div', className: (if @props.displayInWell then "well well-sm"),
      @props.renderEntityView(@props.entityType, @state.entity)
