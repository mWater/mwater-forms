"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const ImagePopupComponent_1 = __importDefault(require("./ImagePopupComponent"));
const RotationAwareImageComponent_1 = __importDefault(require("./RotationAwareImageComponent"));
// Displays an image
class ImageDisplayComponent extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.handleImgError = () => {
            return this.setState({ error: true });
        };
        this.handleImgClick = () => {
            return this.setState({ popup: true });
        };
        this.state = { error: false, url: null, popup: false };
    }
    componentDidMount() {
        return this.update(this.props);
    }
    componentWillReceiveProps(newProps) {
        return this.update(newProps);
    }
    update(props) {
        // Get URL of thumbnail
        return props.imageManager.getImageThumbnailUrl(props.image.id, (url) => {
            return this.setState({ url, error: false });
        }, () => this.setState({ error: true }));
    }
    render() {
        let src;
        if (this.state.error) {
            src = "img/no-image-icon.jpg";
        }
        else if (this.state.url) {
            src = this.state.url;
        }
        else {
            src = "img/image-loading.png";
        }
        return R("span", null, react_1.default.createElement(RotationAwareImageComponent_1.default, {
            image: this.props.image,
            imageManager: this.props.imageManager,
            onClick: this.handleImgClick,
            height: 100,
            thumbnail: true
        }), this.state.popup
            ? react_1.default.createElement(ImagePopupComponent_1.default, {
                imageManager: this.props.imageManager,
                image: this.props.image,
                onClose: () => this.setState({ popup: false }),
                T: this.props.T
            })
            : undefined);
    }
}
exports.default = ImageDisplayComponent;
