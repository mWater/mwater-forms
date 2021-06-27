// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
let LocationAnswerComponent
import PropTypes from "prop-types"
import React from "react"
const R = React.createElement

import { default as LocationEditorComponent } from "../LocationEditorComponent"
import LocationFinder from "../LocationFinder"

export default LocationAnswerComponent = (function () {
  LocationAnswerComponent = class LocationAnswerComponent extends React.Component {
    static initClass() {
      this.contextTypes = {
        displayMap: PropTypes.func,
        T: PropTypes.func.isRequired, // Localizer to use
        locationFinder: PropTypes.object
      }

      this.propTypes = {
        value: PropTypes.object,
        onValueChange: PropTypes.func.isRequired,
        disableSetByMap: PropTypes.bool,
        disableManualLatLng: PropTypes.bool
      }
    }

    focus() {
      // Nothing to focus
      return null
    }

    handleUseMap = () => {
      if (this.context.displayMap != null) {
        return this.context.displayMap(this.props.value, (newLoc) => {
          // Wrap to -180, 180
          while (newLoc.longitude < -180) {
            newLoc.longitude += 360
          }
          while (newLoc.longitude > 180) {
            newLoc.longitude -= 360
          }

          // Clip to -85, 85 (for Webmercator)
          if (newLoc.latitude > 85) {
            newLoc.latitude = 85
          }
          if (newLoc.latitude < -85) {
            newLoc.latitude = -85
          }

          // Record that done via map
          newLoc.method = "map"

          return this.props.onValueChange(newLoc)
        })
      }
    }

    render() {
      return R(LocationEditorComponent, {
        location: this.props.value,
        onLocationChange: this.props.onValueChange,
        onUseMap: !this.props.disableSetByMap && this.context.displayMap != null ? this.handleUseMap : undefined,
        disableManualLatLng: this.props.disableManualLatLng,
        locationFinder: this.context.locationFinder || new LocationFinder(),
        T: this.context.T
      })
    }
  }
  LocationAnswerComponent.initClass()
  return LocationAnswerComponent
})()
