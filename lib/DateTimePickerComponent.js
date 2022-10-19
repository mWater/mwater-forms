"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const moment_1 = __importDefault(require("moment"));
const tempus_dominus_1 = require("@eonasdan/tempus-dominus");
require("@eonasdan/tempus-dominus/dist/css/tempus-dominus.css");
class DateTimePickerComponent extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.inputRef = (elem) => {
            const format = this.getFormat();
            if (elem) {
                this.control = new tempus_dominus_1.TempusDominus(elem, {
                    display: {
                        buttons: {
                            clear: this.props.showClear,
                            today: this.props.showTodayButton,
                        },
                        components: {
                            date: format.includes("DD") || format.includes("ll") || format.includes("LL"),
                            month: format.includes("MM") || format.includes("ll") || format.includes("LL"),
                            year: true,
                            decades: true,
                            clock: format.includes("HH") || format.includes("lll") || format.includes("LLL"),
                            hours: format.includes("HH") || format.includes("lll") || format.includes("LLL"),
                            minutes: format.includes("mm") || format.includes("lll") || format.includes("LLL"),
                            seconds: format.includes("ss") || format.includes("lll") || format.includes("LLL"),
                            useTwentyfourHour: true
                        },
                        icons: {
                            time: "fas fa-clock",
                            date: "fas fa-calendar",
                            up: "fas fa-arrow-up",
                            down: "fas fa-arrow-down",
                            next: "fas fa-arrow-right",
                            previous: "fas fa-arrow-left",
                            today: "fas fa-calendar-check",
                            clear: "fas fa-trash",
                            close: "fas fa-times"
                        }
                    }
                });
                // Override to use moment format
                this.control.dates.formatInput = (date) => date ? (0, moment_1.default)(date).format(format) : "";
                this.control.dates.setFromInput = (value, index) => {
                    const parsedValue = (0, moment_1.default)(value, format);
                    if (parsedValue.isValid()) {
                        this.control.dates.setValue(new tempus_dominus_1.DateTime(parsedValue.toDate()), index);
                        this.control.hide();
                    }
                    else {
                        this.control.dates.clear();
                    }
                };
                if (this.props.date) {
                    this.control.dates.setFromInput(this.props.date.format(format), 0);
                }
                this.control.subscribe(tempus_dominus_1.Namespace.events.change, e => {
                    this.props.onChange(e.date ? (0, moment_1.default)(e.date) : null);
                });
            }
            else {
                if (this.control) {
                    this.control.dispose();
                }
            }
        };
    }
    getFormat() {
        if (!this.props.format) {
            return this.props.timepicker ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD";
        }
        return this.props.format;
    }
    componentDidUpdate(prevProps) {
        if (!prevProps.date && !this.props.date) {
            return;
        }
        // If changed
        const current = this.control.dates.lastPicked ? (0, moment_1.default)(this.control.dates.lastPicked) : null;
        if (current && !this.props.date ||
            !current && this.props.date ||
            (current && this.props.date && !current.isSame(this.props.date))) {
            // If different than current
            if (this.props.date) {
                this.control.dates.setValue(tempus_dominus_1.DateTime.convert(this.props.date.toDate()));
            }
            else {
                this.control.clear();
            }
        }
    }
    render() {
        const defaultValue = this.props.date ? (0, moment_1.default)(this.props.date).format(this.getFormat()) : "";
        return (react_1.default.createElement("div", { className: "input-group", ref: this.inputRef },
            react_1.default.createElement("input", { type: "text", className: "form-control", placeholder: this.props.placeholder, defaultValue: defaultValue, ref: c => { this.textRef = c; }, onChange: ev => { }, onKeyDown: this.props.onKeyDown }),
            react_1.default.createElement("span", { className: "input-group-text" },
                react_1.default.createElement("i", { className: "fas fa-calendar" }))));
    }
}
exports.default = DateTimePickerComponent;
DateTimePickerComponent.defaultProps = { timepicker: false };
