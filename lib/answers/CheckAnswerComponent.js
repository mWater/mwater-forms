"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
// This one is very different from the other AnswerComponents since it's displayed before the title (passed has children)
// TODO: SurveyorPro: Fix checkbox title size
class CheckAnswerComponent extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.handleValueChange = () => {
            return this.props.onValueChange(!this.props.value);
        };
    }
    focus() {
        return this.checkbox.focus();
    }
    render() {
        return R("div", {
            className: `choice touch-checkbox ${this.props.value ? "checked" : ""}`,
            onClick: this.handleValueChange,
            ref: (c) => {
                return (this.checkbox = c);
            }
        }, this.props.children);
    }
}
exports.default = CheckAnswerComponent;
CheckAnswerComponent.defaultProps = { value: false };
