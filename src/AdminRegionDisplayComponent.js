PropTypes = require('prop-types')
_ = require 'lodash'
React = require 'react'
R = React.createElement
AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent')

# Loads and displays an admin region
module.exports = class AdminRegionDisplayComponent extends AsyncLoadComponent
  @propTypes:
    getAdminRegionPath: PropTypes.func.isRequired # Call with (id, callback). Callback (error, [{ id:, level: <e.g. 1>, name: <e.g. Manitoba>, type: <e.g. Province>}] in level ascending order)
    value: PropTypes.string     # _id of entity
    T: PropTypes.func.isRequired  # Localizer to use

  # Override to determine if a load is needed. Not called on mounting
  isLoadNeeded: (newProps, oldProps) ->
    return newProps.value != oldProps.value

  # Call callback with state changes
  load: (props, prevProps, callback) ->
    if not props.value
      callback(error: null, path: [])
      return

    props.getAdminRegionPath(props.value, (error, path) =>
      callback(error: error, path: path)
    )

  render: ->
    if @state.loading
      return R 'span', className: "text-muted", @props.T("Loading...")

    if @state.error
      return R 'span', className: "text-danger", @props.T("Unable to connect to server")

    if not @state.path or @state.path.length == 0
      return R 'span', null, "None"

    return R 'span', null, _.last(@state.path).full_name