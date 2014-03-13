$ = require 'jquery'
Backbone = require 'backbone'
_ = require 'underscore'
LocationFinder = require './LocationFinder'
htmlPreserver = require('pojo-backbone-view').htmlPreserver

module.exports = class Question extends Backbone.View
  className: "question"

  # Validate the question. Returns string of error if not valid or true if not valid but no specific error
  # Returns falsy if no error.
  validate: ->
    val = undefined
    
    # Check required # TODO localize required
    # TODO non-answers/alternates are ok
    val = true  if not @getAnswerValue()? or @getAnswerValue() is ""  if @required
    
    # Check internal validation
    val = @validateInternal()  if not val and @validateInternal
    
    # Check custom validation
    val = @options.validate()  if not val and @options.validate
    
    # Show validation results 
    if val
      @$el.addClass "invalid"
      if typeof(val) == "string"
        @$(".validation-message").text(val)
      else
        @$(".validation-message").text("")
    else
      @$el.removeClass "invalid"
      @$(".validation-message").text("")
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

    # Listen to comment changes 
    @$el.on "change", "#comments", =>
      @setAnswerField('comments', @$("#comments").val())

    # Listen to help clicks
    @$el.on "click", "#toggle_help", =>
      @$(".help").slideToggle()

  update: ->
    # Default is to re-render
    @render()

  render: ->
    # Render question
    question = $("<div>" + require("./Question.hbs")(this) + "</div>")

    # Render answer
    @renderAnswer question.find(".answer")

    # TODO Tabular controls will have display:table-row replaced with block
    unless @shouldBeVisible()
      @$el.hide()
      @visible = false
    
    # Replace element, preserving html
    htmlPreserver.preserveFocus =>
      htmlPreserver.replaceHtml(@$el, question.contents())

    @$("#comments").val(@getAnswerField('comments'))
    
    return this

  # Sets answer field in the model
  setAnswerField: (field, val) ->
    # Clone existing model entry
    entry = @model.get(@id) || {}
    entry = _.clone(entry)
    entry[field] = val
    @model.set(@id, entry)

  # Sets the answer value field in the model
  # Also timestamps and records location if appropriate
  setAnswerValue: (val) ->
    @setAnswerField('value', val)
    if @options.recordTimestamp and not @getAnswerField('timestamp')
      @setAnswerField('timestamp', new Date().toISOString())

    if @options.recordLocation and not @getAnswerField('location')
      locationFinder = @ctx.locationFinder or new LocationFinder()
      locationFinder.getLocation (loc) =>
        if loc?
          @setAnswerField('location', loc.coords)

  # Gets answer field in the model
  getAnswerField: (field) ->
    entry = @model.get(@id) || {}
    return entry[field]

  # Gets the answer value field in the model
  getAnswerValue: ->
    return @getAnswerField('value')
