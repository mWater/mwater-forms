"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_datepicker_1 = __importDefault(require("react-datepicker"));
const react_dom_1 = __importDefault(require("react-dom"));
require("react-datepicker/dist/react-datepicker.css");
class DateTimePickerComponent extends react_1.default.Component {
    render() {
        return (react_1.default.createElement(react_datepicker_1.default, { isClearable: this.props.showClear, selected: this.props.date, onChange: this.props.onChange, showTimeSelect: (this.props.format && (this.props.format.includes("ss") || this.props.format == "lll" || this.props.format == "LLL")) || this.props.timepicker, dateFormat: this.props.format, className: "form-control", popperContainer: createPopperContainer, showMonthDropdown: true, showYearDropdown: true }));
    }
}
exports.default = DateTimePickerComponent;
DateTimePickerComponent.defaultProps = { timepicker: false };
// https://github.com/Hacker0x01/react-datepicker/issues/1366
function createPopperContainer(props) {
    return react_dom_1.default.createPortal(react_1.default.createElement("div", { style: { zIndex: 10000 } }, props.children), document.body);
}
