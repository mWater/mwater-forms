"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var formUtils_1 = __importDefault(require("./formUtils"));
var VisibilityCalculator_1 = __importDefault(require("./VisibilityCalculator"));
var EntityRow_1 = __importDefault(require("./EntityRow"));
var CustomRow_1 = require("./CustomRow");
/*
  Implements the type of row object required by mwater-expressions' PromiseExprEvaluator. Allows expressions to be evaluated
  on responses
*/
var ResponseRow = /** @class */ (function () {
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
    function ResponseRow(options) {
        this.formDesign = options.formDesign;
        this.schema = options.schema;
        this.responseData = options.responseData;
        this.rosterId = options.rosterId;
        this.rosterEntryIndex = options.rosterEntryIndex;
        this.getEntityById = options.getEntityById;
        this.getEntityByCode = options.getEntityByCode;
        this.getCustomTableRow = options.getCustomTableRow;
        this.deployment = options.deployment;
        this.submittedOn = options.submittedOn;
    }
    // Gets the response row for a roster entry
    ResponseRow.prototype.getRosterResponseRow = function (rosterId, rosterEntryIndex) {
        return new ResponseRow({
            formDesign: this.formDesign,
            schema: this.schema,
            responseData: this.responseData,
            getEntityById: this.getEntityById,
            getEntityByCode: this.getEntityByCode,
            getCustomTableRow: this.getCustomTableRow,
            deployment: this.deployment,
            rosterId: rosterId,
            rosterEntryIndex: rosterEntryIndex
        });
    };
    // Gets primary key of row
    ResponseRow.prototype.getPrimaryKey = function () {
        // Not available if not roster
        if (!this.rosterId) {
            return null;
        }
        // Get roster id
        return this.responseData[this.rosterId][this.rosterEntryIndex];
    };
    // Gets the value of a column
    ResponseRow.prototype.getField = function (columnId) {
        return __awaiter(this, void 0, void 0, function () {
            var siteType, value, data, parts, visibilityCalculator_1, visibilityStructure, value_1, question, answerType, entityType_1, code_1, entity, _i, _a, part, location_1, location_2, location_3;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        data = this.responseData;
                        // Go into roster
                        if (this.rosterId) {
                            data = this.responseData[this.rosterId][this.rosterEntryIndex].data;
                        }
                        if (columnId === "deployment") {
                            return [2 /*return*/, this.deployment];
                        }
                        if (columnId == "submittedOn") {
                            return [2 /*return*/, this.submittedOn];
                        }
                        // Handle "response" of roster
                        if (columnId === "response" && this.rosterId) {
                            // Primary key not available
                            return [2 /*return*/, null];
                        }
                        // Handle "index" of roster
                        if (columnId === "index" && this.rosterId) {
                            return [2 /*return*/, this.rosterEntryIndex];
                        }
                        if (!columnId.match(/^data:/)) return [3 /*break*/, 7];
                        parts = columnId.split(":");
                        // Roster
                        if (parts.length === 2) {
                            if (lodash_1.default.isArray(this.responseData[parts[1]])) {
                                // Extract _id s
                                return [2 /*return*/, lodash_1.default.map(this.responseData[parts[1]], function (entry, index) { return entry._id; })];
                            }
                        }
                        if (!(parts.length === 3 && parts[2] === "visible")) return [3 /*break*/, 2];
                        visibilityCalculator_1 = new VisibilityCalculator_1.default(this.formDesign, this.schema);
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                visibilityCalculator_1.createVisibilityStructure(_this.responseData, _this, function (error, visibilityStructure) {
                                    if (error) {
                                        reject(error);
                                    }
                                    else {
                                        resolve(visibilityStructure);
                                    }
                                });
                            })];
                    case 1:
                        visibilityStructure = _b.sent();
                        return [2 /*return*/, visibilityStructure[parts[1]]];
                    case 2:
                        if (!(parts.length === 3 && parts[2] === "value")) return [3 /*break*/, 6];
                        value_1 = data[parts[1]] ? data[parts[1]].value : null;
                        // Null "" and []
                        if (value_1 === "" || (lodash_1.default.isArray(value_1) && value_1.length === 0)) {
                            value_1 = null;
                        }
                        if (value_1 == null) {
                            return [2 /*return*/, null];
                        }
                        question = formUtils_1.default.findItem(this.formDesign, parts[1]);
                        if (!question) {
                            return [2 /*return*/, null];
                        }
                        answerType = formUtils_1.default.getAnswerType(question);
                        // Pad to YYYY-MM-DD
                        if (answerType === "date") {
                            if (value_1.length === 4) {
                                value_1 = value_1 + "-01-01";
                            }
                            if (value_1.length === 7) {
                                value_1 = value_1 + "-01";
                            }
                            // If date only, truncate
                            if (!question.format.match(/ss|LLL|lll|m|h|H/)) {
                                value_1 = value_1.substr(0, 10);
                            }
                        }
                        if (!(answerType === "site")) return [3 /*break*/, 5];
                        // Create site entity row
                        siteType = (question.siteTypes ? question.siteTypes[0] : null) || "water_point";
                        entityType_1 = siteType.toLowerCase().replace(new RegExp(' ', 'g'), "_");
                        code_1 = value_1.code;
                        if (!code_1) return [3 /*break*/, 4];
                        return [4 /*yield*/, new Promise(function (resolve) {
                                _this.getEntityByCode(entityType_1, code_1, lodash_1.default.once(function (entity) {
                                    if (entity) {
                                        return resolve(entity);
                                    }
                                    else {
                                        console.log("Warning: Site " + code_1 + " not found in ResponseRow");
                                        return resolve(null);
                                    }
                                }));
                            })];
                    case 3:
                        entity = _b.sent();
                        if (entity) {
                            return [2 /*return*/, entity._id];
                        }
                        _b.label = 4;
                    case 4: return [2 /*return*/, null];
                    case 5:
                        if (answerType === "entity") {
                            return [2 /*return*/, value_1];
                        }
                        if (answerType == "cascading_ref") {
                            return [2 /*return*/, value_1];
                        }
                        // Location
                        if (value_1 && (value_1.latitude != null)) {
                            return [2 /*return*/, {
                                    type: "Point",
                                    coordinates: [value_1.longitude, value_1.latitude]
                                }];
                        }
                        return [2 /*return*/, nullify(value_1)];
                    case 6:
                        // Value can also recurse for handing matrix, item_choices, altitude, accuracy and CBT
                        if (parts[2] === "value") {
                            value = data[parts[1]] ? data[parts[1]].value : null;
                            for (_i = 0, _a = lodash_1.default.drop(parts, 3); _i < _a.length; _i++) {
                                part = _a[_i];
                                value = value != null ? value[part] : null;
                            }
                            return [2 /*return*/, nullify(value)];
                        }
                        // Specify
                        if (parts[2] === "specify") {
                            return [2 /*return*/, nullify(data[parts[1]] && data[parts[1]].specify != null && data[parts[1]].specify[parts[3]] != null ? data[parts[1]].specify[parts[3]] : null)];
                        }
                        // Comments
                        if (parts[2] === "comments") {
                            return [2 /*return*/, nullify(data[parts[1]] ? data[parts[1]].comments : null)];
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
                        // Alternates
                        if (parts.length === 3 && (parts[2] === 'na' || parts[2] === 'dontknow')) {
                            return [2 /*return*/, data[parts[1]] ? data[parts[1]].alternate == parts[2] || null : null];
                        }
                        // Timestamp
                        if (parts.length === 3 && parts[2] === "timestamp") {
                            return [2 /*return*/, nullify(data[parts[1]] ? data[parts[1]].timestamp : null)];
                        }
                        // Location
                        if (parts.length === 3 && parts[2] === "location") {
                            location_1 = data[parts[1]] ? data[parts[1]].location : null;
                            if (location_1) {
                                return [2 /*return*/, {
                                        type: "Point",
                                        coordinates: [location_1.longitude, location_1.latitude]
                                    }];
                            }
                            return [2 /*return*/, null];
                        }
                        if (parts.length === 4 && parts[2] === "location" && parts[3] === "accuracy") {
                            location_2 = data[parts[1]] ? data[parts[1]].location : null;
                            if (location_2) {
                                return [2 /*return*/, nullify(location_2.accuracy)];
                            }
                            return [2 /*return*/, null];
                        }
                        if (parts.length === 4 && parts[2] === "location" && parts[3] === "altitude") {
                            location_3 = data[parts[1]] ? data[parts[1]].location : null;
                            if (location_3) {
                                return [2 /*return*/, nullify(location_3.altitude)];
                            }
                            return [2 /*return*/, null];
                        }
                        _b.label = 7;
                    case 7: return [2 /*return*/, null];
                }
            });
        });
    };
    /** Follows a join to get row or rows */
    ResponseRow.prototype.followJoin = function (columnId) {
        return __awaiter(this, void 0, void 0, function () {
            var siteType, value, data, parts_1, value_2, question_1, answerType, entityType_2, code_2, entity, entity, tableId, customRow;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = this.responseData;
                        // Go into roster
                        if (this.rosterId) {
                            data = this.responseData[this.rosterId][this.rosterEntryIndex].data;
                        }
                        // Handle "response" of roster
                        if (columnId === "response" && this.rosterId) {
                            return [2 /*return*/, new ResponseRow({
                                    formDesign: this.formDesign,
                                    schema: this.schema,
                                    responseData: this.responseData,
                                    getEntityById: this.getEntityById,
                                    getEntityByCode: this.getEntityByCode,
                                    getCustomTableRow: this.getCustomTableRow,
                                    deployment: this.deployment
                                })];
                        }
                        if (!columnId.match(/^data:/)) return [3 /*break*/, 9];
                        parts_1 = columnId.split(":");
                        // Roster
                        if (parts_1.length === 2) {
                            if (lodash_1.default.isArray(this.responseData[parts_1[1]])) {
                                return [2 /*return*/, lodash_1.default.map(this.responseData[parts_1[1]], function (entry, index) {
                                        return _this.getRosterResponseRow(parts_1[1], index);
                                    })];
                            }
                        }
                        if (!(parts_1.length === 3 && parts_1[2] === "value")) return [3 /*break*/, 9];
                        value_2 = data[parts_1[1]] ? data[parts_1[1]].value : null;
                        if (value_2 == null) {
                            return [2 /*return*/, null];
                        }
                        question_1 = formUtils_1.default.findItem(this.formDesign, parts_1[1]);
                        if (!question_1) {
                            return [2 /*return*/, null];
                        }
                        answerType = formUtils_1.default.getAnswerType(question_1);
                        if (!(answerType === "site")) return [3 /*break*/, 3];
                        // Create site entity row
                        siteType = (question_1.siteTypes ? question_1.siteTypes[0] : null) || "water_point";
                        entityType_2 = siteType.toLowerCase().replace(new RegExp(' ', 'g'), "_");
                        code_2 = value_2.code;
                        if (!code_2) return [3 /*break*/, 2];
                        return [4 /*yield*/, new Promise(function (resolve) {
                                _this.getEntityByCode(entityType_2, code_2, lodash_1.default.once(function (entity) {
                                    if (entity) {
                                        return resolve(entity);
                                    }
                                    else {
                                        console.log("Warning: Site " + code_2 + " not found in ResponseRow");
                                        return resolve(null);
                                    }
                                }));
                            })];
                    case 1:
                        entity = _a.sent();
                        if (entity) {
                            return [2 /*return*/, new EntityRow_1.default({
                                    entityType: entityType_2,
                                    entity: entity,
                                    schema: this.schema,
                                    getEntityById: this.getEntityById
                                })];
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/, null];
                    case 3:
                        if (!(answerType === "entity")) return [3 /*break*/, 6];
                        if (!value_2) return [3 /*break*/, 5];
                        return [4 /*yield*/, new Promise(function (resolve) {
                                _this.getEntityById(question_1.entityType, value_2, lodash_1.default.once(function (entity) {
                                    if (entity) {
                                        resolve(entity);
                                    }
                                    else {
                                        console.log("Warning: Entity " + value_2 + " not found in ResponseRow");
                                        resolve(null);
                                    }
                                }));
                            })];
                    case 4:
                        entity = _a.sent();
                        if (entity) {
                            return [2 /*return*/, new EntityRow_1.default({
                                    entityType: question_1.entityType,
                                    entity: entity,
                                    schema: this.schema,
                                    getEntityById: this.getEntityById
                                })];
                        }
                        _a.label = 5;
                    case 5: return [2 /*return*/, null];
                    case 6:
                        if (!(answerType == "cascading_ref")) return [3 /*break*/, 9];
                        if (!value_2) return [3 /*break*/, 8];
                        tableId = question_1.tableId;
                        return [4 /*yield*/, this.getCustomTableRow(tableId, value_2)];
                    case 7:
                        customRow = _a.sent();
                        if (customRow) {
                            return [2 /*return*/, new CustomRow_1.CustomRow({
                                    tableId: question_1.tableId,
                                    getEntityById: this.getEntityById,
                                    row: customRow,
                                    schema: this.schema
                                })];
                        }
                        _a.label = 8;
                    case 8: return [2 /*return*/, null];
                    case 9: return [2 /*return*/, null];
                }
            });
        });
    };
    return ResponseRow;
}());
exports.default = ResponseRow;
/** Converts undefined to null */
function nullify(value) {
    if (value != null) {
        return value;
    }
    return null;
}
