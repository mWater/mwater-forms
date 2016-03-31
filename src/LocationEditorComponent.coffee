_ = require 'lodash'
React = require 'react'
H = React.DOM

# TODO: Make a React LoactionView
LocationView = require './legacy/LocationView'

# Component that allows setting of location
# TODO reimplement in pure react
module.exports = class LocationEditorComponent extends React.Component
  @propTypes:
    location: React.PropTypes.object  # { latitude, longitude, accuracy, altitude?, altitudeAccuracy? }
    onLocationChange: React.PropTypes.func
    onUseMap: React.PropTypes.func    # Called if map use is requested
    storage: React.PropTypes.object   # Storage object for saving location
    T: React.PropTypes.func           # Localizer
    
  componentDidMount: -> 
    @locationView = new LocationView({
      loc: @props.location
      hideMap: not @props.onUseMap?
      T: @props.T
    })    

    @locationView.on 'locationset', (location) => 
      @props.onLocationChange(location)

    @locationView.on 'map', () => 
      @props.onUseMap()

    $(@refs.main).append(@locationView.el)

  componentWillReceiveProps: (nextProps) ->
    if not _.isEqual(nextProps.location, @props.location)
      @locationView.loc = nextProps.location
      @locationView.render()

  componentWillUnmount: -> 
    @locationView.remove()

  render: ->
    H.div ref: "main"