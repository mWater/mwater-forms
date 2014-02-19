Question = require './Question'
sourcecodes = require './sourcecodes'

# Allows user to select an mWater source
# Context should have selectSource(function(sourceCode)) to use select button

module.exports = Question.extend
  renderAnswer: (answerEl) ->
    answerEl.html '''
      <div class="input-group">
        <input type="tel" class="form-control">
        <span class="input-group-btn"><button class="btn btn-default" id="select" type="button">Select</button></span>
      </div>
      '''
    answerEl.find("input").val @model.get(@id)
    if not @ctx.selectSource?
      @$("#select").attr("disabled", "disabled")

  events:
    'change' : 'changed'
    'click #select' : 'selectSource'

  changed: ->
    @model.set @id, @$("input").val()

  selectSource: ->
    @ctx.selectSource (sourceCode)=>
      @model.set @id, sourceCode

  validateInternal: ->
    if not @$("input").val()
      return false

    if sourcecodes.isValid(@$("input").val())
      return false

    return "Invalid Source"

