Question = require './Question'
_ = require 'lodash'

# Allows user to select an entity
# Options for EntityQuestion
#  entityType: type of entity
#  entityFilter: filter for entities chosen
#  displayProperties: properties of entity to display when chosen
#  selectProperties: properties of entity to display when selecting
#  mapProperty: geo property if selection should use a map to select
#  selectText: text of select button
#
# Context should have selectEntity(<options>)
# selectEntity options:
#  title: title of popup screen
#  type: entity type
#  filter: optional filter of entities that are acceptable
#  selectProperties: properties to display in the list when selecting
#  callback: called with _id of entity
#
# Context should have getEntityProperties(<options>)
# getEntityProperties options:
#  entity: _id of the entity
#  properties: properties to get
#  locale: locale to localize properties into
#  callback: called with list of { id, name, value, type }
#   where id is id of property (e.g. "p243")
#   and name is localized name of property
#   and value is localized value of property
#   and type is type of property (integer, decimal, text, enum)
#  or callback null if entity not found
# 
module.exports = class EntityQuestion extends Question
  updateAnswer: (answerEl) ->
    # Check if entities supported
    if not @ctx.getEntityProperties or not @ctx.selectEntity
      answerEl.html('<div class="text-warning">' + @T("Not supported on this platform") + '</div>')
      return

    # If entity, get properties
    val = @getAnswerValue()
    if val
      # Display right away first in case loading takes time
      data = {
        entity: val
        selectText: @options.selectText
      }
      answerEl.html require('./templates/EntityQuestion.hbs')(data, helpers: { T: @T })

      @ctx.getEntityProperties({
        entity: val
        properties: @options.displayProperties
        locale: @ctx.locale
        callback: (properties) =>
          data = {
            entity: val
            properties: properties
            selectText: @options.selectText
          }
          answerEl.html require('./templates/EntityQuestion.hbs')(data, helpers: { T: @T }) 
        })
    else
      data = {
        selectText: @options.selectText
      }
      answerEl.html require('./templates/EntityQuestion.hbs')(data, helpers: { T: @T })

  events:
    'click #change_entity_button' : 'selectEntity'
    'click #select_entity_button' : 'selectEntity'

  changed: ->
    @setAnswerValue(code: @$("input").val())

  selectEntity: ->
    @ctx.selectEntity { 
      title: @options.selectText
      type: @options.entityType
      filter: @options.entityFilter
      selectProperties: @options.selectProperties
      mapProperty: @options.mapProperty
      callback: (entityId) =>
        @setAnswerValue(entityId)
    }

