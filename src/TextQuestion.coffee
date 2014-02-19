Question = require './Question'
_ = require 'underscore'

module.exports = class TextQuestion extends Question
  renderAnswer: (answerEl) ->
    if @options.multiline
      answerEl.html _.template("<textarea class=\"form-control\" rows=\"5\" x-webkit-speech/>", this)
      answerEl.find("textarea").val @model.get(@id)
      answerEl.find("textarea").attr "readonly", "readonly"  if @options.readonly
    else
      answerEl.html _.template("<input class=\"form-control\" type=\"text\" x-webkit-speech/>", this)
      answerEl.find("input").val @model.get(@id)
      answerEl.find("input").attr "readonly", "readonly"  if @options.readonly

  events:
    change: "changed"

  changed: ->
    @model.set @id, @$((if @options.multiline then "textarea" else "input")).val()
