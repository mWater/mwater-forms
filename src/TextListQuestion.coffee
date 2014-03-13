Question = require './Question'
_ = require 'underscore'
$ = require 'jquery'

# Question that has a variable number of textboxes that the user
# can add more as needed

module.exports = class TextListQuestion extends Question
  events:
    "input .box" : "record"
    "click .remove" : "removeItem"

  renderAnswer: (answerEl) ->
    items = @getAnswerValue() or []

    # Perform a render
    boxes = []
    for i in [0...items.length]
      boxes.push { index: i, position: i+1, text: items[i] } 

    answerEl.html(require('./templates/TextListQuestion.hbs')({
      boxes: boxes, length: boxes.length}))

  record: ->
    # Save to data
    items = []
    for box in @$(".box")
      box = $(box)
      items.push box.val()

    # Last item can't be blank
    if _.last(items) == ""
      items = items[0...-1]

    @setAnswerValue(items)

  removeItem: (ev) ->
    items = _.clone(@getAnswerValue())

    # Remove item
    index = parseInt($(ev.currentTarget).data("index"))
    items.splice(index, 1)
    @setAnswerValue(items)

