PropTypes = require('prop-types')
_ = require 'lodash'
React = require 'react'
R = React.createElement
EntityDisplayComponent = require '../EntityDisplayComponent'
AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent')

# Allows user to select an entity
# State is needed for canEditEntity which requires entire entity
module.exports = class EntityAnswerComponent extends AsyncLoadComponent
  @contextTypes:
    selectEntity: PropTypes.func
    editEntity: PropTypes.func
    renderEntitySummaryView: PropTypes.func.isRequired
    getEntityById: PropTypes.func.isRequired     # Gets an entity by id (entityType, entityId, callback)
    canEditEntity: PropTypes.func
    T: PropTypes.func.isRequired  # Localizer to use

  @propTypes:
    value: PropTypes.string
    entityType: PropTypes.string.isRequired
    onValueChange: PropTypes.func.isRequired

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
      @props.onValueChange(@props.value)
      @forceLoad()

  renderEntityButtons: ->
    R 'div', null,
      R 'button', type: "button", className: "btn btn-link btn-sm", onClick: @handleSelectEntity,
        R 'span', className: "glyphicon glyphicon-ok"
        " "
        @context.T("Change Selection")
      R 'button', type: "button", className: "btn btn-link btn-sm", onClick: @handleClearEntity,
        R 'span', className: "glyphicon glyphicon-remove"
        " "
        @context.T("Clear Selection")
      if @context.editEntity? and @context.canEditEntity(@props.entityType, @state.entity)
        R 'button', type: "button", className: "btn btn-link btn-sm", onClick: @handleEditEntity,
          R 'span', className: "glyphicon glyphicon-pencil"
          " "
          @context.T("Edit Selection")

  render: ->
    if @state.loading
      return R 'div', className: "alert alert-info", @context.T("Loading...")

    if not @props.value 
      # Render select button
      return R 'button', type: "button", className: "btn btn-default btn-sm", onClick: @handleSelectEntity,
        R 'span', className: "glyphicon glyphicon-ok"
        " "
        @context.T("Select")

    if not @state.entity 
      return R 'div', className: "alert alert-danger", @context.T("Not found")

    return R 'div', null,
      @renderEntityButtons()
      R EntityDisplayComponent, 
        entityType: @props.entityType
        displayInWell: true
        entityId: @props.value
        getEntityById: @context.getEntityById
        renderEntityView: @context.renderEntitySummaryView
        T: @context.T
