import CurrentPositionFinder, { PositionStatus } from "./CurrentPositionFinder";
import React from "react";
import LocationFinder from "./LocationFinder";
import { NumberInput } from 'react-library/lib/bootstrap'
import PopupHelpComponent from 'react-library/lib/PopupHelpComponent'

export interface Location {
  latitude: number
  longitude: number
  /** Elevation, taking into account mastHeight and depth if present */
  altitude?: number 
  accuracy?: number 
  altitudeAccuracy?: number
  /** Height of mast of GPS device (altitude is GPS altitude - mast height - depth) */
  mastHeight?: number
  /** Depth of pipe or other object (altitude is GPS altitude - mast height - depth) */
  depth?: number
}

interface Props {
  location?: Location
  /** Location finder to use */
  locationFinder: LocationFinder
  onLocationChange: (location: Location | null) => void
  /** Called if map use is requested */
  onUseMap?: () => void
  /** Localizer to use */
  T: (str: string, ...args: any[]) => string
}

interface State {
  /** True if displaying advanced controls */
  displayingAdvanced: boolean

  /** True if manually entering lat/lng/altitude (only when displayingAdvanced) */
  enteringManual: boolean

  /** Manual entered Lat (only if enteringManual) */
  manualLat: number | null
  /** Manual entered Lng (only if enteringManual) */
  manualLng: number | null
  /** Manual entered Alt (only if enteringManual) */
  manualAlt: number | null
  
  /** True when setting via GPS */
  settingUsingGPS: boolean

  /** Latest status of current position finder (only when settingUsingGPS) */
  positionStatus: PositionStatus | null

  /** True if displaying success message */
  displayingSuccess: boolean

  /** True if displaying error message */
  displayingError: boolean

  /** Mast height that is persisted in local storage */
  mastHeight: number | null

  /** Depth that is persisted in local storage */
  depth: number | null
}

function getLocalStorageNumber(key: string): number | null {
  if (!window.localStorage.getItem(key)) {
    return null
  }
  return parseFloat(window.localStorage.getItem(key)!)
}

function setLocalStorageNumber(key: string, value: number | null) {
  if (value == null) {
    window.localStorage.removeItem(key)
  }
  else {
    window.localStorage.setItem(key, value + "")
  }
}

/** Component that allows setting of location. Allows either setting from GPS, map or manually entering coordinates
 * Stores mast height and depth in local storage and allows it to be updated. 
 */
export default class LocationEditorComponent extends React.Component<Props, State> {
  currentPositionFinder: CurrentPositionFinder
  /** True when component unmounted */
  unmounted?: boolean

  constructor(props: Props) {
    super(props)

    this.currentPositionFinder = new CurrentPositionFinder({ locationFinder: props.locationFinder })
    this.currentPositionFinder.on("status", this.handlePositionStatus)
    this.currentPositionFinder.on("found", this.handlePositionFound)
    this.currentPositionFinder.on("error", this.handlePositionError)

    this.state = {
      displayingAdvanced: false,
      enteringManual: false,
      manualLat: null,
      manualLng: null,
      manualAlt: null,
      settingUsingGPS: false,
      positionStatus: null,
      mastHeight: getLocalStorageNumber("LocationEditorComponent.mastHeight"), 
      depth: getLocalStorageNumber("LocationEditorComponent.depth"),
      displayingSuccess: false,
      displayingError: false
    }
  }

  componentWillUnmount() {
    this.currentPositionFinder.stop()
    this.unmounted = true
  }

  handleClear = () => { 
    this.props.onLocationChange(null) 
    this.setState({ displayingError: false, displayingSuccess: false })
  }
  handleOpenAdvanced = () => { this.setState({ displayingAdvanced: true }) }
  handleCloseAdvanced = () => { this.setState({ displayingAdvanced: false, enteringManual: false }) }
  handleEnterManually = () => { this.setState({ enteringManual: true, manualLat: null, manualLng: null, manualAlt: null }) }
  handleManualLatChange = (value: number | null) => { this.setState({ manualLat: value })}
  handleManualLngChange = (value: number | null) => { this.setState({ manualLng: value })}
  handleManualAltChange = (value: number | null) => { this.setState({ manualAlt: value })}
  
  handleSaveManual = () => { 
    this.props.onLocationChange({
      latitude: this.state.manualLat!,
      longitude: this.state.manualLng!,
      altitude: this.state.manualAlt || undefined,
      accuracy: 0,
      altitudeAccuracy: this.state.manualAlt ? 0 : undefined
    })

    this.setState({ enteringManual: false })
  }

  handleCancelManual = () => { this.setState({ enteringManual: false })}

  handleMastHeightChange = (value: number | null) => { 
    this.setState({ mastHeight: value })
    setLocalStorageNumber("LocationEditorComponent.mastHeight", value)
  }

  handleDepthChange = (value: number | null) => { 
    this.setState({ depth: value })
    setLocalStorageNumber("LocationEditorComponent.depth", value)
  }

  handleSetUsingGPS = () => {
    this.setState({ displayingError: false, displayingSuccess: false })

    // Start position finder
    this.currentPositionFinder.start()
  }

  handleCancelGPS = () => {
    this.currentPositionFinder.stop()
    this.setState({ settingUsingGPS: false, positionStatus: null })
  }

  handleUseAnyway = () => {
    if (this.state.positionStatus!.strength == "poor") {
      if (!confirm(this.props.T("Use location with very low accuracy (±{0}m)?", this.state.positionStatus!.accuracy!.toFixed(0)))) {
        return
      }
    }
    
    this.handlePositionFound(this.state.positionStatus!.pos!)
  }

  handlePositionFound = (pos: Position) => {
    this.currentPositionFinder.stop()

    let altitude = pos.coords.altitude || undefined
    if (altitude != null) {
      // Subtract mast height and depth
      if (this.state.mastHeight) {
        altitude -= this.state.mastHeight
      }
      if (this.state.depth) {
        altitude -= this.state.depth
      }
    }

    this.props.onLocationChange({
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      altitude: altitude,
      accuracy: pos.coords.accuracy,
      altitudeAccuracy: pos.coords.altitudeAccuracy || undefined,
      mastHeight: altitude != null ? this.state.mastHeight || undefined : undefined ,
      depth: altitude != null ? this.state.depth || undefined : undefined
    })

    this.setState({ settingUsingGPS: false, positionStatus: null, displayingSuccess: true, displayingError: false })

    // Hide notification in 5 seconds
    setTimeout(() => {
      if (!this.unmounted) {
        this.setState({ displayingSuccess: false })
      }
    }, 5000)
  }

  handlePositionStatus = (positionStatus: PositionStatus) => {
    this.setState({ positionStatus: positionStatus })
  }

  handlePositionError = () => {
    this.setState({ settingUsingGPS: false, positionStatus: null, displayingSuccess: false, displayingError: true })

    // Hide notification in 5 seconds
    setTimeout(() => {
      if (!this.unmounted) {
        this.setState({ displayingError: false })
      }
    }, 5000)
  }

  renderLocation() {
    if (!this.props.location) {
      return <div style={{ fontStyle: "italic", marginLeft: 10 }}>
        <div>{this.props.T("No Location Set")}</div>
        <br/>
        { this.state.mastHeight != null ? 
          <div>
            <span className="text-muted">{this.props.T("Mast height")}: {this.state.mastHeight} m</span>
          </div> : null }
        { this.state.depth != null ? 
          <div>
            <span className="text-muted">{this.props.T("Depth")}: {this.state.depth} m</span>
          </div> : null }
      </div>
    }

    return (
      <div style={{ fontStyle: "italic", marginLeft: 20 }}>
        <div>
          <span className="text-muted">{this.props.T("Latitude")}:</span> {this.props.location.latitude.toFixed(6)}
        </div>
        <div>
          <span className="text-muted">{this.props.T("Longitude")}:</span> {this.props.location.longitude.toFixed(6)}
        </div>
        { this.props.location.altitude != null ? 
          <div>
            <span className="text-muted">{this.props.T("Altitude")}:</span> {this.props.location.altitude.toFixed(1)} m
          </div> : null }
        { this.props.location.accuracy != null ? 
          <div>
            <span className="text-muted">{this.props.T("Accuracy")}:</span> +/- {this.props.location.accuracy.toFixed(1)} m
          </div> : null }
        { this.props.location.altitudeAccuracy != null ? 
          <div>
            <span className="text-muted">{this.props.T("Altitude Accuracy")}:</span> +/- {this.props.location.altitudeAccuracy.toFixed(1)} m
          </div> : null }
        { this.props.location.mastHeight != null ? 
          <div>
            <span className="text-muted">{this.props.T("Mast height")}:</span> {this.props.location.mastHeight} m
          </div> : null }
        { this.props.location.depth != null ? 
          <div>
            <span className="text-muted">{this.props.T("Depth")}:</span> {this.props.location.depth} m
          </div> : null }
      </div>
    )
  }

  renderEnterManually() {
    if (!this.state.enteringManual) {
      return <div>
        <button className="btn btn-sm btn-link" onClick={this.handleEnterManually}>{this.props.T("Enter Coordinates Manually...")}</button>
      </div>
    }

    return (
      <div style={{ marginTop: 20, marginLeft: 10 }}>
        <div style={{ marginBottom: 5 }}>
          {this.props.T("Latitude")}:
          <NumberInput decimal={true} style={{ display: "inline-block", marginLeft: 10, width: 200 }} value={this.state.manualLat} onChange={this.handleManualLatChange} />
        </div>
        <div style={{ marginBottom: 5 }}>
          {this.props.T("Longitude")}:
          <NumberInput decimal={true} style={{ display: "inline-block", marginLeft: 10, width: 200 }} value={this.state.manualLng} onChange={this.handleManualLngChange} />
        </div>
        <div style={{ marginBottom: 5 }}>
          {this.props.T("Altitude (m)")}:
          <NumberInput decimal={true} style={{ display: "inline-block", marginLeft: 10, width: 200 }} value={this.state.manualAlt} onChange={this.handleManualAltChange} />
        </div>
        <div style={{ marginBottom: 5 }}>
          <button className="btn btn-primary" onClick={this.handleSaveManual} disabled={this.state.manualLat == null || this.state.manualLng == null}>{this.props.T("Save")}</button>
          &nbsp;
          <button className="btn btn-default" onClick={this.handleCancelManual}>{this.props.T("Cancel")}</button>
        </div>
      </div>
    )
  }

  renderMastAndDepth() {
    // Hide if entering manual coordinates
    if (this.state.enteringManual) {
      return null
    }

    return (
      <div style={{ marginLeft: 10 }}>
        <div style={{ marginBottom: 5 }}>
          {this.props.T("Mast height (m)")}:
          <NumberInput decimal={true} style={{ display: "inline-block", marginLeft: 10, width: 200 }} value={this.state.mastHeight} onChange={this.handleMastHeightChange} />
        </div>
        <div style={{ marginBottom: 5 }}>
          {this.props.T("Depth (m)")}:
          <NumberInput decimal={true} style={{ display: "inline-block", marginLeft: 10, width: 200 }} value={this.state.depth} onChange={this.handleDepthChange} />
        </div>
      </div>
    )
  }

  renderAdvanced() {
    // Can't open advanced with location set as too ambiguous what to do
    if (this.props.location) {
      return null
    }

    if (!this.state.displayingAdvanced) {
      return <div style={{ marginTop: 20 }}>
        <button className="btn btn-sm btn-link" onClick={this.handleOpenAdvanced}>{this.props.T("Advanced Location Settings...")}</button>
      </div>
    }
    return (
      <div style={{ marginTop: 20 }}>
        {this.renderEnterManually()}
        {this.renderMastAndDepth()}
        <button className="btn btn-sm btn-link" onClick={this.handleCloseAdvanced}>{this.props.T("Hide Advanced Settings")}</button>
      </div>
    )
  }

  /** Render the set by GPS display */
  renderSetByGPS() {
    // If no status, don't display
    if (!this.state.positionStatus) {
      return null
    }

    let msg: string = ""
    switch (this.state.positionStatus.strength) {
      case "none":
        msg = this.props.T('Waiting for GPS...')
        break
      case "poor":
        msg = this.props.T('Very weak GPS signal (±{0}m)...', this.state.positionStatus.accuracy!.toFixed(0))
        break
      case "fair":
        msg = this.props.T('Weak GPS signal (±{0}m)...', this.state.positionStatus.accuracy!.toFixed(0))
        break
      case "good":
        msg = this.props.T('Setting location in {0}s...', this.state.positionStatus.goodDelayLeft)
        break
    }

    return (
      <div id="location_setter" className="alert alert-warning">
        <div><i className="fa fa-spinner fa-spin"/>&nbsp;<b>{msg}</b> &nbsp;
          { this.state.positionStatus.strength != "none" && this.state.positionStatus.strength != "good" ?
          <button 
            type="button" 
            className="btn btn-sm btn-default" 
            style={{ marginLeft: 5 }} 
            disabled={!this.state.positionStatus.useable}
            onClick={this.handleUseAnyway}>
              {this.props.T("Use Anyway")}
              { this.state.positionStatus.initialDelayLeft ? ` (${this.state.positionStatus.initialDelayLeft}s)` : null }
            </button>
          : null }
          <button type="button" className="btn btn-sm btn-default" style={{ marginLeft: 5 }} onClick={this.handleCancelGPS}>{this.props.T("Cancel")}</button>
        </div>
      </div>
    )
  }

  renderMessages() {
    if (this.state.displayingSuccess) {
      return <div className="alert alert-success">
        {this.props.T("Location Set Successfully")}
      </div>
    }

    if (this.state.displayingError) {
      return <div className="alert alert-danger">
        {this.props.T("Cannot set location")}
      </div>
    }
    return 
  }

  /** Render left pane with the buttons */
  renderLeftPane() {
    return (
      <div>
        <div>{this.props.T("Set location using")}:</div>
        <div style={{ padding: 10 }}>
          <button type="button" className="btn btn-default btn-block" onClick={this.handleSetUsingGPS} disabled={this.state.settingUsingGPS}>
            <span className="glyphicon glyphicon-screenshot"></span> {this.props.T("Current Location")}
          </button>
          <button type="button" className="btn btn-default btn-block" disabled={this.props.onUseMap == null} onClick={this.props.onUseMap}>
            <span className="glyphicon glyphicon-map-marker"></span> {this.props.T("Use Map")}
          </button>
          <button type="button" className="btn btn-default btn-block" disabled={this.props.location == null} onClick={this.handleClear}>
            <span className="glyphicon glyphicon-remove"></span> {this.props.T("Clear")}
          </button>
        </div>
      </div>
    )
  }

  renderRightPane() {
    return (
      <div>
        <div style={{float: "right"}}>
          <PopupHelpComponent>
            <div style={{ whiteSpace: "pre-line"}}>
              {this.props.T(`SETTING LOCATIONS:

There are three ways to set a location:

CURRENT LOCATION:  Use the onboard GPS to obtain your current position. If the accuracy is poor, the app will try to repeatedly get a better GPS position for up to 10 seconds. After this time period, you can press "Use Anyway" to accept the current accuracy.

USE MAP: Open a map interface that can be used to visually set the location. The red marker in the middle of the map is where the position will be set. Drag and zoom the map around it until the marker is in the right location. Note that this feature does not work offline. Accuracy for coordinates set using the map is set to 0. 

ENTER COORDINATES (Advanced): Allows the latitude and longitude to be typed in using the keyboard. Note that all coordinates must be in decimal degrees using the WGS84 datum. Click on "Advanced GPS Settings..." to use this method.

HOW TO IMPROVE GPS ACCURACY:

-On ANDROID: Make sure that your  location settings are set to High Accuracy Mode. Some phones default to "battery saving" or "low accuracy", which forces the device to use cell phone tower and wifi signals to determine positions, rather than GPS satellites, which are much more accurate.

-Set locations outdoors with a clear view of the sky. Trees, buildings, and steep mountaints or valleys can reduce GPS accuracy.

-Rain and clouds do not affect GPS accuracy, but they can reduce the mobile network signal. 

-GPS still works when the phone is offline or has a weak mobile network signal. Some phones use network signals to speed up GPS location setting, but given enough time, the onboard GPS will still be able to acquire an accurate position.

ADVANCED LOCATION SETTINGS:

Access these settings by clicking on "Advanced location settings..."

MAST HEIGHT: The distance, in meters, between the GPS receiver and the ground. This setting is typically used only when an external high-precision GPS reciever is connected to the phone via bluetooth.

DEPTH: The distance that the feature you are mapping is below the surface of the ground. This is typically used when mapping pipes and other buried infrastructure. 

ENTER COORDINATES MANUALLY: Click on this option to manually type in the GPS coordinates. Note that all coordinates must be in decimal degrees using the WGS84 datum. Accuracy for manually set coordinates is blank and cannot be changed. 
`)}
            </div>
          </PopupHelpComponent>
        </div>
        {this.renderLocation()}
        {this.renderAdvanced()}
      </div>
    )
  }

  render() {
    return (
      <div style={{ margin: 10 }}>
        <table>
          <tbody>
            <tr>
              <td style={{ width: 250, verticalAlign: "top"  }}>
                {this.renderLeftPane()}
              </td>
              <td style={{ verticalAlign: "top", paddingTop: 30 }}>
                {this.renderRightPane()}
              </td>
            </tr>
          </tbody>
        </table>  
        {this.renderSetByGPS()}
        {this.renderMessages()}
      </div>  
    )
  }
}
