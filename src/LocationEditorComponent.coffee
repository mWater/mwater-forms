PropTypes = require('prop-types')
_ = require 'lodash'
React = require 'react'
R = React.createElement
$ = require 'jquery'

# TODO: Make a React LoactionView
LocationView = require './legacy/LocationView'

# Component that allows setting of location
# TODO reimplement in pure react
module.exports = class LocationEditorComponent extends React.Component
  @propTypes:
    location: PropTypes.object  # { latitude, longitude, accuracy, altitude?, altitudeAccuracy? }
    locationFinder: PropTypes.object  # Location finder to use
    onLocationChange: PropTypes.func
    onUseMap: PropTypes.func    # Called if map use is requested
    T: PropTypes.func           # Localizer
    
  componentDidMount: -> 
    @locationView = new LocationView({
      loc: @props.location
      hideMap: not @props.onUseMap?
      locationFinder: @props.locationFinder
      T: @props.T
    })    

    @locationView.on 'locationset', (location) => 
      @props.onLocationChange(location)

    @locationView.on 'map', () => 
      @props.onUseMap()

    $(@main).append(@locationView.el)

  componentWillReceiveProps: (nextProps) ->
    if not _.isEqual(nextProps.location, @props.location)
      @locationView.loc = nextProps.location
      @locationView.render()

  componentWillUnmount: -> 
    @locationView.remove()

  render: ->
    R 'div', ref: ((c) => @main = c)