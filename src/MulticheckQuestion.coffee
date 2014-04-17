Question = require './Question'
_ = require 'underscore'
$ = require 'jquery'

module.exports = class MulticheckQuestion extends Question
  events:
    "click .choice": "checked"
    "change .specify-input": "specifyChange"

  checked: (e) ->
    # Get all checked
    value = []
    opts = @options.choices
    $(e.currentTarget).toggleClass("checked")

    @$(".touch-checkbox").each (index, el) ->
      pos = parseInt($(el).data("value"))
      if $(this).hasClass("checked")
        value.push opts[pos].id

    @setAnswerValue(value)

    # Remove other specifies
    specify = _.clone(@getAnswerField('specify') || {})
    specify = _.pick(specify, value)
    @setAnswerField('specify', specify)

  specifyChange: (e) ->
    specify = _.clone(@getAnswerField('specify') || {})
    specify[$(e.currentTarget).data('id')] = $(e.currentTarget).val()
    @setAnswerField('specify', specify)

  updateAnswer: (answerEl) ->
    answerEl.empty()
    for i in [0...@options.choices.length]
      checked = @getAnswerValue() and _.contains(@getAnswerValue(), @options.choices[i].id)
      data = {
        id: @options.choices[i].id
        position: i
        text: @options.choices[i].label
        checked: checked
        hint: @options.choices[i].hint
        specify: checked and @options.choices[i].specify
        specifyValue: if @model.get(@id)? and @model.get(@id).specify? then @model.get(@id).specify[@options.choices[i].id]
      }

      html = require("./templates/MulticheckQuestionChoice.hbs")(data)
      answerEl.append $(html)
