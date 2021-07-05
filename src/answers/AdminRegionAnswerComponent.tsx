// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
let AdminRegionAnswerComponent
import PropTypes from "prop-types"
import _ from "lodash"
import React from "react"
const R = React.createElement

import AdminRegionSelectComponent from "../AdminRegionSelectComponent"

// Displays a gps, map and manual select
export default AdminRegionAnswerComponent = (function () {
  AdminRegionAnswerComponent = class AdminRegionAnswerComponent extends React.Component {
    static initClass() {
      this.contextTypes = {
        locationFinder: PropTypes.object,
        displayMap: PropTypes.func, // Takes location ({ latitude, etc.}) and callback (called back with new location)
        getAdminRegionPath: PropTypes.func.isRequired, // Call with (id, callback). Callback (error, [{ id:, level: <e.g. 1>, name: <e.g. Manitoba>, type: <e.g. Province>}] in level ascending order)
        getSubAdminRegions: PropTypes.func.isRequired, // Call with (id, callback). Callback (error, [{ id:, level: <e.g. 1>, name: <e.g. Manitoba>, type: <e.g. Province>}] of admin regions directly under the specified id)
        findAdminRegionByLatLng: PropTypes.func.isRequired, // Call with (lat, lng, callback). Callback (error, id)
        T: PropTypes.func.isRequired // Localizer to use
      }

      this.propTypes = {
        value: PropTypes.string, // id of admin region
        onChange: PropTypes.func.isRequired
      }
      // Called with new id
    }

    constructor(props: any) {
      super(props)
      this.state = {
        waiting: false, // True when waiting for gps
        error: null
      }
    }

    focus() {
      // Nothing to focus
      return null
    }

    handleUseGPS = () => {
      return this.setState({ error: null, waiting: true }, () => {
        return this.context.locationFinder.getLocation(
          (location: any) => {
            // If no longer waiting, ignore
            if (!this.state.waiting) {
              return
            }

            // Lookup location
            return this.context.findAdminRegionByLatLng(
              location.coords.latitude,
              location.coords.longitude,
              (error: any, id: any) => {
                if (error) {
                  this.setState({ error: this.context.T("Unable to lookup location"), waiting: false })
                  return
                }

                this.setState({ waiting: false })
                return this.props.onChange(id)
              }
            )
          },
          (error: any) => {
            // If no longer waiting, ignore
            if (!this.state.waiting) {
              return
            }

            return this.setState({ error: this.context.T("Unable to get location"), waiting: false })
          }
        )
      })
    }

    handleCancelUseGPS = () => {
      return this.setState({ waiting: false })
    }

    handleUseMap = () => {
      this.setState({ error: null, waiting: false })

      return this.context.displayMap(null, (location: any) => {
        // Cancel if no location
        if (!location) {
          return
        }

        // Lookup location
        return this.context.findAdminRegionByLatLng(location.latitude, location.longitude, (error: any, id: any) => {
          if (error) {
            this.setState({ error: this.context.T("Unable to lookup location") })
            return
          }

          return this.props.onChange(id)
        })
      })
    }

    handleChange = (id: any) => {
      this.setState({ error: null, waiting: false })
      return this.props.onChange(id)
    }

    renderEntityButtons() {
      return R(
        "div",
        null,
        !this.state.waiting
          ? R(
              "button",
              {
                type: "button",
                className: "btn btn-link btn-sm",
                onClick: this.handleUseGPS,
                disabled: this.context.locationFinder == null
              },
              R("span", { className: "glyphicon glyphicon-screenshot" }),
              " ",
              this.context.T("Set Using GPS")
            )
          : R(
              "button",
              {
                type: "button",
                className: "btn btn-link btn-sm",
                onClick: this.handleCancelUseGPS,
                disabled: this.context.locationFinder == null
              },
              R("span", { className: "glyphicon glyphicon-remove" }),
              " ",
              this.context.T("Cancel GPS")
            ),

        R(
          "button",
          {
            type: "button",
            className: "btn btn-link btn-sm",
            onClick: this.handleUseMap,
            disabled: this.context.displayMap == null
          },
          R("span", { className: "glyphicon glyphicon-map-marker" }),
          " ",
          this.context.T("Set Using Map")
        )
      )
    }

    render() {
      return R(
        "div",
        null,
        this.renderEntityButtons(),
        this.state.waiting ? R("div", { className: "text-info" }, this.context.T("Waiting for GPS...")) : undefined,

        this.state.error ? R("div", { className: "text-danger" }, this.state.error) : undefined,
        React.createElement(AdminRegionSelectComponent, {
          getAdminRegionPath: this.context.getAdminRegionPath,
          getSubAdminRegions: this.context.getSubAdminRegions,
          value: this.props.value,
          onChange: this.handleChange,
          T: this.context.T
        })
      )
    }
  }
  AdminRegionAnswerComponent.initClass()
  return AdminRegionAnswerComponent
})()
