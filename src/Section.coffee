Backbone = require 'backbone'
_ = require 'underscore'

module.exports = class Section extends Backbone.View
  className: "section"

  template: _.template("<div class=\"contents\"></div>")

  initialize: (options) ->
    # Save options
    @options = options or {}
    @name = @options.name
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

    # Get validation results
    results = _.map items, (item) ->
      item.validate()

    # Scroll item into view
    for i in [0...items.length]
      if results[i]
        items[i].$el.scrollintoview()

    return not _.any(results)

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
