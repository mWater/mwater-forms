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
exports.renderItem = void 0;
// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
const lodash_1 = __importDefault(require("lodash"));
const formUtils = __importStar(require("./formUtils"));
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const QuestionComponent_1 = __importDefault(require("./QuestionComponent"));
const InstructionsComponent_1 = __importDefault(require("./InstructionsComponent"));
const TimerComponent_1 = __importDefault(require("./TimerComponent"));
const GroupComponent_1 = __importDefault(require("./GroupComponent"));
const RosterGroupComponent_1 = __importDefault(require("./RosterGroupComponent"));
const RosterMatrixComponent_1 = __importDefault(require("./RosterMatrixComponent"));
/** Render an item, given its data, visibility function, etc. */
function renderItem(item, data, responseRow, schema, onDataChange, isVisible, onNext, ref) {
    const handleAnswerChange = (id, answer) => {
        const change = {};
        change[id] = answer;
        return onDataChange(lodash_1.default.extend({}, data, change));
    };
    if (formUtils.isQuestion(item)) {
        let component;
        return (component = R(QuestionComponent_1.default, {
            key: item._id,
            ref,
            question: item,
            onAnswerChange: handleAnswerChange.bind(null, item._id),
            data,
            responseRow,
            schema,
            onNext
        }));
    }
    else if (item._type === "Instructions") {
        return R(InstructionsComponent_1.default, {
            key: item._id,
            ref,
            instructions: item,
            data,
            responseRow,
            schema
        });
    }
    else if (item._type === "Timer") {
        return R(TimerComponent_1.default, {
            key: item._id,
            ref,
            timer: item
        });
    }
    else if (item._type === "Group") {
        return R(GroupComponent_1.default, {
            key: item._id,
            ref,
            group: item,
            data,
            onDataChange,
            responseRow,
            schema,
            isVisible,
            onNext
        });
    }
    else if (item._type === "RosterGroup") {
        return R(RosterGroupComponent_1.default, {
            key: item._id,
            ref,
            rosterGroup: item,
            data,
            onDataChange,
            responseRow,
            schema,
            isVisible
        });
    }
    else if (item._type === "RosterMatrix") {
        return R(RosterMatrixComponent_1.default, {
            key: item._id,
            ref,
            rosterMatrix: item,
            data,
            onDataChange,
            schema,
            responseRow,
            isVisible
        });
    }
    else if (item._type === "Section") {
        // Sections are not usually rendered like this, except when in single-page mode. In which case, render as a group
        return R(GroupComponent_1.default, {
            key: item._id,
            ref,
            group: item,
            data,
            onDataChange,
            responseRow,
            schema,
            isVisible,
            onNext
        });
    }
    else {
        throw new Error(`Unknown item of type ${item._type}`);
    }
}
exports.renderItem = renderItem;
