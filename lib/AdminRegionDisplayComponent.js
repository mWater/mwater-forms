"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
let AdminRegionDisplayComponent;
const prop_types_1 = __importDefault(require("prop-types"));
const lodash_1 = __importDefault(require("lodash"));
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const AsyncLoadComponent_1 = __importDefault(require("react-library/lib/AsyncLoadComponent"));
// Loads and displays an admin region
exports.default = AdminRegionDisplayComponent = (function () {
    AdminRegionDisplayComponent = class AdminRegionDisplayComponent extends AsyncLoadComponent_1.default {
        static initClass() {
            this.propTypes = {
                getAdminRegionPath: prop_types_1.default.func.isRequired,
                value: prop_types_1.default.string,
                T: prop_types_1.default.func.isRequired
            };
            // Localizer to use
        }
        // Override to determine if a load is needed. Not called on mounting
        isLoadNeeded(newProps, oldProps) {
            return newProps.value !== oldProps.value;
        }
        // Call callback with state changes
        load(props, prevProps, callback) {
            if (!props.value) {
                callback({ error: null, path: [] });
                return;
            }
            return props.getAdminRegionPath(props.value, (error, path) => {
                return callback({ error, path });
            });
        }
        render() {
            if (this.state.loading) {
                return R("span", { className: "text-muted" }, this.props.T("Loading..."));
            }
            if (this.state.error) {
                return R("span", { className: "text-danger" }, this.props.T("Unable to connect to server"));
            }
            if (!this.state.path || this.state.path.length === 0) {
                return R("span", null, "None");
            }
            return R("span", null, lodash_1.default.last(this.state.path).full_name);
        }
    };
    AdminRegionDisplayComponent.initClass();
    return AdminRegionDisplayComponent;
})();
