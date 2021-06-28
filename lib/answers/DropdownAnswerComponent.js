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
const lodash_1 = __importDefault(require("lodash"));
const prop_types_1 = __importDefault(require("prop-types"));
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const formUtils = __importStar(require("../formUtils"));
const conditionUtils = __importStar(require("../conditionUtils"));
class DropdownAnswerComponent extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.handleValueChange = (ev) => {
            if (ev.target.value != null && ev.target.value !== "") {
                return this.props.onAnswerChange({ value: ev.target.value, specify: null });
            }
            else {
                return this.props.onAnswerChange({ value: null, specify: null });
            }
        };
        this.handleSpecifyChange = (id, ev) => {
            const change = {};
            change[id] = ev.target.value;
            const specify = lodash_1.default.extend({}, this.props.answer.specify, change);
            return this.props.onAnswerChange({ value: this.props.answer.value, specify });
        };
    }
    static initClass() {
        this.contextTypes = { locale: prop_types_1.default.string }; // Current locale (e.g. "en")
    }
    focus() {
        var _a;
        return (_a = this.select) === null || _a === void 0 ? void 0 : _a.focus();
    }
    // Render specify input box
    renderSpecify() {
        let value;
        const choice = lodash_1.default.findWhere(this.props.choices, { id: this.props.answer.value });
        if (choice && choice.specify && this.props.answer.specify != null) {
            value = this.props.answer.specify[choice.id];
        }
        else {
            value = "";
        }
        if (choice && choice.specify) {
            return R("input", {
                className: "form-control specify-input",
                type: "text",
                value,
                onChange: this.handleSpecifyChange.bind(null, choice.id)
            });
        }
    }
    areConditionsValid(choice) {
        if (choice.conditions == null) {
            return true;
        }
        return conditionUtils.compileConditions(choice.conditions)(this.props.data);
    }
    render() {
        return R("div", null, R("select", {
            className: "form-control",
            style: { width: "auto" },
            value: this.props.answer.value,
            onChange: this.handleValueChange,
            ref: (c) => {
                return (this.select = c);
            }
        }, R("option", { key: "__none__", value: "" }), lodash_1.default.map(this.props.choices, (choice) => {
            if (this.areConditionsValid(choice)) {
                let text = formUtils.localizeString(choice.label, this.context.locale);
                if (choice.hint) {
                    text += " (" + formUtils.localizeString(choice.hint, this.context.locale) + ")";
                }
                return R("option", { key: choice.id, value: choice.id }, text);
            }
        })), this.renderSpecify());
    }
}
exports.default = DropdownAnswerComponent;
;
DropdownAnswerComponent.initClass();
