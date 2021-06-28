"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const bootstrap_1 = __importDefault(require("react-library/lib/bootstrap"));
// Number input component that handles parsing and maintains state when number is invalid
class NumberAnswerComponent extends react_1.default.Component {
    focus() {
        var _a;
        return (_a = this.input) === null || _a === void 0 ? void 0 : _a.focus();
    }
    validate() {
        if (!this.input.isValid()) {
            return "Invalid number";
        }
        return null;
    }
    render() {
        return R(bootstrap_1.default.NumberInput, {
            ref: (c) => {
                return (this.input = c);
            },
            decimal: this.props.decimal,
            value: this.props.value,
            onChange: this.props.onChange,
            size: this.props.small ? "sm" : undefined,
            onTab: this.props.onNextOrComments,
            onEnter: this.props.onNextOrComments
        });
    }
}
exports.default = NumberAnswerComponent;
;
