React = require 'react'
H = React.DOM
AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent')

# Loads and displays an entity
module.exports = class EntityDisplayComponent extends AsyncLoadComponent
  @propTypes:
    entityType: React.PropTypes.string.isRequired   # _id of entity
    entityId: React.PropTypes.string     # _id of entity
    entityCode: React.PropTypes.string   # code of entity if _id not present
    displayInWell: React.PropTypes.bool         # True to render in well if present
    getEntityById: React.PropTypes.func     # Gets an entity by id (entityType, entityId, callback). Required if entityId
    getEntityByCode: React.PropTypes.func   # Gets an entity by code (entityType, entityCode, callback). Required if entityCode
    renderEntitySummaryView: React.PropTypes.func.isRequired
    T: React.PropTypes.func.isRequired  # Localizer to use

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
      return H.div className: "alert alert-info", @props.T("Loading...")

    if not @props.entityId and not @props.entityCode
      return null

    if not @state.entity 
      return H.div className: "alert alert-danger", @props.T("Not found")

    H.div className: (if @props.displayInWell then "well well-sm"),
      @props.renderEntitySummaryView(@props.entityType, @state.entity)
