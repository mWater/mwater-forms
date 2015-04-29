_ = require 'lodash'
Backbone = require 'backbone'

# Must be created with options:
# model (backbone model) 
# contents (array of views)
# Optional:
# setEntity: sets the active entity. (entity type, entity id, optional question id. picks first if not specified)
# getEntityCreates: gets entities that have been created. (array of { type: type of entity, entity: entity attributes, question: id of question that created entity })
# getEntityUpdates: gets entities that have been updated. (array of { type: type of entity, _id: <id of entity>, updates: { attributes to update }, question: id of question that updated entity })
# markEntityCreated: marks that an entity has been created. (question id, entity)
module.exports = class FormView extends Backbone.View
  initialize: (options) ->
    # Save options
    @options = options || {}

    @contents = options.contents

    @setEntity = options.setEntity or (-> throw new Error("Not supported"))
    @getEntityCreates = options.getEntityCreates or (-> return [])
    @getEntityUpdates = options.getEntityUpdates or (-> return [])
    @markEntityCreated = options.markEntityCreated or (->)
    
    # Add contents and listen to events
    for content in options.contents
      @$el.append(content.el);
      @listenTo content, 'close', => @trigger('close')
      @listenTo content, 'complete', => @trigger('complete')
      @listenTo content, 'discard', => @trigger('discard')

    # Add listener to model
    @listenTo @model, 'change', => @trigger('change')

    # Override save if passed as option
    if options.save
      @save = options.save

  # Remove the form view, which in turn removes all contents
  remove: ->
    for content in @contents
      content.remove()
      
    # Call built-in remove 
    super()

  load: (data) ->
    @model.clear()

    # Apply defaults 
    @model.set(_.cloneDeep(data))

  save: ->
    return @model.toJSON()
