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
const lodash_1 = __importDefault(require("lodash"));
const moment_1 = __importDefault(require("moment"));
const formUtils = __importStar(require("./formUtils"));
// The DefaultValueApplier applies a value stored in the stickyStorage as a default answer to a question.
// It uses the following logic:
//    - The question needs to be newly visible
//    - The question needs to have a default value
//    - The data for that question needs to be undefined or null, alternate needs to be null or undefined
class DefaultValueApplier {
    // entity is an object
    // entityType is a string
    constructor(formDesign, stickyStorage, entity, entityType) {
        this.formDesign = formDesign;
        this.stickyStorage = stickyStorage;
        this.entity = entity;
        this.entityType = entityType;
    }
    setStickyData(data, previousVisibilityStructure, newVisibilityStructure) {
        var _a, _b;
        // NOTE: Always remember that data is immutable
        const newData = lodash_1.default.cloneDeep(data);
        const questions = [];
        for (let key in newVisibilityStructure) {
            // If it wasn't visible and it now is
            const nowVisible = newVisibilityStructure[key];
            if (nowVisible && !previousVisibilityStructure[key]) {
                var dataEntry, question, type;
                const values = key.split(".");
                // Simple question
                if (values.length === 1) {
                    type = "simple";
                    question = formUtils.findItem(this.formDesign, values[0]);
                    dataEntry = data[values[0]];
                }
                else if (values.length === 3 && values[1].match(/^\d+$/)) {
                    // Roster
                    type = "roster";
                    question = formUtils.findItem(this.formDesign, values[2]);
                    // Get roster
                    dataEntry = data[values[0]];
                    // Get data for roster entry
                    dataEntry = dataEntry[parseInt(values[1])];
                    if (!dataEntry) {
                        continue;
                    }
                    // Get data for specific question
                    dataEntry = data[values[2]];
                }
                else if (values.length === 3) {
                    type = "matrix";
                    // Matrix question, so question is column
                    question = formUtils.findItem(this.formDesign, values[0]);
                    if (!question) {
                        continue;
                    }
                    question = lodash_1.default.findWhere(question.columns, { _id: values[2] });
                    dataEntry = (_b = (_a = data[values[0]]) === null || _a === void 0 ? void 0 : _a[values[1]]) === null || _b === void 0 ? void 0 : _b[values[2]];
                }
                else {
                    continue;
                }
                // If question not found
                if (question == null) {
                    return null;
                }
                // The data for that question needs to be undefined or null
                // Alternate for that question needs to be undefined or null
                if (dataEntry == null || (dataEntry.value == null && dataEntry.alternate == null)) {
                    const defaultValue = this.getHighestPriorityDefaultValue(question);
                    // Makes sure that a defaultValue has been found
                    if (defaultValue != null && defaultValue !== "") {
                        // Create the dataEntry if not present
                        if (dataEntry == null) {
                            if (type === "simple") {
                                newData[values[0]] = dataEntry = {};
                            }
                            else if (type === "roster") {
                                newData[values[0]][parseInt(values[1])].data[values[2]] = dataEntry = {};
                            }
                            else if (type === "matrix") {
                                // Ensure that question exists
                                newData[values[0]] = newData[values[0]] || {};
                                newData[values[0]][values[1]] = newData[values[0]][values[1]] || {};
                                newData[values[0]][values[1]][values[2]] = dataEntry = {};
                            }
                        }
                        dataEntry.value = defaultValue;
                    }
                }
            }
        }
        return newData;
    }
    // 3 different sources exist for default values.
    // This function returns the one with highest priority:
    // - entityType/entity
    // - sticky with a stored sticky value
    // - defaultValue
    getHighestPriorityDefaultValue(question) {
        if (this.entityType != null &&
            this.entity != null &&
            (question._type === "SiteQuestion" || question._type === "EntityQuestion")) {
            let entityType;
            if (question._type === "SiteQuestion") {
                const siteType = (question.siteTypes ? question.siteTypes[0] : undefined) || "water_point";
                entityType = siteType.toLowerCase().replace(new RegExp(" ", "g"), "_");
            }
            else {
                ;
                ({ entityType } = question);
            }
            if (entityType === this.entityType) {
                if (question._type === "SiteQuestion") {
                    return { code: this.entity.code };
                }
                else {
                    return this.entity._id;
                }
            }
        }
        // If it's a sticky question or if it has a defaultValue
        // Tries to use a sticky value if possible, if not it tries to use the defaultValue field
        if (question.sticky) {
            // Uses stickyStorage.get(questionId) to find any sticky value
            return this.stickyStorage.get(question._id);
        }
        // Handle defaultNow
        if ((question._type === "DateQuestion" || question._type === "DateColumnQuestion") && question.defaultNow) {
            // If datetime
            if (question.format.match(/ss|LLL|lll|m|h|H/)) {
                return new Date().toISOString();
            }
            else {
                return (0, moment_1.default)().format("YYYY-MM-DD");
            }
        }
        return question.defaultValue;
    }
}
exports.default = DefaultValueApplier;
