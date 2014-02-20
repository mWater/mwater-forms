Question = require './Question'
_ = require 'underscore'

module.exports = class CheckQuestion extends Question
  events:
    checked: "checked"

  checked: (e) ->
    # Get checked
    @model.set @id, @$(".touch-checkbox").hasClass("checked")

  renderAnswer: (answerEl) ->
    i = undefined
    answerEl.append $(_.template("<div class=\"touch-checkbox <%=checked%>\"><%=text%></div>",
      text: @options.text
      checked: (if (@model.get(@id)) then "checked" else "")
    ))
