"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prop_types_1 = __importDefault(require("prop-types"));
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const ImagesAnswerComponent_1 = __importDefault(require("./answers/ImagesAnswerComponent"));
// Edit an image list
class ImagelistEditorComponent extends react_1.default.Component {
    static initClass() {
        this.childContextTypes = {
            imageManager: prop_types_1.default.object.isRequired,
            imageAcquirer: prop_types_1.default.object,
            T: prop_types_1.default.func.isRequired
        };
        // Localizer to use
    }
    getChildContext() {
        return {
            imageManager: this.props.imageManager,
            imageAcquirer: this.props.imageAcquirer,
            T: this.props.T
        };
    }
    render() {
        return R(ImagesAnswerComponent_1.default, {
            imagelist: this.props.imagelist,
            onImagelistChange: this.props.onImagelistChange,
            consentPrompt: this.props.consentPrompt
        });
    }
}
exports.default = ImagelistEditorComponent;
;
ImagelistEditorComponent.initClass();
