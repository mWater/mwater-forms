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
// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
let RandomAskedCalculator;
const formUtils = __importStar(require("./formUtils"));
const lodash_1 = __importDefault(require("lodash"));
// The RandomAskedCalculator sets the randomAsked property of visible answers, determining if the question will be visible.
// If question has randomAskProbability, it is visible unless randomAsked is set to false, which this class determines.
exports.default = RandomAskedCalculator = class RandomAskedCalculator {
    constructor(formDesign) {
        this.formDesign = formDesign;
    }
    calculateRandomAsked(data, visibilityStructure) {
        // NOTE: Always remember that data is immutable
        const newData = lodash_1.default.cloneDeep(data);
        // Index all items by _id
        const items = lodash_1.default.indexBy(formUtils.allItems(this.formDesign), "_id");
        // For each item in visibility structure
        for (let key in visibilityStructure) {
            // Do nothing with invisible
            var item;
            const visible = visibilityStructure[key];
            if (!visible) {
                continue;
            }
            const parts = key.split(".");
            // If simple key
            if (parts.length === 1) {
                item = items[parts[0]];
                if (!item) {
                    continue;
                }
                if (item.randomAskProbability != null) {
                    newData[item._id] = newData[item._id] || {};
                    if (newData[item._id].randomAsked == null) {
                        newData[item._id].randomAsked = this.generateRandomValue(item.randomAskProbability);
                    }
                }
            }
            else {
                // If not roster, skip
                if (!parts[1].match(/^\d+$/)) {
                    continue;
                }
                // Lookup question in roster
                item = items[parts[2]];
                if (!item) {
                    continue;
                }
                // Get roster index
                const entryIndex = parseInt(parts[1]);
                if (item.randomAskProbability != null) {
                    // Get enty data
                    const entryData = newData[parts[0]][entryIndex].data;
                    // Create structure
                    entryData[item._id] = entryData[item._id] || {};
                    // Set randomAsked
                    if (entryData[item._id].randomAsked == null) {
                        entryData[item._id].randomAsked = this.generateRandomValue(item.randomAskProbability);
                    }
                }
            }
        }
        return newData;
    }
    // Randomly determine asked
    generateRandomValue(probability) {
        return Math.random() < probability;
    }
};
