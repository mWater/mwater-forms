Question = require './Question'
_ = require 'lodash'

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
#  loadLinkedAnswers: function that loads any linked answers when an entity is selected. Called with entity
#
# Context should have selectEntity(<options>) and getEntity(type, id, callback). See docs/Forms Context.md
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
      callback: (entityId) =>
        @setAnswerValue(entityId)

        # Load answers linked to properties
        @ctx.getEntity @options.entityType, entityId, (entity) =>
          if entity and @options.loadLinkedAnswers
            @options.loadLinkedAnswers(entity)
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

      @ctx.getEntity @options.entityType, val, (entity) =>
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
      value = entity[prop.code]
      if not value?
        properties.push({ name: name, value: "-" })
      else
        switch prop.type
          when "text", "integer", "decimal", "date", "entity"
            properties.push({ name: name, value: value })
          when "enum"
            propValue = _.findWhere(prop.values, { code: value })
            if propValue
              properties.push({ name: name, value: localize(propValue.name)})
            else
              properties.push({ name: name, value: "???"})  
          when "boolean"
            properties.push({ name: name, value: if value then "true" else "false" })
          when "geometry"
            if value.type == "Point"
              properties.push({ name: name, value: value.coordinates[1] + ", " + value.coordinates[0] })
          when "measurement"
            propUnit = _.findWhere(prop.units, { code: value.unit })
            if propUnit
              properties.push({ name: name, value: value.magnitude + " " + propUnit.symbol})
            else
              properties.push({ name: name, value: value.magnitude + " " + "???"})  

          # TO ADD:
          # image, imagelist
          else
            properties.push({ name: name, value: "???"}) 



    return properties
