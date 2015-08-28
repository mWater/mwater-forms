Backbone = require 'backbone'
_ = require 'underscore'
ControlList = require './ControlList'

module.exports = class Section extends Backbone.View
  className: "section"

  template: _.template("<div class=\"contents\"></div>")

  initialize: (options) ->
    # Save options
    @options = options or {}
    @name = @options.name
    @contents = @options.contents

    @controlList = new ControlList(@contents, this)

    # Always invisible initially
    @$el.hide()
    @render()
    return

  shouldBeVisible: =>
    return true unless @options.conditional
    @options.conditional @model

  # Returns true if validates ok
  validate: ->
    return @controlList.validate()

  render: ->
    @$el.html @template(this)
    
    # Add contents (questions, mostly)
    contentsEl = @$(".contents")
    _.each @contents, (c) ->
      contentsEl.append c.$el

    this

  # Remove all contents
  remove: ->
    for content in @contents
      content.remove()
      
    # Call built-in remove 
    super()
