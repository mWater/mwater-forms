# Group of questions which validate as a unit

_ = require 'underscore'
Backbone = require 'backbone'

module.exports = class QuestionGroup extends Backbone.View
  initialize: (options) ->
    @options = options || {}
    @contents = options.contents
    @render()

  validate: ->
    # Get all visible items
    items = _.filter(@contents, (c) ->
      c.visible and c.validate
    )
    return not _.any(_.map(items, (item) ->
      item.validate()
    ))

  render: ->
    @$el.html ""
    
    # Add contents (questions, mostly)
    _.each @contents, (c) => @$el.append c.$el

    this

  # Remove all contents
  remove: ->
    for content in @contents
      content.remove()
      
    # Call built-in remove 
    super()
