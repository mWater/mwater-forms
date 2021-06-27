PropTypes = require('prop-types')
React = require 'react'
R = React.createElement

LocationEditorComponent = require('../LocationEditorComponent').default
LocationFinder = require '../LocationFinder'

module.exports = class LocationAnswerComponent extends React.Component
  @contextTypes:
    displayMap: PropTypes.func
    T: PropTypes.func.isRequired  # Localizer to use
    locationFinder: PropTypes.object

  @propTypes:
    value: PropTypes.object
    onValueChange: PropTypes.func.isRequired
    disableSetByMap: PropTypes.bool
    disableManualLatLng: PropTypes.bool

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

        # Record that done via map
        newLoc.method = "map"

        @props.onValueChange(newLoc)
      )

  render: ->
    return R LocationEditorComponent,
      location: @props.value
      onLocationChange: @props.onValueChange
      onUseMap: if not @props.disableSetByMap and @context.displayMap? then @handleUseMap
      disableManualLatLng: @props.disableManualLatLng
      locationFinder: @context.locationFinder or new LocationFinder()
      T: @context.T