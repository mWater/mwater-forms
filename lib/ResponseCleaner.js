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
const lodash_1 = __importDefault(require("lodash"));
const formUtils = __importStar(require("./formUtils"));
const async_1 = __importDefault(require("async"));
/*
ResponseCleaner removes the data entry (answer) of invisible questions and defaults values

The process of cleaning data is an iterative one, as making a question invisible removes its answer, which in turn may make
other questions invisible or visible.

To further complicate it, when a question becomes visible, it may get a default value, which may in turn trigger other visibility changes

Therefore, it's an iterative process which is also asynchronous, as condition evaluation is asynchronous.

*/
class ResponseCleaner {
    constructor() {
        /**
         * Cleans data, calling back with { data: cleaned data, visibilityStructure: final visibility structure (since expensive to compute) }
         * The old visibility structure is needed as defaulting of values requires knowledge of how visibility has changed
         * The process of computing visibility, cleaning data and applying stickyData/defaultValue can trigger more changes
         * and should be repeated until the visibilityStructure is stable.
         * A simple case: Question A, B and C with B only visible if A is set and C only visible if B is set and B containing a defaultValue
         * Setting a value to A will make B visible and set to defaultValue, but C will remain invisible until the process is repeated
         * responseRowFactory: returns responseRow when called with data
         */
        this.cleanData = (design, visibilityCalculator, defaultValueApplier, randomAskedCalculator, data, responseRowFactory, oldVisibilityStructure, callback) => {
            let nbIterations = 0;
            let complete = false;
            let newData = data;
            let newVisibilityStructure = null;
            // This needs to be repeated until it stabilizes
            return async_1.default.whilst(() => !complete, (cb) => {
                // Compute visibility
                const responseRow = responseRowFactory(newData);
                visibilityCalculator.createVisibilityStructure(newData, responseRow, (error, visibilityStructure) => __awaiter(this, void 0, void 0, function* () {
                    if (error) {
                        return cb(error);
                    }
                    newVisibilityStructure = visibilityStructure;
                    // Clean data
                    newData = this.cleanDataBasedOnVisibility(newData, newVisibilityStructure);
                    newData = yield this.cleanDataBasedOnChoiceConditions(newData, newVisibilityStructure, design, responseRow, visibilityCalculator.schema);
                    newData = this.cleanDataCascadingLists(newData, newVisibilityStructure, design);
                    // Default values
                    if (defaultValueApplier) {
                        newData = defaultValueApplier.setStickyData(newData, oldVisibilityStructure, newVisibilityStructure);
                    }
                    // Set random asked
                    if (randomAskedCalculator) {
                        newData = randomAskedCalculator.calculateRandomAsked(newData, newVisibilityStructure);
                    }
                    // Increment iterations
                    nbIterations++;
                    // If the visibilityStructure is still the same twice, the process is now stable.
                    if (lodash_1.default.isEqual(newVisibilityStructure, oldVisibilityStructure)) {
                        complete = true;
                    }
                    if (nbIterations >= 10) {
                        return cb(new Error("Impossible to compute question visibility. The question conditions must be looping"));
                    }
                    // New is now old
                    oldVisibilityStructure = newVisibilityStructure;
                    return cb(null);
                }));
            }, (error) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, { data: newData, visibilityStructure: newVisibilityStructure });
            });
        };
    }
    // Remove data entries for all the invisible questions
    cleanDataBasedOnVisibility(data, visibilityStructure) {
        var _a, _b, _c, _d;
        const newData = lodash_1.default.cloneDeep(data);
        for (let key in visibilityStructure) {
            const visible = visibilityStructure[key];
            if (!visible) {
                var questionId;
                const values = key.split(".");
                // If the key doesn't contain any '.', simply remove the data entry unless has randomAsked
                if (values.length === 1) {
                    if (((_a = newData[key]) === null || _a === void 0 ? void 0 : _a.randomAsked) != null) {
                        newData[key] = { randomAsked: newData[key].randomAsked };
                    }
                    else {
                        delete newData[key];
                    }
                    // Check if value is an array, which indicates roster
                }
                else if (lodash_1.default.isArray(newData[values[0]])) {
                    // The id of the roster containing the data
                    const rosterGroupId = values[0];
                    // The index of the answer
                    const index = parseInt(values[1]);
                    // The id of the answered question
                    questionId = values[2];
                    // If a data entry exist for that roster and that answer index
                    if (newData[rosterGroupId] != null && newData[rosterGroupId][index] != null) {
                        // Delete the entry, but keep randomAsked
                        const answerToClean = newData[rosterGroupId][index].data;
                        if (answerToClean) {
                            if (((_b = answerToClean[questionId]) === null || _b === void 0 ? void 0 : _b.randomAsked) != null) {
                                answerToClean[questionId] = { randomAsked: answerToClean[questionId].randomAsked };
                            }
                            else {
                                delete answerToClean[questionId];
                            }
                        }
                    }
                }
                else {
                    // Must be a matrix
                    const matrixId = values[0];
                    const itemId = values[1];
                    questionId = values[2];
                    if (itemId && questionId && ((_d = (_c = newData[matrixId]) === null || _c === void 0 ? void 0 : _c[itemId]) === null || _d === void 0 ? void 0 : _d[questionId])) {
                        delete newData[matrixId][itemId][questionId];
                    }
                }
            }
        }
        return newData;
    }
    // Remove data entries for all the conditional choices that are false
    // 'DropdownQuestion', 'RadioQuestion' and 'DropdownColumnQuestion' can have choices that are only present if a condition
    // is filled. If the condition is no longer filled, the answer data needs to be removed
    cleanDataBasedOnChoiceConditions(data, visibilityStructure, design, responseRow, schema) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const newData = lodash_1.default.cloneDeep(data);
            for (let key in visibilityStructure) {
                const visible = visibilityStructure[key];
                if (visible) {
                    var conditionData, questionId;
                    let deleteAnswer;
                    let currentResponseRow = null;
                    const values = key.split(".");
                    let selectedChoice = null;
                    // FIRST: Setup what is needed for the cleaning the data (different for rosters)
                    // If the key doesn't contain any '.', simply remove the data entry
                    if (values.length === 1) {
                        questionId = key;
                        conditionData = newData;
                        selectedChoice = (_a = newData[questionId]) === null || _a === void 0 ? void 0 : _a.value;
                        // A simple delete
                        deleteAnswer = () => delete newData[questionId];
                        currentResponseRow = responseRow;
                    }
                    else if (lodash_1.default.isArray(newData[values[0]])) { // Check if value is an array, which indicates roster
                        // The id of the roster containing the data
                        var rosterGroupId = values[0];
                        // The index of the answer
                        var index = parseInt(values[1]);
                        // The id of the answered question
                        questionId = values[2];
                        if (newData[rosterGroupId] != null && newData[rosterGroupId][index] != null) {
                            // Delete the entry
                            conditionData = newData[rosterGroupId][index].data;
                            selectedChoice = (_b = conditionData === null || conditionData === void 0 ? void 0 : conditionData[questionId]) === null || _b === void 0 ? void 0 : _b.value;
                            deleteAnswer = function () {
                                // Need to find what needs to be cleaned first (with roster data)
                                const answerToClean = newData[rosterGroupId][index].data;
                                return delete answerToClean[questionId];
                            };
                            const rosterResponseRows = yield responseRow.followJoin(`data:${rosterGroupId}`);
                            currentResponseRow = rosterResponseRows[index];
                        }
                    }
                    else {
                        continue;
                    }
                    // SECOND: look for conditional choices and delete their answer if the conditions are false
                    if (selectedChoice != null && currentResponseRow != null) {
                        // Get the question
                        const question = formUtils.findItem(design, questionId);
                        // Of dropdown or radio type (types with conditional choices)
                        if (question._type === "DropdownQuestion" ||
                            question._type === "RadioQuestion" ||
                            question._type === "DropdownColumnQuestion") {
                            for (let choice of question.choices) {
                                // If it's the selected choice
                                if (choice.id === selectedChoice) {
                                    // Check if visible
                                    if (!(yield formUtils.isChoiceVisible(choice, conditionData, currentResponseRow, schema))) {
                                        deleteAnswer();
                                    }
                                }
                            }
                        }
                        // TODO handle multicheck and matrix dropdowns
                    }
                }
            }
            return newData;
        });
    }
    // Cascading lists might reference rows that don't exists,
    // or the c0, c1, etc. values might be out of date
    // or the id might be missing (if updated using ResponseDataExprValueUpdater)
    cleanDataCascadingLists(data, visibilityStructure, design) {
        var _a, _b;
        const newData = lodash_1.default.cloneDeep(data);
        for (var key in visibilityStructure) {
            const visible = visibilityStructure[key];
            if (visible) {
                var questionId, relevantData;
                const values = key.split(".");
                let answerValue = null;
                // FIRST: Setup what is needed for the cleaning the data (different for rosters)
                // Simple case
                if (values.length === 1) {
                    questionId = key;
                    relevantData = newData;
                    answerValue = (_a = newData[questionId]) === null || _a === void 0 ? void 0 : _a.value;
                    // A simple delete
                    // Check if value is an array, which indicates roster
                }
                else if (lodash_1.default.isArray(newData[values[0]])) {
                    // The id of the roster containing the data
                    const rosterGroupId = values[0];
                    // The index of the answer
                    const index = parseInt(values[1]);
                    // The id of the answered question
                    questionId = values[2];
                    if (newData[rosterGroupId] != null && newData[rosterGroupId][index] != null) {
                        // Delete the entry
                        relevantData = newData[rosterGroupId][index].data;
                        answerValue = (_b = relevantData === null || relevantData === void 0 ? void 0 : relevantData[questionId]) === null || _b === void 0 ? void 0 : _b.value;
                    }
                }
                else {
                    continue;
                }
                // SECOND: look for conditional choices and delete their answer if the conditions are false
                if (answerValue != null) {
                    // Get the question
                    const question = formUtils.findItem(design, questionId);
                    // If cascading list
                    if (question._type === "CascadingListQuestion") {
                        // If id, find row
                        if (answerValue.id) {
                            const row = lodash_1.default.find(question.rows, { id: answerValue.id });
                            if (!row) {
                                delete relevantData[question._id].value;
                            }
                            else {
                                // Update answer if wrong
                                if (!!lodash_1.default.isEqual(answerValue, row)) {
                                    relevantData[question._id].value = row;
                                }
                            }
                        }
                        else {
                            // Look up by column values as id is not present
                            var value;
                            let rows = question.rows.slice();
                            for (key in answerValue) {
                                value = answerValue[key];
                                rows = lodash_1.default.filter(rows, (r) => r[key] === value);
                            }
                            // Should be one row
                            if (rows.length === 1) {
                                relevantData[question._id].value = rows[0];
                            }
                            else {
                                delete relevantData[question._id].value;
                            }
                        }
                    }
                }
            }
        }
        return newData;
    }
}
exports.default = ResponseCleaner;
