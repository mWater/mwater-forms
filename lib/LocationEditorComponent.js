"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var CurrentPositionFinder_1 = __importDefault(require("./CurrentPositionFinder"));
var react_1 = __importDefault(require("react"));
var bootstrap_1 = require("react-library/lib/bootstrap");
var PopupHelpComponent_1 = __importDefault(require("react-library/lib/PopupHelpComponent"));
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
var LocationEditorComponent = /** @class */ (function (_super) {
    __extends(LocationEditorComponent, _super);
    function LocationEditorComponent(props) {
        var _this = _super.call(this, props) || this;
        _this.handleClear = function () {
            _this.props.onLocationChange(null);
            _this.setState({ displayingError: false, displayingSuccess: false });
        };
        _this.handleOpenAdvanced = function () { _this.setState({ displayingAdvanced: true }); };
        _this.handleCloseAdvanced = function () { _this.setState({ displayingAdvanced: false, enteringManual: false }); };
        _this.handleEnterManually = function () { _this.setState({ enteringManual: true, manualLat: null, manualLng: null, manualAlt: null }); };
        _this.handleManualLatChange = function (value) { _this.setState({ manualLat: value }); };
        _this.handleManualLngChange = function (value) { _this.setState({ manualLng: value }); };
        _this.handleManualAltChange = function (value) { _this.setState({ manualAlt: value }); };
        _this.handleSaveManual = function () {
            _this.props.onLocationChange({
                latitude: _this.state.manualLat,
                longitude: _this.state.manualLng,
                altitude: _this.state.manualAlt || undefined,
                accuracy: 0,
                altitudeAccuracy: _this.state.manualAlt ? 0 : undefined
            });
            _this.setState({ enteringManual: false });
        };
        _this.handleCancelManual = function () { _this.setState({ enteringManual: false }); };
        _this.handleMastHeightChange = function (value) {
            _this.setState({ mastHeight: value });
            setLocalStorageNumber("LocationEditorComponent.mastHeight", value);
        };
        _this.handleDepthChange = function (value) {
            _this.setState({ depth: value });
            setLocalStorageNumber("LocationEditorComponent.depth", value);
        };
        _this.handleSetUsingGPS = function () {
            _this.setState({ displayingError: false, displayingSuccess: false });
            // Start position finder
            _this.currentPositionFinder.start();
        };
        _this.handleCancelGPS = function () {
            _this.currentPositionFinder.stop();
            _this.setState({ settingUsingGPS: false, positionStatus: null });
        };
        _this.handleUseAnyway = function () {
            if (_this.state.positionStatus.strength == "poor") {
                if (!confirm(_this.props.T("Use location with very low accuracy (±{0}m)?", _this.state.positionStatus.accuracy.toFixed(0)))) {
                    return;
                }
            }
            _this.handlePositionFound(_this.state.positionStatus.pos);
        };
        _this.handlePositionFound = function (pos) {
            _this.currentPositionFinder.stop();
            var altitude = pos.coords.altitude || undefined;
            if (altitude != null) {
                // Subtract mast height and depth
                if (_this.state.mastHeight) {
                    altitude -= _this.state.mastHeight;
                }
                if (_this.state.depth) {
                    altitude -= _this.state.depth;
                }
            }
            _this.props.onLocationChange({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                altitude: altitude,
                accuracy: pos.coords.accuracy,
                altitudeAccuracy: pos.coords.altitudeAccuracy || undefined,
                mastHeight: altitude != null ? _this.state.mastHeight || undefined : undefined,
                depth: altitude != null ? _this.state.depth || undefined : undefined
            });
            _this.setState({ settingUsingGPS: false, positionStatus: null, displayingSuccess: true, displayingError: false });
            // Hide notification in 5 seconds
            setTimeout(function () {
                if (!_this.unmounted) {
                    _this.setState({ displayingSuccess: false });
                }
            }, 5000);
        };
        _this.handlePositionStatus = function (positionStatus) {
            _this.setState({ positionStatus: positionStatus });
        };
        _this.handlePositionError = function () {
            _this.setState({ settingUsingGPS: false, positionStatus: null, displayingSuccess: false, displayingError: true });
            // Hide notification in 5 seconds
            setTimeout(function () {
                if (!_this.unmounted) {
                    _this.setState({ displayingError: false });
                }
            }, 5000);
        };
        _this.currentPositionFinder = new CurrentPositionFinder_1.default({ locationFinder: props.locationFinder });
        _this.currentPositionFinder.on("status", _this.handlePositionStatus);
        _this.currentPositionFinder.on("found", _this.handlePositionFound);
        _this.currentPositionFinder.on("error", _this.handlePositionError);
        _this.state = {
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
        return _this;
    }
    LocationEditorComponent.prototype.componentWillUnmount = function () {
        this.currentPositionFinder.stop();
        this.unmounted = true;
    };
    LocationEditorComponent.prototype.renderLocation = function () {
        if (!this.props.location) {
            return react_1.default.createElement("div", { style: { fontStyle: "italic", marginLeft: 10 } },
                react_1.default.createElement("div", null, this.props.T("No Location Set")),
                react_1.default.createElement("br", null),
                this.state.mastHeight != null ?
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("span", { className: "text-muted" },
                            this.props.T("Mast height"),
                            ": ",
                            this.state.mastHeight,
                            " m")) : null,
                this.state.depth != null ?
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("span", { className: "text-muted" },
                            this.props.T("Depth"),
                            ": ",
                            this.state.depth,
                            " m")) : null);
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
            this.props.location.altitude != null ?
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", { className: "text-muted" },
                        this.props.T("Altitude"),
                        ":"),
                    " ",
                    this.props.location.altitude.toFixed(1),
                    " m") : null,
            this.props.location.accuracy != null ?
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", { className: "text-muted" },
                        this.props.T("Accuracy"),
                        ":"),
                    " +/- ",
                    this.props.location.accuracy.toFixed(1),
                    " m") : null,
            this.props.location.altitudeAccuracy != null ?
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", { className: "text-muted" },
                        this.props.T("Altitude Accuracy"),
                        ":"),
                    " +/- ",
                    this.props.location.altitudeAccuracy.toFixed(1),
                    " m") : null,
            this.props.location.mastHeight != null ?
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", { className: "text-muted" },
                        this.props.T("Mast height"),
                        ":"),
                    " ",
                    this.props.location.mastHeight,
                    " m") : null,
            this.props.location.depth != null ?
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", { className: "text-muted" },
                        this.props.T("Depth"),
                        ":"),
                    " ",
                    this.props.location.depth,
                    " m") : null));
    };
    LocationEditorComponent.prototype.renderEnterManually = function () {
        if (!this.state.enteringManual) {
            return react_1.default.createElement("div", null,
                react_1.default.createElement("button", { className: "btn btn-sm btn-link", onClick: this.handleEnterManually }, this.props.T("Enter Coordinates Manually...")));
        }
        return (react_1.default.createElement("div", { style: { marginTop: 20, marginLeft: 10 } },
            react_1.default.createElement("div", { style: { marginBottom: 5 } },
                this.props.T("Latitude"),
                ":",
                react_1.default.createElement(bootstrap_1.NumberInput, { decimal: true, style: { display: "inline-block", marginLeft: 10, width: 200 }, value: this.state.manualLat, onChange: this.handleManualLatChange })),
            react_1.default.createElement("div", { style: { marginBottom: 5 } },
                this.props.T("Longitude"),
                ":",
                react_1.default.createElement(bootstrap_1.NumberInput, { decimal: true, style: { display: "inline-block", marginLeft: 10, width: 200 }, value: this.state.manualLng, onChange: this.handleManualLngChange })),
            react_1.default.createElement("div", { style: { marginBottom: 5 } },
                this.props.T("Altitude (m)"),
                ":",
                react_1.default.createElement(bootstrap_1.NumberInput, { decimal: true, style: { display: "inline-block", marginLeft: 10, width: 200 }, value: this.state.manualAlt, onChange: this.handleManualAltChange })),
            react_1.default.createElement("div", { style: { marginBottom: 5 } },
                react_1.default.createElement("button", { className: "btn btn-primary", onClick: this.handleSaveManual, disabled: this.state.manualLat == null || this.state.manualLng == null }, this.props.T("Save")),
                "\u00A0",
                react_1.default.createElement("button", { className: "btn btn-default", onClick: this.handleCancelManual }, this.props.T("Cancel")))));
    };
    LocationEditorComponent.prototype.renderMastAndDepth = function () {
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
    };
    LocationEditorComponent.prototype.renderAdvanced = function () {
        // Can't open advanced with location set as too ambiguous what to do
        if (this.props.location) {
            return null;
        }
        if (!this.state.displayingAdvanced) {
            return react_1.default.createElement("div", { style: { marginTop: 20 } },
                react_1.default.createElement("button", { className: "btn btn-sm btn-link", onClick: this.handleOpenAdvanced }, this.props.T("Advanced Location Settings...")));
        }
        return (react_1.default.createElement("div", { style: { marginTop: 20 } },
            this.renderEnterManually(),
            this.renderMastAndDepth(),
            react_1.default.createElement("button", { className: "btn btn-sm btn-link", onClick: this.handleCloseAdvanced }, this.props.T("Hide Advanced Settings"))));
    };
    /** Render the set by GPS display */
    LocationEditorComponent.prototype.renderSetByGPS = function () {
        // If no status, don't display
        if (!this.state.positionStatus) {
            return null;
        }
        var msg = "";
        switch (this.state.positionStatus.strength) {
            case "none":
                msg = this.props.T('Waiting for GPS...');
                break;
            case "poor":
                msg = this.props.T('Very weak GPS signal (±{0}m)...', this.state.positionStatus.accuracy.toFixed(0));
                break;
            case "fair":
                msg = this.props.T('Weak GPS signal (±{0}m)...', this.state.positionStatus.accuracy.toFixed(0));
                break;
            case "good":
                msg = this.props.T('Setting location in {0}s...', this.state.positionStatus.goodDelayLeft);
                break;
        }
        return (react_1.default.createElement("div", { id: "location_setter", className: "alert alert-warning" },
            react_1.default.createElement("div", null,
                react_1.default.createElement("i", { className: "fa fa-spinner fa-spin" }),
                "\u00A0",
                react_1.default.createElement("b", null, msg),
                " \u00A0",
                this.state.positionStatus.strength != "none" && this.state.positionStatus.strength != "good" ?
                    react_1.default.createElement("button", { type: "button", className: "btn btn-sm btn-default", style: { marginLeft: 5 }, disabled: !this.state.positionStatus.useable, onClick: this.handleUseAnyway },
                        this.props.T("Use Anyway"),
                        this.state.positionStatus.initialDelayLeft ? " (" + this.state.positionStatus.initialDelayLeft + "s)" : null)
                    : null,
                react_1.default.createElement("button", { type: "button", className: "btn btn-sm btn-default", style: { marginLeft: 5 }, onClick: this.handleCancelGPS }, this.props.T("Cancel")))));
    };
    LocationEditorComponent.prototype.renderMessages = function () {
        if (this.state.displayingSuccess) {
            return react_1.default.createElement("div", { className: "alert alert-success" }, this.props.T("Location Set Successfully"));
        }
        if (this.state.displayingError) {
            return react_1.default.createElement("div", { className: "alert alert-danger" }, this.props.T("Cannot set location"));
        }
        return;
    };
    /** Render left pane with the buttons */
    LocationEditorComponent.prototype.renderLeftPane = function () {
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("div", null,
                this.props.T("Set location using"),
                ":"),
            react_1.default.createElement("div", { style: { padding: 10 } },
                react_1.default.createElement("button", { type: "button", className: "btn btn-default btn-block", onClick: this.handleSetUsingGPS, disabled: this.state.settingUsingGPS },
                    react_1.default.createElement("span", { className: "glyphicon glyphicon-screenshot" }),
                    " ",
                    this.props.T("Current Location")),
                react_1.default.createElement("button", { type: "button", className: "btn btn-default btn-block", disabled: this.props.onUseMap == null, onClick: this.props.onUseMap },
                    react_1.default.createElement("span", { className: "glyphicon glyphicon-map-marker" }),
                    " ",
                    this.props.T("Use Map")),
                react_1.default.createElement("button", { type: "button", className: "btn btn-default btn-block", disabled: this.props.location == null, onClick: this.handleClear },
                    react_1.default.createElement("span", { className: "glyphicon glyphicon-remove" }),
                    " ",
                    this.props.T("Clear")))));
    };
    LocationEditorComponent.prototype.renderRightPane = function () {
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("div", { style: { float: "right" } },
                react_1.default.createElement(PopupHelpComponent_1.default, null,
                    react_1.default.createElement("div", { style: { whiteSpace: "pre-line" } }, this.props.T("SETTING LOCATIONS:\n\nThere are three ways to set a location:\n\nCURRENT LOCATION:  Use the onboard GPS to obtain your current position. If the accuracy is poor, the app will try to repeatedly get a better GPS position for up to 10 seconds. After this time period, you can press \"Use Anyway\" to accept the current accuracy.\n\nUSE MAP: Open a map interface that can be used to visually set the location. The red marker in the middle of the map is where the position will be set. Drag and zoom the map around it until the marker is in the right location. Note that this feature does not work offline. Accuracy for coordinates set using the map is set to 0. \n\nENTER COORDINATES (Advanced): Allows the latitude and longitude to be typed in using the keyboard. Note that all coordinates must be in decimal degrees using the WGS84 datum. Click on \"Advanced GPS Settings...\" to use this method.\n\nHOW TO IMPROVE GPS ACCURACY:\n\n-On ANDROID: Make sure that your  location settings are set to High Accuracy Mode. Some phones default to \"battery saving\" or \"low accuracy\", which forces the device to use cell phone tower and wifi signals to determine positions, rather than GPS satellites, which are much more accurate.\n\n-Set locations outdoors with a clear view of the sky. Trees, buildings, and steep mountaints or valleys can reduce GPS accuracy.\n\n-Rain and clouds do not affect GPS accuracy, but they can reduce the mobile network signal. \n\n-GPS still works when the phone is offline or has a weak mobile network signal. Some phones use network signals to speed up GPS location setting, but given enough time, the onboard GPS will still be able to acquire an accurate position.\n\nADVANCED LOCATION SETTINGS:\n\nAccess these settings by clicking on \"Advanced location settings...\"\n\nMAST HEIGHT: The distance, in meters, between the GPS receiver and the ground. This setting is typically used only when an external high-precision GPS reciever is connected to the phone via bluetooth.\n\nDEPTH: The distance that the feature you are mapping is below the surface of the ground. This is typically used when mapping pipes and other buried infrastructure. \n\nENTER COORDINATES MANUALLY: Click on this option to manually type in the GPS coordinates. Note that all coordinates must be in decimal degrees using the WGS84 datum. Accuracy for manually set coordinates is blank and cannot be changed. \n")))),
            this.renderLocation(),
            this.renderAdvanced()));
    };
    LocationEditorComponent.prototype.render = function () {
        return (react_1.default.createElement("div", { style: { margin: 10 } },
            react_1.default.createElement("table", null,
                react_1.default.createElement("tbody", null,
                    react_1.default.createElement("tr", null,
                        react_1.default.createElement("td", { style: { width: 250, verticalAlign: "top" } }, this.renderLeftPane()),
                        react_1.default.createElement("td", { style: { verticalAlign: "top", paddingTop: 30 } }, this.renderRightPane())))),
            this.renderSetByGPS(),
            this.renderMessages()));
    };
    return LocationEditorComponent;
}(react_1.default.Component));
exports.default = LocationEditorComponent;
