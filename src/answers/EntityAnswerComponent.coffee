_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement
EntityDisplayComponent = require '../EntityDisplayComponent'
AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent')

# Allows user to select an entity
# State is needed for canEditEntity which requires entire entity
module.exports = class EntityAnswerComponent extends AsyncLoadComponent
  @contextTypes:
    selectEntity: React.PropTypes.func
    editEntity: React.PropTypes.func
    renderEntitySummaryView: React.PropTypes.func.isRequired
    getEntityById: React.PropTypes.func.isRequired     # Gets an entity by id (entityType, entityId, callback)
    canEditEntity: React.PropTypes.func
    T: React.PropTypes.func.isRequired  # Localizer to use

  @propTypes:
    value: React.PropTypes.string
    entityType: React.PropTypes.string.isRequired
    onValueChange: React.PropTypes.func.isRequired

  focus: () ->
    # Nothing to focus
    return false

  # Override to determine if a load is needed. Not called on mounting
  isLoadNeeded: (newProps, oldProps) ->
    return newProps.entityType != oldProps.entityType or newProps.value != oldProps.value

  # Call callback with state changes
  load: (props, prevProps, callback) ->
    if not props.value 
      callback(entity: null)
      return

    @context.getEntityById(props.entityType, props.value, (entity) =>
      callback(entity: entity)
    )

  # Called to select an entity using an external mechanism (calls @ctx.selectEntity)
  handleSelectEntity: =>
    if not @context.selectEntity
      return alert(@context.T("Not supported on this platform"))

    @context.selectEntity {
      entityType: @props.entityType
      callback: (value) =>
        @props.onValueChange(value)
    }

  handleClearEntity: =>
    @props.onValueChange(null)

  handleEditEntity: =>
    if not @context.editEntity
      return alert(@context.T("Not supported on this platform"))

    @context.editEntity @props.entityType, @props.value, =>
      @props.onValueChange(value)
      @forceLoad()

  renderEntityButtons: ->
    H.div null,
      H.button type: "button", className: "btn btn-link btn-sm", onClick: @handleSelectEntity,
        H.span className: "glyphicon glyphicon-ok"
        " "
        @context.T("Change Selection")
      H.button type: "button", className: "btn btn-link btn-sm", onClick: @handleClearEntity,
        H.span className: "glyphicon glyphicon-remove"
        " "
        @context.T("Clear Selection")
      if @context.editEntity? and @context.canEditEntity(@props.entityType, @state.entity)
        H.button type: "button", className: "btn btn-link btn-sm", onClick: @handleEditEntity,
          H.span className: "glyphicon glyphicon-pencil"
          " "
          @context.T("Edit Selection")

  render: ->
    if @state.loading
      return H.div className: "alert alert-info", @context.T("Loading...")

    if not @props.value 
      # Render select button
      return H.button type: "button", className: "btn btn-default btn-sm", onClick: @handleSelectEntity,
        H.span className: "glyphicon glyphicon-ok"
        " "
        @context.T("Select")

    if not @state.entity 
      return H.div className: "alert alert-danger", @context.T("Not found")

    return H.div null,
      @renderEntityButtons()
      R EntityDisplayComponent, 
        entityType: @props.entityType
        displayInWell: true
        entityId: @props.value
