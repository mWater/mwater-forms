_ = require 'lodash'
Backbone = require 'backbone'

# Must be created with model (backbone model) and contents (array of views)
module.exports = class FormView extends Backbone.View
  initialize: (options) ->
    # Save options
    @options = options || {}

    @contents = options.contents
    
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
