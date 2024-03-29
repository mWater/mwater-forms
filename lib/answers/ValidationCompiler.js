"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
// Compiles validations
class ValidationCompiler {
    constructor(locale) {
        this.compileString = (str) => {
            // If no base or null, return null
            if (str == null || !str._base) {
                return null;
            }
            // Return for locale if present
            if (str[this.locale || "en"]) {
                return str[this.locale || "en"];
            }
            // Return base if present
            return str[str._base] || "";
        };
        this.compileValidationMessage = (val) => {
            const str = this.compileString(val.message);
            if (str) {
                return str;
            }
            return true;
        };
        this.compileValidation = (val) => {
            switch (val.op) {
                case "lengthRange":
                    return (answer) => {
                        const value = answer != null && answer.value != null ? answer.value : "";
                        const len = value.length;
                        if (val.rhs.literal.min != null && len < val.rhs.literal.min) {
                            return this.compileValidationMessage(val);
                        }
                        if (val.rhs.literal.max != null && len > val.rhs.literal.max) {
                            return this.compileValidationMessage(val);
                        }
                        return null;
                    };
                case "regex":
                    return (answer) => {
                        const value = answer != null && answer.value != null ? answer.value : "";
                        if (value.match(val.rhs.literal)) {
                            return null;
                        }
                        return this.compileValidationMessage(val);
                    };
                case "range":
                    return (answer) => {
                        let value = answer != null ? answer.value : null;
                        if (value === null || value === undefined) {
                            return null;
                        }
                        // For units question, get quantity
                        if (value.quantity != null) {
                            value = value.quantity;
                        }
                        if (val.rhs.literal.min != null && value < val.rhs.literal.min) {
                            return this.compileValidationMessage(val);
                        }
                        if (val.rhs.literal.max != null && value > val.rhs.literal.max) {
                            return this.compileValidationMessage(val);
                        }
                        return null;
                    };
                default:
                    throw new Error("Unknown validation op " + val.op);
            }
        };
        this.compileValidations = (vals) => {
            const compVals = lodash_1.default.map(vals, this.compileValidation);
            return (answer) => {
                for (let compVal of compVals) {
                    const result = compVal(answer);
                    if (result) {
                        return result;
                    }
                }
                return null;
            };
        };
        this.locale = locale;
    }
}
exports.default = ValidationCompiler;
