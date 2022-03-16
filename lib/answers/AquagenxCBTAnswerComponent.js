"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const prop_types_1 = __importDefault(require("prop-types"));
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const ImageThumbnailComponent_1 = __importDefault(require("../ImageThumbnailComponent"));
const ImagePopupComponent_1 = __importDefault(require("../ImagePopupComponent"));
const AquagenxCBTPopupComponent_1 = __importDefault(require("./AquagenxCBTPopupComponent"));
const AquagenxCBTDisplayComponent_1 = __importDefault(require("./AquagenxCBTDisplayComponent"));
// Based on https://www.aquagenx.com/wp-content/uploads/2013/12/Aquagenx-CBT-Instructions-v3.pdf
class AquagenxCBTAnswerComponent extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.handleClickImage = () => {
            const modal = react_1.default.createElement(ImagePopupComponent_1.default, {
                imageManager: this.context.imageManager,
                image: this.props.value.image,
                T: this.context.T,
                onRemove: () => {
                    this.setState({ imageModal: null });
                    const value = lodash_1.default.clone(this.props.value);
                    value.image = null;
                    return this.props.onValueChange(value);
                },
                onClose: () => {
                    return this.setState({ imageModal: null });
                },
                onRotate: () => {
                    const value = lodash_1.default.clone(this.props.value);
                    value.image = lodash_1.default.extend({}, value.image, { rotation: ((value.image.rotation || 0) + 90) % 360 });
                    return this.props.onValueChange(value);
                }
            });
            return this.setState({ imageModal: modal });
        };
        this.handleAdd = () => {
            // Call imageAcquirer
            return this.context.imageAcquirer.acquire((id) => {
                // Add to model
                const value = lodash_1.default.clone(this.props.value);
                value.image = { id };
                return this.props.onValueChange(value);
            }, (err) => {
                throw err;
            });
        };
        this.handleEditClick = () => {
            const modal = react_1.default.createElement(AquagenxCBTPopupComponent_1.default, {
                value: this.props.value,
                questionId: this.props.questionId,
                onSave: (value) => {
                    this.setState({ aquagenxModal: null });
                    return this.props.onValueChange(value);
                },
                onClose: () => {
                    return this.setState({ aquagenxModal: null });
                }
            });
            return this.setState({ aquagenxModal: modal });
        };
        this.handleClearClick = () => {
            const value = lodash_1.default.clone(this.props.value);
            value.cbt = null;
            return this.props.onValueChange(value);
        };
        this.state = { imageModal: null, aquagenxModal: null };
    }
    focus() {
        return null;
    }
    renderImage() {
        var _a;
        return R("div", null, this.state.imageModal, ((_a = this.props.value) === null || _a === void 0 ? void 0 : _a.image)
            ? react_1.default.createElement(ImageThumbnailComponent_1.default, {
                imageId: this.props.value.image.id,
                onClick: this.handleClickImage,
                imageManager: this.context.imageManager
            })
            : this.props.onValueChange && this.context.imageAcquirer
                ? R("img", {
                    src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAFzAgMAAABtAbdzAAAACVBMVEUAAQBsbmz7//tn1+0/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3woHEjIHlG2SjgAAAxhJREFUeNrt3Mt1pjAMBWA2U8J0NnjhEtyPS/DCrjKbnDn/AUt+cK0AuSxD4APkBCwktt1g2YgQIUKEiCXyb9v+EiFChAgRIkSIECFC5JHIdlz+ECFC5L0I/0ESIUKECBEivxYJ5WNJRIgQeT5ynFAQIfISpICXWEE8GskVpMCXM+LwSDwhHo/kFyOhrIw8ESJEiBAhQoQIkXsiqX8KMI2MzGZmkf+b+XXIx7zGr0KiOInFIYfp8BrkMG/2K5DTvH4FckoBeDxSSVDgkUo2w6ORaqYFjVQTMx6L5CrisIiQl8IiQiLLI5EsIA6JiFk8JCIm/jwOySLicIiS88QhUUYCDFGysR6F5MP1yX1BGUPS6cC7gjKGxPNx9wRlDKkcdu4IyhCSa0ed2kEZQur7awdlDgnVn2KQWL8wzcgPIUKIUyvyU4gwHhwCEXeGRJJ07VMj8iNIlPaVG5GfQJy4FwQiD6KoD68JRB4SACQrY0gfXgNIUg5XH14gJKKQqPxCUjceR7R4XUfU4KrDaxjx2mleRnIH4kBI0IYeClHXXkZSB7JjkMaN6SoS7RCvrw5rkQRBukLm1yIZiJTnI7lrzuYeg/jGU9kTkNSF7I9Bms/8RAyR2IcEAFJ+GMlEiBAhQmQ1svh+wnv8XZH3PKYuRt420zJBWrPfi4jlPD78KJKeg9wh34VBunKQGMQkm7oY6clwoxCTXP1axPL9yT5xmjd9pxVG1828AnQKUlDIPhqvmdeyyrtfh0OCeLUAiFKlsONelVtWFsg1EggkNao9IIUY2bJu5RjgiETKrtcSYcp8ol4VFSCIbX3Xykq1rNbcgZCya9WDoMK+z6pRd9weVqKYjhWvfRWwF8pG+2t5b1gAa1PKa1KUbFJeXWau1j1L3k2K903aEGwaKkxaQ0yaXGzadUwaj2qnEuBItmgGs2lrM2nQs2k1NGmatGn/tGlktWnJ/f5zGTxtNnwTIULkyQi/RNb3SLDuE3QmyH5GTL7YZ/LtwaULESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiNwS+QJpMQICAeI7BAAAAABJRU5ErkJggg==",
                    className: "rounded",
                    onClick: this.handleAdd,
                    style: { maxHeight: 100, verticalAlign: "top" }
                })
                : R("div", { className: "text-muted" }, this.context.T("No images present")));
    }
    renderAquagenxCBT() {
        var _a;
        return R("div", null, this.state.aquagenxModal, ((_a = this.props.value) === null || _a === void 0 ? void 0 : _a.cbt) == null
            ? R("div", null, R("button", { className: "btn btn-secondary", onClick: this.handleEditClick }, this.context.T("Record")))
            : R("div", null, R(AquagenxCBTDisplayComponent_1.default, {
                value: this.props.value,
                questionId: this.props.questionId,
                onEdit: this.handleEditClick
            }), R("div", null, R("button", { className: "btn btn-secondary", onClick: this.handleEditClick }, R("span", { className: "fas fa-edit" }), " ", this.context.T("Edit")), R("button", { className: "btn btn-secondary", onClick: this.handleClearClick, style: { marginLeft: "12px" } }, R("span", { className: "fas fa-times" }), " ", this.context.T("Clear")))));
    }
    render() {
        return R("div", null, this.renderAquagenxCBT(), R("br"), this.renderImage());
    }
}
exports.default = AquagenxCBTAnswerComponent;
AquagenxCBTAnswerComponent.contextTypes = {
    imageManager: prop_types_1.default.object.isRequired,
    imageAcquirer: prop_types_1.default.object,
    T: prop_types_1.default.func.isRequired // Localizer to use
};
AquagenxCBTAnswerComponent.defaultProps = { value: { image: null, cbt: null } };
