Backbone = require 'backbone'
_ = require 'underscore'

module.exports = class Section extends Backbone.View
  className: "section"

  template: _.template("<div class=\"contents\"></div>")

  initialize: (options) ->
    # Save options
    @options = options or {}
    @title = @options.title
    @contents = @options.contents
    
    # Always invisible initially
    @$el.hide()
    @render()
    return

  shouldBeVisible: ->
    return true unless @options.conditional
    @options.conditional @model

  validate: ->
    # Get all visible items
    items = _.filter @contents, (c) ->
      c.visible and c.validate

    return not _.any(_.map(items, (item) ->
      item.validate()
    ))

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
