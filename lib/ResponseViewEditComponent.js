"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const FormComponent_1 = __importDefault(require("./FormComponent"));
const ResponseModel_1 = __importDefault(require("./ResponseModel"));
const ResponseDisplayComponent_1 = __importDefault(require("./ResponseDisplayComponent"));
const ui = __importStar(require("react-library/lib/bootstrap"));
// Displays a view of a response that can be edited, rejected, etc.
// When editing, shows in single-page mode.
class ResponseViewEditComponent extends react_1.default.Component {
    constructor(props) {
        var _a;
        super(props);
        this.handleApprove = () => {
            // TODO no longer needed if response model becomes immutable
            const response = lodash_1.default.cloneDeep(this.props.response);
            const responseModel = this.createResponseModel(response);
            if (!responseModel.canApprove()) {
                return alert("Cannot approve");
            }
            responseModel.approve();
            return this.props.onUpdateResponse(response);
        };
        this.handleReject = () => {
            // TODO no longer needed if response model becomes immutable
            const response = lodash_1.default.cloneDeep(this.props.response);
            const responseModel = this.createResponseModel(response);
            if (!responseModel.canReject()) {
                return alert("Cannot reject");
            }
            const message = prompt("Reason for rejection?");
            if (message == null) {
                return;
            }
            responseModel.reject(message);
            return this.props.onUpdateResponse(response);
        };
        this.handleUnreject = () => {
            // TODO no longer needed if response model becomes immutable
            const response = lodash_1.default.cloneDeep(this.props.response);
            const responseModel = this.createResponseModel(response);
            if (!responseModel.canSubmit()) {
                return alert("Cannot unreject");
            }
            responseModel.submit();
            return this.props.onUpdateResponse(response);
        };
        this.handleDelete = () => {
            if (!confirm("Permanently delete response?")) {
                return;
            }
            return this.props.onDeleteResponse();
        };
        this.handleDataChange = (data) => {
            return this.setState({ unsavedData: data });
        };
        this.handleDiscard = () => {
            return this.setState({ editMode: false, unsavedData: null });
        };
        this.handleSaveLater = () => {
            return alert("Drafts cannot be saved in this mode. Discard or submit to keep changes");
        };
        this.handleEdit = () => {
            return this.setState({ editMode: true, unsavedData: null });
        };
        this.handleLocaleChange = (ev) => {
            return this.setState({ locale: ev.target.value });
        };
        this.handleSubmit = () => {
            // TODO no longer needed if response model becomes immutable
            const response = lodash_1.default.cloneDeep(this.props.response);
            const responseModel = this.createResponseModel(response);
            // Draft if done by enumerator
            if (responseModel.canRedraft()) {
                responseModel.redraft();
            }
            else {
                // Record edit
                responseModel.recordEdit();
            }
            // Update response
            response.data = this.state.unsavedData || response.data;
            // Submit if in draft mode
            if (["draft", "rejected"].includes(response.status)) {
                responseModel.submit();
            }
            // Stop editing
            this.setState({ editMode: false, unsavedData: null });
            return this.props.onUpdateResponse(response);
        };
        this.state = {
            editMode: false,
            unsavedData: null,
            locale: props.locale || ((_a = props.form.design.locales[0]) === null || _a === void 0 ? void 0 : _a.code) || "en"
        };
    }
    // Create a response model
    createResponseModel(response) {
        var _a, _b, _c;
        return new ResponseModel_1.default({
            response,
            form: this.props.form,
            user: (_a = this.props.login) === null || _a === void 0 ? void 0 : _a.user,
            username: (_b = this.props.login) === null || _b === void 0 ? void 0 : _b.username,
            groups: (_c = this.props.login) === null || _c === void 0 ? void 0 : _c.groups
        });
    }
    // Render locales
    renderLocales() {
        if (this.props.form.design.locales.length < 2) {
            return null;
        }
        return R("select", {
            className: "form-select form-select-sm",
            style: { width: "auto", float: "right", marginBottom: 5 },
            onChange: this.handleLocaleChange,
            value: this.state.locale
        }, lodash_1.default.map(this.props.form.design.locales, (l) => {
            return R("option", { value: l.code }, l.name);
        }));
    }
    renderOperations() {
        const responseModel = this.createResponseModel(this.props.response);
        return R("div", { className: "btn-group table-hover-controls" }, responseModel.canApprove()
            ? R("button", { key: "approve", className: "btn btn-success btn-sm approve-response", onClick: this.handleApprove }, "Approve")
            : undefined, responseModel.canReject()
            ? R("button", { key: "reject", className: "btn btn-warning btn-sm reject-response", onClick: this.handleReject }, "Reject")
            : undefined, responseModel.canSubmit() && this.props.response.status === "rejected"
            ? R("button", { key: "unreject", className: "btn btn-success btn-sm unreject-response", onClick: this.handleUnreject }, "Unreject")
            : undefined, responseModel.canDelete()
            ? R("button", { key: "delete", className: "btn btn-danger btn-sm delete-response", onClick: this.handleDelete }, "Delete")
            : undefined);
    }
    render() {
        var _a, _b, _c;
        let elem;
        const printUrl = this.props.login != null
            ? `${this.props.apiUrl}responses/${this.props.response._id}/print?client=${this.props.login.client}&locale=${this.state.locale}`
            : null;
        // If editing
        if (this.state.editMode) {
            elem = R(FormComponent_1.default, {
                formCtx: this.props.formCtx,
                schema: this.props.schema,
                design: this.props.form.design,
                locale: this.state.locale,
                data: this.state.unsavedData || this.props.response.data,
                onDataChange: this.handleDataChange,
                singlePageMode: true,
                disableConfidentialFields: !["draft", "rejected"].includes(this.props.response.status),
                deployment: this.props.response.deployment,
                onSubmit: this.handleSubmit,
                onSaveLater: this.handleSaveLater,
                onDiscard: this.handleDiscard
            });
        }
        else {
            // Determine if can edit
            const responseModel = new ResponseModel_1.default({
                response: this.props.response,
                form: this.props.form,
                user: (_a = this.props.login) === null || _a === void 0 ? void 0 : _a.user,
                username: (_b = this.props.login) === null || _b === void 0 ? void 0 : _b.username,
                groups: (_c = this.props.login) === null || _c === void 0 ? void 0 : _c.groups
            });
            const actions = R("div", { style: { width: "auto", float: "right", margin: 5 } }, this.renderOperations(), responseModel.canRedraft() || responseModel.canEdit()
                ? R("button", {
                    type: "button",
                    className: "btn btn-sm btn-secondary",
                    onClick: this.handleEdit,
                    style: { marginLeft: "10px" }
                }, R("span", { className: "fas fa-edit" }), "Edit Response")
                : undefined);
            elem = R("div", null, actions, R(ResponseDisplayComponent_1.default, {
                form: this.props.form,
                response: this.props.response,
                formCtx: this.props.formCtx,
                schema: this.props.schema,
                apiUrl: this.props.apiUrl,
                locale: this.state.locale,
                login: this.props.login,
                T: this.props.T
            }));
        }
        return R("div", null, this.renderLocales(), printUrl !== null
            ? R("div", { style: { float: "right" } }, R("a", { className: "btn btn-sm btn-link", target: "_blank", href: printUrl }, R(ui.Icon, { id: "fa-external-link" }), " Export as PDF"))
            : undefined, R("div", { style: { clear: "both" } }, elem));
    }
}
exports.default = ResponseViewEditComponent;
