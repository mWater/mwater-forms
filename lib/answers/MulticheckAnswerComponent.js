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
// Multiple checkboxes where more than one can be checked
class MulticheckAnswerComponent extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.handleValueChange = (choice) => {
            let specify;
            const ids = this.props.answer.value || [];
            if (ids.includes(choice.id)) {
                if (this.props.answer.specify != null) {
                    specify = lodash_1.default.clone(this.props.answer.specify);
                    if (specify[choice.id] != null) {
                        delete specify[choice.id];
                    }
                }
                else {
                    specify = null;
                }
                return this.props.onAnswerChange({ value: lodash_1.default.difference(ids, [choice.id]), specify });
            }
            else {
                return this.props.onAnswerChange({ value: lodash_1.default.union(ids, [choice.id]), specify: this.props.answer.specify });
            }
        };
        this.handleSpecifyChange = (id, ev) => {
            const change = {};
            change[id] = ev.target.value;
            const specify = lodash_1.default.extend({}, this.props.answer.specify, change);
            return this.props.onAnswerChange({ value: this.props.answer.value, specify });
        };
    }
    focus() {
        // Nothing to focus
        return null;
    }
    areConditionsValid(choice) {
        if (choice.conditions == null) {
            return true;
        }
        return conditionUtils.compileConditions(choice.conditions)(this.props.data);
    }
    // Render specify input box
    renderSpecify(choice) {
        let value;
        if (this.props.answer.specify != null) {
            value = this.props.answer.specify[choice.id];
        }
        else {
            value = "";
        }
        return R("input", {
            className: "form-control specify-input",
            type: "text",
            value,
            onChange: this.handleSpecifyChange.bind(null, choice.id)
        });
    }
    renderChoice(choice) {
        if (!this.areConditionsValid(choice)) {
            return null;
        }
        const selected = lodash_1.default.isArray(this.props.answer.value) && this.props.answer.value.includes(choice.id);
        return R("div", { key: choice.id }, 
        // id is used for testing
        R("div", {
            className: `choice touch-checkbox ${selected ? "checked" : ""}`,
            id: choice.id,
            onClick: this.handleValueChange.bind(null, choice)
        }, formUtils.localizeString(choice.label, this.context.locale), choice.hint
            ? R("span", { className: "checkbox-choice-hint" }, formUtils.localizeString(choice.hint, this.context.locale))
            : undefined), choice.specify && selected ? this.renderSpecify(choice) : undefined);
    }
    render() {
        return R("div", null, lodash_1.default.map(this.props.choices, (choice) => this.renderChoice(choice)));
    }
}
exports.default = MulticheckAnswerComponent;
MulticheckAnswerComponent.contextTypes = { locale: prop_types_1.default.string };
