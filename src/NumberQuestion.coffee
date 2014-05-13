Question = require './Question'

# Number question with optional prefix and suffix. Set prefix option or suffix option
# to a string to appear before/after box.

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
    change: "changed"

  validateInternal: ->
    val = @$("input").val()
    if @options.decimal and val.length > 0
      if isNaN(parseFloat(val))
        return true # TODO localize
    else if val.length > 0
      if not val.match(/^-?\d+$/)
        return true # TODO localize
    return null

  changed: ->
    val = if @options.decimal then parseFloat(@$("input").val()) else parseInt(@$("input").val())
    if isNaN(val)
      val = null
    @setAnswerValue(val)
