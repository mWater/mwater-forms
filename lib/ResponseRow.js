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
const VisibilityCalculator_1 = __importDefault(require("./VisibilityCalculator"));
const EntityRow_1 = __importDefault(require("./EntityRow"));
const CustomRow_1 = require("./CustomRow");
const AssetRow_1 = require("./AssetRow");
/*
  Implements the type of row object required by mwater-expressions' PromiseExprEvaluator. Allows expressions to be evaluated
  on responses
*/
class ResponseRow {
    // Create a response row from a response data object.
    // Options:
    //  responseData: data of entire response
    //  formDesign: design of the form
    //  schema: schema to use
    //  rosterId: id of roster if it is a roster row
    //  rosterEntryIndex: index of roster row
    //  getEntityById(entityType, entityId, callback): looks up entity. Any callbacks after first one will be ignored.
    //    callback: called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found
    //  getEntityByCode(entityType, entityCode, callback): looks up an entity. Any callbacks after first one will be ignored.
    //    callback: called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found
    constructor(options) {
        this.formDesign = options.formDesign;
        this.schema = options.schema;
        this.responseData = options.responseData;
        this.rosterId = options.rosterId;
        this.rosterEntryIndex = options.rosterEntryIndex;
        this.getEntityById = options.getEntityById;
        this.getEntityByCode = options.getEntityByCode;
        this.getCustomTableRow = options.getCustomTableRow;
        this.getAssetById = options.getAssetById;
        this.deployment = options.deployment;
        this.submittedOn = options.submittedOn;
        this.code = options.code;
    }
    // Gets the response row for a roster entry
    getRosterResponseRow(rosterId, rosterEntryIndex) {
        return new ResponseRow({
            formDesign: this.formDesign,
            schema: this.schema,
            responseData: this.responseData,
            getEntityById: this.getEntityById,
            getEntityByCode: this.getEntityByCode,
            getCustomTableRow: this.getCustomTableRow,
            getAssetById: this.getAssetById,
            deployment: this.deployment,
            rosterId: rosterId,
            rosterEntryIndex: rosterEntryIndex
        });
    }
    // Gets primary key of row
    getPrimaryKey() {
        // Not available if not roster
        if (!this.rosterId) {
            return null;
        }
        // Get roster id
        return this.responseData[this.rosterId][this.rosterEntryIndex];
    }
    // Gets the value of a column
    getField(columnId) {
        return __awaiter(this, void 0, void 0, function* () {
            var siteType, value;
            let data = this.responseData;
            // Go into roster
            if (this.rosterId) {
                data = this.responseData[this.rosterId][this.rosterEntryIndex].data;
            }
            if (columnId === "deployment") {
                return this.deployment;
            }
            if (columnId == "submittedOn") {
                return this.submittedOn;
            }
            if (columnId == "code") {
                return this.code;
            }
            // Handle "response" of roster
            if (columnId === "response" && this.rosterId) {
                // Primary key not available
                return null;
            }
            // Handle "index" of roster
            if (columnId === "index" && this.rosterId) {
                return this.rosterEntryIndex;
            }
            // Handle data
            if (columnId.match(/^data:/)) {
                const parts = columnId.split(":");
                // Roster
                if (parts.length === 2) {
                    if (lodash_1.default.isArray(this.responseData[parts[1]])) {
                        // Extract _id s
                        return lodash_1.default.map(this.responseData[parts[1]], (entry, index) => entry._id);
                    }
                }
                // Visible
                if (parts.length === 3 && parts[2] === "visible") {
                    const visibilityCalculator = new VisibilityCalculator_1.default(this.formDesign, this.schema);
                    const visibilityStructure = yield new Promise((resolve, reject) => {
                        visibilityCalculator.createVisibilityStructure(this.responseData, this, (error, visibilityStructure) => {
                            if (error) {
                                reject(error);
                            }
                            else {
                                resolve(visibilityStructure);
                            }
                        });
                    });
                    return visibilityStructure[parts[1]];
                }
                // Simple values
                if (parts.length === 3 && parts[2] === "value") {
                    let value = data[parts[1]] ? data[parts[1]].value : null;
                    // Null "" and []
                    if (value === "" || (lodash_1.default.isArray(value) && value.length === 0)) {
                        value = null;
                    }
                    if (value == null) {
                        return null;
                    }
                    // Get type of answer
                    const question = formUtils.findItem(this.formDesign, parts[1]);
                    if (!question) {
                        return null;
                    }
                    const answerType = formUtils.getAnswerType(question);
                    // Pad to YYYY-MM-DD
                    if (answerType === "date") {
                        if (value.length === 4) {
                            value = value + "-01-01";
                        }
                        if (value.length === 7) {
                            value = value + "-01";
                        }
                        // If date only, truncate
                        if (!question.format.match(/ss|LLL|lll|m|h|H/)) {
                            value = value.substr(0, 10);
                        }
                    }
                    if (answerType === "site") {
                        // Create site entity row
                        siteType =
                            (question.siteTypes ? question.siteTypes[0] : null) || "water_point";
                        const entityType = siteType.toLowerCase().replace(new RegExp(" ", "g"), "_");
                        const code = value.code;
                        if (code) {
                            const entity = yield new Promise((resolve) => {
                                this.getEntityByCode(entityType, code, lodash_1.default.once((entity) => {
                                    if (entity) {
                                        return resolve(entity);
                                    }
                                    else {
                                        console.log(`Warning: Site ${code} not found in ResponseRow`);
                                        return resolve(null);
                                    }
                                }));
                            });
                            if (entity) {
                                return entity._id;
                            }
                        }
                        return null;
                    }
                    if (answerType === "entity") {
                        return value;
                    }
                    if (answerType == "cascading_ref") {
                        return value;
                    }
                    // Location
                    if (value && value.latitude != null) {
                        return {
                            type: "Point",
                            coordinates: [value.longitude, value.latitude]
                        };
                    }
                    return nullify(value);
                }
                // Value can also recurse for handing matrix, item_choices, altitude, accuracy and CBT
                if (parts[2] === "value") {
                    value = data[parts[1]] ? data[parts[1]].value : null;
                    for (const part of lodash_1.default.drop(parts, 3)) {
                        value = value != null ? value[part] : null;
                    }
                    return nullify(value);
                }
                // Specify
                if (parts[2] === "specify") {
                    return nullify(data[parts[1]] &&
                        data[parts[1]].specify != null &&
                        data[parts[1]].specify[parts[3]] != null
                        ? data[parts[1]].specify[parts[3]]
                        : null);
                }
                // Comments
                if (parts[2] === "comments") {
                    return nullify(data[parts[1]] ? data[parts[1]].comments : null);
                }
                // # Altitude and accuracy
                // if parts[2] == "value" and parts[3] in ["altitude", "accuracy"]
                //   return callback(null, data[parts[1]]?.value?[parts[3]])
                // # Units
                // if parts[2] == "value" and parts[3] in ["quantity", "units"]
                //   return callback(null, data[parts[1]]?.value?[parts[3]])
                // # Aquagenx cbt
                // if parts[2] == "value" and parts[3] == "cbt" and parts[4] in ["c1","c2","c3","c4","c5","healthRisk","mpn","confidence","accuracy"]
                //   return callback(null, data[parts[1]]?.value?[parts[3]]?[parts[4]])
                // if parts[2] == "value" and parts[3] == "image"
                //   return callback(null, data[parts[1]]?.value?[parts[3]])
                // Randomly asked
                if (parts.length === 3 && parts[2] === "randomAsked") {
                    return data[parts[1]] ? data[parts[1]].randomAsked || false : null;
                }
                // Alternates
                if (parts.length === 3 && (parts[2] === "na" || parts[2] === "dontknow")) {
                    return data[parts[1]] ? data[parts[1]].alternate == parts[2] || null : null;
                }
                // Timestamp
                if (parts.length === 3 && parts[2] === "timestamp") {
                    return nullify(data[parts[1]] ? data[parts[1]].timestamp : null);
                }
                // Location
                if (parts.length === 3 && parts[2] === "location") {
                    const location = data[parts[1]] ? data[parts[1]].location : null;
                    if (location) {
                        return {
                            type: "Point",
                            coordinates: [location.longitude, location.latitude]
                        };
                    }
                    return null;
                }
                if (parts.length === 4 && parts[2] === "location" && parts[3] === "accuracy") {
                    const location = data[parts[1]] ? data[parts[1]].location : null;
                    if (location) {
                        return nullify(location.accuracy);
                    }
                    return null;
                }
                if (parts.length === 4 && parts[2] === "location" && parts[3] === "altitude") {
                    const location = data[parts[1]] ? data[parts[1]].location : null;
                    if (location) {
                        return nullify(location.altitude);
                    }
                    return null;
                }
            }
            return null;
        });
    }
    /** Follows a join to get row or rows */
    followJoin(columnId) {
        return __awaiter(this, void 0, void 0, function* () {
            var siteType, value;
            let data = this.responseData;
            // Go into roster
            if (this.rosterId) {
                data = this.responseData[this.rosterId][this.rosterEntryIndex].data;
            }
            // Handle "response" of roster
            if (columnId === "response" && this.rosterId) {
                return new ResponseRow({
                    formDesign: this.formDesign,
                    schema: this.schema,
                    responseData: this.responseData,
                    getEntityById: this.getEntityById,
                    getEntityByCode: this.getEntityByCode,
                    getCustomTableRow: this.getCustomTableRow,
                    getAssetById: this.getAssetById,
                    deployment: this.deployment
                });
            }
            // Handle data
            if (columnId.match(/^data:/)) {
                const parts = columnId.split(":");
                // Roster
                if (parts.length === 2) {
                    if (lodash_1.default.isArray(this.responseData[parts[1]])) {
                        return lodash_1.default.map(this.responseData[parts[1]], (entry, index) => this.getRosterResponseRow(parts[1], index));
                    }
                }
                // Simple values
                if (parts.length === 3 && parts[2] === "value") {
                    let value = data[parts[1]] ? data[parts[1]].value : null;
                    if (value == null) {
                        return null;
                    }
                    // Get type of answer
                    const question = formUtils.findItem(this.formDesign, parts[1]);
                    if (!question) {
                        return null;
                    }
                    const answerType = formUtils.getAnswerType(question);
                    if (answerType === "site") {
                        // Create site entity row
                        siteType =
                            (question.siteTypes ? question.siteTypes[0] : null) || "water_point";
                        const entityType = siteType.toLowerCase().replace(new RegExp(" ", "g"), "_");
                        const code = value.code;
                        if (code) {
                            const entity = yield new Promise((resolve) => {
                                this.getEntityByCode(entityType, code, lodash_1.default.once((entity) => {
                                    if (entity) {
                                        return resolve(entity);
                                    }
                                    else {
                                        console.log(`Warning: Site ${code} not found in ResponseRow`);
                                        return resolve(null);
                                    }
                                }));
                            });
                            if (entity) {
                                return new EntityRow_1.default({
                                    entityType: entityType,
                                    entity: entity,
                                    schema: this.schema,
                                    getEntityById: this.getEntityById
                                });
                            }
                        }
                        return null;
                    }
                    if (answerType === "entity") {
                        // Create site entity row
                        if (value) {
                            const entity = yield new Promise((resolve) => {
                                this.getEntityById(question.entityType, value, lodash_1.default.once((entity) => {
                                    if (entity) {
                                        resolve(entity);
                                    }
                                    else {
                                        console.log(`Warning: Entity ${value} not found in ResponseRow`);
                                        resolve(null);
                                    }
                                }));
                            });
                            if (entity) {
                                return new EntityRow_1.default({
                                    entityType: question.entityType,
                                    entity: entity,
                                    schema: this.schema,
                                    getEntityById: this.getEntityById
                                });
                            }
                        }
                        return null;
                    }
                    if (answerType == "cascading_ref") {
                        // Create custom row
                        if (value) {
                            const tableId = question.tableId;
                            const customRow = yield this.getCustomTableRow(tableId, value);
                            if (customRow) {
                                return new CustomRow_1.CustomRow({
                                    tableId: question.tableId,
                                    getEntityById: this.getEntityById,
                                    row: customRow,
                                    schema: this.schema
                                });
                            }
                        }
                        return null;
                    }
                    if (answerType == "asset") {
                        // Create asset row
                        if (value) {
                            const systemId = question.assetSystemId;
                            const asset = yield this.getAssetById(systemId, value);
                            if (asset) {
                                return new AssetRow_1.AssetRow(asset);
                            }
                        }
                        return null;
                    }
                }
            }
            return null;
        });
    }
}
exports.default = ResponseRow;
/** Converts undefined to null */
function nullify(value) {
    if (value != null) {
        return value;
    }
    return null;
}
