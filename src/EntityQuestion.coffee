Question = require './Question'
_ = require 'lodash'
React = require 'react'
ReactDOM = require 'react-dom'
H = React.DOM
EntityDisplayComponent = require './EntityDisplayComponent'
EntityLoadingComponent = require './EntityLoadingComponent'

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
# Context should have selectEntity(<options>) and getEntity(type, id, callback). See docs/Forms Context.md
module.exports = class EntityQuestion extends Question
  events:
    'click #change_entity_button' : 'selectEntity'
    'click #select_entity_button' : 'selectEntity'
    'click #clear_entity_button' : 'clearEntity'
    'click #edit_entity_button' : 'editEntity'

  # Loads properties into linked answers
  loadLinkedAnswers: (entityId) =>
    # Load answers linked to properties
    @ctx.getEntity @options.entityType, entityId, (entity) =>
      if entity and @options.loadLinkedAnswers
        @options.loadLinkedAnswers(entity)

  # Called to select an entity using an external mechanism (calls @ctx.selectEntity)
  selectEntity: =>
    if not @ctx.selectEntity
      return alert(@T("Not supported on this platform"))

    @ctx.selectEntity { 
      title: @options.selectText
      type: @options.entityType
      filter: @options.entityFilter
      selectProperties: @options.selectProperties
      mapProperty: @options.mapProperty
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
      # Set to null and back to force a change
      @setAnswerValue(null)
      @setAnswerValue(entityId)

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
    if not @ctx.getEntity?
      elem = H.div className: "text-warning", @T("Not supported on this platform")
    else
      entityId = @getAnswerValue()
  
      elem = React.createElement(EntityLoadingComponent, {
        formCtx: @ctx
        entityId: entityId
        entityType: @options.entityType
        T: @T },
        React.createElement(EntityAnswerComponent, {
          onSelectEntity: @selectEntity
          onClearEntity: @clearEntity
          onEditEntity: @editEntity
          formCtx: @ctx
          displayProperties: @options.displayProperties
          locale: @options.locale
          T: @T
        }))
        
    ReactDOM.render(elem, answerEl.get(0))

  remove: ->
    if @answerEl
      ReactDOM.unmountComponentAtNode(@answerEl.get(0))
    super

class EntityAnswerComponent extends React.Component
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
      if @props.entity._editable and @props.formCtx.editEntity?
        H.button type: "button", className: "btn btn-link btn-sm", onClick: @props.onEditEntity,
          H.span className: "glyphicon glyphicon-pencil"
          " "
          @props.T("Edit Selection")

  render: ->
    # If entity to render
    if @props.entity
      return H.div null,
        React.createElement(EntityDisplayComponent, 
          entity: @props.entity
          formCtx: @props.formCtx
          propertyIds: @props.displayProperties
          locale: @props.locale
          T: @props.T
          )
        @renderEntityButtons()

    # Render select button
    return H.button type: "button", className: "btn btn-default btn-sm", onClick: @props.onSelectEntity,
      H.span className: "glyphicon glyphicon-ok"
      " "
      @props.T("Select")
