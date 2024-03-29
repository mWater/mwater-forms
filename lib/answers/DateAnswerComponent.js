"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const moment_1 = __importDefault(require("moment"));
const DateTimePickerComponent_1 = __importDefault(require("../DateTimePickerComponent"));
class DateAnswerComponent extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.componentWillReceiveProps = (nextProps) => {
            return this.updateState(nextProps);
        };
        this.updateState = (props) => {
            let detailLevel;
            const { format } = props;
            let isoFormat = null;
            if (format.match(/ss|LLL|lll/)) {
                detailLevel = 5;
            }
            else if (format.match(/m/)) {
                detailLevel = 4;
            }
            else if (format.match(/h|H/)) {
                detailLevel = 3;
            }
            else if (format.match(/D|l|L/)) {
                detailLevel = 2;
                isoFormat = "YYYY-MM-DD";
            }
            else if (format.match(/M/)) {
                detailLevel = 1;
                isoFormat = "YYYY-MM";
            }
            else if (format.match(/Y/)) {
                detailLevel = 0;
                isoFormat = "YYYY";
            }
            else {
                throw new Error("Invalid format: " + format);
            }
            // Set placeholder if not set
            let placeholder = null;
            if (props.placeholder != null) {
                ;
                ({ placeholder } = props);
            }
            else {
                // Can't set for full dates
                if (!format.match(/l|L/)) {
                    placeholder = format.replace("HH", "hh");
                }
                else {
                    placeholder = "...";
                }
            }
            if (this.state) {
                this.setState({ detailLevel, isoFormat, placeholder });
            }
            else {
                // This is a weird lifecycle quirk of it being called on the constructor
                this.state = { detailLevel, isoFormat, placeholder };
            }
        };
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
        this.handleChange = (date) => {
            // Get date
            if (!date) {
                this.props.onValueChange(null);
                return;
            }
            // Get iso format (if date, use format to avoid timezone wrapping)
            if (this.state.isoFormat) {
                date = date.format(this.state.isoFormat);
            }
            else {
                date = date.toISOString();
            }
            // Trim to detail level
            switch (this.state.detailLevel) {
                case 0:
                    date = date.substring(0, 4);
                    break;
                case 1:
                    date = date.substring(0, 7);
                    break;
                case 2:
                    date = date.substring(0, 10);
                    break;
                case 3:
                    date = date.substring(0, 13) + "Z";
                    break;
                case 4:
                    date = date.substring(0, 16) + "Z";
                    break;
                case 5:
                    date = date.substring(0, 19) + "Z";
                    break;
                default:
                    throw new Error("Invalid detail level");
            }
            return this.props.onValueChange(date);
        };
        this.updateState(props);
    }
    focus() {
        const { datetimepicker } = this;
        if (datetimepicker && datetimepicker.focus != null) {
            datetimepicker.focus();
        }
    }
    render() {
        let value = null;
        if (this.props.value) {
            if (this.state.isoFormat) {
                value = (0, moment_1.default)(this.props.value, this.state.isoFormat);
            }
            else {
                value = (0, moment_1.default)(this.props.value, moment_1.default.ISO_8601);
            }
        }
        return R("div", { style: { maxWidth: "30em" } }, R(DateTimePickerComponent_1.default, {
            onChange: this.handleChange,
            date: value,
            format: this.props.format,
            placeholder: this.state.placeholder,
            showTodayButton: true,
            showClear: true,
            onKeyDown: this.handleKeyDown,
            ref: (c) => {
                this.datetimepicker = c;
            },
        }));
    }
}
exports.default = DateAnswerComponent;
DateAnswerComponent.defaultProps = { format: "YYYY-MM-DD" };
