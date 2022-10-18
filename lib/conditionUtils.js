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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.summarizeCondition = exports.summarizeConditions = exports.validateCondition = exports.rhsChoices = exports.getRhsType = exports.applicableOps = exports.compileConditions = exports.compileCondition = void 0;
const lodash_1 = __importDefault(require("lodash"));
const formUtils = __importStar(require("./formUtils"));
// Helpful utilities when building conditions
const allOps = [
    { id: "present", text: "was answered" },
    { id: "!present", text: "was not answered" },
    { id: "contains", text: "contains text" },
    { id: "!contains", text: "does not contain text" },
    { id: "=", text: "is equal to" },
    { id: ">", text: "is greater than" },
    { id: "<", text: "is less than" },
    { id: "!=", text: "is not equal to" },
    { id: "is", text: "is" },
    { id: "isnt", text: "isn't" },
    { id: "includes", text: "includes" },
    { id: "!includes", text: "does not include" },
    { id: "isoneof", text: "is one of" },
    { id: "isntoneof", text: "isn't one of" },
    { id: "before", text: "is before" },
    { id: "after", text: "is after" },
    { id: "true", text: "is checked" },
    { id: "false", text: "is not checked" }
];
// This code has been copied from FromCompiler, only getValue and getAlternate have been changed
function compileCondition(cond) {
    const getValue = (data) => {
        const answer = data[cond.lhs.question] || {};
        return answer.value;
    };
    const getAlternate = (data) => {
        const answer = data[cond.lhs.question] || {};
        return answer.alternate;
    };
    switch (cond.op) {
        case "present":
            return (data) => {
                const value = getValue(data);
                const present = value != null && value !== "" && !(value instanceof Array && value.length === 0);
                if (!present) {
                    return false;
                    // If present, let's make sure that at least one field is set if it's an object
                }
                else {
                    if (value instanceof Object) {
                        for (let key in value) {
                            const v = value[key];
                            if (v != null) {
                                return true;
                            }
                        }
                        // Not present, since the object has no set fields
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            };
        case "!present":
            return (data) => {
                const value = getValue(data);
                const notPresent = value == null || value === "" || (value instanceof Array && value.length === 0);
                if (notPresent) {
                    return true;
                    // If present, let's make sure that at least one field is set if it's an object
                }
                else {
                    if (value instanceof Object) {
                        for (let key in value) {
                            const v = value[key];
                            if (v != null) {
                                return false;
                            }
                        }
                        // Not present, since the object has no set fields
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            };
        case "contains":
            return (data) => {
                return (getValue(data) || "").indexOf(cond.rhs.literal) !== -1;
            };
        case "!contains":
            return (data) => {
                return (getValue(data) || "").indexOf(cond.rhs.literal) === -1;
            };
        case "=":
            return (data) => {
                return getValue(data) === cond.rhs.literal;
            };
        case ">":
        case "after":
            return (data) => {
                return getValue(data) > cond.rhs.literal;
            };
        case "<":
        case "before":
            return (data) => {
                return getValue(data) < cond.rhs.literal;
            };
        case "!=":
            return (data) => {
                return getValue(data) !== cond.rhs.literal;
            };
        case "includes":
            return (data) => {
                return lodash_1.default.contains(getValue(data) || [], cond.rhs.literal) || cond.rhs.literal === getAlternate(data);
            };
        case "!includes":
            return (data) => {
                return !lodash_1.default.contains(getValue(data) || [], cond.rhs.literal) && cond.rhs.literal !== getAlternate(data);
            };
        case "is":
            return (data) => {
                return getValue(data) === cond.rhs.literal || getAlternate(data) === cond.rhs.literal;
            };
        case "isnt":
            return (data) => {
                return getValue(data) !== cond.rhs.literal && getAlternate(data) !== cond.rhs.literal;
            };
        case "isoneof":
            return (data) => {
                const value = getValue(data);
                if (lodash_1.default.isArray(value)) {
                    return lodash_1.default.intersection(cond.rhs.literal, value).length > 0 || lodash_1.default.contains(cond.rhs.literal, getAlternate(data));
                }
                else {
                    return lodash_1.default.contains(cond.rhs.literal, value) || lodash_1.default.contains(cond.rhs.literal, getAlternate(data));
                }
            };
        case "isntoneof":
            return (data) => {
                const value = getValue(data);
                if (lodash_1.default.isArray(value)) {
                    return (lodash_1.default.intersection(cond.rhs.literal, value).length === 0 && !lodash_1.default.contains(cond.rhs.literal, getAlternate(data)));
                }
                else {
                    return !lodash_1.default.contains(cond.rhs.literal, value) && !lodash_1.default.contains(cond.rhs.literal, getAlternate(data));
                }
            };
        case "true":
            return (data) => {
                return getValue(data) === true;
            };
        case "false":
            return (data) => {
                return getValue(data) !== true;
            };
        default:
            throw new Error("Unknown condition op " + cond.op);
    }
}
exports.compileCondition = compileCondition;
// This code has been copied from FromCompiler
function compileConditions(conds) {
    const compConds = lodash_1.default.map(conds, compileCondition);
    return (data) => {
        for (let compCond of compConds) {
            if (!compCond(data)) {
                return false;
            }
        }
        return true;
    };
}
exports.compileConditions = compileConditions;
// Maps op id to complete op info
function getOpDetails(op) {
    const opDetail = lodash_1.default.findWhere(allOps, { id: op });
    if (!opDetail) {
        throw new Error(`Unknown op ${op}`);
    }
    return opDetail;
}
// Gets list of applicable operators for a lhs question
// Return includes id and text for each one, suitable for a select2 control
function applicableOps(lhsQuestion) {
    let ops = (() => {
        switch (lhsQuestion._type) {
            case "TextQuestion":
            case "TextColumnQuestion":
                return ["present", "!present", "contains", "!contains"];
            case "NumberQuestion":
            case "NumberColumnQuestion":
            case "StopwatchQuestion":
                return ["present", "!present", "=", "!=", ">", "<"];
            case "DropdownQuestion":
            case "DropdownColumnQuestion":
                return ["present", "!present", "is", "isnt", "isoneof", "isntoneof"];
            case "RadioQuestion":
                return ["present", "!present", "is", "isnt", "isoneof", "isntoneof"];
            case "MulticheckQuestion":
                return ["present", "!present", "includes", "!includes", "isoneof", "isntoneof"];
            case "DateQuestion":
            case "DateColumnQuestion":
                return ["present", "!present", "before", "after"];
            case "CheckQuestion":
            case "CheckColumnQuestion":
                return ["true", "false"];
            // TODO: ???
            case "LikertQuestion":
                return [];
            case "MatrixQuestion":
                return [];
            default:
                return ["present", "!present"];
        }
    })();
    // Add is, etc if alternates present, since we can do "is N/A"
    if (lodash_1.default.keys(lhsQuestion.alternates).length > 0) {
        // is/isn't is not applicable to Multicheck
        if (lhsQuestion._type !== "MulticheckQuestion") {
            ops = lodash_1.default.union(ops, ["is", "isnt", "isoneof", "isntoneof"]);
        }
    }
    return lodash_1.default.map(ops, getOpDetails);
}
exports.applicableOps = applicableOps;
// Gets rhs type for a question and operator.
// Can be null (for unary), "text", "number", "choice", "choices", "date", "datetime"
function getRhsType(lhsQuestion, op) {
    switch (op) {
        case "present":
        case "!present":
        case "true":
        case "false":
            return null;
        case "contains":
        case "!contains":
            return "text";
        case "=":
        case "!=":
            return "number";
        case ">":
        case "<":
            return "number";
        case "is":
        case "isnt":
            return "choice";
        case "isoneof":
        case "isntoneof":
            return "choices";
        case "includes":
        case "!includes":
            return "choice";
        case "before":
        case "after":
            return "date";
        default:
            throw new Error("Unknown op");
    }
}
exports.getRhsType = getRhsType;
// In the case of choice, returns choices for rhs (returns base localization)
// Return includes id and text for each one, suitable for a select2 control
function rhsChoices(lhsQuestion, op) {
    // Doesn't apply to LikertQuestions/MatrixQuestions since simple conditions don't apply to them
    let choices;
    if (!["LikertQuestion", "MatrixQuestion"].includes(lhsQuestion._type)) {
        choices = lodash_1.default.map(lhsQuestion.choices, (choice) => ({
            id: choice.id,
            text: choice.label[choice.label._base || "en"]
        }));
    }
    else {
        choices = [];
    }
    // Add alternates
    if (lhsQuestion.alternates && lhsQuestion.alternates.dontknow) {
        choices.push({ id: "dontknow", text: "Don't Know" });
    }
    if (lhsQuestion.alternates && lhsQuestion.alternates.na) {
        choices.push({ id: "na", text: "Not Applicable" });
    }
    return choices;
}
exports.rhsChoices = rhsChoices;
// Checks if condition is valid. True for yes, false for no
function validateCondition(cond, formDesign) {
    // Check if lhs
    if (cond.lhs == null || !cond.lhs.question) {
        return false;
    }
    const lhsQuestion = formUtils.findItem(formDesign, cond.lhs.question);
    if (!lhsQuestion) {
        return false;
    }
    // Check op
    if (!cond.op) {
        return false;
    }
    if (!lodash_1.default.contains(lodash_1.default.pluck(applicableOps(lhsQuestion), "id"), cond.op)) {
        return false;
    }
    // Check rhs
    const rhsType = getRhsType(lhsQuestion, cond.op);
    if (rhsType) {
        if (!cond.rhs || cond.rhs.literal == null) {
            return false;
        }
        // Check type
        switch (rhsType) {
            case "number":
                if (!(typeof cond.rhs.literal === "number")) {
                    return false;
                }
                break;
            case "choice":
                if (!lodash_1.default.findWhere(lhsQuestion.choices, { id: cond.rhs.literal })) {
                    // Check alternates
                    if (lhsQuestion.alternates && lhsQuestion.alternates[cond.rhs.literal]) {
                        return true;
                    }
                    return false;
                }
                break;
            case "choices":
                return lodash_1.default.all(cond.rhs.literal, function (c) {
                    if (!lodash_1.default.findWhere(lhsQuestion.choices, { id: c })) {
                        // Check alternates
                        if (lhsQuestion.alternates && lhsQuestion.alternates[c]) {
                            return true;
                        }
                        return false;
                    }
                    return true;
                });
                break;
            default:
                if (!(typeof cond.rhs.literal === "string")) {
                    return false;
                }
        }
    }
    return true;
}
exports.validateCondition = validateCondition;
function summarizeConditions(conditions = [], formDesign, locale) {
    return lodash_1.default.map(conditions, (cond) => summarizeCondition(cond, formDesign, locale)).join(" and ");
}
exports.summarizeConditions = summarizeConditions;
function summarizeCondition(cond, formDesign, locale) {
    var _a, _b, _c;
    if (!((_a = cond.lhs) === null || _a === void 0 ? void 0 : _a.question)) {
        return "";
    }
    const lhsQuestion = formUtils.findItem(formDesign, cond.lhs.question);
    if (!lhsQuestion) {
        return "";
    }
    let str = formUtils.localizeString(lhsQuestion.text, locale);
    str += " " + ((_b = getOpDetails(cond.op)) === null || _b === void 0 ? void 0 : _b.text);
    const rhsType = getRhsType(lhsQuestion, cond.op);
    switch (rhsType) {
        case "text":
        case "number":
            str += ` ${cond.rhs.literal}`;
            break;
        case "choice":
            var choices = rhsChoices(lhsQuestion, cond.op);
            str += " " + ((_c = lodash_1.default.findWhere(choices, { id: cond.rhs.literal })) === null || _c === void 0 ? void 0 : _c.text);
            break;
        case "choices":
            choices = rhsChoices(lhsQuestion, cond.op);
            str += " ";
            str += lodash_1.default.map(cond.rhs.literal, (choice) => { var _a; return (_a = lodash_1.default.findWhere(choices, { id: choice })) === null || _a === void 0 ? void 0 : _a.text; }).join(", ");
            break;
        case "date":
            // case "datetime":
            // TODO prettier
            str += ` ${cond.rhs.literal}`;
            break;
    }
    return str;
}
exports.summarizeCondition = summarizeCondition;
