"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const AsyncLoadComponent_1 = __importDefault(require("react-library/lib/AsyncLoadComponent"));
const classnames_1 = __importDefault(require("classnames"));
/** Displays a single image rotated appropriately */
class RotationAwareImageComponent extends AsyncLoadComponent_1.default {
    // Override to determine if a load is needed. Not called on mounting
    isLoadNeeded(newProps, oldProps) {
        return newProps.image.id !== oldProps.image.id || newProps.thumbnail !== oldProps.thumbnail;
    }
    // Call callback with state changes
    load(props, prevProps, callback) {
        if (props.thumbnail) {
            return props.imageManager.getImageThumbnailUrl(props.image.id, (url) => {
                return callback({ url, error: false });
            }, () => callback({ error: true }));
        }
        else {
            return props.imageManager.getImageUrl(props.image.id, (url) => {
                return callback({ url, error: false });
            }, () => callback({ error: true }));
        }
    }
    render() {
        const imageStyle = {};
        const containerStyle = {};
        const classes = (0, classnames_1.default)({
            "img-thumbnail": this.props.thumbnail,
            rotated: this.props.image.rotation,
            "rotate-90": this.props.image.rotation && this.props.image.rotation === 90,
            "rotate-180": this.props.image.rotation && this.props.image.rotation === 180,
            "rotate-270": this.props.image.rotation && this.props.image.rotation === 270
        });
        const containerClasses = (0, classnames_1.default)({
            "rotated-image-container": true,
            "rotated-thumbnail": this.props.thumbnail
        });
        if (this.props.thumbnail) {
            if (this.props.image.rotation === 90 || this.props.image.rotation === 270) {
                imageStyle.maxHeight = this.props.width || 160;
                imageStyle.maxWidth = this.props.height || 160;
            }
            else {
                imageStyle.maxHeight = this.props.height || 160;
                imageStyle.maxWidth = this.props.width || 160;
            }
            // Changing to max height as seems to create extra padding
            containerStyle.maxHeight = this.props.height || 160;
        }
        else {
            imageStyle.maxWidth = "100%";
        }
        if (this.state.url) {
            return R("span", {
                ref: (c) => {
                    this.parent = c;
                },
                className: containerClasses,
                style: containerStyle
            }, R("img", {
                ref: (c) => {
                    this.image = c;
                },
                src: this.state.url,
                style: imageStyle,
                className: classes,
                onClick: this.props.onClick,
                alt: this.props.image.caption || ""
            }));
        }
        else {
            return null;
        }
    }
}
exports.default = RotationAwareImageComponent;
