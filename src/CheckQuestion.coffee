Question = require './Question'
_ = require 'underscore'
$ = require 'jquery'

# Check question that has either a checkbox next to the question prompt, 
# or next to a label, if present
module.exports = class CheckQuestion extends Question
  events:
    "click .prompt": "checked"

  checked: (e) =>
    # Skip if help button was clicked
    if @$("#toggle_help").length > 0 and $.contains(@$("#toggle_help")[0], e.target)
      return

    # Get checked
    @setAnswerValue(not @getAnswerValue())

  renderAnswer: ->
    # Make a checkbox
    @$(".prompt").addClass("touch-checkbox")

  updateAnswer: (answerEl) ->
    # Check or uncheck question prompt
    if @getAnswerValue() 
      @$(".prompt").addClass("checked")
    else
      @$(".prompt").removeClass("checked")

