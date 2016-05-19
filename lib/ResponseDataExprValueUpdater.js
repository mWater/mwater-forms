var ResponseCleaner, ResponseDataExprValueUpdater, VisibilityCalculator, formUtils;

formUtils = require('./formUtils');

ResponseCleaner = require('./ResponseCleaner');

VisibilityCalculator = require('./VisibilityCalculator');

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
    if (expr.type === "field") {
      if (expr.column.match(/^data:.+:value$/) || expr.column.match(/^data:.+:value:quantity$/) || expr.column.match(/^data:.+:value:units$/)) {
        return true;
      }
    }
    return false;
  };

  ResponseDataExprValueUpdater.prototype.updateData = function(data, expr, value, callback, suppressCleaning) {
    var cleanData;
    if (suppressCleaning == null) {
      suppressCleaning = false;
    }
    cleanData = (function(_this) {
      return function(error, data) {
        var responseCleaner, visibilityCalculator, visibilityStructure;
        if (suppressCleaning || error) {
          return callback(error, data);
        }
        visibilityCalculator = new VisibilityCalculator(_this.formDesign);
        visibilityStructure = visibilityCalculator.createVisibilityStructure(data);
        responseCleaner = new ResponseCleaner();
        data = responseCleaner.cleanData(data, visibilityStructure, _this.formDesign);
        return callback(null, data);
      };
    })(this);
    if (expr.type === "field" && expr.column.match(/^data:.+:value$/)) {
      this.updateValue(data, expr, value, cleanData);
      return;
    }
    if (expr.type === "field" && expr.column.match(/^data:.+:value:quantity$/)) {
      this.updateQuantity(data, expr, value, cleanData);
      return;
    }
    if (expr.type === "field" && expr.column.match(/^data:.+:value:units$/)) {
      this.updateUnits(data, expr, value, cleanData);
      return;
    }
    return callback(new Error("Cannot update expr " + (JSON.stringify(expr))));
  };

  ResponseDataExprValueUpdater.prototype.updateValue = function(data, expr, value, callback) {
    var answerType, question, ref, setValue;
    question = this.formItems[expr.column.match(/^data:(.+):value$/)[1]];
    if (!question) {
      return callback(new Error("Question " + expr.column + " not found"));
    }
    setValue = (function(_this) {
      return function(val) {
        var answer, change;
        answer = data[question._id] || {};
        answer.value = val;
        change = {};
        change[question._id] = answer;
        data = _.extend({}, data, change);
        return callback(null, data);
      };
    })(this);
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
        return setValue(value);
      case "location":
        if (!value) {
          return setValue(null);
        }
        if (value.type !== "Point") {
          return callback(new Error("GeoJSON type " + value.type + " not supported"));
        }
        return setValue(_.extend({}, ((ref = data[question._id]) != null ? ref.value : void 0) || {}, {
          latitude: value.coordinates[1],
          longitude: value.coordinates[0]
        }));
      default:
        return callback(new Error("Answer type " + answerType + " not supported"));
    }
  };

  ResponseDataExprValueUpdater.prototype.updateQuantity = function(data, expr, value, callback) {
    var answer, change, question;
    question = this.formItems[expr.column.match(/^data:(.+):value:quantity$/)[1]];
    if (!question) {
      return callback(new Error("Question " + expr.column + " not found"));
    }
    answer = data[question._id] || {};
    answer.value = _.extend({}, answer.value || {}, {
      quantity: value
    });
    change = {};
    change[question._id] = answer;
    data = _.extend({}, data, change);
    return callback(null, data);
  };

  ResponseDataExprValueUpdater.prototype.updateUnits = function(data, expr, value, callback) {
    var answer, change, question;
    question = this.formItems[expr.column.match(/^data:(.+):value:units$/)[1]];
    if (!question) {
      return callback(new Error("Question " + expr.column + " not found"));
    }
    answer = data[question._id] || {};
    answer.value = _.extend({}, answer.value || {}, {
      units: value
    });
    change = {};
    change[question._id] = answer;
    data = _.extend({}, data, change);
    return callback(null, data);
  };

  return ResponseDataExprValueUpdater;

})();
