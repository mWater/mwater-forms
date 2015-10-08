Backbone = require 'backbone'
_ = require 'lodash'
ezlocalize = require 'ez-localize'
ControlList = require './ControlList'

# Displays form controls (Save, Complete, Discard)
module.exports = class FormControls extends Backbone.View
  className: "survey"

  initialize: (options) ->
    # Save options
    @options = options or {}
    @contents = @options.contents

    # Save T
    @T = options.T or ezlocalize.defaultT

    @controlList = new ControlList(@contents, this)

    @render()

  events:
    "click #discard": "discard"
    "click #close": "close"
    "click .finish": "finish"

  # Returns true if validates ok
  validate: ->
    return @controlList.validate()

  finish: ->
    # Validate current contents
    @trigger "complete"  if @validate()

  close: ->
    @trigger "close"

  discard: ->
    @trigger "discard"

  render: ->
    @$el.html require('./templates/FormControls.hbs')({
      submitLabel: @options.submitLabel
      allowSaveForLater: @options.allowSaveForLater
      }, helpers: { T: @T })
    
    # Add contents 
    _.each @contents, (c) => @$("#contents").append c.$el
    this

  # Remove all contents
  remove: ->
    for content in @contents
      content.remove()
      
    # Call built-in remove 
    super()    
