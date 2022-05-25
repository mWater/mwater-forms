"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
class TextListAnswerComponent extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.handleChange = (index, ev) => {
            let newValue;
            if (this.props.value != null) {
                newValue = lodash_1.default.clone(this.props.value);
            }
            else {
                newValue = [];
            }
            newValue[index] = ev.target.value;
            return this.props.onValueChange(newValue);
        };
        this.handleNewLineChange = (ev) => {
            let newValue;
            if (this.props.value != null) {
                newValue = lodash_1.default.clone(this.props.value);
            }
            else {
                newValue = [];
            }
            newValue.push(ev.target.value);
            return this.props.onValueChange(newValue);
        };
        this.handleKeydown = (index, ev) => {
            let value;
            if (this.props.value != null) {
                value = lodash_1.default.clone(this.props.value);
            }
            else {
                value = [];
            }
            // When pressing ENTER or TAB
            if (ev.keyCode === 13 || ev.keyCode === 9) {
                // If the index is equal to the items length, it means that it's the last empty entry
                let nextInput;
                if (index >= value.length) {
                    if (this.props.onNextOrComments != null) {
                        this.props.onNextOrComments(ev);
                    }
                }
                // If it equals to one less, we focus the newLine input
                if (index === value.length - 1) {
                    nextInput = this.newLine;
                    nextInput.focus();
                    // If not, we focus the next input
                }
                else {
                    nextInput = this[`input${index + 1}`];
                    nextInput.focus();
                }
                // It's important to prevent the default behavior when handling tabs (or else the tab is applied after the focus change)
                return ev.preventDefault();
            }
        };
        this.handleRemoveClick = (index, ev) => {
            let newValue;
            if (this.props.value != null) {
                newValue = lodash_1.default.clone(this.props.value);
            }
            else {
                newValue = [];
            }
            newValue.splice(index, 1);
            return this.props.onValueChange(newValue);
        };
    }
    focus() {
        var _a;
        return (_a = this.newLine) === null || _a === void 0 ? void 0 : _a.focus();
    }
    render() {
        const value = this.props.value || [];
        return R("table", { style: { width: "100%" } }, R("tbody", null, value.map((textLine, index) => R("tr", { key: index }, R("td", null, R("b", null, `${index + 1}.\u00a0`)), R("td", null, R("div", { className: "input-group" }, R("input", {
            ref: (c) => {
                this[`input${index}`] = c;
            },
            type: "text",
            className: "form-control box",
            value: textLine,
            onChange: this.handleChange.bind(null, index),
            onKeyDown: this.handleKeydown.bind(null, index),
            autoFocus: index === value.length - 1,
            onFocus(ev) {
                // Necessary or else the cursor is set before the first character after a new line is created
                return ev.target.setSelectionRange(textLine.length, textLine.length);
            }
        }), R("button", {
            className: "btn btn-link remove",
            "data-index": index,
            type: "button",
            onClick: this.handleRemoveClick.bind(null, index)
        }, R("span", { className: "fas fa-times" })))))), R("tr", null, R("td", null), R("td", null, R("div", { className: "input-group" }, R("input", {
            type: "text",
            className: "form-control box",
            onChange: this.handleNewLineChange,
            value: "",
            ref: (c) => {
                this.newLine = c;
            },
            id: "newLine"
        }), R("span", { className: "", style: { paddingRight: "39px" } }))))));
    }
}
exports.default = TextListAnswerComponent;
