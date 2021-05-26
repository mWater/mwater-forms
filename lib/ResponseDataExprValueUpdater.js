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
var ResponseCleaner_1 = __importDefault(require("./ResponseCleaner"));
var VisibilityCalculator_1 = __importDefault(require("./VisibilityCalculator"));
var RandomAskedCalculator_1 = __importDefault(require("./RandomAskedCalculator"));
var mwater_expressions_1 = require("mwater-expressions");
var ResponseDataValidator_1 = __importDefault(require("./ResponseDataValidator"));
/** Updates data in a response given an expression (mWater expression, see FormSchemaBuilder and also mwater-expressions package) and a value
 * When updates are complete for data, cleanData must be called to clean data (removing values that are invisble because of conditions).
 * and then call validateData to ensure that is valid
 */
var ResponseDataExprValueUpdater = /** @class */ (function () {
    function ResponseDataExprValueUpdater(formDesign, schema, dataSource) {
        this.formDesign = formDesign;
        this.schema = schema;
        this.dataSource = dataSource;
        // Index all items for fast lookup
        this.formItems = {};
        for (var _i = 0, _a = formUtils_1.default.allItems(this.formDesign); _i < _a.length; _i++) {
            var item = _a[_i];
            if (item._id) {
                this.formItems[item._id] = item;
            }
        }
    }
    /** True if an expression can be updated */
    ResponseDataExprValueUpdater.prototype.canUpdate = function (expr) {
        if (!expr) {
            return false;
        }
        // Handle simple fields
        if (expr.type === "field") {
            if (expr.column.match(/^data:[^:]+:value(:.+)?$/)) {
                return true;
            }
            // Comments field
            if (expr.column.match(/^data:[^:]+:comments$/)) {
                return true;
            }
            // NA/Don't know field
            if (expr.column.match(/^data:[^:]+:na$/) || expr.column.match(/^data:[^:]+:dontknow$/)) {
                return true;
            }
            // Specify field
            if (expr.column.match(/^data:[^:]+:specify:.+$/)) {
                return true;
            }
        }
        if ((expr.type === "op") && ['latitude', 'longitude'].includes(expr.op) && (expr.exprs[0].type === "field") && expr.exprs[0].column.match(/^data:[^:]+:value$/)) {
            return true;
        }
        // Can update scalar with single join
        if ((expr.type === "scalar") && (expr.joins.length === 1) && expr.joins[0].match(/^data:.+$/)) {
            return true;
        }
        if ((expr.type === "op") && (expr.op === "contains")
            && (expr.exprs[0].type === "field") && expr.exprs[0].column.match(/^data:[^:]+:value$/)
            && ((expr.exprs[1].value != null ? expr.exprs[1].value.length : undefined) === 1)) {
            return true;
        }
        return false;
    };
    ResponseDataExprValueUpdater.prototype.cleanData = function (data, createResponseRow, callback) {
        var _this = this;
        // Support older callback method
        if (callback) {
            this.cleanData(data, createResponseRow).then(function (cleanedData) { callback(null, cleanedData); }).catch(function (error) { return callback(error); });
            return;
        }
        // Compute visibility
        var visibilityCalculator = new VisibilityCalculator_1.default(this.formDesign, this.schema);
        var randomAskedCalculator = new RandomAskedCalculator_1.default(this.formDesign);
        var responseCleaner = new ResponseCleaner_1.default();
        return new Promise(function (resolve, reject) {
            responseCleaner.cleanData(_this.formDesign, visibilityCalculator, null, randomAskedCalculator, data, createResponseRow, null, function (error, results) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(results.data);
                }
            });
        });
    };
    ResponseDataExprValueUpdater.prototype.validateData = function (data, responseRow, callback) {
        var _this = this;
        // Support older callback method
        if (callback) {
            this.validateData(data, responseRow).then(function (result) { callback(null, result); }).catch(function (error) { return callback(error); });
            return;
        }
        var visibilityCalculator = new VisibilityCalculator_1.default(this.formDesign, this.schema);
        return new Promise(function (resolve, reject) {
            visibilityCalculator.createVisibilityStructure(data, responseRow, function (error, visibilityStructure) {
                if (error) {
                    reject(error);
                    return;
                }
                new ResponseDataValidator_1.default().validate(_this.formDesign, visibilityStructure, data, _this.schema, responseRow).then(resolve).catch(reject);
            });
        });
    };
    /** Updates the data of a response, given multiple expressions and their values.
     * This is the preferred way to do multiple updates instead of calling updateData repeatedly,
     * as some expressions may depend on another. For example, if there are two scalar expressions
     * for the same join, then the search for the underlying id value must take into account
     * both constraints (e.g. updating based on water point name and type)
     */
    ResponseDataExprValueUpdater.prototype.updateDataMultiple = function (data, exprValues) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, exprValue, scalarEvs, grouped, _b, _c, group;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _i = 0, _a = exprValues.filter(function (ev) { return ev.expr.type != "scalar"; });
                        _d.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        exprValue = _a[_i];
                        return [4 /*yield*/, this.updateData(data, exprValue.expr, exprValue.value)];
                    case 2:
                        data = _d.sent();
                        _d.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        scalarEvs = exprValues.filter(function (ev) { return ev.expr.type == "scalar"; }).map(function (ev) { return ({ expr: ev.expr, value: ev.value }); });
                        grouped = lodash_1.default.groupBy(scalarEvs, function (ev) { return ev.expr.joins[0]; });
                        _b = 0, _c = Object.values(grouped);
                        _d.label = 5;
                    case 5:
                        if (!(_b < _c.length)) return [3 /*break*/, 8];
                        group = _c[_b];
                        return [4 /*yield*/, this.updateScalar(data, group[0].expr.joins[0], group.map(function (ev) { return ({ expr: ev.expr.expr, value: ev.value }); }))];
                    case 6:
                        data = _d.sent();
                        _d.label = 7;
                    case 7:
                        _b++;
                        return [3 /*break*/, 5];
                    case 8: return [2 /*return*/, data];
                }
            });
        });
    };
    ResponseDataExprValueUpdater.prototype.updateData = function (data, expr, value, callback) {
        var _this = this;
        // Support newer promise method
        if (!callback) {
            return new Promise(function (resolve, reject) {
                _this.updateData(data, expr, value, function (error, responseData) {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(responseData);
                    }
                });
            });
        }
        var matches;
        if (!expr || !this.canUpdate(expr)) {
            callback(new Error("Cannot update expression: " + JSON.stringify(expr)));
            return;
        }
        // Handle simple fields
        if ((expr.type === "field") && expr.column.match(/^data:[^:]+:value$/)) {
            this.updateValue(data, expr, value, callback);
            return;
        }
        // Handle quantity and units
        if ((expr.type === "field") && expr.column.match(/^data:[^:]+:value:quantity$/)) {
            this.updateQuantity(data, expr, value, callback);
            return;
        }
        if ((expr.type === "field") && expr.column.match(/^data:[^:]+:value:units$/)) {
            this.updateUnits(data, expr, value, callback);
            return;
        }
        // Handle latitude/longitude of location question
        if ((expr.type === "op") && ['latitude', 'longitude'].includes(expr.op) && (expr.exprs[0].type === "field") && expr.exprs[0].column.match(/^data:.+:value$/)) {
            this.updateLocationLatLng(data, expr, value, callback);
            return;
        }
        // Handle location altitude
        if ((expr.type === "field") && expr.column.match(/^data:[^:]+:value:altitude$/)) {
            this.updateLocationAltitude(data, expr, value, callback);
            return;
        }
        // Handle location accuracy
        if ((expr.type === "field") && expr.column.match(/^data:[^:]+:value:accuracy$/)) {
            this.updateLocationAccuracy(data, expr, value, callback);
            return;
        }
        // Handle location method
        if ((expr.type === "field") && expr.column.match(/^data:[^:]+:value:method$/)) {
            this.updateLocationMethod(data, expr, value, callback);
            return;
        }
        // Handle CBT fields
        if ((expr.type === "field") && (matches = expr.column.match(/^data:[^:]+:value:cbt:(mpn|c1|c2|c3|c4|c5|confidence|healthRisk)$/))) {
            this.updateCBTField(data, expr, value, matches[1], callback);
            return;
        }
        // Handle CBT image 
        // TODO: This does not just match an AquagenX question but any thing that has image property besides value!
        if ((expr.type === "field") && expr.column.match(/^data:[^:]+:value:image$/)) {
            this.updateCBTImage(data, expr, value, callback);
            return;
        }
        // Handle Likert (items_choices) and Matrix
        if ((expr.type === "field") && expr.column.match(/^data:[^:]+:value:.+$/)) {
            var question = this.formItems[expr.column.match(/^data:([^:]+):value:.+$/)[1]];
            if (!question) {
                return callback(new Error("Question " + expr.column + " not found"));
            }
            var answerType = formUtils_1.default.getAnswerType(question);
            if (answerType === "items_choices") {
                this.updateItemsChoices(data, expr, value, callback);
                return;
            }
            if (answerType === "matrix") {
                this.updateMatrix(data, expr, value, callback);
                return;
            }
            if (answerType === "cascading_list") {
                this.updateCascadingList(data, expr, value, callback);
                return;
            }
        }
        // Handle contains for enumset with one value
        if ((expr.type === "op") && (expr.op === "contains")
            && (expr.exprs[0].type === "field") && expr.exprs[0].column.match(/^data:.+:value$/)
            && ((expr.exprs[1].value != null ? expr.exprs[1].value.length : undefined) === 1)) {
            this.updateEnumsetContains(data, expr, value, callback);
            return;
        }
        // Handle specify
        if ((expr.type === "field") && expr.column.match(/^data:[^:]+:specify:.+$/)) {
            this.updateSpecify(data, expr, value, callback);
            return;
        }
        // Handle comments
        if ((expr.type === "field") && expr.column.match(/^data:[^:]+:comments$/)) {
            this.updateComments(data, expr, value, callback);
            return;
        }
        // Handle alternate
        if ((expr.type === "field") && expr.column.match(/^data:[^:]+:(na|dontknow)$/)) {
            this.updateAlternate(data, expr, value, callback);
            return;
        }
        // Can update scalar with single join, non-aggr
        if ((expr.type === "scalar") && (expr.joins.length === 1) && expr.joins[0].match(/^data:.+:value$/)) {
            this.updateScalar(data, expr.joins[0], [{ expr: expr.expr, value: value }])
                .then(function (result) { return callback(null, result); })
                .catch(function (error) { return callback(error); });
            return;
        }
        return callback(new Error("Cannot update expr " + JSON.stringify(expr)));
    };
    // Updates a value of a cascading list question
    ResponseDataExprValueUpdater.prototype.updateCascadingList = function (data, expr, value, callback) {
        var _a = expr.column.match(/^data:([^:]+):value:(c\d)$/), field = _a[0], questionId = _a[1], column = _a[2];
        var question = this.formItems[questionId];
        if (!question) {
            return callback(new Error("Question " + expr.column + " not found"));
        }
        // Find column
        var colObj = lodash_1.default.find(question.columns, { id: column });
        if (!colObj) {
            return callback(new Error("Column " + column + " in question " + expr.column + " not found"));
        }
        // Check that value is valid
        if (!lodash_1.default.find(colObj.enumValues, { id: value })) {
            return callback(new Error("Column \"" + colObj.name[colObj.name._base] + "\" value " + value + " in question \"" + question.text[question.text._base] + "\" not found"));
        }
        // Get answer value and set new value
        var answerValue = lodash_1.default.cloneDeep((data[questionId] != null ? data[questionId].value : undefined) || {});
        answerValue[column] = value;
        // Clear id, as it will change with the update
        delete answerValue.id;
        // Check that row possibly exists
        var rows = question.rows.slice();
        for (var key in answerValue) {
            rows = lodash_1.default.filter(rows, function (r) { return r[key] === answerValue[key]; });
        }
        if (rows.length === 0) {
            return callback(new Error("Row referenced in question \"" + question.text[question.text._base] + "\" not found"));
        }
        return callback(null, this.setValue(data, question, answerValue));
    };
    // Updates a value of a question, e.g. data:somequestion:value
    ResponseDataExprValueUpdater.prototype.updateValue = function (data, expr, value, callback) {
        var question = this.formItems[expr.column.match(/^data:([^:]+):value$/)[1]];
        if (!question) {
            return callback(new Error("Question " + expr.column + " not found"));
        }
        // Get type of answer
        var answerType = formUtils_1.default.getAnswerType(question);
        switch (answerType) {
            case "text":
            case "number":
            case "choice":
            case "choices":
            case "date":
            case "boolean":
            case "image":
            case "images":
            case "texts":
            case "cascading_ref":
                return callback(null, this.setValue(data, question, value));
            case "location":
                // Convert from GeoJSON to lat/lng
                if (!value) {
                    return callback(null, this.setValue(data, question, value));
                }
                if (value.type !== "Point") {
                    return callback(new Error("GeoJSON type " + value.type + " not supported"));
                }
                var val = lodash_1.default.extend({}, (data[question._id] != null ? data[question._id].value : undefined) || {}, { latitude: value.coordinates[1], longitude: value.coordinates[0] });
                return callback(null, this.setValue(data, question, val));
            case "site":
                // Pretend it was a scalar update, as there is already code for that
                var entityType = formUtils_1.default.getSiteEntityType(question);
                return this.updateScalar(data, expr.column, [{ expr: { type: "id", table: "entities." + entityType }, value: value }])
                    .then(function (result) { return callback(null, result); })
                    .catch(function (error) { return callback(error); });
            default:
                return callback(new Error("Answer type " + answerType + " not supported"));
        }
    };
    // Update a single latitude or longitude of a location
    ResponseDataExprValueUpdater.prototype.updateLocationLatLng = function (data, expr, value, callback) {
        var val;
        var question = this.formItems[expr.exprs[0].column.match(/^data:([^:]+):value$/)[1]];
        if (!question) {
            return callback(new Error("Question " + expr.exprs[0].column + " not found"));
        }
        if (expr.op === "latitude") {
            val = lodash_1.default.extend({}, (data[question._id] != null ? data[question._id].value : undefined) || {}, { latitude: value });
        }
        else if (expr.op === "longitude") {
            val = lodash_1.default.extend({}, (data[question._id] != null ? data[question._id].value : undefined) || {}, { longitude: value });
        }
        else {
            throw new Error("Unsupported op " + expr.op);
        }
        return callback(null, this.setValue(data, question, val));
    };
    ResponseDataExprValueUpdater.prototype.updateLocationMethod = function (data, expr, value, callback) {
        var question = this.formItems[expr.column.match(/^data:([^:]+):value:method$/)[1]];
        if (!question) {
            return callback(new Error("Question " + expr.column + " not found"));
        }
        var answer = (data[question._id] || {});
        return callback(null, this.setValue(data, question, lodash_1.default.extend({}, answer.value || {}, { method: value })));
    };
    ResponseDataExprValueUpdater.prototype.updateLocationAccuracy = function (data, expr, value, callback) {
        var question = this.formItems[expr.column.match(/^data:([^:]+):value:accuracy$/)[1]];
        if (!question) {
            return callback(new Error("Question " + expr.column + " not found"));
        }
        var answer = (data[question._id] || {});
        return callback(null, this.setValue(data, question, lodash_1.default.extend({}, answer.value || {}, { accuracy: value })));
    };
    ResponseDataExprValueUpdater.prototype.updateLocationAltitude = function (data, expr, value, callback) {
        var question = this.formItems[expr.column.match(/^data:([^:]+):value:altitude$/)[1]];
        if (!question) {
            return callback(new Error("Question " + expr.column + " not found"));
        }
        var answer = (data[question._id] || {});
        return callback(null, this.setValue(data, question, lodash_1.default.extend({}, answer.value || {}, { altitude: value })));
    };
    ResponseDataExprValueUpdater.prototype.updateQuantity = function (data, expr, value, callback) {
        var question = this.formItems[expr.column.match(/^data:([^:]+):value:quantity$/)[1]];
        if (!question) {
            return callback(new Error("Question " + expr.column + " not found"));
        }
        var answer = (data[question._id] || {});
        callback(null, this.setValue(data, question, lodash_1.default.extend({}, answer.value || {}, { quantity: value })));
    };
    ResponseDataExprValueUpdater.prototype.updateUnits = function (data, expr, value, callback) {
        var question = this.formItems[expr.column.match(/^data:([^:]+):value:units$/)[1]];
        if (!question) {
            return callback(new Error("Question " + expr.column + " not found"));
        }
        var answer = (data[question._id] || {});
        callback(null, this.setValue(data, question, lodash_1.default.extend({}, answer.value || {}, { units: value })));
    };
    ResponseDataExprValueUpdater.prototype.updateCBTField = function (data, expr, value, cbtField, callback) {
        var pattern = new RegExp("^data:([^:]+):value:cbt:" + cbtField + "$");
        var question = this.formItems[expr.column.match(pattern)[1]];
        if (!question) {
            return callback(new Error("Question " + expr.column + " not found"));
        }
        var answer = (data[question._id] || {});
        var updates = {};
        updates[cbtField] = value;
        var cbt = lodash_1.default.extend({}, (answer.value != null ? answer.value.cbt : undefined) || {}, updates);
        callback(null, this.setValue(data, question, lodash_1.default.extend({}, answer.value || {}, { cbt: cbt })));
    };
    ResponseDataExprValueUpdater.prototype.updateCBTImage = function (data, expr, value, callback) {
        var question = this.formItems[expr.column.match(/^data:([^:]+):value:image$/)[1]];
        if (!question) {
            return callback(new Error("Question " + expr.column + " not found"));
        }
        var answer = (data[question._id] || {});
        callback(null, this.setValue(data, question, lodash_1.default.extend({}, answer.value || {}, { image: value })));
    };
    ResponseDataExprValueUpdater.prototype.updateEnumsetContains = function (data, expr, value, callback) {
        var question = this.formItems[expr.exprs[0].column.match(/^data:([^:]+):value$/)[1]];
        if (!question) {
            return callback(new Error("Question " + expr.exprs[0].column + " not found"));
        }
        var answerValue = (data[question._id] != null ? data[question._id].value : undefined) || [];
        // Add to list if true
        if (value === true) {
            answerValue = lodash_1.default.union(answerValue, [expr.exprs[1].value[0]]);
        }
        else if (value === false) {
            answerValue = lodash_1.default.difference(answerValue, [expr.exprs[1].value[0]]);
        }
        callback(null, this.setValue(data, question, answerValue));
    };
    ResponseDataExprValueUpdater.prototype.updateSpecify = function (data, expr, value, callback) {
        var question = this.formItems[expr.column.match(/^data:([^:]+):specify:.+$/)[1]];
        if (!question) {
            return callback(new Error("Question " + expr.column + " not found"));
        }
        var specifyId = expr.column.match(/^data:[^:]+:specify:(.+)$/)[1];
        var answer = (data[question._id] || {});
        var specify = answer.specify || {};
        var change = {};
        change[specifyId] = value;
        specify = lodash_1.default.extend({}, specify, change);
        callback(null, this.setAnswer(data, question, lodash_1.default.extend({}, answer, { specify: specify })));
    };
    // Update a Likert-style item
    ResponseDataExprValueUpdater.prototype.updateItemsChoices = function (data, expr, value, callback) {
        var question = this.formItems[expr.column.match(/^data:([^:]+):value:.+$/)[1]];
        if (!question) {
            return callback(new Error("Question " + expr.column + " not found"));
        }
        var item = expr.column.match(/^data:.+:value:(.+)$/)[1];
        var answerValue = (data[question._id] != null ? data[question._id].value : undefined) || {};
        var change = {};
        change[item] = value;
        answerValue = lodash_1.default.extend({}, answerValue, change);
        callback(null, this.setValue(data, question, answerValue));
    };
    // Updates a matrix question
    ResponseDataExprValueUpdater.prototype.updateMatrix = function (data, expr, value, callback) {
        var change;
        var question = this.formItems[expr.column.match(/^data:([^:]+):value:.+$/)[1]];
        if (!question) {
            return callback(new Error("Question " + expr.column + " not found"));
        }
        var item = expr.column.match(/^data:[^:]+:value:(.+):.+:value(:.+)?$/)[1];
        var column = expr.column.match(/^data:[^:]+:value:.+:(.+):value(:.+)?$/)[1];
        var answerValue = (data[question._id] != null ? data[question._id].value : undefined) || {};
        var itemPart = answerValue[item] || {};
        var cellAnswer = itemPart[column] || {};
        var cellValue = cellAnswer.value;
        // If direct update (not quantity/units)
        if (expr.column.match(/^data:[^:]+:value:(.+):.+:value$/)) {
            cellAnswer = { value: value };
            change = {};
            change[column] = cellAnswer;
            itemPart = lodash_1.default.extend({}, itemPart, change);
            change = {};
            change[item] = itemPart;
            answerValue = lodash_1.default.extend({}, answerValue, change);
            return callback(null, this.setValue(data, question, answerValue));
        }
        // If magnitude
        if (expr.column.match(/^data:.+:value:(.+):.+:value:quantity$/)) {
            cellAnswer = { value: lodash_1.default.extend({}, cellValue || {}, { quantity: value }) };
            change = {};
            change[column] = cellAnswer;
            itemPart = lodash_1.default.extend({}, itemPart, change);
            change = {};
            change[item] = itemPart;
            answerValue = lodash_1.default.extend({}, answerValue, change);
            return callback(null, this.setValue(data, question, answerValue));
        }
        // If units
        if (expr.column.match(/^data:.+:value:(.+):.+:value:units$/)) {
            cellAnswer = { value: lodash_1.default.extend({}, cellValue || {}, { units: value }) };
            change = {};
            change[column] = cellAnswer;
            itemPart = lodash_1.default.extend({}, itemPart, change);
            change = {};
            change[item] = itemPart;
            answerValue = lodash_1.default.extend({}, answerValue, change);
            return callback(null, this.setValue(data, question, answerValue));
        }
    };
    ResponseDataExprValueUpdater.prototype.updateComments = function (data, expr, value, callback) {
        var question = this.formItems[expr.column.match(/^data:(.+):comments$/)[1]];
        if (!question) {
            return callback(new Error("Question " + expr.column + " not found"));
        }
        var answer = (data[question._id] || {});
        answer = lodash_1.default.extend({}, answer, { comments: value });
        return callback(null, this.setAnswer(data, question, answer));
    };
    ResponseDataExprValueUpdater.prototype.updateAlternate = function (data, expr, value, callback) {
        var question = this.formItems[expr.column.match(/^data:(.+):(.+)$/)[1]];
        if (!question) {
            return callback(new Error("Question " + expr.column + " not found"));
        }
        var alternate = expr.column.match(/^data:(.+):(.+)$/)[2];
        var answer = (data[question._id] || {});
        // Set if true
        if (value && (answer.alternate !== alternate)) {
            answer = lodash_1.default.extend({}, answer, { alternate: alternate });
        }
        else if (!value && (answer.alternate === alternate)) {
            answer = lodash_1.default.extend({}, answer, { alternate: null });
        }
        return callback(null, this.setAnswer(data, question, answer));
    };
    ResponseDataExprValueUpdater.prototype.setAnswer = function (data, question, answer) {
        var change = {};
        change[question._id] = answer;
        return lodash_1.default.extend({}, data, change);
    };
    // Sets a value in data
    ResponseDataExprValueUpdater.prototype.setValue = function (data, question, value) {
        var answer = (data[question._id] || {});
        answer.value = value;
        return this.setAnswer(data, question, answer);
    };
    /** Update a scalar, which may have multiple expressions to determine the row referenced */
    ResponseDataExprValueUpdater.prototype.updateScalar = function (data, join, exprValues) {
        return __awaiter(this, void 0, void 0, function () {
            var selectExpr, question, exprCompiler, table, query, rows;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        question = this.formItems[join.match(/^data:([^:]+):value$/)[1]];
                        if (!question) {
                            throw new Error("Question " + join + " not found");
                        }
                        // If all values null, remove
                        if (exprValues.every(function (ev) { return ev.value == null; })) {
                            return [2 /*return*/, this.setValue(data, question, null)];
                        }
                        // Shortcut for site question where we have code already
                        if (question._type === "SiteQuestion"
                            && exprValues.length == 1
                            && exprValues[0].expr.type == "field"
                            && (exprValues[0].expr.column === "code")) {
                            return [2 /*return*/, this.setValue(data, question, { code: exprValues[0].value })];
                        }
                        exprCompiler = new mwater_expressions_1.ExprCompiler(this.schema);
                        if (question._type === "SiteQuestion") {
                            // Site questions store code
                            selectExpr = { type: "field", tableAlias: "main", column: "code" };
                        }
                        else if (["EntityQuestion", "AdminRegionQuestion", "CascadingRefQuestion"].includes(question._type)) {
                            // Entity question etc store _id 
                            selectExpr = { type: "field", tableAlias: "main", column: "_id" };
                        }
                        else {
                            throw new Error("Unsupported type " + question._type);
                        }
                        table = exprValues[0].expr.table;
                        query = {
                            type: "query",
                            selects: [
                                { type: "select", expr: selectExpr, alias: "value" }
                            ],
                            from: { type: "table", table: table, alias: "main" },
                            where: {
                                type: "op",
                                op: "and",
                                exprs: exprValues.map(function (ev) { return ({
                                    type: "op",
                                    op: "=",
                                    exprs: [
                                        exprCompiler.compileExpr({ expr: ev.expr, tableAlias: "main" }),
                                        ev.value
                                    ]
                                }); })
                            },
                            limit: 2
                        };
                        return [4 /*yield*/, new Promise(function (resolve, reject) { return _this.dataSource.performQuery(query, function (error, rows) {
                                if (error) {
                                    return reject(error);
                                }
                                else {
                                    resolve(rows);
                                }
                            }); })
                            // Only one result
                        ];
                    case 1:
                        rows = _a.sent();
                        // Only one result
                        if (rows.length === 0) {
                            throw new Error("Value " + exprValues.map(function (ev) { return ev.value + ""; }).join(", ") + " not found");
                        }
                        if (rows.length > 1) {
                            throw new Error("Value " + exprValues.map(function (ev) { return ev.value + ""; }).join(", ") + " has multiple matches");
                        }
                        // Set value
                        if (question._type === "SiteQuestion") {
                            return [2 /*return*/, this.setValue(data, question, { code: rows[0].value })];
                        }
                        else if (["EntityQuestion", "AdminRegionQuestion", "CascadingRefQuestion"].includes(question._type)) {
                            return [2 /*return*/, this.setValue(data, question, rows[0].value)];
                        }
                        else {
                            throw new Error("Unsupported type " + question._type);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return ResponseDataExprValueUpdater;
}());
exports.default = ResponseDataExprValueUpdater;
