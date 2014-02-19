Backbone = require 'backbone'
_ = require 'underscore'

module.exports = Backbone.View.extend
  initialize: (options) ->
    # Save options
    @options = options || {}

    @$el.html _.template('''
      <div class="well well-small"><%=html%><%-text%></div>
      ''')(html: @options.html, text: @options.text)

    # Adjust visibility based on model if model present
    if @model?
      @model.on("change", @updateVisibility, @)

    # Starts visible
    @visible = true
    if not @shouldBeVisible()
      @$el.hide()
      @visible = false

  updateVisibility: (e) ->
      # slideUp/slideDown
      if @shouldBeVisible() and not @visible
          @$el.slideDown()
      if not @shouldBeVisible() and @visible
          @$el.slideUp()
      @visible = @shouldBeVisible()

  shouldBeVisible: ->
      if not this.options.conditional
          return true
      # Test equality to handle undefined more gracefully
      return @options.conditional(this.model) == true
  