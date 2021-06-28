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
class LikertAnswerComponent extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.handleValueChange = (choice, item) => {
            let newValue;
            if (this.props.answer.value != null) {
                newValue = lodash_1.default.clone(this.props.answer.value);
            }
            else {
                newValue = {};
            }
            if (newValue[item.id] === choice.id) {
                delete newValue[item.id];
            }
            else {
                newValue[item.id] = choice.id;
            }
            return this.props.onAnswerChange(lodash_1.default.extend({}, this.props.answer, { value: newValue }));
        };
    }
    static initClass() {
        this.contextTypes = { locale: prop_types_1.default.string }; // Current locale (e.g. "en")
    }
    focus() {
        // Nothing to focus
        return null;
    }
    renderChoice(item, choice) {
        let value;
        const id = `${item.id}:${choice.id}`;
        if (this.props.answer.value != null) {
            value = this.props.answer.value[item.id];
        }
        else {
            value = null;
        }
        return R("td", { key: id }, 
        // id is used for testing
        R("div", {
            className: `touch-radio ${value === choice.id ? "checked" : ""}`,
            id,
            onClick: this.handleValueChange.bind(null, choice, item)
        }, formUtils.localizeString(choice.label, this.context.locale)));
    }
    // IN CASE WE DECIDE TO DISPLAY THE CHOICES AT THE TOP (INSTEAD OF REPEATING THEM)
    //renderChoiceLabel: (choice) ->
    //  R 'td', key: "label#{choice.id}",
    //    formUtils.localizeString(choice.label, @context.locale)
    renderItem(item) {
        return R("tr", null, R("td", null, R("b", null, formUtils.localizeString(item.label, this.context.locale)), item.hint
            ? R("div", null, R("span", { className: "", style: { color: "#888" } }, formUtils.localizeString(item.hint, this.context.locale)))
            : undefined), lodash_1.default.map(this.props.choices, (choice) => this.renderChoice(item, choice)));
    }
    render() {
        return R("table", { className: "", style: { width: "100%" } }, 
        // IN CASE WE DECIDE TO DISPLAY THE CHOICES AT THE TOP (INSTEAD OF REPEATING THEM)
        //R 'thead', null,
        //  R 'tr', null,
        //    R('td'),
        //    _.map @props.choices, (choice) =>
        //      @renderChoiceLabel(choice)
        R("tbody", null, lodash_1.default.map(this.props.items, (item) => this.renderItem(item))));
    }
}
exports.default = LikertAnswerComponent;
;
LikertAnswerComponent.initClass();
