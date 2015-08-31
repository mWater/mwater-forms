Question = require './Question'

# Number question with optional prefix and suffix. Set prefix option or suffix option
# to a string to appear before/after box.

# Validation on mobile HTML5 is a mess.
# type="number" puts a numeric keypad, but allows letters to be typed and then silently strips them, 
# not from display but from the val().
# Was using type="text" for decimal, but awkward on mobile, type="tel" for integer for now
module.exports = Question.extend
  renderAnswer: (answerEl) ->
    data = {
      prefix: @options.prefix, 
      suffix: @options.suffix, 
      decimal: @options.decimal,
      prefixOrSuffix: @options.prefix or @options.suffix
    }
    answerEl.html require('./templates/NumberQuestion.hbs')(data, helpers: { T: @T })

  updateAnswer: (answerEl) ->
    answerEl.find("input").val @getAnswerValue()

  events:
    "change .answer input": "changed"
    "input .answer input": "checkValidation"
    "keydown .answer input": "inputKeydown"

  validateInternal: ->
    val = @$(".answer input").val()
    if @isValid(val)
      return null
    else
      return true

  # Check regex matching of numbers
  isValid: (val) ->
    if val.length == 0
      return true

    if @options.decimal
      return val.match(/^-?[0-9]*\.?[0-9]+$/) and not isNaN(parseFloat(val))
    else
      return val.match(/^-?\d+$/)

  checkValidation: ->
    # Check if valid number
    val = @$(".answer input").val()

    # Always validate immediately at input box level
    @$(".answer").toggleClass("has-error", not @isValid(val))

  changed: ->
    # Check if valid number
    val = @$(".answer input").val()

    if @isValid(val)
      val = if @options.decimal then parseFloat(val) else parseInt(val)
      if isNaN(val)
        val = null
      @setAnswerValue(val)

  setFocus: ->
    input = @$(".answer input")
    input.focus()
    input.select()