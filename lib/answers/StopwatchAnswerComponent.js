"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
function now() {
    return new Date().getTime();
}
function toSeconds(ticks) {
    if (ticks != null) {
        return ticks / 1000;
    }
    else {
        return null;
    }
}
function toTicks(seconds) {
    if (seconds != null) {
        return seconds * 1000;
    }
    else {
        return null;
    }
}
function integerDiv(dividend, divisor) {
    return [Math.floor(dividend / divisor), dividend % divisor];
}
function zeroPad(val, length) {
    val += "";
    const numPads = length - val.length;
    if (numPads > 0) {
        return new Array(numPads + 1).join("0") + val;
    }
    else {
        return val;
    }
}
function getDisplayValue(ticks) {
    if (ticks != null) {
        let seconds;
        let [minutes, remainder] = integerDiv(ticks, 60000);
        [seconds, remainder] = integerDiv(remainder, 1000);
        minutes = zeroPad(minutes, 2);
        seconds = zeroPad(seconds, 2);
        return minutes + ":" + seconds;
    }
    else {
        return "--:--";
    }
}
// Creates a stopwatch timer component on the form, can be start/stop/reset
class StopwatchAnswerComponent extends react_1.default.Component {
    constructor(props) {
        super(props);
        // Starts a timer to update @elapsedTicks every 10 ms
        this.handleStartClick = () => {
            const startTime = now() - (this.state.elapsedTicks || 0); // for restarts we need to fudge the startTime
            const update = () => this.setState({ elapsedTicks: now() - startTime });
            this.setState({ timerId: setInterval(update, 10) }); // create a timer and store its id\
            return this.props.onValueChange(null);
        };
        // Stops the timer and persists the value
        this.handleStopClick = () => {
            clearInterval(this.state.timerId); // stop the running timer
            this.setState({ timerId: null });
            return this.persistValue(this.state.elapsedTicks);
        };
        // Stops timer and resets @elapsedTicks to 0
        this.handleResetClick = () => {
            clearInterval(this.state.timerId);
            this.setState({ elapsedTicks: null, timerId: null });
            return this.props.onValueChange(null);
        };
        const ticks = toTicks(props.value);
        this.state = {
            elapsedTicks: ticks,
            timerId: null
        };
    }
    componentWillReceiveProps(nextProps) {
        if (this.state.timerId !== null) {
            // Don't update elapsedTicks if timer is active
            return this.setState({ elapsedTicks: toTicks(nextProps.value) });
        }
    }
    // Stores the value in seconds
    persistValue(ticks) {
        return this.props.onValueChange(toSeconds(ticks));
    }
    render() {
        const isRunning = this.state.timerId != null;
        return R("div", {}, R("h1", { style: { fontFamily: "monospace" } }, getDisplayValue(this.state.elapsedTicks)), R("div", { className: "btn-toolbar", role: "toolbar" }, R("div", { className: "btn-group", role: "group" }, R("button", { className: "btn btn-success", onClick: this.handleStartClick, disabled: isRunning }, this.props.T("Start")), R("button", { className: "btn btn-danger", onClick: this.handleStopClick, disabled: !isRunning }, this.props.T("Stop")), R("button", { className: "btn btn-default", onClick: this.handleResetClick, disabled: !this.state.elapsedTicks }, this.props.T("Reset")))));
    }
}
exports.default = StopwatchAnswerComponent;
