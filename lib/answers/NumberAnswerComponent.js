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
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const ui = __importStar(require("react-library/lib/bootstrap"));
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
        return R(ui.NumberInput, {
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
