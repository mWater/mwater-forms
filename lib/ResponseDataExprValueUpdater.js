var ExprCompiler, ResponseCleaner, ResponseDataExprValueUpdater, ResponseDataValidator, VisibilityCalculator, _, formUtils;

_ = require('lodash');

formUtils = require('./formUtils');

ResponseCleaner = require('./ResponseCleaner');

VisibilityCalculator = require('./VisibilityCalculator');

ExprCompiler = require('mwater-expressions').ExprCompiler;

ResponseDataValidator = require('./ResponseDataValidator');

module.exports = ResponseDataExprValueUpdater = (function() {
  function ResponseDataExprValueUpdater(formDesign, schema, dataSource) {
    var i, item, len, ref;
    this.formDesign = formDesign;
    this.schema = schema;
    this.dataSource = dataSource;
    this.formItems = {};
    ref = formUtils.allItems(this.formDesign);
    for (i = 0, len = ref.length; i < len; i++) {
      item = ref[i];
      if (item._id) {
        this.formItems[item._id] = item;
      }
    }
  }

  ResponseDataExprValueUpdater.prototype.canUpdate = function(expr) {
    var ref, ref1;
    if (expr.type === "field") {
      if (expr.column.match(/^data:[^:]+:value(:.+)?$/)) {
        return true;
      }
      if (expr.column.match(/^data:[^:]+:comments$/)) {
        return true;
      }
      if (expr.column.match(/^data:[^:]+:na$/) || expr.column.match(/^data:[^:]+:dontknow$/)) {
        return true;
      }
      if (expr.column.match(/^data:[^:]+:specify:.+$/)) {
        return true;
      }
    }
    if (expr.type === "op" && ((ref = expr.op) === 'latitude' || ref === 'longitude') && expr.exprs[0].type === "field" && expr.exprs[0].column.match(/^data:[^:]+:value$/)) {
      return true;
    }
    if (expr.type === "scalar" && expr.joins.length === 1 && !expr.aggr && expr.joins[0].match(/^data:.+$/)) {
      return true;
    }
    if (expr.type === "op" && expr.op === "contains" && expr.exprs[0].type === "field" && expr.exprs[0].column.match(/^data:[^:]+:value$/) && ((ref1 = expr.exprs[1].value) != null ? ref1.length : void 0) === 1) {
      return true;
    }
    return false;
  };

  ResponseDataExprValueUpdater.prototype.cleanData = function(data, createResponseRow, callback) {
    var responseCleaner, visibilityCalculator;
    visibilityCalculator = new VisibilityCalculator(this.formDesign);
    responseCleaner = new ResponseCleaner();
    return responseCleaner.cleanData(this.formDesign, visibilityCalculator, null, data, createResponseRow, null, (function(_this) {
      return function(error, results) {
        return callback(error, results != null ? results.data : void 0);
      };
    })(this));
  };

  ResponseDataExprValueUpdater.prototype.validateData = function(data, responseRow, callback) {
    var visibilityCalculator;
    visibilityCalculator = new VisibilityCalculator(this.formDesign);
    return visibilityCalculator.createVisibilityStructure(data, responseRow, (function(_this) {
      return function(error, visibilityStructure) {
        var result;
        if (error) {
          return callback(error);
        }
        result = new ResponseDataValidator().validate(_this.formDesign, visibilityStructure, data);
        return callback(null, result);
      };
    })(this));
  };

  ResponseDataExprValueUpdater.prototype.updateData = function(data, expr, value, callback) {
    var answerType, question, ref, ref1;
    if (!this.canUpdate(expr)) {
      callback(new Error("Cannot update expression"));
      return;
    }
    if (expr.type === "field" && expr.column.match(/^data:[^:]+:value$/)) {
      this.updateValue(data, expr, value, callback);
      return;
    }
    if (expr.type === "field" && expr.column.match(/^data:[^:]+:value:quantity$/)) {
      this.updateQuantity(data, expr, value, callback);
      return;
    }
    if (expr.type === "field" && expr.column.match(/^data:[^:]+:value:units$/)) {
      this.updateUnits(data, expr, value, callback);
      return;
    }
    if (expr.type === "op" && ((ref = expr.op) === 'latitude' || ref === 'longitude') && expr.exprs[0].type === "field" && expr.exprs[0].column.match(/^data:.+:value$/)) {
      this.updateLocationLatLng(data, expr, value, callback);
      return;
    }
    if (expr.type === "field" && expr.column.match(/^data:[^:]+:value:altitude$/)) {
      this.updateLocationAltitude(data, expr, value, callback);
      return;
    }
    if (expr.type === "field" && expr.column.match(/^data:[^:]+:value:accuracy$/)) {
      this.updateLocationAccuracy(data, expr, value, callback);
      return;
    }
    if (expr.type === "field" && expr.column.match(/^data:[^:]+:value:.+$/)) {
      question = this.formItems[expr.column.match(/^data:([^:]+):value:.+$/)[1]];
      if (!question) {
        return callback(new Error("Question " + expr.column + " not found"));
      }
      answerType = formUtils.getAnswerType(question);
      if (answerType === "items_choices") {
        this.updateItemsChoices(data, expr, value, callback);
        return;
      }
      if (answerType === "matrix") {
        this.updateMatrix(data, expr, value, callback);
        return;
      }
    }
    if (expr.type === "op" && expr.op === "contains" && expr.exprs[0].type === "field" && expr.exprs[0].column.match(/^data:.+:value$/) && ((ref1 = expr.exprs[1].value) != null ? ref1.length : void 0) === 1) {
      this.updateEnumsetContains(data, expr, value, callback);
      return;
    }
    if (expr.type === "field" && expr.column.match(/^data:[^:]+:specify:.+$/)) {
      this.updateSpecify(data, expr, value, callback);
      return;
    }
    if (expr.type === "field" && expr.column.match(/^data:[^:]+:comments$/)) {
      this.updateComments(data, expr, value, callback);
      return;
    }
    if (expr.type === "field" && expr.column.match(/^data:[^:]+:(na|dontknow)$/)) {
      this.updateAlternate(data, expr, value, callback);
      return;
    }
    if (expr.type === "scalar" && expr.joins.length === 1 && !expr.aggr && expr.joins[0].match(/^data:.+:value$/)) {
      this.updateScalar(data, expr, value, callback);
      return;
    }
    return callback(new Error("Cannot update expr " + (JSON.stringify(expr))));
  };

  ResponseDataExprValueUpdater.prototype.updateValue = function(data, expr, value, callback) {
    var answerType, question, ref, val;
    question = this.formItems[expr.column.match(/^data:([^:]+):value$/)[1]];
    if (!question) {
      return callback(new Error("Question " + expr.column + " not found"));
    }
    answerType = formUtils.getAnswerType(question);
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
        if (!value) {
          return callback(null, this.setValue(data, question, value));
        }
        if (value.type !== "Point") {
          return callback(new Error("GeoJSON type " + value.type + " not supported"));
        }
        val = _.extend({}, ((ref = data[question._id]) != null ? ref.value : void 0) || {}, {
          latitude: value.coordinates[1],
          longitude: value.coordinates[0]
        });
        return callback(null, this.setValue(data, question, val));
      default:
        return callback(new Error("Answer type " + answerType + " not supported"));
    }
  };

  ResponseDataExprValueUpdater.prototype.updateLocationLatLng = function(data, expr, value, callback) {
    var question, ref, ref1, val;
    question = this.formItems[expr.exprs[0].column.match(/^data:([^:]+):value$/)[1]];
    if (!question) {
      return callback(new Error("Question " + expr.exprs[0].column + " not found"));
    }
    if (expr.op === "latitude") {
      val = _.extend({}, ((ref = data[question._id]) != null ? ref.value : void 0) || {}, {
        latitude: value
      });
    } else if (expr.op === "longitude") {
      val = _.extend({}, ((ref1 = data[question._id]) != null ? ref1.value : void 0) || {}, {
        longitude: value
      });
    } else {
      throw new Error("Unsupported op " + expr.op);
    }
    return callback(null, this.setValue(data, question, val));
  };

  ResponseDataExprValueUpdater.prototype.updateLocationAccuracy = function(data, expr, value, callback) {
    var answer, question;
    question = this.formItems[expr.column.match(/^data:([^:]+):value:accuracy$/)[1]];
    if (!question) {
      return callback(new Error("Question " + expr.column + " not found"));
    }
    answer = data[question._id] || {};
    return callback(null, this.setValue(data, question, _.extend({}, answer.value || {}, {
      accuracy: value
    })));
  };

  ResponseDataExprValueUpdater.prototype.updateLocationAltitude = function(data, expr, value, callback) {
    var answer, question;
    question = this.formItems[expr.column.match(/^data:([^:]+):value:altitude$/)[1]];
    if (!question) {
      return callback(new Error("Question " + expr.column + " not found"));
    }
    answer = data[question._id] || {};
    return callback(null, this.setValue(data, question, _.extend({}, answer.value || {}, {
      altitude: value
    })));
  };

  ResponseDataExprValueUpdater.prototype.updateQuantity = function(data, expr, value, callback) {
    var answer, question;
    question = this.formItems[expr.column.match(/^data:([^:]+):value:quantity$/)[1]];
    if (!question) {
      return callback(new Error("Question " + expr.column + " not found"));
    }
    answer = data[question._id] || {};
    return callback(null, this.setValue(data, question, _.extend({}, answer.value || {}, {
      quantity: value
    })));
  };

  ResponseDataExprValueUpdater.prototype.updateUnits = function(data, expr, value, callback) {
    var answer, question;
    question = this.formItems[expr.column.match(/^data:([^:]+):value:units$/)[1]];
    if (!question) {
      return callback(new Error("Question " + expr.column + " not found"));
    }
    answer = data[question._id] || {};
    return callback(null, this.setValue(data, question, _.extend({}, answer.value || {}, {
      units: value
    })));
  };

  ResponseDataExprValueUpdater.prototype.updateEnumsetContains = function(data, expr, value, callback) {
    var answerValue, question, ref;
    question = this.formItems[expr.exprs[0].column.match(/^data:([^:]+):value$/)[1]];
    if (!question) {
      return callback(new Error("Question " + expr.exprs[0].column + " not found"));
    }
    answerValue = ((ref = data[question._id]) != null ? ref.value : void 0) || [];
    if (value === true) {
      answerValue = _.union(answerValue, [expr.exprs[1].value[0]]);
    } else if (value === false) {
      answerValue = _.difference(answerValue, [expr.exprs[1].value[0]]);
    }
    return callback(null, this.setValue(data, question, answerValue));
  };

  ResponseDataExprValueUpdater.prototype.updateSpecify = function(data, expr, value, callback) {
    var answer, change, question, specify, specifyId;
    question = this.formItems[expr.column.match(/^data:([^:]+):specify:.+$/)[1]];
    if (!question) {
      return callback(new Error("Question " + expr.column + " not found"));
    }
    specifyId = expr.column.match(/^data:[^:]+:specify:(.+)$/)[1];
    answer = data[question._id] || {};
    specify = answer.specify || {};
    change = {};
    change[specifyId] = value;
    specify = _.extend({}, specify, change);
    return callback(null, this.setAnswer(data, question, _.extend({}, answer, {
      specify: specify
    })));
  };

  ResponseDataExprValueUpdater.prototype.updateItemsChoices = function(data, expr, value, callback) {
    var answerValue, change, item, question, ref;
    question = this.formItems[expr.column.match(/^data:([^:]+):value:.+$/)[1]];
    if (!question) {
      return callback(new Error("Question " + expr.column + " not found"));
    }
    item = expr.column.match(/^data:.+:value:(.+)$/)[1];
    answerValue = ((ref = data[question._id]) != null ? ref.value : void 0) || {};
    change = {};
    change[item] = value;
    answerValue = _.extend({}, answerValue, change);
    return callback(null, this.setValue(data, question, answerValue));
  };

  ResponseDataExprValueUpdater.prototype.updateMatrix = function(data, expr, value, callback) {
    var answerValue, cellAnswer, cellValue, change, column, item, itemPart, question, ref;
    question = this.formItems[expr.column.match(/^data:([^:]+):value:.+$/)[1]];
    if (!question) {
      return callback(new Error("Question " + expr.column + " not found"));
    }
    item = expr.column.match(/^data:[^:]+:value:(.+):.+:value(:.+)?$/)[1];
    column = expr.column.match(/^data:[^:]+:value:.+:(.+):value(:.+)?$/)[1];
    answerValue = ((ref = data[question._id]) != null ? ref.value : void 0) || {};
    itemPart = answerValue[item] || {};
    cellAnswer = itemPart[column] || {};
    cellValue = cellAnswer.value;
    if (expr.column.match(/^data:[^:]+:value:(.+):.+:value$/)) {
      cellAnswer = {
        value: value
      };
      change = {};
      change[column] = cellAnswer;
      itemPart = _.extend({}, itemPart, change);
      change = {};
      change[item] = itemPart;
      answerValue = _.extend({}, answerValue, change);
      return callback(null, this.setValue(data, question, answerValue));
    }
    if (expr.column.match(/^data:.+:value:(.+):.+:value:quantity$/)) {
      cellAnswer = {
        value: _.extend({}, cellValue || {}, {
          quantity: value
        })
      };
      change = {};
      change[column] = cellAnswer;
      itemPart = _.extend({}, itemPart, change);
      change = {};
      change[item] = itemPart;
      answerValue = _.extend({}, answerValue, change);
      return callback(null, this.setValue(data, question, answerValue));
    }
    if (expr.column.match(/^data:.+:value:(.+):.+:value:units$/)) {
      cellAnswer = {
        value: _.extend({}, cellValue || {}, {
          units: value
        })
      };
      change = {};
      change[column] = cellAnswer;
      itemPart = _.extend({}, itemPart, change);
      change = {};
      change[item] = itemPart;
      answerValue = _.extend({}, answerValue, change);
      return callback(null, this.setValue(data, question, answerValue));
    }
  };

  ResponseDataExprValueUpdater.prototype.updateComments = function(data, expr, value, callback) {
    var answer, question;
    question = this.formItems[expr.column.match(/^data:(.+):comments$/)[1]];
    if (!question) {
      return callback(new Error("Question " + expr.column + " not found"));
    }
    answer = data[question._id] || {};
    answer = _.extend({}, answer, {
      comments: value
    });
    return callback(null, this.setAnswer(data, question, answer));
  };

  ResponseDataExprValueUpdater.prototype.updateAlternate = function(data, expr, value, callback) {
    var alternate, answer, question;
    question = this.formItems[expr.column.match(/^data:(.+):(.+)$/)[1]];
    if (!question) {
      return callback(new Error("Question " + expr.column + " not found"));
    }
    alternate = expr.column.match(/^data:(.+):(.+)$/)[2];
    answer = data[question._id] || {};
    if (value && answer.alternate !== alternate) {
      answer = _.extend({}, answer, {
        alternate: alternate
      });
    } else if (!value && answer.alternate === alternate) {
      answer = _.extend({}, answer, {
        alternate: null
      });
    }
    return callback(null, this.setAnswer(data, question, answer));
  };

  ResponseDataExprValueUpdater.prototype.setAnswer = function(data, question, answer) {
    var change;
    change = {};
    change[question._id] = answer;
    return _.extend({}, data, change);
  };

  ResponseDataExprValueUpdater.prototype.setValue = function(data, question, value) {
    var answer;
    answer = data[question._id] || {};
    answer.value = value;
    return this.setAnswer(data, question, answer);
  };

  ResponseDataExprValueUpdater.prototype.updateScalar = function(data, expr, value, callback) {
    var exprCompiler, query, question, ref, selectExpr;
    question = this.formItems[expr.joins[0].match(/^data:([^:]+):value$/)[1]];
    if (!question) {
      return callback(new Error("Question " + expr.joins[0] + " not found"));
    }
    if (value == null) {
      return callback(null, this.setValue(data, question, null));
    }
    exprCompiler = new ExprCompiler(this.schema);
    if (question._type === "SiteQuestion") {
      selectExpr = {
        type: "field",
        tableAlias: "main",
        column: "code"
      };
    } else if ((ref = question._type) === "EntityQuestion" || ref === "AdminRegionQuestion") {
      selectExpr = {
        type: "field",
        tableAlias: "main",
        column: "_id"
      };
    } else {
      throw new Error("Unsupported type " + question._type);
    }
    query = {
      type: "query",
      selects: [
        {
          type: "select",
          expr: selectExpr,
          alias: "value"
        }
      ],
      from: {
        type: "table",
        table: expr.expr.table,
        alias: "main"
      },
      where: {
        type: "op",
        op: "=",
        exprs: [
          exprCompiler.compileExpr({
            expr: expr.expr,
            tableAlias: "main"
          }), value
        ]
      },
      limit: 2
    };
    return this.dataSource.performQuery(query, (function(_this) {
      return function(error, rows) {
        var ref1;
        if (error) {
          return callback(error);
        }
        if (rows.length === 0) {
          return callback(new Error("Value " + value + " not found"));
        }
        if (rows.length > 1) {
          return callback(new Error("Value " + value + " has multiple matches"));
        }
        if (question._type === "SiteQuestion") {
          return callback(null, _this.setValue(data, question, {
            code: rows[0].value
          }));
        } else if ((ref1 = question._type) === "EntityQuestion" || ref1 === "AdminRegionQuestion") {
          return callback(null, _this.setValue(data, question, rows[0].value));
        } else {
          throw new Error("Unsupported type " + question._type);
        }
      };
    })(this));
  };

  return ResponseDataExprValueUpdater;

})();
