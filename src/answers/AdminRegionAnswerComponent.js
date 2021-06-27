PropTypes = require('prop-types')
_ = require 'lodash'
React = require 'react'
R = React.createElement

AdminRegionSelectComponent = require '../AdminRegionSelectComponent'

# Displays a gps, map and manual select
module.exports = class AdminRegionAnswerComponent extends React.Component
  @contextTypes:
    locationFinder: PropTypes.object
    displayMap: PropTypes.func # Takes location ({ latitude, etc.}) and callback (called back with new location)
    getAdminRegionPath: PropTypes.func.isRequired # Call with (id, callback). Callback (error, [{ id:, level: <e.g. 1>, name: <e.g. Manitoba>, type: <e.g. Province>}] in level ascending order)
    getSubAdminRegions: PropTypes.func.isRequired # Call with (id, callback). Callback (error, [{ id:, level: <e.g. 1>, name: <e.g. Manitoba>, type: <e.g. Province>}] of admin regions directly under the specified id)
    findAdminRegionByLatLng: PropTypes.func.isRequired # Call with (lat, lng, callback). Callback (error, id)
    T: PropTypes.func.isRequired  # Localizer to use

  @propTypes:
    value: PropTypes.string     # id of admin region
    onChange: PropTypes.func.isRequired  # Called with new id

  constructor: (props) ->
    super(props)
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
            @setState(error: @context.T("Unable to lookup location"), waiting: false)
            return
          
          @setState(waiting: false)
          @props.onChange(id)
          )
      , (error) =>
        # If no longer waiting, ignore
        if not @state.waiting
          return

        @setState(error: @context.T("Unable to get location"), waiting: false)
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
          @setState(error: @context.T("Unable to lookup location"))
          return

        @props.onChange(id)
        )

  handleChange: (id) =>
    @setState(error: null, waiting: false)
    @props.onChange(id)

  renderEntityButtons: ->
    R 'div', null,
      if not @state.waiting
        R 'button', type: "button", className: "btn btn-link btn-sm", onClick: @handleUseGPS, disabled: not @context.locationFinder?,
          R 'span', className: "glyphicon glyphicon-screenshot"
          " "
          @context.T("Set Using GPS")
      else
        R 'button', type: "button", className: "btn btn-link btn-sm", onClick: @handleCancelUseGPS, disabled: not @context.locationFinder?,
          R 'span', className: "glyphicon glyphicon-remove"
          " "
          @context.T("Cancel GPS")

      R 'button', type: "button", className: "btn btn-link btn-sm", onClick: @handleUseMap, disabled: not @context.displayMap?,
        R 'span', className: "glyphicon glyphicon-map-marker"
        " "
        @context.T("Set Using Map")

  render: ->
    return R 'div', null,
      @renderEntityButtons()
      if @state.waiting
        R 'div', className: "text-info", @context.T("Waiting for GPS...")

      if @state.error
        R 'div', className: "text-danger", @state.error
      React.createElement(AdminRegionSelectComponent, {
        getAdminRegionPath: @context.getAdminRegionPath
        getSubAdminRegions: @context.getSubAdminRegions
        value: @props.value
        onChange: @handleChange
        T: @context.T
      })

