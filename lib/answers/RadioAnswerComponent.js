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
class RadioAnswerComponent extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.handleValueChange = (choice) => {
            if (choice.id === this.props.answer.value) {
                return this.props.onAnswerChange({ value: null, specify: null });
            }
            else {
                return this.props.onAnswerChange({ value: choice.id, specify: null });
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
    // Render general specify input box (without choice specified)
    renderGeneralSpecify() {
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
        return null;
    }
    renderVerticalChoice(choice) {
        if (this.state.choiceVisibility[choice.id]) {
            return R("div", { key: choice.id }, 
            // id is used for testing
            R("div", {
                className: `touch-radio ${this.props.answer.value === choice.id ? "checked" : ""}`,
                id: choice.id,
                onClick: this.handleValueChange.bind(null, choice)
            }, formUtils.localizeString(choice.label, this.context.locale), choice.hint
                ? R("span", { className: "radio-choice-hint" }, " " + formUtils.localizeString(choice.hint, this.context.locale))
                : undefined), choice.specify && this.props.answer.value === choice.id ? this.renderSpecify(choice) : undefined);
        }
        return null;
    }
    renderAsVertical() {
        return R("div", { className: "touch-radio-group" }, lodash_1.default.map(this.props.choices, (choice) => this.renderVerticalChoice(choice)));
    }
    // Render as toggle
    renderAsToggle() {
        return R("div", null, R("div", { className: "btn-group", key: "toggle" }, lodash_1.default.map(this.props.choices, (choice) => {
            if (this.state.choiceVisibility[choice.id]) {
                let text = formUtils.localizeString(choice.label, this.context.locale);
                if (choice.hint) {
                    text += " (" + formUtils.localizeString(choice.hint, this.context.locale) + ")";
                }
                return R("button", {
                    key: choice.id,
                    type: "button",
                    onClick: () => this.props.onAnswerChange({
                        value: choice.id === this.props.answer.value ? null : choice.id,
                        specify: null
                    }),
                    className: this.props.answer.value === choice.id ? "btn btn-primary active" : "btn btn-outline-primary"
                }, text);
            }
            return null;
        })), this.renderGeneralSpecify());
    }
    render() {
        if ((this.props.displayMode || "vertical") === "vertical") {
            return this.renderAsVertical();
        }
        else if (this.props.displayMode === "toggle") {
            return this.renderAsToggle();
        }
        return null;
    }
}
exports.default = RadioAnswerComponent;
RadioAnswerComponent.contextTypes = { locale: prop_types_1.default.string };
