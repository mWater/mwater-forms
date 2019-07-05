import CurrentPositionFinder, { PositionStatus } from "./CurrentPositionFinder";
import React from "react";
import LocationFinder from "./LocationFinder";
import { NumberInput } from 'react-library/lib/bootstrap'

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

  displayingSuccess: boolean

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
export default class NewLocationEditorComponent extends React.Component<Props, State> {
  currentPositionFinder: CurrentPositionFinder

  constructor(props: Props) {
    super(props)

    this.currentPositionFinder = new CurrentPositionFinder({ locationFinder: props.locationFinder })
    this.currentPositionFinder.on("status", this.handlePositionStatus)

    this.state = {
      displayingAdvanced: false,
      enteringManual: false,
      manualLat: null,
      manualLng: null,
      manualAlt: null,
      settingUsingGPS: false,
      positionStatus: null,
      displayingSuccess: false,
      mastHeight: getLocalStorageNumber("LocationEditorComponent.mastHeight"), 
      depth: getLocalStorageNumber("LocationEditorComponent.depth")
    }
  }

  componentWillUnmount() {
    this.currentPositionFinder.stop()
  }

  handleClear = () => { this.props.onLocationChange(null) }
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
    // Start position finder
    this.currentPositionFinder.start()
  }

  handleCancelGPS = () => {
    this.currentPositionFinder.stop()
    this.setState({ settingUsingGPS: false, positionStatus: null })
  }

  handleUseAnyway = () => {
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

    this.setState({ settingUsingGPS: false, positionStatus: null })
  }

  handlePositionStatus = (positionStatus: PositionStatus) => {
    this.setState({ positionStatus: positionStatus })
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
          <span className="text-muted">{this.props.T("Latitude")}:</span> {this.props.location.latitude}
        </div>
        <div>
          <span className="text-muted">{this.props.T("Longitude")}:</span> {this.props.location.longitude}
        </div>
        { this.props.location.altitude != null ? 
          <div>
            <span className="text-muted">{this.props.T("Altitude")}:</span> {this.props.location.altitude} m
          </div> : null }
        { this.props.location.accuracy != null ? 
          <div>
            <span className="text-muted">{this.props.T("Accuracy")}:</span> +/- {this.props.location.accuracy} m
          </div> : null }
        { this.props.location.altitudeAccuracy != null ? 
          <div>
            <span className="text-muted">{this.props.T("Altitude Accuracy")}:</span> +/- {this.props.location.altitudeAccuracy} m
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
        msg = this.props.T('Setting location...')
        break
    }

    return (
      <div id="location_setter" className="alert alert-warning">
        <div><i className="fa fa-spinner fa-spin"/>&nbsp;<b>{msg}</b> &nbsp;
          { this.state.positionStatus.useable && this.state.positionStatus.strength != "good" ?
          <button id="use_anyway" type="button" className="btn btn-sm btn-default" style={{ marginLeft: 5 }} onClick={this.handleUseAnyway}>{this.props.T("Use Anyway")}</button>
          : null }
          <button id="cancel_set" type="button" className="btn btn-sm btn-default" style={{ marginLeft: 5 }} onClick={this.handleCancelGPS}>{this.props.T("Cancel")}</button>
        </div>
      </div>
    )
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
      </div>  
    )
  }
}
