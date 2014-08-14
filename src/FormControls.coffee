Backbone = require 'backbone'
_ = require 'underscore'
ezlocalize = require 'ez-localize'

# Displays form controls (Save, Complete, Discard)
module.exports = class FormControls extends Backbone.View
  className: "survey"

  initialize: (options) ->
    # Save options
    @options = options or {}
    @contents = @options.contents

    # Save T
    @T = options.T or ezlocalize.defaultT
    
    @render()

  events:
    "click #discard": "discard"
    "click #close": "close"
    "click .finish": "finish"

  # Returns true if validates ok
  validate: ->
    # Get all visible items
    items = _.filter @contents, (c) ->
      c.visible and c.validate

    # Get validation results
    results = _.map items, (item) ->
      item.validate()

    # Scroll item into view
    for i in [0...items.length]
      if results[i]
        items[i].$el.scrollintoview()

    return not _.any(results)

  finish: ->
    # Validate current contents
    @trigger "complete"  if @validate()

  close: ->
    @trigger "close"

  discard: ->
    @trigger "discard"

  render: ->
    @$el.html require('./templates/FormControls.hbs')({}, helpers: { T: @T })
    
    # Add contents 
    _.each @contents, (c) => @$("#contents").append c.$el
    this

  # Remove all contents
  remove: ->
    for content in @contents
      content.remove()
      
    # Call built-in remove 
    super()    
