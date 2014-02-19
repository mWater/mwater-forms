# TODO Fix to have editable YYYY-MM-DD with click to popup scroller
_ = require 'underscore'

Question = require './Question'

module.exports = Question.extend
  events:
    change: "changed"

  changed: ->
    @model.set @id, @$el.find("input[name=\"date\"]").val()

  renderAnswer: (answerEl) ->
    answerEl.html _.template("<input class=\"needsclick\" name=\"date\" />", this)
    answerEl.find("input").val @model.get(@id)

    # Support readonly
    if @options.readonly
      answerEl.find("input").attr('readonly', 'readonly')
    else
      answerEl.find("input").scroller
        preset: "date"
        theme: "ios"
        display: "modal"
        mode: "scroller"
        dateOrder: "yymmD dd"
        dateFormat: "yy-mm-dd"
