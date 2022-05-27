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
const prop_types_1 = __importDefault(require("prop-types"));
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const formUtils = __importStar(require("./formUtils"));
const ItemListComponent_1 = __importDefault(require("./ItemListComponent"));
// A group is a list of questions/other items that can have a common condition and a header
class GroupComponent extends react_1.default.Component {
    validate(scrollToFirstInvalid = true) {
        return this.itemlist.validate(scrollToFirstInvalid);
    }
    render() {
        return R("div", { className: "card mb-3" }, R("div", { key: "header", className: "card-header" }, formUtils.localizeString(this.props.group.name, this.context.locale)), R("div", { key: "body", className: "card-body" }, R(ItemListComponent_1.default, {
            ref: (c) => {
                this.itemlist = c;
            },
            contents: this.props.group.contents,
            data: this.props.data,
            responseRow: this.props.responseRow,
            onDataChange: this.props.onDataChange,
            isVisible: this.props.isVisible,
            onNext: this.props.onNext,
            schema: this.props.schema
        })));
    }
}
exports.default = GroupComponent;
GroupComponent.contextTypes = { locale: prop_types_1.default.string };
