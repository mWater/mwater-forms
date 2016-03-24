React = require 'react'
H = React.DOM
R = React.createElement

LocationEditorComponent = require '../LocationEditorComponent'

# Functional??

module.exports = class LocationAnswerComponent extends React.Component
  @contextTypes:
    displayMap: React.PropTypes.func
    storage: React.PropTypes.object

  @propTypes:
    value: React.PropTypes.string
    onValueChange: React.PropTypes.func.isRequired

  constructor: (props) ->
    console.log 'constructing LocationAnswerComponent'

  handleUseMap: =>
    # TODO: Display map function is not defined (maybe only because I'm running the demo)
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
      # storage: @context.storage
      T: T