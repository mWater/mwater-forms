"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prop_types_1 = __importDefault(require("prop-types"));
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const TextExprsComponent_1 = __importDefault(require("./TextExprsComponent"));
class InstructionsComponent extends react_1.default.Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (this.context.locale !== nextContext.locale) {
            return true;
        }
        if (nextProps.instructions.textExprs != null && nextProps.instructions.textExprs.length > 0) {
            return true;
        }
        if (nextProps.instructions !== this.props.instructions) {
            return true;
        }
        return false;
    }
    render() {
        return R("div", { className: "card bg-light mb-3" }, R("div", { className: "card-body" }, R(TextExprsComponent_1.default, {
            localizedStr: this.props.instructions.text,
            exprs: this.props.instructions.textExprs,
            schema: this.props.schema,
            responseRow: this.props.responseRow,
            locale: this.context.locale,
            markdown: true
        })));
    }
}
exports.default = InstructionsComponent;
InstructionsComponent.contextTypes = { locale: prop_types_1.default.string };
