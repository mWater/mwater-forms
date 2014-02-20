Question = require './Question'
_ = require 'underscore'

module.exports = class RadioQuestion extends Question
  events:
    checked: "checked"

  checked: (e) ->
    index = parseInt(e.target.getAttribute("data-value"))
    value = @options.options[index][0]
    @model.set @id, value

  renderAnswer: (answerEl) ->
    answerEl.html _.template("<div class=\"touch-radio-group\"><%=renderRadioOptions()%></div>", this)
    answerEl.find(".radio-group").addClass "readonly"  if @options.readonly

  renderRadioOptions: ->
    html = ""
    i = undefined
    i = 0
    while i < @options.options.length
      html += _.template("<div class=\"touch-radio <%=checked%>\" data-value=\"<%=position%>\"><%=text%></div>",
        position: i
        text: @options.options[i][1]
        checked: (if @model.get(@id) is @options.options[i][0] then "checked" else "")
      )
      i++
    return html
