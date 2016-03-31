_ = require 'lodash'
React = require 'react'
ReactDOM = require 'react-dom'
H = React.DOM

AdminRegionSelectComponent = require '../AdminRegionSelectComponent'

# Done by Clayton

# Displays a gps, map and manual select
module.exports = class AdminRegionAnswerComponent extends React.Component
  @contextTypes:
    locationFinder: React.PropTypes.object
    displayMap: React.PropTypes.func # Takes location ({ latitude, etc.}) and callback (called back with new location)
    getAdminRegionPath: React.PropTypes.func.isRequired # Call with (id, callback). Callback (error, [{ id:, level: <e.g. 1>, name: <e.g. Manitoba>, type: <e.g. Province>}] in level ascending order)
    getSubAdminRegions: React.PropTypes.func.isRequired # Call with (id, callback). Callback (error, [{ id:, level: <e.g. 1>, name: <e.g. Manitoba>, type: <e.g. Province>}] of admin regions directly under the specified id)
    findAdminRegionByLatLng: React.PropTypes.func.isRequired # Call with (lat, lng, callback). Callback (error, id)

  @propTypes:
    value: React.PropTypes.string     # id of admin region
    onChange: React.PropTypes.func.isRequired  # Called with new id

  constructor: ->
    super
    @state = {
      waiting: false # True when waiting for gps
      error: null
    }

  focus: () ->
    # Nothing to focus
    null

  handleUseGPS: =>
    @setState({ error: null, waiting: true }, =>
      @context.locationFinder.getLocation (location) =>
        # If no longer waiting, ignore
        if not @state.waiting
          return

        # Lookup location
        @context.findAdminRegionByLatLng(location.coords.latitude, location.coords.longitude, (error, id) =>
          if error
            @setState(error: T("Unable to lookup location"), waiting: false)
            return
          
          @setState(waiting: false)
          @props.onChange(id)
          )
      , (error) =>
        # If no longer waiting, ignore
        if not @state.waiting
          return

        @setState(error: T("Unable to get location"), waiting: false)
    )

  handleCancelUseGPS: =>
    @setState(waiting: false)

  handleUseMap: =>
    @setState(error: null, waiting: false)

    @context.displayMap null, (location) =>
      # Cancel if no location
      if not location
        return

      # Lookup location
      @context.findAdminRegionByLatLng(location.latitude, location.longitude, (error, id) =>
        if error
          @setState(error: T("Unable to lookup location"))
          return

        @props.onChange(id)
        )

  handleChange: (id) =>
    @setState(error: null, waiting: false)
    @props.onChange(id)

  renderEntityButtons: ->
    H.div null,
      if not @state.waiting
        H.button type: "button", className: "btn btn-link btn-sm", onClick: @handleUseGPS, disabled: not @context.locationFinder?,
          H.span className: "glyphicon glyphicon-screenshot"
          " "
          T("Set Using GPS")
      else
        H.button type: "button", className: "btn btn-link btn-sm", onClick: @handleCancelUseGPS, disabled: not @context.locationFinder?,
          H.span className: "glyphicon glyphicon-remove"
          " "
          T("Cancel GPS")

      H.button type: "button", className: "btn btn-link btn-sm", onClick: @handleUseMap, disabled: not @context.displayMap?,
        H.span className: "glyphicon glyphicon-map-marker"
        " "
        T("Set Using Map")

  render: ->
    return H.div null,
      @renderEntityButtons()
      if @state.waiting
        H.div className: "text-info", T("Waiting for GPS...")

      if @state.error
        H.div className: "text-danger", @state.error
      React.createElement(AdminRegionSelectComponent, {
        getAdminRegionPath: @context.getAdminRegionPath
        getSubAdminRegions: @context.getSubAdminRegions
        value: @props.value
        onChange: @handleChange
      })

