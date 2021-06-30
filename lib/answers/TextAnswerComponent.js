"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
class TextAnswerComponent extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.handleKeyDown = (ev) => {
            if (this.props.onNextOrComments != null) {
                // When pressing ENTER or TAB
                if (ev.keyCode === 13 || ev.keyCode === 9) {
                    this.props.onNextOrComments(ev);
                    // It's important to prevent the default behavior when handling tabs (or else the tab is applied after the focus change)
                    return ev.preventDefault();
                }
            }
        };
        this.handleBlur = (ev) => {
            return this.props.onValueChange(ev.target.value ? ev.target.value : null);
        };
        this.state = { text: props.value };
    }
    componentWillReceiveProps(nextProps) {
        // If different, override text
        if (nextProps.value !== this.props.value) {
            return this.setState({ text: nextProps.value != null ? nextProps.value : "" });
        }
    }
    focus() {
        return this.input.focus();
    }
    render() {
        if (this.props.format === "multiline") {
            return R("textarea", {
                className: "form-control",
                id: "input",
                ref: (c) => {
                    return (this.input = c);
                },
                value: this.state.text || "",
                rows: "5",
                readOnly: this.props.readOnly,
                onBlur: this.handleBlur,
                onChange: (ev) => this.setState({ text: ev.target.value })
            });
        }
        else {
            return R("input", {
                className: "form-control",
                id: "input",
                ref: (c) => {
                    return (this.input = c);
                },
                type: "text",
                value: this.state.text || "",
                readOnly: this.props.readOnly,
                onKeyDown: this.handleKeyDown,
                onBlur: this.handleBlur,
                onChange: (ev) => this.setState({ text: ev.target.value })
            });
        }
    }
}
exports.default = TextAnswerComponent;
TextAnswerComponent.defaultProps = { readOnly: false };
