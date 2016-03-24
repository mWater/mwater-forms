Question = require './Question'
_ = require 'lodash'
React = require 'react'
ReactDOM = require 'react-dom'
H = React.DOM

AdminRegionAnswerComponent = require '../answers/AdminRegionAnswerComponent'

# Allows user to select an administrative region
# Options for AdminRegionQuestion
#   defaultValue: default region when blank
# Context should have getAdminRegionPath and getSubAdminRegions. See docs/Forms Context.md
module.exports = class AdminRegionQuestion extends Question
  updateAnswer: (answerEl) ->
    # Save answer element to unmount
    @answerEl = answerEl

    # Check if entities supported
    if not @ctx.getAdminRegionPath? or not @ctx.getSubAdminRegions?
      elem = H.div className: "text-warning", @T("Not supported on this platform")
    else
      value = @getAnswerValue()
  
      elem = React.createElement(AdminRegionAnswerComponent, {
        locationFinder: @ctx.locationFinder
        displayMap: @ctx.displayMap
        getAdminRegionPath: @ctx.getAdminRegionPath
        getSubAdminRegions: @ctx.getSubAdminRegions
        findAdminRegionByLatLng: @ctx.findAdminRegionByLatLng
        value: value
        onChange: (val) => @setAnswerValue(val)
      })
        
    ReactDOM.render(elem, answerEl.get(0))

  shownFirstTime: ->
    super
    if not @isAnswered() and @options.defaultValue
      @setAnswerValue(@options.defaultValue)

  remove: ->
    if @answerEl
      ReactDOM.unmountComponentAtNode(@answerEl.get(0))

    super

