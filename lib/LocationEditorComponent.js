"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CurrentPositionFinder_1 = __importDefault(require("./CurrentPositionFinder"));
const react_1 = __importDefault(require("react"));
const bootstrap_1 = require("react-library/lib/bootstrap");
const PopupHelpComponent_1 = __importDefault(require("react-library/lib/PopupHelpComponent"));
function getLocalStorageNumber(key) {
    if (!window.localStorage.getItem(key)) {
        return null;
    }
    return parseFloat(window.localStorage.getItem(key));
}
function setLocalStorageNumber(key, value) {
    if (value == null) {
        window.localStorage.removeItem(key);
    }
    else {
        window.localStorage.setItem(key, value + "");
    }
}
/** Component that allows setting of location. Allows either setting from GPS, map or manually entering coordinates
 * Stores mast height and depth in local storage and allows it to be updated.
 */
class LocationEditorComponent extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.handleClear = () => {
            this.props.onLocationChange(null);
            this.setState({ displayingError: false, displayingSuccess: false });
        };
        this.handleOpenAdvanced = () => {
            this.setState({ displayingAdvanced: true });
        };
        this.handleCloseAdvanced = () => {
            this.setState({ displayingAdvanced: false, enteringManual: false });
        };
        this.handleEnterManually = () => {
            this.setState({ enteringManual: true, manualLat: null, manualLng: null, manualAlt: null });
        };
        this.handleManualLatChange = (value) => {
            this.setState({ manualLat: value });
        };
        this.handleManualLngChange = (value) => {
            this.setState({ manualLng: value });
        };
        this.handleManualAltChange = (value) => {
            this.setState({ manualAlt: value });
        };
        this.handleSaveManual = () => {
            if (this.state.manualLat >= 85 || this.state.manualLat <= -85) {
                alert(this.props.T("Latitude out of range"));
                return;
            }
            if (this.state.manualLng >= 180 || this.state.manualLng <= -180) {
                alert(this.props.T("Longitude out of range"));
                return;
            }
            this.props.onLocationChange({
                latitude: this.state.manualLat,
                longitude: this.state.manualLng,
                altitude: this.state.manualAlt || undefined,
                accuracy: 0,
                altitudeAccuracy: this.state.manualAlt ? 0 : undefined,
                method: "manual"
            });
            this.setState({ enteringManual: false });
        };
        this.handleCancelManual = () => {
            this.setState({ enteringManual: false });
        };
        this.handleMastHeightChange = (value) => {
            this.setState({ mastHeight: value });
            setLocalStorageNumber("LocationEditorComponent.mastHeight", value);
        };
        this.handleDepthChange = (value) => {
            this.setState({ depth: value });
            setLocalStorageNumber("LocationEditorComponent.depth", value);
        };
        this.handleSetUsingGPS = () => {
            this.setState({ displayingError: false, displayingSuccess: false });
            // Start position finder
            this.currentPositionFinder.start();
        };
        this.handleCancelGPS = () => {
            this.currentPositionFinder.stop();
            this.setState({ settingUsingGPS: false, positionStatus: null });
        };
        this.handleUseAnyway = () => {
            if (this.state.positionStatus.strength == "poor") {
                if (!confirm(this.props.T("Use location with very low accuracy (±{0}m)?", this.state.positionStatus.accuracy.toFixed(0)))) {
                    return;
                }
            }
            this.handlePositionFound(this.state.positionStatus.pos);
        };
        this.handlePositionFound = (pos) => {
            this.currentPositionFinder.stop();
            let altitude = pos.coords.altitude || undefined;
            if (altitude != null) {
                // Subtract mast height and depth
                if (this.state.mastHeight) {
                    altitude -= this.state.mastHeight;
                }
                if (this.state.depth) {
                    altitude -= this.state.depth;
                }
            }
            this.props.onLocationChange({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                altitude: altitude,
                accuracy: pos.coords.accuracy,
                altitudeAccuracy: pos.coords.altitudeAccuracy || undefined,
                mastHeight: altitude != null ? this.state.mastHeight || undefined : undefined,
                depth: altitude != null ? this.state.depth || undefined : undefined,
                method: "gps"
            });
            this.setState({ settingUsingGPS: false, positionStatus: null, displayingSuccess: true, displayingError: false });
            // Hide notification in 5 seconds
            setTimeout(() => {
                if (!this.unmounted) {
                    this.setState({ displayingSuccess: false });
                }
            }, 5000);
        };
        this.handlePositionStatus = (positionStatus) => {
            this.setState({ positionStatus: positionStatus });
        };
        this.handlePositionError = () => {
            this.setState({ settingUsingGPS: false, positionStatus: null, displayingSuccess: false, displayingError: true });
            // Hide notification in 5 seconds
            setTimeout(() => {
                if (!this.unmounted) {
                    this.setState({ displayingError: false });
                }
            }, 5000);
        };
        this.currentPositionFinder = new CurrentPositionFinder_1.default({ locationFinder: props.locationFinder });
        this.currentPositionFinder.on("status", this.handlePositionStatus);
        this.currentPositionFinder.on("found", this.handlePositionFound);
        this.currentPositionFinder.on("error", this.handlePositionError);
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
        };
    }
    componentWillUnmount() {
        this.currentPositionFinder.stop();
        this.unmounted = true;
    }
    renderLocation() {
        if (!this.props.location) {
            return (react_1.default.createElement("div", { style: { fontStyle: "italic", marginLeft: 10 } },
                react_1.default.createElement("div", null, this.props.T("No Location Set")),
                react_1.default.createElement("br", null),
                this.state.mastHeight != null ? (react_1.default.createElement("div", null,
                    react_1.default.createElement("span", { className: "text-muted" },
                        this.props.T("Mast height"),
                        ": ",
                        this.state.mastHeight,
                        " m"))) : null,
                this.state.depth != null ? (react_1.default.createElement("div", null,
                    react_1.default.createElement("span", { className: "text-muted" },
                        this.props.T("Depth"),
                        ": ",
                        this.state.depth,
                        " m"))) : null));
        }
        return (react_1.default.createElement("div", { style: { fontStyle: "italic", marginLeft: 20 } },
            react_1.default.createElement("div", null,
                react_1.default.createElement("span", { className: "text-muted" },
                    this.props.T("Latitude"),
                    ":"),
                " ",
                this.props.location.latitude.toFixed(6)),
            react_1.default.createElement("div", null,
                react_1.default.createElement("span", { className: "text-muted" },
                    this.props.T("Longitude"),
                    ":"),
                " ",
                this.props.location.longitude.toFixed(6)),
            this.props.location.altitude != null ? (react_1.default.createElement("div", null,
                react_1.default.createElement("span", { className: "text-muted" },
                    this.props.T("Altitude"),
                    ":"),
                " ",
                this.props.location.altitude.toFixed(1),
                " m")) : null,
            this.props.location.accuracy != null ? (react_1.default.createElement("div", null,
                react_1.default.createElement("span", { className: "text-muted" },
                    this.props.T("Accuracy"),
                    ":"),
                " +/-",
                " ",
                this.props.location.accuracy.toFixed(1),
                " m")) : null,
            this.props.location.altitudeAccuracy != null ? (react_1.default.createElement("div", null,
                react_1.default.createElement("span", { className: "text-muted" },
                    this.props.T("Altitude Accuracy"),
                    ":"),
                " +/-",
                " ",
                this.props.location.altitudeAccuracy.toFixed(1),
                " m")) : null,
            this.props.location.mastHeight != null ? (react_1.default.createElement("div", null,
                react_1.default.createElement("span", { className: "text-muted" },
                    this.props.T("Mast height"),
                    ":"),
                " ",
                this.props.location.mastHeight,
                " m")) : null,
            this.props.location.depth != null ? (react_1.default.createElement("div", null,
                react_1.default.createElement("span", { className: "text-muted" },
                    this.props.T("Depth"),
                    ":"),
                " ",
                this.props.location.depth,
                " m")) : null));
    }
    renderEnterManually() {
        if (this.props.disableManualLatLng) {
            return null;
        }
        if (!this.state.enteringManual) {
            return (react_1.default.createElement("div", null,
                react_1.default.createElement("button", { className: "btn btn-sm btn-link", onClick: this.handleEnterManually }, this.props.T("Enter Coordinates Manually..."))));
        }
        return (react_1.default.createElement("div", { style: { marginTop: 20, marginLeft: 10 } },
            react_1.default.createElement("div", { style: { marginBottom: 5 }, "data-test-id": "latitude" },
                this.props.T("Latitude"),
                ":",
                react_1.default.createElement(bootstrap_1.NumberInput, { decimal: true, style: { display: "inline-block", marginLeft: 10, width: 200 }, value: this.state.manualLat, onChange: this.handleManualLatChange })),
            react_1.default.createElement("div", { style: { marginBottom: 5 }, "data-test-id": "longitude" },
                this.props.T("Longitude"),
                ":",
                react_1.default.createElement(bootstrap_1.NumberInput, { decimal: true, style: { display: "inline-block", marginLeft: 10, width: 200 }, value: this.state.manualLng, onChange: this.handleManualLngChange })),
            react_1.default.createElement("div", { style: { marginBottom: 5 }, "data-test-id": "altitude" },
                this.props.T("Altitude (m)"),
                ":",
                react_1.default.createElement(bootstrap_1.NumberInput, { decimal: true, style: { display: "inline-block", marginLeft: 10, width: 200 }, value: this.state.manualAlt, onChange: this.handleManualAltChange })),
            react_1.default.createElement("div", { style: { marginBottom: 5 } },
                react_1.default.createElement("button", { className: "btn btn-primary", onClick: this.handleSaveManual, disabled: this.state.manualLat == null || this.state.manualLng == null, "data-test-id": "save" }, this.props.T("Save")),
                "\u00A0",
                react_1.default.createElement("button", { className: "btn btn-secondary", onClick: this.handleCancelManual }, this.props.T("Cancel")))));
    }
    renderMastAndDepth() {
        // Hide if entering manual coordinates
        if (this.state.enteringManual) {
            return null;
        }
        return (react_1.default.createElement("div", { style: { marginLeft: 10 } },
            react_1.default.createElement("div", { style: { marginBottom: 5 } },
                this.props.T("Mast height (m)"),
                ":",
                react_1.default.createElement(bootstrap_1.NumberInput, { decimal: true, style: { display: "inline-block", marginLeft: 10, width: 200 }, value: this.state.mastHeight, onChange: this.handleMastHeightChange })),
            react_1.default.createElement("div", { style: { marginBottom: 5 } },
                this.props.T("Depth (m)"),
                ":",
                react_1.default.createElement(bootstrap_1.NumberInput, { decimal: true, style: { display: "inline-block", marginLeft: 10, width: 200 }, value: this.state.depth, onChange: this.handleDepthChange }))));
    }
    renderAdvanced() {
        // Can't open advanced with location set as too ambiguous what to do
        if (this.props.location) {
            return null;
        }
        if (!this.state.displayingAdvanced) {
            return (react_1.default.createElement("div", { style: { marginTop: 20 } },
                react_1.default.createElement("button", { className: "btn btn-sm btn-link", onClick: this.handleOpenAdvanced }, this.props.T("Advanced Location Settings..."))));
        }
        return (react_1.default.createElement("div", { style: { marginTop: 20 } },
            this.renderEnterManually(),
            this.props.enableMastHeightAndDepth == true && this.renderMastAndDepth(),
            react_1.default.createElement("button", { className: "btn btn-sm btn-link", onClick: this.handleCloseAdvanced }, this.props.T("Hide Advanced Settings"))));
    }
    /** Render the set by GPS display */
    renderSetByGPS() {
        // If no status, don't display
        if (!this.state.positionStatus) {
            return null;
        }
        let msg = "";
        switch (this.state.positionStatus.strength) {
            case "none":
                msg = this.props.T("Waiting for GPS...");
                break;
            case "poor":
                msg = this.props.T("Very weak GPS signal (±{0}m)...", this.state.positionStatus.accuracy.toFixed(0));
                break;
            case "fair":
                msg = this.props.T("Weak GPS signal (±{0}m)...", this.state.positionStatus.accuracy.toFixed(0));
                break;
            case "good":
                msg = this.props.T("Setting location in {0}s...", this.state.positionStatus.goodDelayLeft);
                break;
        }
        return (react_1.default.createElement("div", { id: "location_setter", className: "alert alert-warning" },
            react_1.default.createElement("div", null,
                react_1.default.createElement("i", { className: "fa fa-spinner fa-spin" }),
                "\u00A0",
                react_1.default.createElement("b", null, msg),
                " \u00A0",
                (this.state.positionStatus.strength == "fair" || this.state.positionStatus.strength == "poor") ? (react_1.default.createElement("button", { type: "button", className: "btn btn-sm btn-secondary", style: { marginLeft: 5 }, disabled: !this.state.positionStatus.useable, onClick: this.handleUseAnyway },
                    this.props.T("Use Anyway"),
                    this.state.positionStatus.initialDelayLeft ? ` (${this.state.positionStatus.initialDelayLeft}s)` : null)) : null,
                react_1.default.createElement("button", { type: "button", className: "btn btn-sm btn-secondary", style: { marginLeft: 5 }, onClick: this.handleCancelGPS }, this.props.T("Cancel")))));
    }
    renderMessages() {
        if (this.state.displayingSuccess) {
            return react_1.default.createElement("div", { className: "alert alert-success" }, this.props.T("Location Set Successfully"));
        }
        if (this.state.displayingError) {
            return react_1.default.createElement("div", { className: "alert alert-danger" }, this.props.T("Cannot set location"));
        }
        return;
    }
    /** Render left pane with the buttons */
    renderLeftPane() {
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("div", null,
                this.props.T("Set location using"),
                ":"),
            react_1.default.createElement("div", { style: { padding: 10 } },
                react_1.default.createElement("div", { className: "d-grid pb-1" },
                    react_1.default.createElement("button", { type: "button", className: "btn btn-secondary", onClick: this.handleSetUsingGPS, disabled: this.state.settingUsingGPS },
                        react_1.default.createElement("span", { className: "fas fa-location-arrow" }),
                        " ",
                        this.props.T("Current Location"))),
                react_1.default.createElement("div", { className: "d-grid pb-1" },
                    react_1.default.createElement("button", { type: "button", className: "btn btn-secondary", disabled: this.props.onUseMap == null, onClick: this.props.onUseMap },
                        react_1.default.createElement("span", { className: "fas fa-map-marker-alt" }),
                        " ",
                        this.props.T("Use Map"))),
                react_1.default.createElement("div", { className: "d-grid pb-1" },
                    react_1.default.createElement("button", { type: "button", className: "btn btn-secondary", disabled: this.props.location == null, onClick: this.handleClear },
                        react_1.default.createElement("span", { className: "fas fa-times" }),
                        " ",
                        this.props.T("Clear"))))));
    }
    renderRightPane() {
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("div", { style: { float: "right" } },
                react_1.default.createElement(PopupHelpComponent_1.default, null,
                    react_1.default.createElement("div", { style: { whiteSpace: "pre-line" } }, this.props.T(`SETTING LOCATIONS:

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
`)))),
            this.renderLocation(),
            this.renderAdvanced()));
    }
    render() {
        return (react_1.default.createElement("div", { style: { margin: 10 } },
            react_1.default.createElement("table", { style: { width: "100%" } },
                react_1.default.createElement("tbody", null,
                    react_1.default.createElement("tr", null,
                        react_1.default.createElement("td", { style: { width: 250, verticalAlign: "top" } }, this.renderLeftPane()),
                        react_1.default.createElement("td", { style: { verticalAlign: "top", paddingTop: 30 } }, this.renderRightPane())))),
            this.renderSetByGPS(),
            this.renderMessages()));
    }
}
exports.default = LocationEditorComponent;
