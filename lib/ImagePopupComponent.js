"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const ModalPopupComponent_1 = __importDefault(require("react-library/lib/ModalPopupComponent"));
const AsyncLoadComponent_1 = __importDefault(require("react-library/lib/AsyncLoadComponent"));
const RotationAwareImageComponent_1 = __importDefault(require("./RotationAwareImageComponent"));
// Displays an image in a popup and allows removing or setting as cover image
class ImagePopupComponent extends AsyncLoadComponent_1.default {
    // Override to determine if a load is needed. Not called on mounting
    isLoadNeeded(newProps, oldProps) {
        return newProps.id !== oldProps.id;
    }
    // Call callback with state changes
    load(props, prevProps, callback) {
        return this.props.imageManager.getImageUrl(props.image.id, (url) => {
            return callback({ url, error: false });
        }, () => callback({ error: true }));
    }
    render() {
        if (this.state.loading) {
            return R("div", { className: "alert alert-info" }, this.props.T("Loading..."));
        }
        if (this.state.error) {
            return R("div", { className: "alert alert-danger" }, this.props.T("Error"));
        }
        return react_1.default.createElement(ModalPopupComponent_1.default, {
            footer: R("button", { type: "button", className: "btn btn-default", onClick: this.props.onClose }, this.props.T("Close"))
        }, R("div", null, R("button", { type: "button", className: "close", onClick: this.props.onClose }, "×"), 
        // Add button links
        R("div", null, this.props.onSetCover
            ? R("button", { type: "button", className: "btn btn-link", onClick: this.props.onSetCover }, this.props.T("Set as Cover Image"))
            : undefined, " ", this.props.onRemove
            ? R("button", { type: "button", className: "btn btn-link", onClick: this.props.onRemove }, this.props.T("Remove"))
            : undefined, " ", this.props.onRotate
            ? R("button", { type: "button", className: "btn btn-link", onClick: this.props.onRotate }, this.props.T("Rotate"))
            : undefined), 
        // Render image
        react_1.default.createElement(RotationAwareImageComponent_1.default, {
            key: this.props.image.id,
            imageManager: this.props.imageManager,
            image: this.props.image,
            onClick: this.handleClickImage
        })));
    }
}
exports.default = ImagePopupComponent;
;
