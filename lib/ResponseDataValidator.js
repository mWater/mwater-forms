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
const AnswerValidator_1 = __importDefault(require("./answers/AnswerValidator"));
const ValidationCompiler_1 = __importDefault(require("./answers/ValidationCompiler"));
const formUtils = __importStar(require("./formUtils"));
/** ResponseDataValidator checks whether the entire data is valid for a response */
class ResponseDataValidator {
    /** It returns null if everything is fine
     * It makes sure required questions are properly answered
     * It checks custom validations
     * It returns the id of the question that caused the error, the error and a message which is includes the error and question
     * e.g. { questionId: someid, error: true for required, message otherwise, message: complete message including question text }
     *     If the question causing the error is nested (like a Matrix), the questionId is separated by a .
     *     RosterMatrix   -> matrixId.index.columnId
     *     RosterGroup   -> rosterGroupId.index.questionId
     *     QuestionMatrix -> matrixId.itemId.columnId
     */
    validate(formDesign, visibilityStructure, data, schema, responseRow) {
        return this.validateParentItem(formDesign, visibilityStructure, data, schema, responseRow, "");
    }
    // Validates an parent row
    //   keyPrefix: the part before the row id in the visibility structure. For rosters
    validateParentItem(parentItem, visibilityStructure, data, schema, responseRow, keyPrefix) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            // Create validator
            const answerValidator = new AnswerValidator_1.default(schema, responseRow, "en");
            // For each item
            for (let item of parentItem.contents) {
                // If not visible, ignore
                var result;
                if (!visibilityStructure[`${keyPrefix}${item._id}`]) {
                    continue;
                }
                if (item._type === "Section" || item._type === "Group") {
                    result = yield this.validateParentItem(item, visibilityStructure, data, schema, responseRow, keyPrefix);
                    if (result != null) {
                        return result;
                    }
                }
                if (item._type == "RosterGroup" || item._type == "RosterMatrix") {
                    const answerId = item.rosterId || item._id;
                    const rosterData = (data[answerId] || []);
                    const rosterResponseRows = (yield responseRow.followJoin(`data:${answerId}`));
                    for (let index = 0; index < rosterData.length; index++) {
                        // Key prefix is itemid.indexinroster.
                        const entry = rosterData[index];
                        result = yield this.validateParentItem(item, visibilityStructure, entry.data, schema, rosterResponseRows[index], `${keyPrefix}${answerId}.${index}.`);
                        if (result != null) {
                            return {
                                questionId: `${item._id}.${index}.${result.questionId}`,
                                error: result.error,
                                message: formUtils.localizeString(item.name) + ` (${index + 1})` + result.message
                            };
                        }
                    }
                }
                if (formUtils.isQuestionOrMatrixColumnQuestion(item)) {
                    const answer = (data[item._id] || {});
                    if (item._type === "MatrixQuestion") {
                        for (let rowIndex = 0; rowIndex < item.items.length; rowIndex++) {
                            // For each column
                            const row = item.items[rowIndex];
                            for (let columnIndex = 0; columnIndex < item.columns.length; columnIndex++) {
                                const column = item.columns[columnIndex];
                                const key = `${row.id}.${column._id}`;
                                const completedId = item._id + "." + key;
                                const cellData = (_b = (_a = answer.value) === null || _a === void 0 ? void 0 : _a[row.id]) === null || _b === void 0 ? void 0 : _b[column._id];
                                if (formUtils.isQuestionOrMatrixColumnQuestion(column) && column.required && ((cellData === null || cellData === void 0 ? void 0 : cellData.value) == null || (cellData === null || cellData === void 0 ? void 0 : cellData.value) === "")) {
                                    return {
                                        questionId: completedId,
                                        error: true,
                                        message: formUtils.localizeString(item.text) +
                                            ` (${rowIndex + 1}) ` +
                                            formUtils.localizeString(column.text) +
                                            " is required"
                                    };
                                }
                                if (formUtils.isQuestionOrMatrixColumnQuestion(column) && column.validations && column.validations.length > 0) {
                                    const validationError = new ValidationCompiler_1.default("en").compileValidations(column.validations)(cellData);
                                    if (validationError) {
                                        return {
                                            questionId: completedId,
                                            error: validationError,
                                            message: formUtils.localizeString(item.text) +
                                                ` (${rowIndex + 1})` +
                                                formUtils.localizeString(column.text) +
                                                ` ${validationError}`
                                        };
                                    }
                                }
                            }
                        }
                    }
                    else {
                        const error = yield answerValidator.validate(item, answer);
                        if (error != null) {
                            return {
                                questionId: item._id,
                                error,
                                message: formUtils.localizeString(item.text) + " " + (error === true ? "is required" : error)
                            };
                        }
                    }
                }
            }
            return null;
        });
    }
}
exports.default = ResponseDataValidator;
