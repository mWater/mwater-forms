Question = require './Question'
_ = require 'underscore'

module.exports = class TextQuestion extends Question
  renderAnswer: (answerEl) ->
    if @options.format == "multiline"
      answerEl.html _.template("<textarea id=\"input\" class=\"form-control\" rows=\"5\"/>")(this)
      answerEl.find("textarea").attr "readonly", "readonly"  if @options.readonly
    else
      answerEl.html _.template("<input id=\"input\" class=\"form-control\" type=\"text\"/>")(this)
      answerEl.find("input").attr "readonly", "readonly"  if @options.readonly

  updateAnswer: (answerEl) ->
    answerEl.find("#input").val @getAnswerValue()

  events:
    "change #input": "changed"
    "keydown #input": "inputKeydown"
    "keydown #comments": "commentsKeydown"

  getText: ->
    return @$("#input").val()

  changed: ->
    @setAnswerValue(@getText())

  validateInternal: ->
    if @options.format == "email"
      if @getText().match /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        return false
      return true
    if @options.format == "url"
      if @getText().match /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
        return false
      return true

    return false

  inputKeydown: (ev) ->
    # If it's a multiline, we have to handle the enter key normally
    if @options.format != "multiline"
      if ev.keyCode == 13
        if @options.commentsField
          @$("#comments").focus()
          @$("#comments").select()
        else
          @commentsKeydown(ev)

  commentsKeydown: (ev) ->
    if ev.keyCode == 13
      @$("#input").blur()
      @trigger 'nextQuestion'

  setFocus: ->
    @$("#input").focus()
    @$("#input").select()