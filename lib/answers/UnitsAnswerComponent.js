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
const prop_types_1 = __importDefault(require("prop-types"));
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const formUtils = __importStar(require("../formUtils"));
const bootstrap_1 = __importDefault(require("react-library/lib/bootstrap"));
// Not tested
class UnitsAnswerComponent extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.handleKeyDown = (ev) => {
            if (this.props.onNextOrComments != null) {
                // When pressing ENTER or TAB
                if (ev.keyCode === 13 || ev.keyCode === 9) {
                    this.props.onNextOrComments(ev);
                    // It's important to prevent the default behavior when handling tabs (or else the tab is applied after the focus change)
                    return ev.preventDefault();
                }
            }
        };
        this.handleInternalNext = (ev) => {
            // When pressing ENTER or TAB
            if (ev.keyCode === 13 || ev.keyCode === 9) {
                if (this.props.prefix) {
                    this.quantity.focus();
                }
                else {
                    this.units.focus();
                }
                // It's important to prevent the default behavior when handling tabs (or else the tab is applied after the focus change)
                return ev.preventDefault();
            }
        };
        this.handleValueChange = (val) => {
            return this.changed(val, this.state.selectedUnits);
        };
        this.handleUnitChange = (val) => {
            return this.changed(this.state.quantity, val.target.value);
        };
        this.state = {
            quantity: this.getSelectedQuantity(props.answer),
            selectedUnits: this.getSelectedUnit(props.answer)
        };
    }
    componentWillReceiveProps(nextProps) {
        return this.setState({
            quantity: this.getSelectedQuantity(nextProps.answer),
            selectedUnits: this.getSelectedUnit(nextProps.answer)
        });
    }
    focus() {
        if (this.props.prefix) {
            return this.quantity.focus();
        }
        else {
            return this.units.focus();
        }
    }
    changed(quantity, unit) {
        unit = unit ? unit : this.props.defaultUnits;
        return this.props.onValueChange({ quantity, units: unit });
    }
    getSelectedUnit(answer) {
        if (answer.value != null) {
            return answer.value.units;
        }
        if (this.props.defaultUnits != null) {
            return this.props.defaultUnits;
        }
        return null;
    }
    getSelectedQuantity(answer) {
        var _a;
        if (((_a = answer.value) === null || _a === void 0 ? void 0 : _a.quantity) != null) {
            return answer.value.quantity;
        }
        return null;
    }
    createNumberInput() {
        return R("td", null, R(bootstrap_1.default.NumberInput, {
            ref: (c) => {
                return (this.quantity = c);
            },
            decimal: this.props.decimal,
            value: this.state.quantity != null ? this.state.quantity : undefined,
            onChange: this.handleValueChange,
            onTab: this.props.prefix ? this.props.onNextOrComments : this.handleInternalNext,
            onEnter: this.props.prefix ? this.props.onNextOrComments : this.handleInternalNext
        }));
    }
    render() {
        return R("table", null, R("tbody", null, R("tr", null, !this.props.prefix ? this.createNumberInput() : undefined, R("td", null, R("select", {
            id: "units",
            ref: (c) => {
                return (this.units = c);
            },
            className: "form-control",
            style: { width: "auto" },
            onChange: this.handleUnitChange,
            value: this.state.selectedUnits === null ? "" : this.state.selectedUnits
        }, !this.props.defaultUnits ? R("option", { value: "" }, "Select units") : undefined, this.props.units.map((unit) => R("option", { key: unit.id, value: unit.id }, formUtils.localizeString(unit.label, this.context.locale))))), this.props.prefix ? this.createNumberInput() : undefined)));
    }
}
exports.default = UnitsAnswerComponent;
UnitsAnswerComponent.contextTypes = { locale: prop_types_1.default.string };
