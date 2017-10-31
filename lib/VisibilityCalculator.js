var ExprEvaluator, VisibilityCalculator, async, conditionUtils, formUtils;

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

module.exports = VisibilityCalculator = (function() {
  function VisibilityCalculator(formDesign) {
    this.formDesign = formDesign;
  }

  VisibilityCalculator.prototype.createVisibilityStructure = function(data, responseRow, callback) {
    var visibilityStructure;
    visibilityStructure = {};
    return this.processItem(this.formDesign, false, data, responseRow, visibilityStructure, "", (function(_this) {
      return function(error) {
        if (error) {
          return callback(error);
        } else {
          return callback(null, visibilityStructure);
        }
      };
    })(this));
  };

  VisibilityCalculator.prototype.processGroup = function(item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback) {
    var applyResult, conditions, isVisible;
    applyResult = (function(_this) {
      return function(isVisible) {
        if (item._id) {
          visibilityStructure[prefix + item._id] = isVisible;
        }
        return async.each(item.contents, function(subitem, cb) {
          return _this.processItem(subitem, isVisible === false, data, responseRow, visibilityStructure, prefix, cb);
        }, callback);
      };
    })(this);
    if (forceToInvisible) {
      isVisible = false;
    } else if ((item.conditions != null) && item.conditions.length > 0) {
      conditions = conditionUtils.compileConditions(item.conditions, this.formDesign);
      isVisible = conditions(data);
    } else {
      isVisible = true;
    }
    if (item.conditionExpr) {
      return new ExprEvaluator().evaluate(item.conditionExpr, {
        row: responseRow
      }, (function(_this) {
        return function(error, value) {
          if (error) {
            return callback(error);
          }
          if (!value) {
            isVisible = false;
          }
          return applyResult(isVisible);
        };
      })(this));
    } else {
      return applyResult(isVisible);
    }
  };

  VisibilityCalculator.prototype.processItem = function(item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback) {
    var ref;
    if (formUtils.isQuestion(item)) {
      return this.processQuestion(item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback);
    } else if (item._type === 'TextColumn') {
      return this.processQuestion(item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback);
    } else if (item._type === "Instructions") {
      return this.processQuestion(item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback);
    } else if (item._type === "Timer") {
      return this.processQuestion(item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback);
    } else if (item._type === "RosterGroup" || item._type === "RosterMatrix") {
      return this.processRoster(item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback);
    } else if ((ref = item._type) === 'Section' || ref === "Group" || ref === "Form") {
      return this.processGroup(item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback);
    } else {
      return callback(new Error('Unknow item type'));
    }
  };

  VisibilityCalculator.prototype.processQuestion = function(question, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback) {
    var applyResult, conditions, isVisible, ref;
    applyResult = (function(_this) {
      return function(isVisible) {
        visibilityStructure[prefix + question._id] = isVisible;
        if (question._type === 'MatrixQuestion') {
          return async.each(question.items, function(item, cb) {
            return async.each(question.columns, function(column, cb2) {
              var newPrefix;
              newPrefix = question._id + "." + item.id + ".";
              return _this.processItem(column, isVisible === false, data, responseRow, visibilityStructure, newPrefix, cb2);
            }, cb);
          }, callback);
        } else {
          return callback(null);
        }
      };
    })(this);
    if (forceToInvisible) {
      isVisible = false;
    } else if ((question.conditions != null) && question.conditions.length > 0) {
      conditions = conditionUtils.compileConditions(question.conditions, this.formDesign);
      isVisible = conditions(data);
    } else {
      isVisible = true;
    }
    if ((question.randomAskProbability != null) && ((ref = data[question._id]) != null ? ref.randomAsked : void 0) === false) {
      isVisible = false;
    }
    if (question.conditionExpr) {
      return new ExprEvaluator().evaluate(question.conditionExpr, {
        row: responseRow
      }, (function(_this) {
        return function(error, value) {
          if (error) {
            return callback(error);
          }
          if (!value) {
            isVisible = false;
          }
          return applyResult(isVisible);
        };
      })(this));
    } else {
      return applyResult(isVisible);
    }
  };

  VisibilityCalculator.prototype.processRoster = function(rosterGroup, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback) {
    var applyResult, conditions, isVisible;
    if (rosterGroup._type !== 'RosterGroup' && rosterGroup._type !== 'RosterMatrix') {
      throw new Error('Should be a RosterGroup or RosterMatrix');
    }
    applyResult = (function(_this) {
      return function(isVisible) {
        var dataId, subData;
        visibilityStructure[rosterGroup._id] = isVisible;
        if (rosterGroup.rosterId != null) {
          dataId = rosterGroup.rosterId;
        } else {
          dataId = rosterGroup._id;
        }
        subData = data[dataId];
        if (subData != null) {
          return responseRow.getField("data:" + dataId, function(error, rosterRows) {
            if (error) {
              return callback(error);
            }
            return async.forEachOf(subData, function(entry, index, cb) {
              return async.each(rosterGroup.contents, function(item, cb2) {
                var newPrefix;
                newPrefix = dataId + "." + index + ".";
                return _this.processItem(item, isVisible === false, entry.data, rosterRows[index], visibilityStructure, newPrefix, cb2);
              }, cb);
            }, callback);
          });
        } else {
          return callback(null);
        }
      };
    })(this);
    if (forceToInvisible) {
      isVisible = false;
    } else if ((rosterGroup.conditions != null) && rosterGroup.conditions.length > 0) {
      conditions = conditionUtils.compileConditions(rosterGroup.conditions, this.formDesign);
      isVisible = conditions(data);
    } else {
      isVisible = true;
    }
    if (rosterGroup.conditionExpr) {
      return new ExprEvaluator().evaluate(rosterGroup.conditionExpr, {
        row: responseRow
      }, (function(_this) {
        return function(error, value) {
          if (error) {
            return callback(error);
          }
          if (!value) {
            isVisible = false;
          }
          return applyResult(isVisible);
        };
      })(this));
    } else {
      return applyResult(isVisible);
    }
  };

  return VisibilityCalculator;

})();
