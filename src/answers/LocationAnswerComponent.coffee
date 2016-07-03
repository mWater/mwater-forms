React = require 'react'
H = React.DOM
R = React.createElement

LocationEditorComponent = require '../LocationEditorComponent'

# Functional??

module.exports = class LocationAnswerComponent extends React.Component
  @contextTypes:
    displayMap: React.PropTypes.func
    storage: React.PropTypes.object
    T: React.PropTypes.func.isRequired  # Localizer to use
    locationFinder: React.PropTypes.object

  @propTypes:
    value: React.PropTypes.object
    onValueChange: React.PropTypes.func.isRequired

  constructor: (props) ->
    super

  focus: () ->
    # Nothing to focus
    null

  handleUseMap: =>
    if @context.displayMap?
      @context.displayMap(@props.value, (newLoc) =>
        # Wrap to -180, 180
        while newLoc.longitude < -180
          newLoc.longitude += 360
        while newLoc.longitude > 180
          newLoc.longitude -= 360

        # Clip to -85, 85 (for Webmercator)
        if newLoc.latitude > 85
          newLoc.latitude = 85
        if newLoc.latitude < -85
          newLoc.latitude = -85
        @props.onValueChange(newLoc)
      )

  render: ->
    return R LocationEditorComponent,
      location: @props.value
      onLocationChange: @props.onValueChange
      onUseMap: @handleUseMap
      locationFinder: @context.locationFinder
      T: @context.T