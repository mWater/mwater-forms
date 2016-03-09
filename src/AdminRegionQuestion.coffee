Question = require './Question'
_ = require 'lodash'
React = require 'react'
ReactDOM = require 'react-dom'
H = React.DOM

AdminRegionSelectComponent = require './AdminRegionSelectComponent'

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
        getAdminRegionPath: @ctx.getAdminRegionPath
        getSubAdminRegions: @ctx.getSubAdminRegions
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

class AdminRegionAnswerComponent extends React.Component
  @propTypes:
    getAdminRegionPath: React.PropTypes.func.isRequired # Call with (id, callback). Callback (error, [{ id:, level: <e.g. 1>, name: <e.g. Manitoba>, type: <e.g. Province>}] in level ascending order)
    getSubAdminRegions: React.PropTypes.func.isRequired # Call with (id, callback). Callback (error, [{ id:, level: <e.g. 1>, name: <e.g. Manitoba>, type: <e.g. Province>}] of admin regions directly under the specified id)
    value: React.PropTypes.string     # id of admin region
    onChange: React.PropTypes.func.isRequired  # Called with new id

  renderEntityButtons: ->
    H.div null,
      H.button type: "button", className: "btn btn-link btn-sm", onClick: @handleUseGPS,
        H.span className: "glyphicon glyphicon-screenshot"
        " "
        T("Set Using GPS")
      H.button type: "button", className: "btn btn-link btn-sm", onClick: @handleUseMap,
        H.span className: "glyphicon glyphicon-map-marker"
        " "
        T("Set Using Map")

  render: ->
    return H.div null,
      @renderEntityButtons()
      React.createElement(AdminRegionSelectComponent, {
        getAdminRegionPath: @props.getAdminRegionPath
        getSubAdminRegions: @props.getSubAdminRegions
        value: @props.value
        onChange: @props.onChange
      })

