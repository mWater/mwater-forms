"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Modal that allows upload of an image to the server
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const formUtils = __importStar(require("./formUtils"));
const ModalPopupComponent_1 = __importDefault(require("react-library/lib/ModalPopupComponent"));
// Based on http://www.matlus.com/html5-file-upload-with-progress/
class ImageUploaderModalComponent extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.handleUploadProgress = (evt) => {
            let percentComplete;
            if (evt.lengthComputable) {
                percentComplete = Math.round((evt.loaded * 100) / evt.total);
                return this.setState({ percentComplete });
            }
            else {
                return this.setState({ percentComplete: 100 });
            }
        };
        this.handleUploadComplete = (evt) => {
            // This event is raised when the server send back a response
            if (evt.target.status === 200) {
                return this.props.onSuccess(this.state.id);
            }
            else {
                alert(this.props.T("Upload failed: {0}", evt.target.responseText));
                return this.props.onCancel();
            }
        };
        this.handleUploadFailed = (evt) => {
            alert(this.props.T("Error uploading file. You must be connected to the Internet for image upload to work from a web browser."));
            return this.props.onCancel();
        };
        this.handleUploadCanceled = (evt) => {
            alert(this.props.T("Upload cancelled"));
            return this.props.onCancel();
        };
        this.handleCancel = () => {
            var _a;
            return (_a = this.state.xhr) === null || _a === void 0 ? void 0 : _a.abort();
        };
        this.handleFileSelected = (ev) => {
            // Get file information
            const file = ev.target.files[0];
            if (!file) {
                return;
            }
            if (file.type !== "image/jpeg") {
                alert(T("Image must be a jpeg file"));
                return;
            }
            const xhr = new XMLHttpRequest();
            const fd = new FormData();
            fd.append("image", file);
            // Add event listners
            xhr.upload.onprogress = this.handleUploadProgress;
            xhr.addEventListener("load", this.handleUploadComplete, false);
            xhr.addEventListener("error", this.handleUploadFailed, false);
            xhr.addEventListener("abort", this.handleUploadCanceled, false);
            // Create id
            const id = formUtils.createUid();
            // Generate url
            let url = this.props.apiUrl + "images/" + id;
            if (this.props.client) {
                url += "?client=" + this.props.client;
            }
            // Set that uploading (start at 100% in case no updates)
            this.setState({ id, xhr, percentComplete: 100 });
            // Begin upload
            xhr.open("POST", url);
            return xhr.send(fd);
        };
        this.state = {
            id: null,
            xhr: null,
            percentComplete: null // Percent upload completed
        };
    }
    static initClass() {
        // Static function to show modal easily
        this.show = (apiUrl, client, T, success, forceCamera) => {
            return ModalPopupComponent_1.default.show((onClose) => {
                return R(ImageUploaderModalComponent, {
                    apiUrl,
                    client,
                    T,
                    forceCamera,
                    onCancel: onClose,
                    onSuccess: (id) => {
                        onClose();
                        return success(id);
                    }
                });
            });
        };
        // True to force use of camera
    }
    renderContents() {
        return R("div", null, R("form", { encType: "multipart/form-data", method: "post" }, R("label", { className: "btn btn-default btn-lg", style: { display: this.state.xhr ? "none" : undefined } }, R("span", { className: "glyphicon glyphicon-camera" }), " ", this.props.T("Select"), R("input", {
            type: "file",
            style: { display: "none" },
            accept: "image/*",
            capture: this.props.forceCamera ? "camera" : undefined,
            onChange: this.handleFileSelected
        })), R("div", { style: { display: !this.state.xhr ? "none" : undefined } }, R("p", null, R("em", null, this.props.T("Uploading Image..."))), R("div", { className: "progress progress-striped active" }, R("div", { className: "progress-bar", style: { width: `${this.state.percentComplete}%` } })))), this.state.xhr
            ? R("button", { type: "button", className: "btn btn-default", onClick: this.handleCancel }, this.props.T("Cancel"))
            : undefined);
    }
    render() {
        return R(ModalPopupComponent_1.default, {
            header: this.props.T("Upload Image"),
            showCloseX: true,
            onClose: this.props.onCancel
        }, this.renderContents());
    }
}
exports.default = ImageUploaderModalComponent;
ImageUploaderModalComponent.initClass();
