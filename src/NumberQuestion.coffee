Question = require './Question'

# Number question with optional prefix and suffix. Set prefix option or suffix option
# to a string to appear before/after box.

module.exports = Question.extend
  renderAnswer: (answerEl) ->
    answerEl.html require('./templates/NumberQuestion.hbs')(
      prefix: @options.prefix, 
      suffix: @options.suffix, 
      decimal: @options.decimal,
      prefixOrSuffix: @options.prefix or @options.suffix)

    answerEl.find("input").val @model.get(@id)

  events:
    change: "changed"

  validateInternal: ->
    val = @$("input").val()
    if @options.decimal and val.length > 0
      if isNaN(parseFloat(val))
        return "Invalid decimal number"
    else if val.length > 0
      if not val.match(/^-?\d+$/)
        return "Invalid integer number"
    return null

  changed: ->
    val = parseFloat(@$("input").val())
    if isNaN(val)
      val = null
    @model.set @id, val 
