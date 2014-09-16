Question = require './Question'
_ = require 'underscore'
$ = require 'jquery'

module.exports = class CheckQuestion extends Question
  events:
    "click #check": "checked"

  checked: (e) ->
    # Get checked
    @setAnswerValue(not @getAnswerValue())

  updateAnswer: (answerEl) ->
    answerEl.html $(_.template("<div id=\"check\" class=\"touch-checkbox <%=checked%>\"><%-label%></div>",
      label: if @options.label then @options.label else "&nbsp;"
      checked: (if @getAnswerValue() then "checked" else "")
    ))
