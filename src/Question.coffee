Backbone = require 'backbone'
_ = require 'underscore'

module.exports = class Question extends Backbone.View
  className: "question"

  # Validate the question. Returns string of error if not valid or true if not valid but no specific error
  # Returns falsy if no error.
  validate: ->
    val = undefined
    
    # Check required
    val = "Required"  if @model.get(@id) is `undefined` or @model.get(@id) is null or @model.get(@id) is ""  if @required
    
    # Check internal validation
    val = @validateInternal()  if not val and @validateInternal
    
    # Check custom validation
    val = @options.validate()  if not val and @options.validate
    
    # Show validation results TODO
    if val
      @$el.addClass "invalid"
    else
      @$el.removeClass "invalid"
    return val

  updateVisibility: (e) ->
    
    # slideUp/slideDown
    @$el.slideDown()  if @shouldBeVisible() and not @visible
    @$el.slideUp()  if not @shouldBeVisible() and @visible
    @visible = @shouldBeVisible()

  shouldBeVisible: ->
    return true  unless @options.conditional
    
    # Test equality to handle undefined more gracefully
    return @options.conditional(@model) is true

  initialize: (options) ->
    # Save options
    @options = options or {}
    
    # Set class based on style
    @$el.addClass "question-" + (@options.style or "default")
    
    # Adjust visibility based on model
    @model.on "change", @updateVisibility, this  if @options.conditional
    
    # Update based on model changes
    @model.on "change:" + @id, @update, this
    @required = @options.required
    
    # Starts visible
    @visible = true
    
    # Save context
    @ctx = @options.ctx or {}
    @render()

  update: ->
    # Default is to re-render
    @render()

  render: ->
    @$el.html(require("./Question.hbs")(this))
    
    # Render answer
    @renderAnswer @$(".answer")
    
    # TODO Tabular controls will have display:table-row replaced with block
    unless @shouldBeVisible()
      @$el.hide()
      @visible = false
    this

  # Sets the answer field in the model
  setAnswer: (val) ->
    # Clone existing model entry
    entry = @model.get(@id) || {}
    entry = _.clone(entry)
    entry.answer = val
    @model.set(@id, entry)

  # Gets the answer field in the model
  getAnswer: ->
    entry = @model.get(@id) || {}
    return entry.answer
