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
/** The DefaultValueApplier applies a value stored in the stickyStorage as a default answer to a question.
 * It uses the following logic:
 *    - The question needs to be newly visible
 *    - The question needs to have a default value
 *    - The data for that question needs to be undefined or null, alternate needs to be null or undefined
 */
class DefaultValueApplier {
    /** entity is entity to use */
    constructor(formDesign, stickyStorage, options = {}) {
        this.formDesign = formDesign;
        this.stickyStorage = stickyStorage;
        this.entity = options.entity;
        this.entityType = options.entityType;
        this.assetSystemId = options.assetSystemId;
        this.assetType = options.assetType;
        this.assetId = options.assetId;
    }
    setStickyData(data, previousVisibilityStructure, newVisibilityStructure) {
        // NOTE: Always remember that data is immutable
        const newData = lodash_1.default.cloneDeep(data);
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
                    // Get roster data
                    const rosterData = data[values[0]];
                    // Get roster entry
                    const rosterEntry = rosterData[parseInt(values[1])];
                    // Get data for roster entry
                    if (!rosterEntry) {
                        continue;
                    }
                    // Get data for specific question
                    dataEntry = rosterEntry.data[values[2]];
                }
                else if (values.length === 3) {
                    type = "matrix";
                    // Matrix sticky is not supported
                    continue;
                }
                else {
                    continue;
                }
                // If question not found
                if (question == null) {
                    continue;
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
    /** 2 different sources exist for default values.
     * This function returns the one with highest priority:
     * - entityType/entity
     * - sticky with a stored sticky value
     */
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
        // Fill in asset question
        if (question._type === "AssetQuestion"
            && this.assetSystemId != null &&
            this.assetId != null &&
            this.assetType != null) {
            if (question.assetSystemId === this.assetSystemId) {
                if (question.assetTypes == null || question.assetTypes.includes(this.assetType)) {
                    return this.assetId;
                }
            }
        }
        // If it's a sticky question or if it has a defaultValue
        // Tries to use a sticky value if possible, if not it tries to use the defaultValue field
        if (formUtils.isQuestion(question)) {
            if (question.sticky) {
                // Uses stickyStorage.get(questionId) to find any sticky value
                return this.stickyStorage.get(question._id);
            }
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
        return undefined;
    }
}
exports.default = DefaultValueApplier;
