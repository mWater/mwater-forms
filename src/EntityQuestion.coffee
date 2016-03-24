Question = require './Question'
_ = require 'lodash'
React = require 'react'
ReactDOM = require 'react-dom'
H = React.DOM
EntityDisplayComponent = require './EntityDisplayComponent'
AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent')

# Allows user to select an entity
# Options for EntityQuestion
#  entityType: type of entity
#  entityFilter: filter for entities chosen
#  displayProperties: properties of entity to display when chosen
#  selectionMode: "external" (for external selection of entity)
#  selectProperties: properties of entity to display when selecting
#  mapProperty: geo property if selection should use a map to select
#  selectText: text of select button
#  locale: current locale
#  hidden: true to always hide
#  loadLinkedAnswers: function that loads any linked answers when an entity is selected. Called with entity
#
# Context should have selectEntity(<options>) and getEntityById(type, id, callback). See docs/Forms Context.md
module.exports = class EntityQuestion extends Question
  events:
    'click #change_entity_button' : 'selectEntity'
    'click #select_entity_button' : 'selectEntity'
    'click #clear_entity_button' : 'clearEntity'
    'click #edit_entity_button' : 'editEntity'

  # Loads properties into linked answers
  loadLinkedAnswers: (entityId) =>
    # Load answers linked to properties
    @ctx.getEntityById @options.entityType, entityId, (entity) =>
      if entity and @options.loadLinkedAnswers
        @options.loadLinkedAnswers(entity)

  # Called to select an entity using an external mechanism (calls @ctx.selectEntity)
  selectEntity: =>
    if not @ctx.selectEntity
      return alert(@T("Not supported on this platform"))

    @ctx.selectEntity { 
      entityType: @options.entityType
      filter: @options.entityFilter
      callback: (entityId) =>
        @setAnswerValue(entityId)

        # Load answers linked to properties
        @loadLinkedAnswers(entityId)
    }

  clearEntity: =>
    @setAnswerValue(null)

  editEntity: =>
    if not @ctx.editEntity
      return alert(@T("Not supported on this platform"))

    entityId = @getAnswerValue()
    @ctx.editEntity @options.entityType, entityId, =>
      # Force load display
      @answerComp?.forceLoad()

      # Load answers linked to properties
      @loadLinkedAnswers(entityId)
    

  shouldBeVisible: =>
    if @options.hidden
      return false

    return super()

  updateAnswer: (answerEl) ->
    # Save answer element to unmount
    @answerEl = answerEl

    # Check if entities supported
    if not @ctx.getEntityById?
      elem = H.div className: "text-warning", @T("Not supported on this platform")
    else
      entityId = @getAnswerValue()
  
      elem = React.createElement(EntityAnswerComponent, {
        entityType: @options.entityType
        entityId: entityId
        onSelectEntity: @selectEntity
        onClearEntity: @clearEntity
        onEditEntity: @editEntity
        formCtx: @ctx
        T: @T
      })
        
    @answerComp = ReactDOM.render(elem, answerEl.get(0))

  remove: ->
    if @answerEl
      ReactDOM.unmountComponentAtNode(@answerEl.get(0))
    super

class EntityAnswerComponent extends AsyncLoadComponent
  @propTypes:
    entityId: React.PropTypes.string
    entityType: React.PropTypes.string.isRequired
    onSelectEntity: React.PropTypes.func.isRequired
    onClearEntity: React.PropTypes.func.isRequired
    onEditEntity: React.PropTypes.func.isRequired
    formCtx: React.PropTypes.object.isRequired
    T: React.PropTypes.func.isRequired

  # Override to determine if a load is needed. Not called on mounting
  isLoadNeeded: (newProps, oldProps) ->
    return newProps.entityType != oldProps.entityType or newProps.entityId != oldProps.entityId

  # Call callback with state changes
  load: (props, prevProps, callback) ->
    if not props.entityId 
      callback(entity: null)
      return

    props.formCtx.getEntityById(props.entityType, props.entityId, (entity) =>
      callback(entity: entity)
    )

  renderEntityButtons: ->
    H.div null,
      H.button type: "button", className: "btn btn-link btn-sm", onClick: @props.onSelectEntity,
        H.span className: "glyphicon glyphicon-ok"
        " "
        @props.T("Change Selection")
      H.button type: "button", className: "btn btn-link btn-sm", onClick: @props.onClearEntity,
        H.span className: "glyphicon glyphicon-remove"
        " "
        @props.T("Clear Selection")
      if @props.formCtx.editEntity? and @props.formCtx.canEditEntity(@props.entityType, @state.entity)  
        H.button type: "button", className: "btn btn-link btn-sm", onClick: @props.onEditEntity,
          H.span className: "glyphicon glyphicon-pencil"
          " "
          @props.T("Edit Selection")

  render: ->
    if @state.loading
      return H.div className: "alert alert-info", T("Loading...")

    if not @props.entityId 
      # Render select button
      return H.button type: "button", className: "btn btn-default btn-sm", onClick: @props.onSelectEntity,
        H.span className: "glyphicon glyphicon-ok"
        " "
        @props.T("Select")

    if not @state.entity 
      return H.div className: "alert alert-danger", T("Not found")

    return H.div null,
      @renderEntityButtons()
      H.div className: "well well-sm",
        @props.formCtx.renderEntitySummaryView(@props.entityType, @state.entity)

