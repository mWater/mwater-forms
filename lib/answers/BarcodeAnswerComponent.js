"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prop_types_1 = __importDefault(require("prop-types"));
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
// Functional? I haven't tried this one yet
// Not tested
class BarcodeAnswerComponent extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.handleValueChange = () => {
            return this.props.onValueChange(!this.props.value);
        };
        this.handleScanClick = () => {
            return this.context.scanBarcode({
                success: (text) => {
                    return this.props.onValueChange(text);
                }
            });
        };
        this.handleClearClick = () => {
            return this.props.onValueChange(null);
        };
    }
    focus() {
        // Nothing to focus
        return null;
    }
    render() {
        const supported = this.context.scanBarcode != null;
        if (this.props.value) {
            return R("div", null, R("pre", null, R("p", null, this.props.value)), R("div", null, R("button", { className: "btn btn-secondary", onClick: this.handleClearClick, type: "button" }, R("span", { className: "fas fa-times" }, this.context.T("Clear")))));
        }
        else {
            if (supported) {
                return R("div", null, R("button", { className: "btn btn-secondary", onClick: this.handleScanClick, type: "button" }, R("span", { className: "fas fa-qrcode" }), this.context.T("Scan")));
            }
            else {
                return R("div", { className: "text-warning" }, this.context.T("Barcode scanning not supported on this platform"));
            }
        }
    }
}
exports.default = BarcodeAnswerComponent;
BarcodeAnswerComponent.contextTypes = {
    scanBarcode: prop_types_1.default.func,
    T: prop_types_1.default.func.isRequired // Localizer to use
};
