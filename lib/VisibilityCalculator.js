'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ExprEvaluator, VisibilityCalculator, _, async, conditionUtils, formUtils;

_ = require('lodash');

formUtils = require('./formUtils');

async = require('async');

conditionUtils = require('./conditionUtils');

ExprEvaluator = require('mwater-expressions').ExprEvaluator;

/*

Uses conditions to defines the visibility status of all the Sections, Questions, Instructions, Group, RosterGroup and RosterMatrix
The result is kept in the visibilityStructure. It contains an entry with true or false for each element (should never be null or undefined)
A parent (like a section or a group), will always force visible to false for all their children if they are invisible.
The usage is fairly simple. It's created with a form and then the visibilityStructure is recalculated with specify data each time it changes.

Visibility is based both on simple conditions (see conditionUtils), but also on conditionExpr (advanced conditions made of mwater-expressions) 
which need access to the entities which the questions may reference.

Non-rosters are just referenced by id: e.g. { "somequestionid": true }

Unless it is a matrix, in which case it is referenced by "questionid.itemid.columnid"

Rosters are referenced by entry index: e.g. { "somerosterid.2.somequestionid": true }

*/
module.exports = VisibilityCalculator = function () {
  function VisibilityCalculator(formDesign) {
    (0, _classCallCheck3.default)(this, VisibilityCalculator);

    this.formDesign = formDesign;
  }

  // Updates the visibilityStructure dictionary with one entry for each element
  // data is the data of the response
  // responseRow is a ResponseRow which represents the same row


  (0, _createClass3.default)(VisibilityCalculator, [{
    key: 'createVisibilityStructure',
    value: function createVisibilityStructure(data, responseRow, callback) {
      var visibilityStructure;
      visibilityStructure = {};
      return this.processItem(this.formDesign, false, data, responseRow, visibilityStructure, "", function (error) {
        if (error) {
          return callback(error);
        } else {
          return callback(null, visibilityStructure);
        }
      });
    }

    // Process a form, section or a group (they both behave the same way when it comes to determining visibility)

  }, {
    key: 'processGroup',
    value: function processGroup(item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback) {
      var _this = this;

      var applyResult, conditions, isVisible;
      // Once visibility is calculated, call this
      applyResult = function applyResult(isVisible) {
        // Forms don't have an _id at design level
        if (item._id) {
          visibilityStructure[prefix + item._id] = isVisible;
        }
        return async.each(item.contents, function (subitem, cb) {
          return _this.processItem(subitem, isVisible === false, data, responseRow, visibilityStructure, prefix, function () {
            return _.defer(cb);
          });
        }, callback);
      };
      // Always visible if no condition has been set
      if (forceToInvisible) {
        isVisible = false;
      } else if (item.conditions != null && item.conditions.length > 0) {
        conditions = conditionUtils.compileConditions(item.conditions, this.formDesign);
        isVisible = conditions(data);
      } else {
        isVisible = true;
      }
      // Apply conditionExpr
      if (item.conditionExpr) {
        return new ExprEvaluator().evaluate(item.conditionExpr, {
          row: responseRow
        }, function (error, value) {
          if (error) {
            return callback(error);
          }
          // Null or false is not visible
          if (!value) {
            isVisible = false;
          }
          return applyResult(isVisible);
        });
      } else {
        return applyResult(isVisible);
      }
    }

    // If the parent is invisible, forceToInvisible is set to true and the item will be invisible no matter what
    // The prefix contains the info set by a RosterGroup or a RosterMatrix

  }, {
    key: 'processItem',
    value: function processItem(item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback) {
      var ref;
      if (formUtils.isQuestion(item)) {
        return this.processQuestion(item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback);
      } else if (item._type === 'TextColumn') {
        return this.processQuestion(item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback);
      } else if (item._type === "Instructions") {
        // Behaves like a question
        return this.processQuestion(item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback);
      } else if (item._type === "Timer") {
        // Behaves like a question
        return this.processQuestion(item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback);
      } else if (item._type === "RosterGroup" || item._type === "RosterMatrix") {
        return this.processRoster(item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback);
      } else if ((ref = item._type) === 'Section' || ref === "Group" || ref === "Form") {
        return this.processGroup(item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback);
      } else {
        return callback(new Error('Unknow item type'));
      }
    }

    // Sets visible to false if forceToInvisible is true or the conditions and data make the question invisible
    // The prefix contains the info set by a RosterGroup or a RosterMatrix

  }, {
    key: 'processQuestion',
    value: function processQuestion(question, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback) {
      var _this2 = this;

      var applyResult, conditions, isVisible, ref;
      // Once visibility is calculated, call this
      applyResult = function applyResult(isVisible) {
        visibilityStructure[prefix + question._id] = isVisible;
        if (question._type === 'MatrixQuestion') {
          return async.each(question.items, function (item, cb) {
            return async.each(question.columns, function (column, cb2) {
              var newPrefix;
              newPrefix = question._id + '.' + item.id + '.';
              return _this2.processItem(column, isVisible === false, data, responseRow, visibilityStructure, newPrefix, function () {
                return _.defer(cb2);
              });
            }, cb);
          }, callback);
        } else {
          return callback(null);
        }
      };
      if (forceToInvisible) {
        isVisible = false;
      } else if (question.conditions != null && question.conditions.length > 0) {
        conditions = conditionUtils.compileConditions(question.conditions, this.formDesign);
        isVisible = conditions(data);
      } else {
        isVisible = true;
      }
      // Apply randomAsk
      if (question.randomAskProbability != null && ((ref = data[question._id]) != null ? ref.randomAsked : void 0) === false) {
        isVisible = false;
      }
      // Apply conditionExpr
      if (question.conditionExpr) {
        return new ExprEvaluator().evaluate(question.conditionExpr, {
          row: responseRow
        }, function (error, value) {
          if (error) {
            return callback(error);
          }
          // Null or false is not visible
          if (!value) {
            isVisible = false;
          }
          return applyResult(isVisible);
        });
      } else {
        return applyResult(isVisible);
      }
    }

    // Handles RosterGroup and RosterMatrix
    // The visibility of the Rosters are similar to questions, the extra logic is for handling the children
    // The logic is a bit more tricky when a rosterId is set. It uses that other roster data for calculating the visibility of its children.

  }, {
    key: 'processRoster',
    value: function processRoster(rosterGroup, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback) {
      var _this3 = this;

      var applyResult, conditions, isVisible;
      if (rosterGroup._type !== 'RosterGroup' && rosterGroup._type !== 'RosterMatrix') {
        throw new Error('Should be a RosterGroup or RosterMatrix');
      }
      applyResult = function applyResult(isVisible) {
        var dataId, subData;
        visibilityStructure[rosterGroup._id] = isVisible;
        // The data used (and passed down to sub items) is the one specified by rosterId if set
        if (rosterGroup.rosterId != null) {
          dataId = rosterGroup.rosterId;
        } else {
          // Else the RosterGroup uses its own data
          dataId = rosterGroup._id;
        }
        subData = data[dataId];
        if (subData != null) {
          // Get subrows
          return responseRow.getField('data:' + dataId, function (error, rosterRows) {
            if (error) {
              return callback(error);
            }
            // For each entry of roster
            return async.forEachOf(subData, function (entry, index, cb) {
              return async.each(rosterGroup.contents, function (item, cb2) {
                var newPrefix;
                newPrefix = dataId + '.' + index + '.';
                // Data is actually stored in .data subfield
                return _this3.processItem(item, isVisible === false, entry.data, rosterRows[index], visibilityStructure, newPrefix, cb2);
              }, cb);
            }, callback);
          });
        } else {
          return callback(null);
        }
      };
      if (forceToInvisible) {
        isVisible = false;
      } else if (rosterGroup.conditions != null && rosterGroup.conditions.length > 0) {
        conditions = conditionUtils.compileConditions(rosterGroup.conditions, this.formDesign);
        isVisible = conditions(data);
      } else {
        isVisible = true;
      }
      // Apply conditionExpr
      if (rosterGroup.conditionExpr) {
        return new ExprEvaluator().evaluate(rosterGroup.conditionExpr, {
          row: responseRow
        }, function (error, value) {
          if (error) {
            return callback(error);
          }
          // Null or false is not visible
          if (!value) {
            isVisible = false;
          }
          return applyResult(isVisible);
        });
      } else {
        return applyResult(isVisible);
      }
    }
  }]);
  return VisibilityCalculator;
}();