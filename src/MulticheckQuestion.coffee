Question = require './Question'
_ = require 'underscore'

module.exports = Question.extend
  events:
    checked: "checked"

  checked: (e) ->
    # Get all checked
    value = []
    opts = @options.options
    @$(".touch-checkbox").each (index, el) ->
      pos = parseInt($(el).data("value"))
      if $(this).hasClass("checked")
        value.push opts[pos][0]

    @model.set @id, value

  renderAnswer: (answerEl) ->
    for i in [0...@options.options.length]
      # Add headers if length 1
      if @options.options[i].length == 1
        answerEl.append $(_.template("<div class=\"check-section\"><%=text%></div>",
          text: @options.options[i][0]
        ))
      else
        answerEl.append $(_.template("<div class=\"touch-checkbox <%=checked%>\" data-value=\"<%=position%>\"><%=text%></div>",
          position: i
          text: @options.options[i][1]
          checked: (if (@model.get(@id) and _.contains(@model.get(@id), @options.options[i][0])) then "checked" else "")
        ))

