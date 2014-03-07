Question = require './Question'
_ = require 'underscore'
$ = require 'jquery'

module.exports = class RadioQuestion extends Question
  events:
    "click .touch-radio" : "checked"

  checked: (e) ->
    # Ignore if readonlu
    if @options.readonly
      return

    # Set answer
    index = parseInt(e.currentTarget.getAttribute("data-value"))
    value = @options.choices[index].id

    # If already set, unset
    if value == @getAnswerValue()
      @setAnswerValue(null)
    else
      @setAnswerValue(value)

  renderAnswer: (answerEl) ->
    answerEl.html _.template("<div class=\"touch-radio-group\"><%=renderRadioOptions()%></div>", this)
    answerEl.find(".radio-group").addClass "readonly"  if @options.readonly

  renderRadioOptions: ->
    html = ""
    i = undefined
    i = 0
    while i < @options.choices.length
      data = {
        position: i
        text: @options.choices[i].label
        checked: (if @getAnswerValue() is @options.choices[i].id then "checked" else "")
        hint: @options.choices[i].hint
      }

      html += _.template('''
        <div class="touch-radio <%=checked%>" 
          data-value="<%=position%>">
          <%=text%>
          <span class="choice-hint"><%=hint%></span>
        </div>''', data)
      i++
    return html
