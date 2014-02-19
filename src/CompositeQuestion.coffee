Question = require './Question'
_ = require 'underscore'
Backbone = require 'backbone'

module.exports = class CompositeQuestion extends Question
  # Check that all questions validate
  validateInternal: ->
    # Add contents
    for q in @contents
      val = q.validate()
      if val
        return val
    return null

  update: ->
    # Only update if different 
    if not _.isEqual(@model.get(@id), @submodel.toJSON())
      @submodel.clear()
      @submodel.set(@model.get(@id) || {})

  renderAnswer: (answerEl) ->
    answerEl.html _.template("<div id=\"contents\"></div>")

    # Create submodel
    @submodel = new Backbone.Model(@model.get(@id))

    # Wire submodel changes to model
    @submodel.on "change", =>
      # Only set if different 
      if not _.isEqual(@model.get(@id), @submodel.toJSON())
        @model.set(@id, @submodel.toJSON())

    # Create contents
    @contents = @options.createContents(@submodel)

    # Add contents
    for q in @contents
      answerEl.find("#contents").append(q.el)

  # Remove all contents
  remove: ->
    for content in @contents
      content.remove()
      
    # Call built-in remove 
    super()
