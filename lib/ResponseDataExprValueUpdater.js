"use strict";
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
    // Cleans data. Must be called after last update is done. 
    // createResponseRow takes one parameter (data) and returns a response row
    // Callback with (error, cleanedData)
    ResponseDataExprValueUpdater.prototype.cleanData = function (data, createResponseRow, callback) {
        // Compute visibility
        var visibilityCalculator = new VisibilityCalculator_1.default(this.formDesign, this.schema);
        var randomAskedCalculator = new RandomAskedCalculator_1.default(this.formDesign);
        var responseCleaner = new ResponseCleaner_1.default();
        responseCleaner.cleanData(this.formDesign, visibilityCalculator, null, randomAskedCalculator, data, createResponseRow, null, function (error, results) {
            callback(error, results != null ? results.data : undefined);
        });
    };
    // Validates the data. Callback null if ok, otherwise string message in second parameter. Clean first.
    ResponseDataExprValueUpdater.prototype.validateData = function (data, responseRow, callback) {
        var _this = this;
        var visibilityCalculator = new VisibilityCalculator_1.default(this.formDesign, this.schema);
        visibilityCalculator.createVisibilityStructure(data, responseRow, function (error, visibilityStructure) {
            if (error) {
                return callback(error);
            }
            new ResponseDataValidator_1.default().validate(_this.formDesign, visibilityStructure, data, _this.schema, responseRow)
                .then(function (result) { return callback(null, result); })
                .catch(function (err) { return callback(err); });
        });
    };
    // Updates the data of a response, given an expression and its value. For example,
    // if there is a text field in question q1234, the expression { type: "field", table: "responses:form123", column: "data:q1234:value" }
    // refers to the text field value. Setting it will set data.q1234.value in the data.
    ResponseDataExprValueUpdater.prototype.updateData = function (data, expr, value, callback) {
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
            this.updateScalar(data, expr, value, callback);
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
                return this.updateScalar(data, { type: "scalar", joins: [expr.column], table: expr.table, expr: { type: "id", table: "entities." + entityType } }, value, callback);
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
    ResponseDataExprValueUpdater.prototype.updateScalar = function (data, expr, value, callback) {
        var _this = this;
        var selectExpr;
        var question = this.formItems[expr.joins[0].match(/^data:([^:]+):value$/)[1]];
        if (!question) {
            return callback(new Error("Question " + expr.joins[0] + " not found"));
        }
        // If null, remove
        if ((value == null)) {
            return callback(null, this.setValue(data, question, null));
        }
        // Shortcut for site question where we have code already
        if ((question._type === "SiteQuestion") && (expr.expr.column === "code")) {
            return callback(null, this.setValue(data, question, { code: value }));
        }
        // Create query to get _id or code, depending on question type
        var exprCompiler = new mwater_expressions_1.ExprCompiler(this.schema);
        if (question._type === "SiteQuestion") {
            // Site questions store code
            selectExpr = { type: "field", tableAlias: "main", column: "code" };
        }
        else if (["EntityQuestion", "AdminRegionQuestion"].includes(question._type)) {
            // Entity question store id
            selectExpr = { type: "field", tableAlias: "main", column: "_id" };
        }
        else {
            throw new Error("Unsupported type " + question._type);
        }
        // Query matches to the expression, limiting to 2 as we want exactly one match
        var query = {
            type: "query",
            selects: [
                { type: "select", expr: selectExpr, alias: "value" }
            ],
            from: { type: "table", table: expr.expr.table, alias: "main" },
            where: {
                type: "op",
                op: "=",
                exprs: [
                    exprCompiler.compileExpr({ expr: expr.expr, tableAlias: "main" }),
                    value
                ]
            },
            limit: 2
        };
        // Perform query
        return this.dataSource.performQuery(query, function (error, rows) {
            if (error) {
                return callback(error);
            }
            // Only one result
            if (rows.length === 0) {
                return callback(new Error("Value " + value + " not found"));
            }
            if (rows.length > 1) {
                return callback(new Error("Value " + value + " has multiple matches"));
            }
            // Set value
            if (question._type === "SiteQuestion") {
                return callback(null, _this.setValue(data, question, { code: rows[0].value }));
            }
            else if (["EntityQuestion", "AdminRegionQuestion"].includes(question._type)) {
                return callback(null, _this.setValue(data, question, rows[0].value));
            }
            else {
                throw new Error("Unsupported type " + question._type);
            }
        });
    };
    return ResponseDataExprValueUpdater;
}());
exports.default = ResponseDataExprValueUpdater;
