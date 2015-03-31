_ = require 'lodash'

# Translates entity properties into answers and vice-versa
# See docs/Property Links.md
module.exports = class FormEntityLinker
  # entity: entity to load properties to/from
  # formModel: Backbone model of the form
  # isQuestionVisible: determines if a question with (_id) is visible. returns boolean
  constructor: (entity, formModel, isQuestionVisible) ->
    @entity = entity
    @model = formModel
    @isQuestionVisible = isQuestionVisible

  # Loads a property link to the form (if direction is both or load)
  loadToForm: (propLink) ->
    # Only if direction is "load" or "both"
    if propLink.direction not in ["load", "both"]
      return

    # Get old answer, cloning to make sure backbone recognizes as changed
    answer = @model.get(propLink.question) or {}
    answer = _.cloneDeep(answer)

    val = @entity[propLink.property.code]
    if not val?
      return

    switch propLink.type
      when "direct"
        # Handle by type
        switch propLink.property.type
          when "geometry"
            if val.type == "Point"
              if not answer.value? 
                answer.value = {}
             answer.value.latitude = val.coordinates[1]
             answer.value.longitude = val.coordinates[0] 
          else
            answer.value = val
        @model.set(propLink.question, answer)

      when "geometry:location"
        if val.type == "Point"
          if not answer.value? 
            answer.value = {}
          answer.value.latitude = val.coordinates[1]
          answer.value.longitude = val.coordinates[0] 

          @model.set(propLink.question, answer)

      when "enum:choice"
        # Find the from value
        mapping = _.findWhere(propLink.mappings, { from: val })
        if mapping
          # Copy property to question value 
          answer.value = mapping.to
          @model.set(propLink.question, answer)

      when "boolean:choices"
        answer.value = answer.value or []

        # Make sure choice is selected
        if val == true
          if not _.contains(answer.value, propLink.choice)
            answer.value.push(propLink.choice)
            @model.set(propLink.question, answer)
        else 
          if _.contains(answer.value, propLink.choice)
            answer.value = _.without(answer.value, propLink.choice)
            @model.set(propLink.question, _.cloneDeep(answer)) # Needed to cause change in backbone

      when "boolean:choice"
        # Find the from value
        mapping = _.findWhere(propLink.mappings, { from: (if val then "true" else "false") })
        if mapping
          # Copy property to question value 
          answer.value = mapping.to
          @model.set(propLink.question, answer)

      when "boolean:alternate"
        if val
          answer.alternate = propLink.alternate
        else
          answer.alternate = null

        @model.set(propLink.question, answer)

      when "measurement:units"
        # Find the from value
        mapping = _.findWhere(propLink.mappings, { from: val.unit })
        if mapping
          # Copy property to question value
          answer.value = { quantity: val.magnitude, units: mapping.to }
          @model.set(propLink.question, answer)

      when "text:specify"
        # Copy property to question specify
        answer.specify = answer.specify or {}
        answer.specify[propLink.choice] = val
        @model.set(propLink.question, answer)

      when "decimal:location_accuracy"
        if not answer.value
          answer.value = {}

        answer.value.accuracy = val
        @model.set(propLink.question, answer)
      else
        throw new Error("Unknown link type #{propLink.type}")

  # Saves a property link from the form (if direction is both or save)
  saveFromForm: (propLink) ->
    # Only if direction is "save" or "both"
    if propLink.direction not in ["save", "both"]
      return

    # Check if question is visible provided
    if @isQuestionVisible
      if not @isQuestionVisible(propLink.question)
        return

    # Get answer
    answer = @model.get(propLink.question) or {}

    switch propLink.type
      when "direct"
        if answer.value? 
          # Handle by type
          switch propLink.property.type
            when "geometry"
              @entity[propLink.property.code] = { type: "Point", coordinates: [answer.value.longitude, answer.value.latitude] }
            else
              @entity[propLink.property.code] = answer.value
        else
          @entity[propLink.property.code] = null

      when "geometry:location"
        if answer.value? and answer.value.longitude? and answer.value.latitude?
          @entity[propLink.property.code] = { type: "Point", coordinates: [answer.value.longitude, answer.value.latitude] }

      when "enum:choice"
        # Find the to value
        mapping = _.findWhere(propLink.mappings, { to: answer.value })
        if mapping
          # Set the property
          @entity[propLink.property.code] = mapping.from

      when "boolean:choices"
        # Check if choice present
        if _.isArray(answer.value)
          @entity[propLink.property.code] = _.contains(answer.value, propLink.choice)

      when "boolean:choice"
        # Find the to value
        mapping = _.findWhere(propLink.mappings, { to: answer.value })
        if mapping
          # Set the property
          @entity[propLink.property.code] = mapping.from == "true"

      when "boolean:alternate"
        @entity[propLink.property.code] = answer.alternate == propLink.alternate

      when "measurement:units"
        if answer.value?
          # Find the to value
          mapping = _.findWhere(propLink.mappings, { to: answer.value.units })
          if mapping  and answer.value.quantity?
            # Set the property
            @entity[propLink.property.code] = { magnitude: answer.value.quantity, unit: mapping.from }
          else 
            @entity[propLink.property.code] = null


      when "text:specify"
        # Check if choice present
        if answer.specify and answer.specify[propLink.choice]?
          @entity[propLink.property.code] = answer.specify[propLink.choice]

      when "decimal:location_accuracy"
        if answer.value?
          @entity[propLink.property.code] = answer.value.accuracy

      else
        throw new Error("Unknown link type #{propLink.type}")

