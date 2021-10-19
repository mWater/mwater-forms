"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const jquery_1 = __importDefault(require("jquery"));
// This only works in browser. Load datetime picker
require("eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js");
require("eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css");
class DateTimePickerComponent extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.onChange = (event) => {
            var _a, _b;
            return (_b = (_a = this.props).onChange) === null || _b === void 0 ? void 0 : _b.call(_a, event.date);
        };
        this.handleInputFocus = () => {
            const node = this.datetimepicker;
            return jquery_1.default(node).data("DateTimePicker").show();
        };
    }
    componentDidMount() {
        return this.createNativeComponent(this.props);
    }
    componentWillUnmount() {
        return this.destroyNativeComponent();
    }
    destroyNativeComponent() {
        return jquery_1.default(this.datetimepicker).data("DateTimePicker").destroy();
    }
    createNativeComponent(props) {
        const pickerOptions = { showClear: props.showClear, useStrict: true, focusOnShow: false };
        if (props.format != null) {
            pickerOptions.format = props.format;
        }
        else if (props.timepicker) {
            pickerOptions.format = "YYYY-MM-DD HH-mm-ss";
        }
        else {
            pickerOptions.format = "YYYY-MM-DD";
        }
        if (props.defaultDate) {
            pickerOptions.defaultDate = props.defaultDate;
        }
        pickerOptions.showTodayButton = props.showTodayButton;
        const node = this.datetimepicker;
        const picker = jquery_1.default(node).datetimepicker(pickerOptions);
        jquery_1.default(node)
            .data("DateTimePicker")
            .date(props.date || null);
        return jquery_1.default(node).on("dp.change", this.onChange);
    }
    componentWillReceiveProps(nextProps) {
        // If format changed, recreate
        if (nextProps.format !== this.props.format) {
            this.destroyNativeComponent();
            lodash_1.default.defer(() => {
                return this.createNativeComponent(nextProps);
            });
            return;
        }
        // If unchanged
        if (nextProps.date === null && this.props.date === null) {
            return;
        }
        if (nextProps.date != null && this.props.date != null && nextProps.date.isSame(this.props.date)) {
            return;
        }
        const node = this.datetimepicker;
        jquery_1.default(node).off("dp.change", this.onChange);
        jquery_1.default(node)
            .data("DateTimePicker")
            .date(nextProps.date || null);
        return jquery_1.default(node).on("dp.change", this.onChange);
    }
    render() {
        // Override z-index due to bootstrap oddness
        const input = R("input", {
            type: "text",
            className: "form-control",
            placeholder: this.props.placeholder,
            onFocus: this.handleInputFocus,
            style: { zIndex: "inherit", minWidth: "12em" }
        });
        return R("div", {
            className: "input-group date",
            ref: (c) => {
                return (this.datetimepicker = c);
            }
        }, input, R("span", { className: "", onClick: this.handleCalendarClick }, R("span", { className: "fas fa-calendar-alt" })));
    }
}
exports.default = DateTimePickerComponent;
DateTimePickerComponent.defaultProps = { timepicker: false };
