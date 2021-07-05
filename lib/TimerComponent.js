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
const formUtils = __importStar(require("./formUtils"));
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
class TimerComponent extends react_1.default.Component {
    constructor(props) {
        super(props);
        // Starts a timer to update @elapsedTicks every 10 ms
        this.handleStartClick = () => {
            const startTime = now() - (this.state.elapsedTicks || 0); // for restarts we need to fudge the startTime
            const update = () => this.setState({ elapsedTicks: now() - startTime });
            return this.setState({ timerId: setInterval(update, 10) }); // create a timer and store its id\
        };
        // Stops the timer
        this.handleStopClick = () => {
            clearInterval(this.state.timerId); // stop the running timer
            return this.setState({ timerId: null });
        };
        // Stops timer and resets @elapsedTicks to 0
        this.handleResetClick = () => {
            clearInterval(this.state.timerId);
            return this.setState({ elapsedTicks: null, timerId: null });
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
    render() {
        const isRunning = this.state.timerId != null;
        let timeLeft = this.props.timer.duration - this.state.elapsedTicks;
        if (timeLeft < 0) {
            timeLeft = null; // To display -- : --
        }
        return R("div", { className: "timer" }, R("div", { className: "prompt" }, formUtils.localizeString(this.props.timer.text, this.context.locale)), this.props.timer.hint
            ? R("div", { className: "text-muted" }, formUtils.localizeString(this.props.timer.hint, this.context.locale))
            : undefined, R("h1", { style: { fontFamily: "monospace" } }, getDisplayValue(timeLeft)), R("div", { className: "btn-toolbar", role: "toolbar" }, R("div", { className: "btn-group", role: "group" }, R("button", { className: "btn btn-success", onClick: this.handleStartClick, disabled: isRunning }, this.context.T("Start")), R("button", { className: "btn btn-danger", onClick: this.handleStopClick, disabled: !isRunning }, this.context.T("Stop")), R("button", { className: "btn btn-default", onClick: this.handleResetClick, disabled: !this.state.elapsedTicks }, this.context.T("Reset")))));
    }
}
exports.default = TimerComponent;
TimerComponent.contextTypes = {
    T: prop_types_1.default.func.isRequired,
    locale: prop_types_1.default.string
};
