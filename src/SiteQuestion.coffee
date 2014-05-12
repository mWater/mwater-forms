Question = require './Question'
siteCodes = require './siteCodes'

# Allows user to select an mWater site
# Context should have selectSite(function(siteCode)) to use select button

module.exports = class SiteQuestion extends Question
  renderAnswer: (answerEl) ->
    answerEl.html '''
      <div class="input-group">
        <input type="tel" class="form-control">
        <span class="input-group-btn"><button class="btn btn-default" id="select" type="button">Select</button></span>
      </div>
      '''
    if not @ctx.selectSite?
      @$("#select").attr("disabled", "disabled")

  updateAnswer: (answerEl) ->
    val = @getAnswerValue()
    if val then val = val.code
    answerEl.find("input").val val

  events:
    'change' : 'changed'
    'click #select' : 'selectSite'

  changed: ->
    @setAnswerValue(code: @$("input").val())

  selectSite: ->
    @ctx.selectSite (siteCode)=>
      @setAnswerValue(code: siteCode)

  validateInternal: ->
    if not @$("input").val()
      return false

    if siteCodes.isValid(@$("input").val())
      return false

    return "Invalid Site"

