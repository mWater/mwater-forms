"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const prop_types_1 = __importDefault(require("prop-types"));
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const ImagePopupComponent_1 = __importDefault(require("../ImagePopupComponent"));
const RotationAwareImageComponent_1 = __importDefault(require("../RotationAwareImageComponent"));
// Edit an image
class ImageAnswerComponent extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.handleClickImage = () => {
            return this.setState({ modalOpen: true });
        };
        this.handleAdd = () => {
            // Check consent
            if (this.props.consentPrompt) {
                if (!confirm(this.props.consentPrompt)) {
                    return;
                }
            }
            // Call imageAcquirer
            return this.context.imageAcquirer.acquire((id, rotation = 0) => {
                // Add to model
                return this.props.onImageChange({ id, rotation });
            }, (err) => {
                console.log("Error acquiring image");
                console.log(err.message || err.code || err);
                alert(this.context.T("Error getting image") + ": " + (err.message || err.code || err));
            });
        };
        this.state = { modalOpen: false };
    }
    focus() {
        // Nothing to focus
        return null;
    }
    renderModal() {
        if (!this.state.modalOpen) {
            return null;
        }
        const onRemove = this.props.onImageChange
            ? () => {
                this.setState({ modalOpen: false });
                return this.props.onImageChange(null);
            }
            : undefined;
        const onRotate = this.props.onImageChange
            ? () => {
                const image = lodash_1.default.extend({}, this.props.image, { rotation: ((this.props.image.rotation || 0) + 90) % 360 });
                return this.props.onImageChange(image);
            }
            : undefined;
        return react_1.default.createElement(ImagePopupComponent_1.default, {
            imageManager: this.context.imageManager,
            image: this.props.image,
            T: this.context.T,
            onRemove,
            onRotate,
            onClose: () => {
                return this.setState({ modalOpen: false });
            }
        });
    }
    render() {
        return R("div", null, this.renderModal(), this.props.image
            ? react_1.default.createElement(RotationAwareImageComponent_1.default, {
                key: this.props.image.id,
                imageManager: this.context.imageManager,
                image: this.props.image,
                thumbnail: true,
                onClick: this.handleClickImage
            })
            : this.props.onImageChange && this.context.imageAcquirer
                ? R("img", {
                    src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAFzAgMAAABtAbdzAAAACVBMVEUAAQBsbmz7//tn1+0/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3woHEjIHlG2SjgAAAxhJREFUeNrt3Mt1pjAMBWA2U8J0NnjhEtyPS/DCrjKbnDn/AUt+cK0AuSxD4APkBCwktt1g2YgQIUKEiCXyb9v+EiFChAgRIkSIECFC5JHIdlz+ECFC5L0I/0ESIUKECBEivxYJ5WNJRIgQeT5ynFAQIfISpICXWEE8GskVpMCXM+LwSDwhHo/kFyOhrIw8ESJEiBAhQoQIkXsiqX8KMI2MzGZmkf+b+XXIx7zGr0KiOInFIYfp8BrkMG/2K5DTvH4FckoBeDxSSVDgkUo2w6ORaqYFjVQTMx6L5CrisIiQl8IiQiLLI5EsIA6JiFk8JCIm/jwOySLicIiS88QhUUYCDFGysR6F5MP1yX1BGUPS6cC7gjKGxPNx9wRlDKkcdu4IyhCSa0ed2kEZQur7awdlDgnVn2KQWL8wzcgPIUKIUyvyU4gwHhwCEXeGRJJ07VMj8iNIlPaVG5GfQJy4FwQiD6KoD68JRB4SACQrY0gfXgNIUg5XH14gJKKQqPxCUjceR7R4XUfU4KrDaxjx2mleRnIH4kBI0IYeClHXXkZSB7JjkMaN6SoS7RCvrw5rkQRBukLm1yIZiJTnI7lrzuYeg/jGU9kTkNSF7I9Bms/8RAyR2IcEAFJ+GMlEiBAhQmQ1svh+wnv8XZH3PKYuRt420zJBWrPfi4jlPD78KJKeg9wh34VBunKQGMQkm7oY6clwoxCTXP1axPL9yT5xmjd9pxVG1828AnQKUlDIPhqvmdeyyrtfh0OCeLUAiFKlsONelVtWFsg1EggkNao9IIUY2bJu5RjgiETKrtcSYcp8ol4VFSCIbX3Xykq1rNbcgZCya9WDoMK+z6pRd9weVqKYjhWvfRWwF8pG+2t5b1gAa1PKa1KUbFJeXWau1j1L3k2K903aEGwaKkxaQ0yaXGzadUwaj2qnEuBItmgGs2lrM2nQs2k1NGmatGn/tGlktWnJ/f5zGTxtNnwTIULkyQi/RNb3SLDuE3QmyH5GTL7YZ/LtwaULESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiNwS+QJpMQICAeI7BAAAAABJRU5ErkJggg==",
                    className: "rounded",
                    onClick: this.handleAdd,
                    style: { maxHeight: 100, verticalAlign: "top" }
                })
                : R("div", { className: "text-muted" }, this.context.T("No images present")));
    }
}
exports.default = ImageAnswerComponent;
ImageAnswerComponent.contextTypes = {
    imageManager: prop_types_1.default.object.isRequired,
    imageAcquirer: prop_types_1.default.object,
    T: prop_types_1.default.func.isRequired // Localizer to use
};
