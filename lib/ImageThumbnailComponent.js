"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const AsyncLoadComponent_1 = __importDefault(require("react-library/lib/AsyncLoadComponent"));
// Displays a thumbnail of an image
class ImageThumbnailComponent extends AsyncLoadComponent_1.default {
    constructor() {
        super(...arguments);
        this.handleError = () => {
            return this.setState({ error: true });
        };
    }
    // Override to determine if a load is needed. Not called on mounting
    isLoadNeeded(newProps, oldProps) {
        return newProps.imageId !== oldProps.imageId;
    }
    // Call callback with state changes
    load(props, prevProps, callback) {
        return props.imageManager.getImageUrl(props.imageId, (url) => {
            return callback({ url, error: false });
        }, () => callback({ error: true }));
    }
    render() {
        let url;
        if (this.state.loading) {
            // TODO better as font-awesome or suchlike
            url = "img/image-loading.png";
        }
        else if (this.state.error) {
            // TODO better as font-awesome or suchlike
            url = "img/no-image-icon.jpg";
        }
        else if (this.state.url) {
            ;
            ({ url } = this.state);
        }
        return R("img", {
            src: url,
            style: { maxHeight: 100 },
            className: "img-thumbnail",
            onClick: this.props.onClick,
            onError: this.handleError
        });
    }
}
exports.default = ImageThumbnailComponent;
