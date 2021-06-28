"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
let AdminRegionSelectComponent;
const prop_types_1 = __importDefault(require("prop-types"));
const lodash_1 = __importDefault(require("lodash"));
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const AsyncLoadComponent_1 = __importDefault(require("react-library/lib/AsyncLoadComponent"));
// Allows selecting an admin region via cascading dropdowns
exports.default = AdminRegionSelectComponent = (function () {
    AdminRegionSelectComponent = class AdminRegionSelectComponent extends AsyncLoadComponent_1.default {
        constructor() {
            super(...arguments);
            // props.imageManager.getImageUrl(props.imageId, (url) =>
            //   callback(url: url, error: false)
            // , => callback(error: true))
            this.handleChange = (level, ev) => {
                if (ev.target.value) {
                    return this.props.onChange(ev.target.value);
                }
                else if (level > 0) {
                    // Use level above
                    return this.props.onChange(this.state.path[level - 1].id);
                }
                else {
                    return this.props.onChange(null);
                }
            };
        }
        static initClass() {
            this.propTypes = {
                getAdminRegionPath: prop_types_1.default.func.isRequired,
                getSubAdminRegions: prop_types_1.default.func.isRequired,
                value: prop_types_1.default.string,
                onChange: prop_types_1.default.func.isRequired,
                T: prop_types_1.default.func.isRequired
            };
            // Localizer to use
        }
        componentWillMount(props) {
            super.componentWillMount(props);
            // Get countries initially
            return this.props.getSubAdminRegions(null, 0, (error, level0s) => {
                return this.setState({ level0s });
            });
        }
        // Override to determine if a load is needed. Not called on mounting
        isLoadNeeded(newProps, oldProps) {
            return newProps.value !== oldProps.value;
        }
        // Call callback with state changes
        load(props, prevProps, callback) {
            // Leave current state alone while loading
            callback({ busy: true }); // loading is reserved
            // Get path
            if (props.value) {
                return props.getAdminRegionPath(props.value, (error, path) => {
                    if (error) {
                        return callback({ error, busy: false });
                    }
                    callback({
                        error: null,
                        path,
                        busy: false,
                        level1s: null,
                        level2s: null,
                        level3s: null,
                        level4s: null,
                        level5s: null
                    });
                    // Get subadmins
                    return path.map((pathElem) => ((pathElem) => {
                        return props.getSubAdminRegions(pathElem.id, pathElem.level + 1, (error, subRegions) => {
                            if (error) {
                                return callback({ error });
                            }
                            // Set levelNs to be list of values
                            const val = {};
                            val[`level${pathElem.level + 1}s`] = subRegions;
                            return callback(val);
                        });
                    })(pathElem));
                });
            }
            else {
                return callback({ error: null, path: [], busy: false });
            }
        }
        renderLevel(level) {
            if (!this.state.path[level] && (!this.state[`level${level}s`] || this.state[`level${level}s`].length === 0)) {
                return null;
            }
            return R("tr", { key: level }, R("td", { style: { paddingLeft: 10, paddingRight: 10 }, className: "text-muted" }, this.state.path[level] ? this.state.path[level].type : undefined), R("td", null, R("select", {
                key: `level${level}`,
                className: "form-control",
                value: this.state.path[level] ? this.state.path[level].id : "",
                onChange: this.handleChange.bind(null, level)
            }, R("option", { key: "none", value: "" }, this.state.path[level] ? this.props.T("None") : this.props.T("Select...")), (() => {
                if (this.state[`level${level}s`]) {
                    return lodash_1.default.map(this.state[`level${level}s`], (subRegion) => R("option", { key: subRegion.id, value: subRegion.id }, subRegion.name));
                }
                else if (this.state.path[level]) {
                    // No options yet, just use value
                    return R("option", { key: this.state.path[level].id, value: this.state.path[level].id }, this.state.path[level].name);
                }
            })())));
        }
        render() {
            if (this.state.loading || (!this.state.path && this.props.value) || (!this.props.value && !this.state.level0s)) {
                return R("div", null, this.props.T("Loading..."));
            }
            return R("table", { style: { opacity: this.state.busy ? 0.5 : undefined } }, R("tbody", null, lodash_1.default.map(lodash_1.default.range(0, this.state.path.length + 1), (level) => this.renderLevel(level))));
        }
    };
    AdminRegionSelectComponent.initClass();
    return AdminRegionSelectComponent;
})();
// if @state.loading
//   # TODO better as font-awesome or suchlike
//   url = "img/image-loading.png"
// else if @state.error
//   # TODO better as font-awesome or suchlike
//   url = "img/no-image-icon.jpg"
// else if @state.url
//   url = @state.url
// return R('img', src: url, style: { maxHeight: 100 }, className: "img-thumbnail", onClick: @props.onClick, onError: @handleError)
