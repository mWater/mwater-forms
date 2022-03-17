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
const prop_types_1 = __importDefault(require("prop-types"));
const lodash_1 = __importDefault(require("lodash"));
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const formUtils = __importStar(require("./formUtils"));
const NumberAnswerComponent_1 = __importDefault(require("./answers/NumberAnswerComponent"));
const DateAnswerComponent_1 = __importDefault(require("./answers/DateAnswerComponent"));
const UnitsAnswerComponent_1 = __importDefault(require("./answers/UnitsAnswerComponent"));
const SiteColumnAnswerComponent_1 = __importDefault(require("./answers/SiteColumnAnswerComponent"));
const TextExprsComponent_1 = __importDefault(require("./TextExprsComponent"));
// Cell of a matrix column
class MatrixColumnCellComponent extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.handleValueChange = (value) => {
            return this.props.onAnswerChange(lodash_1.default.extend({}, this.props.answer, { value }));
        };
        this.state = {
            choiceVisibility: {}
        };
        // Set all initially visible
        if (this.props.column._type == "DropdownColumnQuestion") {
            for (const choice of this.props.column.choices) {
                this.state.choiceVisibility[choice.id] = true;
            }
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
            if (this.props.column._type != "DropdownColumnQuestion") {
                return;
            }
            const choiceVisibility = {};
            for (const choice of this.props.column.choices) {
                choiceVisibility[choice.id] = yield formUtils.isChoiceVisible(choice, this.props.data, this.props.responseRow, this.props.schema);
            }
            this.setState({ choiceVisibility });
        });
    }
    render() {
        var _a;
        let className, elem;
        const { column } = this.props;
        const value = (_a = this.props.answer) === null || _a === void 0 ? void 0 : _a.value;
        // Create element
        switch (column._type) {
            case "Calculation":
                elem = R("label", { key: column._id }, R(TextExprsComponent_1.default, {
                    localizedStr: { _base: "en", en: "{0}" },
                    exprs: [column.expr || null],
                    format: column.format,
                    schema: this.props.schema,
                    responseRow: this.props.responseRow,
                    locale: this.context.locale
                }));
                break;
            case "TextColumn":
                elem = R("label", { key: column._id }, R(TextExprsComponent_1.default, {
                    localizedStr: column.cellText,
                    exprs: column.cellTextExprs,
                    schema: this.props.schema,
                    responseRow: this.props.responseRow,
                    locale: this.context.locale
                }));
                break;
            case "UnitsColumnQuestion":
                var answer = value ? value[column._id] : null;
                elem = R(UnitsAnswerComponent_1.default, {
                    small: true,
                    decimal: column.decimal,
                    prefix: column.unitsPosition === "prefix",
                    answer: this.props.answer || {},
                    units: column.units,
                    defaultUnits: column.defaultUnits,
                    onValueChange: this.handleValueChange
                });
                break;
            case "TextColumnQuestion":
                elem = R("input", {
                    type: "text",
                    className: "form-control form-control-sm",
                    value: value || "",
                    onChange: (ev) => this.handleValueChange(ev.target.value || null)
                });
                break;
            case "NumberColumnQuestion":
                elem = R(NumberAnswerComponent_1.default, {
                    small: true,
                    style: { maxWidth: "10em" },
                    decimal: column.decimal,
                    value,
                    onChange: this.handleValueChange
                });
                break;
            case "CheckColumnQuestion":
                elem = R("div", {
                    className: `touch-checkbox ${value ? "checked" : ""}`,
                    onClick: () => this.handleValueChange(!value),
                    style: { display: "inline-block" }
                }, "\u200B"); // ZWSP
                break;
            case "DropdownColumnQuestion":
                elem = R("select", {
                    className: "form-select form-select-sm",
                    style: { width: "auto" },
                    value,
                    onChange: (ev) => this.handleValueChange(ev.target.value ? ev.target.value : null)
                }, R("option", { key: "__none__", value: "" }), lodash_1.default.map(column.choices, (choice) => {
                    if (this.state.choiceVisibility[choice.id]) {
                        const text = formUtils.localizeString(choice.label, this.context.locale);
                        return R("option", { key: choice.id, value: choice.id }, text);
                    }
                    return null;
                }));
                break;
            case "SiteColumnQuestion":
                elem = R(SiteColumnAnswerComponent_1.default, {
                    value,
                    onValueChange: this.handleValueChange,
                    siteType: column.siteType
                });
                break;
            case "DateColumnQuestion":
                elem = R("div", { style: { maxWidth: "18em" } }, R(DateAnswerComponent_1.default, {
                    format: column.format,
                    placeholder: column.placeholder,
                    value,
                    onValueChange: this.handleValueChange
                }));
                break;
        }
        if (this.props.invalid) {
            className = "invalid";
        }
        return R("td", { className }, elem, this.props.invalid && !!this.props.invalidMessage
            ? R("small", { style: { color: "#C43B1D" } }, this.props.invalidMessage)
            : undefined);
    }
}
exports.default = MatrixColumnCellComponent;
MatrixColumnCellComponent.contextTypes = { locale: prop_types_1.default.string };
