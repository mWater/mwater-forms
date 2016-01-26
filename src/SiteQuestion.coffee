Question = require './Question'
siteCodes = require './siteCodes'
_ = require 'lodash'
React = require 'react'
ReactDOM = require 'react-dom'
SiteDisplayComponent = require './SiteDisplayComponent'

# Allows user to select an mWater site
# options.siteTypes is array of acceptable site types. null/undefined for all
# Context should have selectSite(siteTypes, function(siteCode)) to use select button
# siteTypes is optional list of acceptable top-level site types. Null/undefined for all
module.exports = class SiteQuestion extends Question
  renderAnswer: (answerEl) ->
    answerEl.html '''
      <div class="input-group">
        <input id="input" type="tel" class="form-control">
        <span class="input-group-btn"><button class="btn btn-default" id="select" type="button">''' + @T("Select") + '''</button></span>
      </div>
      <div id="site_display"></div>
      '''
    if not @ctx.selectSite?
      @$("#select").attr("disabled", "disabled")

  remove: ->
    # Remove react component
    siteDisplayElem = @$("#site_display")[0]
    if siteDisplayElem
      ReactDOM.unmountComponentAtNode(siteDisplayElem)

    super

  updateAnswer: (answerEl) ->
    val = @getAnswerValue()
    if val then val = val.code
    answerEl.find("input").val val

    # Display site information
    siteDisplayElem = @$("#site_display")[0]
    if siteDisplayElem
      ReactDOM.render(React.createElement(SiteDisplayComponent, formCtx: @ctx, siteCode: val, hideCode: true), siteDisplayElem)

  events:
    'change' : 'changed'
    'click #select' : 'selectSite'
    "keydown #input": "inputKeydown"

  changed: ->
    @setAnswerValue(code: @$("input").val())

  selectSite: ->
    @ctx.selectSite @options.siteTypes, (siteCode) =>
      @setAnswerValue(code: siteCode)
      @validate()

  validateInternal: ->
    if not @$("input").val()
      return false

    if siteCodes.isValid(@$("input").val())
      return false

    return "Invalid Site"
