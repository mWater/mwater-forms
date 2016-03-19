Question = require './Question'
_ = require 'lodash'
$ = require 'jquery'

module.exports = class RadioQuestion extends Question
  events:
    "click .answer .touch-radio" : "checked"
    "change .specify-input": "specifyChange"

  checked: (e) ->
    # Ignore if readonly
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

    # Remove other specifies
    specify = _.clone(@getAnswerField('specify') || {})
    specify = _.pick(specify, [value])
    @setAnswerField('specify', specify)

  specifyChange: (e) ->
    specify = _.clone(@getAnswerField('specify') || {})
    specify[$(e.currentTarget).data('id')] = $(e.currentTarget).val()
    @setAnswerField('specify', specify)

  updateAnswer: (answerEl) ->
    answerEl.html _.template("<div class=\"touch-radio-group\"><%=renderRadioOptions()%></div>")(this)
    answerEl.find(".radio-group").addClass "readonly"  if @options.readonly

  renderRadioOptions: ->
    html = ""
    for i in [0...@options.choices.length]
      checked = @getAnswerValue() is @options.choices[i].id
      data = {
        id: @options.choices[i].id
        position: i
        text: @options.choices[i].label
        checked: checked
        hint: @options.choices[i].hint
        specify: checked and @options.choices[i].specify
        specifyValue: if @model.get(@id)? and @model.get(@id).specify? then @model.get(@id).specify[@options.choices[i].id]
      }

      html += require("./templates/RadioQuestionChoice.hbs")(data, helpers: { T: @T })

    return html
