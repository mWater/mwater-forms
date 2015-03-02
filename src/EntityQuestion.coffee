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
#  locale: current locale
#  updateLinkedAnswers: function that updates any linked answers when an entity is selected. Called with entity
#
# Context should have selectEntity(<options>)
# selectEntity options:
#  title: title of popup screen
#  type: entity type
#  filter: optional filter of entities that are acceptable
#  selectProperties: properties to display in the list when selecting
#  callback: called with entity selected
#
# Context should have getEntity(_id, callback)
# getEntity options:
#  callback: called with an entity e.g. { a: "abc", b: 123 }
#  or callback null if entity not found
# 
module.exports = class EntityQuestion extends Question
  events:
    'click #change_entity_button' : 'selectEntity'
    'click #select_entity_button' : 'selectEntity'

  changed: ->
    @setAnswerValue(code: @$("input").val())

  # Called to select an entity using an external mechanism (calls @ctx.selectEntity)
  selectEntity: ->
    if not @ctx.selectEntity
      return alert(@T("Not supported on this platform"))

    @ctx.selectEntity { 
      title: @options.selectText
      type: @options.entityType
      filter: @options.entityFilter
      selectProperties: @options.selectProperties
      mapProperty: @options.mapProperty
      callback: (entity) =>
        @setAnswerValue(entity._id)

        # Update answers linked to properties
        if @options.updateLinkedAnswers
          @options.updateLinkedAnswers(entity)
    }

  updateAnswer: (answerEl) ->
    # Check if entities supported
    if not @ctx.getEntity
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

      @ctx.getEntity val, (entity) =>
        if entity
          # Display entity
          properties = @formatEntityProperties(entity)
          data = {
            entity: val
            properties: properties
            selectText: @options.selectText
          }
          answerEl.html require('./templates/EntityQuestion.hbs')(data, helpers: { T: @T }) 
        else
          # Entity not found
          data = {
            entity: entity
            propertiesError: @T("Data Not Found")
            selectText: @options.selectText
          }
          answerEl.html require('./templates/EntityQuestion.hbs')(data, helpers: { T: @T }) 
    else
      # No entity selected
      data = { selectText: @options.selectText }
      answerEl.html require('./templates/EntityQuestion.hbs')(data, helpers: { T: @T })

  # Format entity properties for display. Return array of name, value
  formatEntityProperties: (entity) ->
    # Localize to locale, or English as fallback
    localize = (str) =>
      return str[@options.locale] or str.en

    # Get properties and format    
    properties = []
    for prop in @options.displayProperties
      name = localize(prop.name)
      switch prop.type
        when "text", "integer", "decimal"
          properties.push({ name: name, value: entity[prop.code]})
        when "enum"
          enumVal = entity[prop.code]
          propValue = _.findWhere(prop.values, { code: enumVal })
          if propValue
            properties.push({ name: name, value: localize(propValue.name)})
          else
            properties.push({ name: name, value: "???"})  # TODO
        else
          properties.push({ name: name, value: "???"}) # TODO

    return properties
