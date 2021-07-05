"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prop_types_1 = __importDefault(require("prop-types"));
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const LocationEditorComponent_1 = __importDefault(require("../LocationEditorComponent"));
const LocationFinder_1 = __importDefault(require("../LocationFinder"));
class LocationAnswerComponent extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.handleUseMap = () => {
            if (this.context.displayMap != null) {
                return this.context.displayMap(this.props.value, (newLoc) => {
                    // Wrap to -180, 180
                    while (newLoc.longitude < -180) {
                        newLoc.longitude += 360;
                    }
                    while (newLoc.longitude > 180) {
                        newLoc.longitude -= 360;
                    }
                    // Clip to -85, 85 (for Webmercator)
                    if (newLoc.latitude > 85) {
                        newLoc.latitude = 85;
                    }
                    if (newLoc.latitude < -85) {
                        newLoc.latitude = -85;
                    }
                    // Record that done via map
                    newLoc.method = "map";
                    return this.props.onValueChange(newLoc);
                });
            }
        };
    }
    focus() {
        // Nothing to focus
        return null;
    }
    render() {
        return R(LocationEditorComponent_1.default, {
            location: this.props.value,
            onLocationChange: this.props.onValueChange,
            onUseMap: !this.props.disableSetByMap && this.context.displayMap != null ? this.handleUseMap : undefined,
            disableManualLatLng: this.props.disableManualLatLng,
            locationFinder: this.context.locationFinder || new LocationFinder_1.default(),
            T: this.context.T
        });
    }
}
exports.default = LocationAnswerComponent;
LocationAnswerComponent.contextTypes = {
    displayMap: prop_types_1.default.func,
    T: prop_types_1.default.func.isRequired,
    locationFinder: prop_types_1.default.object
};
