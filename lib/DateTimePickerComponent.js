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
const react_1 = __importStar(require("react"));
const react_datepicker_1 = __importDefault(require("react-datepicker"));
const react_dom_1 = __importDefault(require("react-dom"));
require("react-datepicker/dist/react-datepicker.css");
require("./DateTimePickerComponent.css");
const CustomInput = react_1.forwardRef((props, ref) => {
    return react_1.default.createElement("div", { className: "input-group" },
        react_1.default.createElement("input", { type: "text", className: "form-control", placeholder: props.placeholder, onClick: props.onClick, ref: ref, value: props.value }),
        react_1.default.createElement("span", { className: "input-group-text", onClick: props.onClick },
            react_1.default.createElement("i", { className: "fas fa-calendar-alt" })));
});
class DateTimePickerComponent extends react_1.default.Component {
    render() {
        return (react_1.default.createElement("div", { className: "datetimepickercomponent" },
            react_1.default.createElement(react_datepicker_1.default, { isClearable: this.props.showClear, selected: this.props.date, onChange: this.props.onChange, showTimeSelect: (this.props.format && (this.props.format.includes("ss") || this.props.format == "lll" || this.props.format == "LLL")) || this.props.timepicker, dateFormat: this.props.format, placeholderText: this.props.placeholder, popperContainer: createPopperContainer, showMonthDropdown: true, showYearDropdown: true, dropdownMode: "select", customInput: react_1.default.createElement(CustomInput, null), todayButton: react_1.default.createElement("span", null,
                    react_1.default.createElement("i", { className: "fas fa-arrow-right", style: { marginRight: 3 } }),
                    react_1.default.createElement("i", { className: "fas fa-clock" })) })));
    }
}
exports.default = DateTimePickerComponent;
DateTimePickerComponent.defaultProps = { timepicker: false };
// https://github.com/Hacker0x01/react-datepicker/issues/1366
function createPopperContainer(props) {
    return react_dom_1.default.createPortal(react_1.default.createElement("div", { style: { zIndex: 10000 } }, props.children), document.body);
}
