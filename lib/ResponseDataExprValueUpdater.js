"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var ExprCompiler, RandomAskedCalculator, ResponseCleaner, ResponseDataExprValueUpdater, ResponseDataValidator, VisibilityCalculator, _, formUtils;

_ = require('lodash');
formUtils = require('./formUtils');
ResponseCleaner = require('./ResponseCleaner');
VisibilityCalculator = require('./VisibilityCalculator');
RandomAskedCalculator = require('./RandomAskedCalculator');
ExprCompiler = require('mwater-expressions').ExprCompiler;
ResponseDataValidator = require('./ResponseDataValidator'); // Updates data in a response given an expression (mWater expression, see FormSchemaBuilder and also mwater-expressions package) and a value
// When updates are complete for data, cleanData must be called to clean data (removing values that are invisble because of conditions).
// and then call validateData to ensure that is valid

module.exports = ResponseDataExprValueUpdater = /*#__PURE__*/function () {
  function ResponseDataExprValueUpdater(formDesign, schema, dataSource) {
    (0, _classCallCheck2["default"])(this, ResponseDataExprValueUpdater);
    var i, item, len, ref;
    this.formDesign = formDesign;
    this.schema = schema;
    this.dataSource = dataSource; // Index all items for fast lookup

    this.formItems = {};
    ref = formUtils.allItems(this.formDesign);

    for (i = 0, len = ref.length; i < len; i++) {
      item = ref[i];

      if (item._id) {
        this.formItems[item._id] = item;
      }
    }
  } // True if an expression can be updated


  (0, _createClass2["default"])(ResponseDataExprValueUpdater, [{
    key: "canUpdate",
    value: function canUpdate(expr) {
      var ref, ref1; // Handle simple fields

      if (expr.type === "field") {
        if (expr.column.match(/^data:[^:]+:value(:.+)?$/)) {
          return true;
        } // Comments field


        if (expr.column.match(/^data:[^:]+:comments$/)) {
          return true;
        } // NA/Don't know field


        if (expr.column.match(/^data:[^:]+:na$/) || expr.column.match(/^data:[^:]+:dontknow$/)) {
          return true;
        } // Specify field


        if (expr.column.match(/^data:[^:]+:specify:.+$/)) {
          return true;
        }
      }

      if (expr.type === "op" && ((ref = expr.op) === 'latitude' || ref === 'longitude') && expr.exprs[0].type === "field" && expr.exprs[0].column.match(/^data:[^:]+:value$/)) {
        return true;
      } // Can update scalar with single join, non-aggr


      if (expr.type === "scalar" && expr.joins.length === 1 && !expr.aggr && expr.joins[0].match(/^data:.+$/)) {
        return true;
      }

      if (expr.type === "op" && expr.op === "contains" && expr.exprs[0].type === "field" && expr.exprs[0].column.match(/^data:[^:]+:value$/) && ((ref1 = expr.exprs[1].value) != null ? ref1.length : void 0) === 1) {
        return true;
      }

      return false;
    } // Cleans data. Must be called after last update is done. 
    // createResponseRow takes one parameter (data) and returns a response row
    // Callback with (error, cleanedData)

  }, {
    key: "cleanData",
    value: function cleanData(data, createResponseRow, callback) {
      var randomAskedCalculator, responseCleaner, visibilityCalculator; // Compute visibility

      visibilityCalculator = new VisibilityCalculator(this.formDesign, this.schema);
      randomAskedCalculator = new RandomAskedCalculator(this.formDesign);
      responseCleaner = new ResponseCleaner();
      return responseCleaner.cleanData(this.formDesign, visibilityCalculator, null, randomAskedCalculator, data, createResponseRow, null, function (error, results) {
        return callback(error, results != null ? results.data : void 0);
      });
    } // Validates the data. Callback null if ok, otherwise string message in second parameter. Clean first.

  }, {
    key: "validateData",
    value: function validateData(data, responseRow, callback) {
      var _this = this;

      var visibilityCalculator;
      visibilityCalculator = new VisibilityCalculator(this.formDesign, this.schema);
      return visibilityCalculator.createVisibilityStructure(data, responseRow, function (error, visibilityStructure) {
        if (error) {
          return callback(error);
        }

        return new ResponseDataValidator().validate(_this.formDesign, visibilityStructure, data, _this.schema, responseRow).then(function (result) {
          return callback(null, result);
        })["catch"](function (err) {
          return callback(err);
        });
      });
    } // Updates the data of a response, given an expression and its value. For example,
    // if there is a text field in question q1234, the expression { type: "field", table: "responses:form123", column: "data:q1234:value" }
    // refers to the text field value. Setting it will set data.q1234.value in the data.

  }, {
    key: "updateData",
    value: function updateData(data, expr, value, callback) {
      var answerType, matches, question, ref, ref1;

      if (!this.canUpdate(expr)) {
        callback(new Error("Cannot update expression"));
        return;
      } // Handle simple fields


      if (expr.type === "field" && expr.column.match(/^data:[^:]+:value$/)) {
        this.updateValue(data, expr, value, callback);
        return;
      } // Handle quantity and units


      if (expr.type === "field" && expr.column.match(/^data:[^:]+:value:quantity$/)) {
        this.updateQuantity(data, expr, value, callback);
        return;
      }

      if (expr.type === "field" && expr.column.match(/^data:[^:]+:value:units$/)) {
        this.updateUnits(data, expr, value, callback);
        return;
      } // Handle latitude/longitude of location question


      if (expr.type === "op" && ((ref = expr.op) === 'latitude' || ref === 'longitude') && expr.exprs[0].type === "field" && expr.exprs[0].column.match(/^data:.+:value$/)) {
        this.updateLocationLatLng(data, expr, value, callback);
        return;
      } // Handle location altitude


      if (expr.type === "field" && expr.column.match(/^data:[^:]+:value:altitude$/)) {
        this.updateLocationAltitude(data, expr, value, callback);
        return;
      } // Handle location accuracy


      if (expr.type === "field" && expr.column.match(/^data:[^:]+:value:accuracy$/)) {
        this.updateLocationAccuracy(data, expr, value, callback);
        return;
      } // Handle location method


      if (expr.type === "field" && expr.column.match(/^data:[^:]+:value:method$/)) {
        this.updateLocationMethod(data, expr, value, callback);
        return;
      } // Handle CBT fields


      if (expr.type === "field" && (matches = expr.column.match(/^data:[^:]+:value:cbt:(mpn|c1|c2|c3|c4|c5|confidence|healthRisk)$/))) {
        this.updateCBTField(data, expr, value, matches[1], callback);
        return;
      } // Handle CBT image 
      // TODO: This does not just match an AquagenX question but any thing that has image property besides value!


      if (expr.type === "field" && expr.column.match(/^data:[^:]+:value:image$/)) {
        this.updateCBTImage(data, expr, value, callback);
        return;
      } // Handle Likert (items_choices) and Matrix


      if (expr.type === "field" && expr.column.match(/^data:[^:]+:value:.+$/)) {
        question = this.formItems[expr.column.match(/^data:([^:]+):value:.+$/)[1]];

        if (!question) {
          return callback(new Error("Question ".concat(expr.column, " not found")));
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

        if (answerType === "cascading_list") {
          this.updateCascadingList(data, expr, value, callback);
          return;
        }
      } // Handle contains for enumset with one value


      if (expr.type === "op" && expr.op === "contains" && expr.exprs[0].type === "field" && expr.exprs[0].column.match(/^data:.+:value$/) && ((ref1 = expr.exprs[1].value) != null ? ref1.length : void 0) === 1) {
        this.updateEnumsetContains(data, expr, value, callback);
        return;
      } // Handle specify


      if (expr.type === "field" && expr.column.match(/^data:[^:]+:specify:.+$/)) {
        this.updateSpecify(data, expr, value, callback);
        return;
      } // Handle comments


      if (expr.type === "field" && expr.column.match(/^data:[^:]+:comments$/)) {
        this.updateComments(data, expr, value, callback);
        return;
      } // Handle alternate


      if (expr.type === "field" && expr.column.match(/^data:[^:]+:(na|dontknow)$/)) {
        this.updateAlternate(data, expr, value, callback);
        return;
      } // Can update scalar with single join, non-aggr


      if (expr.type === "scalar" && expr.joins.length === 1 && !expr.aggr && expr.joins[0].match(/^data:.+:value$/)) {
        this.updateScalar(data, expr, value, callback);
        return;
      }

      return callback(new Error("Cannot update expr ".concat(JSON.stringify(expr))));
    } // Updates a value of a cascading list question

  }, {
    key: "updateCascadingList",
    value: function updateCascadingList(data, expr, value, callback) {
      var answerValue, colObj, column, field, key, question, questionId, ref, rows;

      var _expr$column$match = expr.column.match(/^data:([^:]+):value:(c\d)$/);

      var _expr$column$match2 = (0, _slicedToArray2["default"])(_expr$column$match, 3);

      field = _expr$column$match2[0];
      questionId = _expr$column$match2[1];
      column = _expr$column$match2[2];
      question = this.formItems[questionId];

      if (!question) {
        return callback(new Error("Question ".concat(expr.column, " not found")));
      } // Find column


      colObj = _.find(question.columns, {
        id: column
      });

      if (!colObj) {
        return callback(new Error("Column ".concat(column, " in question ").concat(expr.column, " not found")));
      } // Check that value is valid


      if (!_.find(colObj.enumValues, {
        id: value
      })) {
        return callback(new Error("Column ".concat(column, " value ").concat(value, " in question ").concat(expr.column, " not found")));
      } // Get answer value and set new value


      answerValue = _.cloneDeep(((ref = data[questionId]) != null ? ref.value : void 0) || {});
      answerValue[column] = value; // Clear id, as it will change with the update

      delete answerValue.id; // Check that row possibly exists

      rows = question.rows.slice();

      for (key in answerValue) {
        value = answerValue[key];
        rows = _.filter(rows, function (r) {
          return r[key] === value;
        });
      }

      if (rows.length === 0) {
        return callback(new Error("Row referenced in question ".concat(expr.column, " not found")));
      }

      return callback(null, this.setValue(data, question, answerValue));
    } // Updates a value of a question, e.g. data:somequestion:value

  }, {
    key: "updateValue",
    value: function updateValue(data, expr, value, callback) {
      var answerType, entityType, question, ref, val;
      question = this.formItems[expr.column.match(/^data:([^:]+):value$/)[1]];

      if (!question) {
        return callback(new Error("Question ".concat(expr.column, " not found")));
      } // Get type of answer


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
          // Convert from GeoJSON to lat/lng
          if (!value) {
            return callback(null, this.setValue(data, question, value));
          }

          if (value.type !== "Point") {
            return callback(new Error("GeoJSON type ".concat(value.type, " not supported")));
          }

          val = _.extend({}, ((ref = data[question._id]) != null ? ref.value : void 0) || {}, {
            latitude: value.coordinates[1],
            longitude: value.coordinates[0]
          });
          return callback(null, this.setValue(data, question, val));

        case "site":
          // Pretend it was a scalar update, as there is already code for that
          entityType = formUtils.getSiteEntityType(question);
          return this.updateScalar(data, {
            type: "scalar",
            joins: [expr.column],
            expr: {
              type: "id",
              table: "entities.".concat(entityType)
            }
          }, value, callback);

        default:
          return callback(new Error("Answer type ".concat(answerType, " not supported")));
      }
    } // Update a single latitude or longitude of a location

  }, {
    key: "updateLocationLatLng",
    value: function updateLocationLatLng(data, expr, value, callback) {
      var question, ref, ref1, val;
      question = this.formItems[expr.exprs[0].column.match(/^data:([^:]+):value$/)[1]];

      if (!question) {
        return callback(new Error("Question ".concat(expr.exprs[0].column, " not found")));
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
        throw new Error("Unsupported op ".concat(expr.op));
      }

      return callback(null, this.setValue(data, question, val));
    }
  }, {
    key: "updateLocationMethod",
    value: function updateLocationMethod(data, expr, value, callback) {
      var answer, question;
      question = this.formItems[expr.column.match(/^data:([^:]+):value:method$/)[1]];

      if (!question) {
        return callback(new Error("Question ".concat(expr.column, " not found")));
      }

      answer = data[question._id] || {};
      return callback(null, this.setValue(data, question, _.extend({}, answer.value || {}, {
        method: value
      })));
    }
  }, {
    key: "updateLocationAccuracy",
    value: function updateLocationAccuracy(data, expr, value, callback) {
      var answer, question;
      question = this.formItems[expr.column.match(/^data:([^:]+):value:accuracy$/)[1]];

      if (!question) {
        return callback(new Error("Question ".concat(expr.column, " not found")));
      }

      answer = data[question._id] || {};
      return callback(null, this.setValue(data, question, _.extend({}, answer.value || {}, {
        accuracy: value
      })));
    }
  }, {
    key: "updateLocationAltitude",
    value: function updateLocationAltitude(data, expr, value, callback) {
      var answer, question;
      question = this.formItems[expr.column.match(/^data:([^:]+):value:altitude$/)[1]];

      if (!question) {
        return callback(new Error("Question ".concat(expr.column, " not found")));
      }

      answer = data[question._id] || {};
      return callback(null, this.setValue(data, question, _.extend({}, answer.value || {}, {
        altitude: value
      })));
    }
  }, {
    key: "updateQuantity",
    value: function updateQuantity(data, expr, value, callback) {
      var answer, question;
      question = this.formItems[expr.column.match(/^data:([^:]+):value:quantity$/)[1]];

      if (!question) {
        return callback(new Error("Question ".concat(expr.column, " not found")));
      }

      answer = data[question._id] || {};
      return callback(null, this.setValue(data, question, _.extend({}, answer.value || {}, {
        quantity: value
      })));
    }
  }, {
    key: "updateUnits",
    value: function updateUnits(data, expr, value, callback) {
      var answer, question;
      question = this.formItems[expr.column.match(/^data:([^:]+):value:units$/)[1]];

      if (!question) {
        return callback(new Error("Question ".concat(expr.column, " not found")));
      }

      answer = data[question._id] || {};
      return callback(null, this.setValue(data, question, _.extend({}, answer.value || {}, {
        units: value
      })));
    }
  }, {
    key: "updateCBTField",
    value: function updateCBTField(data, expr, value, cbtField, callback) {
      var answer, cbt, pattern, question, ref, updates;
      pattern = new RegExp("^data:([^:]+):value:cbt:".concat(cbtField, "$"));
      question = this.formItems[expr.column.match(pattern)[1]];

      if (!question) {
        return callback(new Error("Question ".concat(expr.column, " not found")));
      }

      answer = data[question._id] || {};
      updates = {};
      updates[cbtField] = value;
      cbt = _.extend({}, ((ref = answer.value) != null ? ref.cbt : void 0) || {}, updates);
      return callback(null, this.setValue(data, question, _.extend({}, answer.value || {}, {
        cbt: cbt
      })));
    }
  }, {
    key: "updateCBTImage",
    value: function updateCBTImage(data, expr, value, callback) {
      var answer, question;
      question = this.formItems[expr.column.match(/^data:([^:]+):value:image$/)[1]];

      if (!question) {
        return callback(new Error("Question ".concat(expr.column, " not found")));
      }

      answer = data[question._id] || {};
      return callback(null, this.setValue(data, question, _.extend({}, answer.value || {}, {
        image: value
      })));
    }
  }, {
    key: "updateEnumsetContains",
    value: function updateEnumsetContains(data, expr, value, callback) {
      var answerValue, question, ref;
      question = this.formItems[expr.exprs[0].column.match(/^data:([^:]+):value$/)[1]];

      if (!question) {
        return callback(new Error("Question ".concat(expr.exprs[0].column, " not found")));
      }

      answerValue = ((ref = data[question._id]) != null ? ref.value : void 0) || []; // Add to list if true

      if (value === true) {
        answerValue = _.union(answerValue, [expr.exprs[1].value[0]]);
      } else if (value === false) {
        answerValue = _.difference(answerValue, [expr.exprs[1].value[0]]);
      }

      return callback(null, this.setValue(data, question, answerValue));
    }
  }, {
    key: "updateSpecify",
    value: function updateSpecify(data, expr, value, callback) {
      var answer, change, question, specify, specifyId;
      question = this.formItems[expr.column.match(/^data:([^:]+):specify:.+$/)[1]];

      if (!question) {
        return callback(new Error("Question ".concat(expr.column, " not found")));
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
    } // Update a Likert-style item

  }, {
    key: "updateItemsChoices",
    value: function updateItemsChoices(data, expr, value, callback) {
      var answerValue, change, item, question, ref;
      question = this.formItems[expr.column.match(/^data:([^:]+):value:.+$/)[1]];

      if (!question) {
        return callback(new Error("Question ".concat(expr.column, " not found")));
      }

      item = expr.column.match(/^data:.+:value:(.+)$/)[1];
      answerValue = ((ref = data[question._id]) != null ? ref.value : void 0) || {};
      change = {};
      change[item] = value;
      answerValue = _.extend({}, answerValue, change);
      return callback(null, this.setValue(data, question, answerValue));
    } // Updates a matrix question

  }, {
    key: "updateMatrix",
    value: function updateMatrix(data, expr, value, callback) {
      var answerValue, cellAnswer, cellValue, change, column, item, itemPart, question, ref;
      question = this.formItems[expr.column.match(/^data:([^:]+):value:.+$/)[1]];

      if (!question) {
        return callback(new Error("Question ".concat(expr.column, " not found")));
      }

      item = expr.column.match(/^data:[^:]+:value:(.+):.+:value(:.+)?$/)[1];
      column = expr.column.match(/^data:[^:]+:value:.+:(.+):value(:.+)?$/)[1];
      answerValue = ((ref = data[question._id]) != null ? ref.value : void 0) || {};
      itemPart = answerValue[item] || {};
      cellAnswer = itemPart[column] || {};
      cellValue = cellAnswer.value; // If direct update (not quantity/units)

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
      } // If magnitude


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
      } // If units


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
    }
  }, {
    key: "updateComments",
    value: function updateComments(data, expr, value, callback) {
      var answer, question;
      question = this.formItems[expr.column.match(/^data:(.+):comments$/)[1]];

      if (!question) {
        return callback(new Error("Question ".concat(expr.column, " not found")));
      }

      answer = data[question._id] || {};
      answer = _.extend({}, answer, {
        comments: value
      });
      return callback(null, this.setAnswer(data, question, answer));
    }
  }, {
    key: "updateAlternate",
    value: function updateAlternate(data, expr, value, callback) {
      var alternate, answer, question;
      question = this.formItems[expr.column.match(/^data:(.+):(.+)$/)[1]];

      if (!question) {
        return callback(new Error("Question ".concat(expr.column, " not found")));
      }

      alternate = expr.column.match(/^data:(.+):(.+)$/)[2];
      answer = data[question._id] || {}; // Set if true

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
    }
  }, {
    key: "setAnswer",
    value: function setAnswer(data, question, answer) {
      var change;
      change = {};
      change[question._id] = answer;
      return _.extend({}, data, change);
    } // Sets a value in data

  }, {
    key: "setValue",
    value: function setValue(data, question, value) {
      var answer;
      answer = data[question._id] || {};
      answer.value = value;
      return this.setAnswer(data, question, answer);
    }
  }, {
    key: "updateScalar",
    value: function updateScalar(data, expr, value, callback) {
      var _this2 = this;

      var exprCompiler, query, question, ref, selectExpr;
      question = this.formItems[expr.joins[0].match(/^data:([^:]+):value$/)[1]];

      if (!question) {
        return callback(new Error("Question ".concat(expr.joins[0], " not found")));
      } // If null, remove


      if (value == null) {
        return callback(null, this.setValue(data, question, null));
      } // Shortcut for site question where we have code already


      if (question._type === "SiteQuestion" && expr.expr.column === "code") {
        return callback(null, this.setValue(data, question, {
          code: value
        }));
      } // Create query to get _id or code, depending on question type


      exprCompiler = new ExprCompiler(this.schema);

      if (question._type === "SiteQuestion") {
        // Site questions store code
        selectExpr = {
          type: "field",
          tableAlias: "main",
          column: "code"
        };
      } else if ((ref = question._type) === "EntityQuestion" || ref === "AdminRegionQuestion") {
        // Entity question store id
        selectExpr = {
          type: "field",
          tableAlias: "main",
          column: "_id"
        };
      } else {
        throw new Error("Unsupported type ".concat(question._type));
      } // Query matches to the expression, limiting to 2 as we want exactly one match


      query = {
        type: "query",
        selects: [{
          type: "select",
          expr: selectExpr,
          alias: "value"
        }],
        from: {
          type: "table",
          table: expr.expr.table,
          alias: "main"
        },
        where: {
          type: "op",
          op: "=",
          exprs: [exprCompiler.compileExpr({
            expr: expr.expr,
            tableAlias: "main"
          }), value]
        },
        limit: 2
      }; // Perform query

      return this.dataSource.performQuery(query, function (error, rows) {
        var ref1;

        if (error) {
          return callback(error);
        } // Only one result


        if (rows.length === 0) {
          return callback(new Error("Value ".concat(value, " not found")));
        }

        if (rows.length > 1) {
          return callback(new Error("Value ".concat(value, " has multiple matches")));
        } // Set value


        if (question._type === "SiteQuestion") {
          return callback(null, _this2.setValue(data, question, {
            code: rows[0].value
          }));
        } else if ((ref1 = question._type) === "EntityQuestion" || ref1 === "AdminRegionQuestion") {
          return callback(null, _this2.setValue(data, question, rows[0].value));
        } else {
          throw new Error("Unsupported type ".concat(question._type));
        }
      });
    }
  }]);
  return ResponseDataExprValueUpdater;
}();