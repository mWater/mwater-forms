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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
// Multiple checkboxes where more than one can be checked
class MulticheckAnswerComponent extends react_1.default.Component {
    constructor(props) {
        super(props);
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
        this.state = {
            choiceVisibility: {}
        };
        // Set all initially visible
        for (const choice of this.props.choices) {
            this.state.choiceVisibility[choice.id] = true;
        }
    }
    componentDidMount() {
        this.calculateChoiceVisibility();
    }
    componentDidUpdate(prevProps) {
        // If visibility potentially changed, recalculate
        if (prevProps.data != this.props.data) {
            this.calculateChoiceVisibility();
        }
    }
    calculateChoiceVisibility() {
        return __awaiter(this, void 0, void 0, function* () {
            const choiceVisibility = {};
            for (const choice of this.props.choices) {
                choiceVisibility[choice.id] = yield formUtils.isChoiceVisible(choice, this.props.data, this.props.responseRow, this.props.schema);
            }
            this.setState({ choiceVisibility });
        });
    }
    focus() {
        // Nothing to focus
        return null;
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
        if (!this.state.choiceVisibility[choice.id]) {
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
