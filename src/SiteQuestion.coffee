Question = require './Question'
siteCodes = require './siteCodes'
_ = require 'lodash'
React = require 'react'
ReactDOM = require 'react-dom'
EntityDisplayComponent = require './EntityDisplayComponent'

# Allows user to select an mWater site
# options.siteTypes is array of acceptable site types. null/undefined for all
# Context should have selectSite(siteType, function(siteCode)) to use select button
# siteType is "water_point", etc.
module.exports = class SiteQuestion extends Question
  renderAnswer: (answerEl) ->
    answerEl.html '''
      <div class="input-group">
        <input id="input" type="tel" class="form-control">
        <span class="input-group-btn"><button class="btn btn-default" id="select" type="button">''' + @T("Select") + '''</button></span>
      </div>
      <br/>
      <div id="site_display"></div>
      '''
    if not @ctx.selectEntity?
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
      # Convert to new entity type
      siteType = @options.siteTypes[0] or "Water point" 
      entityType = siteType.toLowerCase().replace(/ /g, "_")

      ReactDOM.render(React.createElement(EntityDisplayComponent, formCtx: @ctx, displayInWell: true, entityCode: val, entityType: entityType), siteDisplayElem)

  events:
    'change' : 'changed'
    'click #select' : 'selectSite'
    "keydown #input": "inputKeydown"

  changed: ->
    @setAnswerValue(code: @$("input").val())

  selectSite: ->
    # Convert to new entity type
    siteType = @options.siteTypes[0] or "Water point" 
    entityType = siteType.toLowerCase().replace(/ /g, "_")

    @ctx.selectEntity { entityType: entityType, callback: (entityId) =>
      # Get entity
      @ctx.getEntityById(entityType, entityId, (entity) =>
        @setAnswerValue(code: entity.code)
        @validate()
      )
    }

  validateInternal: ->
    if not @$("input").val()
      return false

    if siteCodes.isValid(@$("input").val())
      return false

    return "Invalid Site"
