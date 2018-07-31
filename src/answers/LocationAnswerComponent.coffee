PropTypes = require('prop-types')
React = require 'react'
H = React.DOM
R = React.createElement

LocationEditorComponent = require '../LocationEditorComponent'

# Functional??

module.exports = class LocationAnswerComponent extends React.Component
  @contextTypes:
    displayMap: PropTypes.func
    T: PropTypes.func.isRequired  # Localizer to use
    locationFinder: PropTypes.object

  @propTypes:
    value: PropTypes.object
    onValueChange: PropTypes.func.isRequired

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