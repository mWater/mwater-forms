$ = require 'jquery'
Backbone = require 'backbone'
_ = require 'underscore'
LocationFinder = require './LocationFinder'
ezlocalize = require 'ez-localize'

# Question types are subclasses that implement renderAnswer and updateAnswer
# See methods for more detail
# Common options include:
# radioAlternates: true to use radio buttons for alternates, not checkboxes
# alternates: array of {id: id of alternate, label: label of alternate}
# required: true to make question required
# conditional: function to determine visibility. Passed model
# style: optional style of question. Default is default which maps to .question-default
# validate: custom validation function
# commentsField: true to include comment field
# recordTimestamp: true to record timestamp when completed
# recordLocation: true to record location when completed
#
# ctx: context of question. See Forms Context.md docs.
# T: localizer function to use. See ez-localize module for more details. If not passed, uses default
module.exports = class Question extends Backbone.View
  className: "question"

  initialize: (options) ->
    # Save options
    @options = options or {}
    
    # Save T
    @T = options.T or ezlocalize.defaultT

    # Set class based on style
    @$el.addClass "question-" + (@options.style or "default")
    
    # Adjust visibility based on model
    @model.on "change", @updateVisibility, this  if @options.conditional
    
    # Update based on model changes
    @model.on "change:" + @id, @update, this
    @required = @options.required
    
    # Starts visible
    @visible = true

    # Help starts invisible
    @helpVisible = false
    
    # Save context
    @ctx = @options.ctx or {}

    # If sticky, set initial value
    if @options.sticky and @ctx.stickyStorage and not @model.get(@id)?
      value = @ctx.stickyStorage.get(@id)
      if value?
        @setAnswerField("value", value)

    @render()

    # Listen to comment changes 
    @$el.on "change", "#comments", =>
      @setAnswerField('comments', @$("#comments").val())

    # Listen to help clicks
    @$el.on "click", "#toggle_help", =>
      @helpVisible = not @helpVisible
      @$(".help").slideToggle(@helpVisible)

    # Listen to alternates
    @$el.on "click", ".alternate", (ev) =>
      # If being set
      if @getAnswerField('alternate') != ev.currentTarget.id
        # Cache answer and remove
        @cachedAnswer = @getAnswerValue()
        @setAnswerValue(null)

        @setAnswerField('alternate', ev.currentTarget.id)
      else 
        # Restore cached answer
        @setAnswerValue(@cachedAnswer)
        @setAnswerField('alternate', null)

  # Default checks falsy values
  isAnswered: ->
    return @getAnswerValue()? and @getAnswerValue() != ""

  # Validate the question. Returns string of error if not valid or true if not valid but no specific error
  # Returns falsy if no error.
  validate: ->
    val = undefined
    
    # Check required and answered # TODO localize required
    if @required
      if not @isAnswered() and not @getAnswerField('alternate') 
        val = true
    
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

  # Update question visibility
  updateVisibility: (e) ->
    # slideUp/slideDown
    @$el.slideDown()  if @shouldBeVisible() and not @visible
    @$el.slideUp()  if not @shouldBeVisible() and @visible
    @visible = @shouldBeVisible()

  shouldBeVisible: ->
    return true  unless @options.conditional
    
    # Test equality to handle undefined more gracefully
    return @options.conditional(@model) is true

  # Should fill answer element appropriately. Will only be called once
  renderAnswer: (answerEl) ->
    # Default does nothing
    return

  # Should update answer element appropriately. Called on each change to model value
  updateAnswer: (answerEl) ->
    # Default does nothing
    return

  update: ->
    # Update answer if changed
    if not _.isEqual(@getAnswerValue(), @currentAnswer)
      @updateAnswer @$(".answer")
      @currentAnswer = @getAnswerValue()

    # Update comments
    if @options.commentsField    
      @$("#comments").val(@getAnswerField('comments'))

    # Set checked status of alternates
    @$(".alternate").removeClass("checked")
    if @options.alternates
      # If alternate is selected and value is present, erase alternate
      if @getAnswerValue()? and @getAnswerField('alternate')
        @setAnswerField('alternate', null)

      if @getAnswerField('alternate')
        @$("#" + @getAnswerField('alternate')).addClass("checked")

  # Render is called only once automatically from the constructor
  # The question is self-updating from then on via listening to the model
  render: ->
    # Render question
    @$el.html require("./Question.hbs")(this, helpers: { T: @T })

    # TODO Tabular controls will have display:table-row replaced with block
    unless @shouldBeVisible()
      @$el.hide()
      @visible = false

    # Render answer
    @renderAnswer @$(".answer")

    # Update answer
    @updateAnswer @$(".answer")

    # Save current answer to avoid spurious answer updates
    @currentAnswer = @getAnswerValue()

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

    # If sticky, save value
    if @options.sticky and @ctx.stickyStorage
      @ctx.stickyStorage.set(@id, val)

  # Gets answer field in the model
  getAnswerField: (field) ->
    entry = @model.get(@id) || {}
    return entry[field]

  # Gets the answer value field in the model
  getAnswerValue: ->
    return @getAnswerField('value')
