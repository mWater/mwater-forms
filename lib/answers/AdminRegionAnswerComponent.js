"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
let AdminRegionAnswerComponent;
const prop_types_1 = __importDefault(require("prop-types"));
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const AdminRegionSelectComponent_1 = __importDefault(require("../AdminRegionSelectComponent"));
// Displays a gps, map and manual select
exports.default = AdminRegionAnswerComponent = (function () {
    AdminRegionAnswerComponent = class AdminRegionAnswerComponent extends react_1.default.Component {
        constructor(props) {
            super(props);
            this.handleUseGPS = () => {
                return this.setState({ error: null, waiting: true }, () => {
                    return this.context.locationFinder.getLocation((location) => {
                        // If no longer waiting, ignore
                        if (!this.state.waiting) {
                            return;
                        }
                        // Lookup location
                        return this.context.findAdminRegionByLatLng(location.coords.latitude, location.coords.longitude, (error, id) => {
                            if (error) {
                                this.setState({ error: this.context.T("Unable to lookup location"), waiting: false });
                                return;
                            }
                            this.setState({ waiting: false });
                            return this.props.onChange(id);
                        });
                    }, (error) => {
                        // If no longer waiting, ignore
                        if (!this.state.waiting) {
                            return;
                        }
                        return this.setState({ error: this.context.T("Unable to get location"), waiting: false });
                    });
                });
            };
            this.handleCancelUseGPS = () => {
                return this.setState({ waiting: false });
            };
            this.handleUseMap = () => {
                this.setState({ error: null, waiting: false });
                return this.context.displayMap(null, (location) => {
                    // Cancel if no location
                    if (!location) {
                        return;
                    }
                    // Lookup location
                    return this.context.findAdminRegionByLatLng(location.latitude, location.longitude, (error, id) => {
                        if (error) {
                            this.setState({ error: this.context.T("Unable to lookup location") });
                            return;
                        }
                        return this.props.onChange(id);
                    });
                });
            };
            this.handleChange = (id) => {
                this.setState({ error: null, waiting: false });
                return this.props.onChange(id);
            };
            this.state = {
                waiting: false,
                error: null
            };
        }
        static initClass() {
            this.contextTypes = {
                locationFinder: prop_types_1.default.object,
                displayMap: prop_types_1.default.func,
                getAdminRegionPath: prop_types_1.default.func.isRequired,
                getSubAdminRegions: prop_types_1.default.func.isRequired,
                findAdminRegionByLatLng: prop_types_1.default.func.isRequired,
                T: prop_types_1.default.func.isRequired // Localizer to use
            };
            this.propTypes = {
                value: prop_types_1.default.string,
                onChange: prop_types_1.default.func.isRequired
            };
            // Called with new id
        }
        focus() {
            // Nothing to focus
            return null;
        }
        renderEntityButtons() {
            return R("div", null, !this.state.waiting
                ? R("button", {
                    type: "button",
                    className: "btn btn-link btn-sm",
                    onClick: this.handleUseGPS,
                    disabled: this.context.locationFinder == null
                }, R("span", { className: "fas fa-location-arrow" }), " ", this.context.T("Set Using GPS"))
                : R("button", {
                    type: "button",
                    className: "btn btn-link btn-sm",
                    onClick: this.handleCancelUseGPS,
                    disabled: this.context.locationFinder == null
                }, R("span", { className: "fas fa-times" }), " ", this.context.T("Cancel GPS")), R("button", {
                type: "button",
                className: "btn btn-link btn-sm",
                onClick: this.handleUseMap,
                disabled: this.context.displayMap == null
            }, R("span", { className: "fas fa-map-marker-alt" }), " ", this.context.T("Set Using Map")));
        }
        render() {
            return R("div", null, this.renderEntityButtons(), this.state.waiting ? R("div", { className: "text-info" }, this.context.T("Waiting for GPS...")) : undefined, this.state.error ? R("div", { className: "text-danger" }, this.state.error) : undefined, react_1.default.createElement(AdminRegionSelectComponent_1.default, {
                getAdminRegionPath: this.context.getAdminRegionPath,
                getSubAdminRegions: this.context.getSubAdminRegions,
                value: this.props.value,
                onChange: this.handleChange,
                T: this.context.T
            }));
        }
    };
    AdminRegionAnswerComponent.initClass();
    return AdminRegionAnswerComponent;
})();
