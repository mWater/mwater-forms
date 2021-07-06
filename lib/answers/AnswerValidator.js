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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const siteCodes = __importStar(require("../siteCodes"));
const mwater_expressions_1 = require("mwater-expressions");
const ValidationCompiler_1 = __importDefault(require("./ValidationCompiler"));
const formUtils = __importStar(require("../formUtils"));
// AnswerValidator gets called when a form is submitted (or on next)
// Only the validate method is not internal
class AnswerValidator {
    constructor(schema, responseRow, locale) {
        this.schema = schema;
        this.responseRow = responseRow;
        this.locale = locale;
    }
    // It returns null if everything is fine
    // It makes sure required questions are properly answered
    // It checks answer type specific validations
    // It checks custom validations
    validate(question, answer) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // If it has an alternate value, it cannot be invalid
            if (answer.alternate) {
                return null;
            }
            if (question.disabled) {
                return null;
            }
            // Check required and answered
            if (question.required) {
                if (answer.value == null || answer.value === "") {
                    return true;
                }
                // Handle specify
                if (question.choices) {
                    // MulticheckQuestion
                    if (lodash_1.default.isArray(answer.value)) {
                        const specifyChoices = question.choices.filter((c) => c.specify).map((c) => c.id);
                        const selectedSpecifyChoicecs = lodash_1.default.intersection(specifyChoices, answer.value);
                        if (selectedSpecifyChoicecs.length > 0) {
                            for (let selectedChoice of selectedSpecifyChoicecs) {
                                if (!((_a = answer.specify) === null || _a === void 0 ? void 0 : _a[selectedChoice])) {
                                    return true;
                                }
                            }
                        }
                    }
                    else {
                        // RadioQuestion
                        const choiceOption = lodash_1.default.find(question.choices, { specify: true });
                        if (choiceOption && answer.value === choiceOption.id && !answer.specify) {
                            return true;
                        }
                    }
                }
                // Handling empty string for Units values
                if (answer.value != null && answer.value.quantity != null && answer.value.quantity === "") {
                    return true;
                }
                // A required LikertQuestion needs an answer for all items
                if (question._type === "LikertQuestion") {
                    for (let item of question.items) {
                        if (answer.value[item.id] == null) {
                            return true;
                        }
                    }
                }
                if (question._type === "AquagenxCBTQuestion") {
                    if (answer.value.cbt == null) {
                        return true;
                    }
                }
            }
            // Check internal validation
            const specificValidation = this.validateSpecificAnswerType(question, answer);
            if (specificValidation != null) {
                return specificValidation;
            }
            // Skip validation if value is not set
            if (answer.value == null || answer.value === "") {
                return null;
            }
            // Check custom validation
            if (question.validations != null) {
                const result = new ValidationCompiler_1.default(this.locale).compileValidations(question.validations)(answer);
                if (result) {
                    return result;
                }
            }
            if (question.advancedValidations != null && this.responseRow) {
                for (let { expr, message } of question.advancedValidations) {
                    if (expr) {
                        // Evaluate expression
                        const exprEvaluator = new mwater_expressions_1.PromiseExprEvaluator({ schema: this.schema });
                        const value = yield exprEvaluator.evaluate(expr, { row: this.responseRow });
                        if (value !== true) {
                            return formUtils.localizeString(message, this.locale) || true;
                        }
                    }
                }
            }
            return null;
        });
    }
    validateSpecificAnswerType(question, answer) {
        switch (question._type) {
            case "TextQuestion":
                return this.validateTextQuestion(question, answer);
            case "UnitsQuestion":
                return this.validateUnitsQuestion(question, answer);
            case "NumbersQuestion":
                return this.validateNumberQuestion(question, answer);
            case "SiteQuestion":
                return this.validateSiteQuestion(question, answer);
            case "LikertQuestion":
                return this.validateLikertQuestion(question, answer);
            case "MatrixQuestion":
                return this.validateMatrixQuestion(question, answer);
            default:
                return null;
        }
    }
    // Valid if null or empty
    // Valid if code is valid (checksum)
    validateSiteQuestion(question, answer) {
        var _a;
        if (!answer.value) {
            return null;
        }
        if (!((_a = answer.value) === null || _a === void 0 ? void 0 : _a.code)) {
            return true;
        }
        if (siteCodes.isValid(answer.value.code)) {
            return null;
        }
        else {
            return "Invalid code";
        }
    }
    // Valid if null or empty
    // Valid if not email or url format
    // Else a match is performed on the anser value
    validateTextQuestion(question, answer) {
        if (answer.value == null || answer.value === "") {
            return null;
        }
        if (question.format === "email") {
            if (answer.value.match(/[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
                return null;
            }
            else {
                return "Invalid format";
            }
        }
        else if (question.format === "url") {
            if (answer.value.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/)) {
                return null;
            }
            else {
                return "Invalid format";
            }
        }
        return null;
    }
    // Valid if null or empty
    // Valid if quantity is not set
    // Invalid if quantity is set but not units
    validateUnitsQuestion(question, answer) {
        if (answer.value == null || answer.value === "") {
            return null;
        }
        if (answer.value.quantity != null && answer.value.quantity !== "") {
            if (answer.value.units == null || answer.value.units === "") {
                return "units field is required when a quantity is set";
            }
        }
        return null;
    }
    // Valid if null or empty
    // Valid if quantity is not set
    // Invalid if quantity is set but not units
    validateLikertQuestion(question, answer) {
        if (answer.value == null || answer.value === "") {
            return null;
        }
        for (let item in answer.value) {
            const choiceId = answer.value[item];
            if (lodash_1.default.findWhere(question.choices, { id: choiceId }) == null) {
                return "Invalid choice";
            }
        }
        return null;
    }
    // Valid if null or empty
    validateNumberQuestion(question, answer) {
        if (answer.value == null || answer.value === "") {
            return null;
        }
        return null;
    }
    validateMatrixQuestion(question, answer) {
        var _a, _b;
        const validationErrors = {};
        // For each entry
        for (let rowIndex = 0; rowIndex < question.items.length; rowIndex++) {
            // For each column
            const item = question.items[rowIndex];
            for (let columnIndex = 0; columnIndex < question.columns.length; columnIndex++) {
                const column = question.columns[columnIndex];
                const key = `${item.id}_${column._id}`;
                const data = (_b = (_a = answer.value) === null || _a === void 0 ? void 0 : _a[item.id]) === null || _b === void 0 ? void 0 : _b[column._id];
                if (column.required && ((data === null || data === void 0 ? void 0 : data.value) == null || (data === null || data === void 0 ? void 0 : data.value) === "")) {
                    return true;
                }
                if (column.validations && column.validations.length > 0) {
                    const validationError = new ValidationCompiler_1.default(this.locale).compileValidations(column.validations)(data);
                    if (validationError) {
                        return validationError;
                    }
                }
            }
        }
        return null;
    }
}
exports.default = AnswerValidator;
