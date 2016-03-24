React = require 'react'
H = React.DOM
R = React.createElement

LocationEditorComponent = require '../LocationEditorComponent'

# Functional??

module.exports = class LocationAnswerComponent extends React.Component
  @propTypes:
    value: React.PropTypes.string
    onValueChange: React.PropTypes.func.isRequired
    # storage: React.PropTypes.object
    displayMap: React.PropTypes.func

  handleUseMap: ->
    if @props.displayMap?
      @props.displayMap.displayMap(@props.value, (newLoc) =>
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
    return H.div null,
      'YO!'
    #console.log 'rendering location editor component'
    #return R LocationEditorComponent,
    #  location: @props.value
    #  onLocationChange: @props.onValueChange
    #  onUseMap: @handleUseMap
    #  # storage: @props.storage
    #  T: global.T # TODO