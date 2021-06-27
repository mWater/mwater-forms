// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
let AdminRegionDisplayComponent
import PropTypes from "prop-types"
import _ from "lodash"
import React from "react"
const R = React.createElement
import AsyncLoadComponent from "react-library/lib/AsyncLoadComponent"

// Loads and displays an admin region
export default AdminRegionDisplayComponent = (function () {
  AdminRegionDisplayComponent = class AdminRegionDisplayComponent extends AsyncLoadComponent {
    static initClass() {
      this.propTypes = {
        getAdminRegionPath: PropTypes.func.isRequired, // Call with (id, callback). Callback (error, [{ id:, level: <e.g. 1>, name: <e.g. Manitoba>, type: <e.g. Province>}] in level ascending order)
        value: PropTypes.string, // _id of entity
        T: PropTypes.func.isRequired
      }
      // Localizer to use
    }

    // Override to determine if a load is needed. Not called on mounting
    isLoadNeeded(newProps, oldProps) {
      return newProps.value !== oldProps.value
    }

    // Call callback with state changes
    load(props, prevProps, callback) {
      if (!props.value) {
        callback({ error: null, path: [] })
        return
      }

      return props.getAdminRegionPath(props.value, (error, path) => {
        return callback({ error, path })
      })
    }

    render() {
      if (this.state.loading) {
        return R("span", { className: "text-muted" }, this.props.T("Loading..."))
      }

      if (this.state.error) {
        return R("span", { className: "text-danger" }, this.props.T("Unable to connect to server"))
      }

      if (!this.state.path || this.state.path.length === 0) {
        return R("span", null, "None")
      }

      return R("span", null, _.last(this.state.path).full_name)
    }
  }
  AdminRegionDisplayComponent.initClass()
  return AdminRegionDisplayComponent
})()
