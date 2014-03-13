Question = require './Question'
_ = require 'underscore'
$ = require 'jquery'

module.exports = class CheckQuestion extends Question
  events:
    "click #check": "checked"

  checked: (e) ->
    # Get checked
    @setAnswerValue(not @getAnswerValue())

  renderAnswer: (answerEl) ->
    i = undefined
    answerEl.append $(_.template("<div id=\"check\" class=\"touch-checkbox <%=checked%>\"><%=label%></div>",
      label: @options.label
      checked: (if @getAnswerValue() then "checked" else "")
    ))
