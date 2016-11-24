var VisibilityCalculator, async, conditionUtils, formUtils;

formUtils = require('./formUtils');

async = require('async');

conditionUtils = require('./conditionUtils');

module.exports = VisibilityCalculator = (function() {
  function VisibilityCalculator(formDesign) {
    this.formDesign = formDesign;
  }

  VisibilityCalculator.prototype.createVisibilityStructure = function(data, callback) {
    var visibilityStructure;
    visibilityStructure = {};
    return this.processItem(this.formDesign, false, data, visibilityStructure, "", (function(_this) {
      return function(error) {
        if (error) {
          return callback(error);
        } else {
          return callback(null, visibilityStructure);
        }
      };
    })(this));
  };

  VisibilityCalculator.prototype.processGroup = function(item, forceToInvisible, data, visibilityStructure, prefix, callback) {
    var conditions, isVisible;
    if (forceToInvisible) {
      isVisible = false;
    } else if ((item.conditions != null) && item.conditions.length > 0) {
      conditions = conditionUtils.compileConditions(item.conditions, this.formDesign);
      isVisible = conditions(data);
    } else {
      isVisible = true;
    }
    if (item._id) {
      visibilityStructure[prefix + item._id] = isVisible;
    }
    return async.each(item.contents, (function(_this) {
      return function(subitem, cb) {
        return _this.processItem(subitem, isVisible === false, data, visibilityStructure, prefix, cb);
      };
    })(this), callback);
  };

  VisibilityCalculator.prototype.processItem = function(item, forceToInvisible, data, visibilityStructure, prefix, callback) {
    var ref;
    if (formUtils.isQuestion(item)) {
      return this.processQuestion(item, forceToInvisible, data, visibilityStructure, prefix, callback);
    } else if (item._type === 'TextColumn') {
      return this.processQuestion(item, forceToInvisible, data, visibilityStructure, prefix, callback);
    } else if (item._type === "Instructions") {
      return this.processInstruction(item, forceToInvisible, data, visibilityStructure, prefix, callback);
    } else if (item._type === "Timer") {
      return this.processTimer(item, forceToInvisible, data, visibilityStructure, prefix, callback);
    } else if (item._type === "RosterGroup" || item._type === "RosterMatrix") {
      return this.processRoster(item, forceToInvisible, data, visibilityStructure, prefix, callback);
    } else if ((ref = item._type) === 'Section' || ref === "Group" || ref === "Form") {
      return this.processGroup(item, forceToInvisible, data, visibilityStructure, prefix, callback);
    } else {
      return callback(new Error('Unknow item type'));
    }
  };

  VisibilityCalculator.prototype.processQuestion = function(question, forceToInvisible, data, visibilityStructure, prefix, callback) {
    var conditions, isVisible;
    if (forceToInvisible) {
      isVisible = false;
    } else if ((question.conditions != null) && question.conditions.length > 0) {
      conditions = conditionUtils.compileConditions(question.conditions, this.formDesign);
      isVisible = conditions(data);
    } else {
      isVisible = true;
    }
    visibilityStructure[prefix + question._id] = isVisible;
    if (question._type === 'MatrixQuestion') {
      return async.each(question.items, (function(_this) {
        return function(item, cb) {
          return async.each(question.columns, function(column, cb2) {
            var newPrefix;
            newPrefix = question._id + "." + item.id + ".";
            return _this.processItem(column, isVisible === false, data, visibilityStructure, newPrefix, cb2);
          }, cb);
        };
      })(this), callback);
    } else {
      return callback(null);
    }
  };

  VisibilityCalculator.prototype.processInstruction = function(instruction, forceToInvisible, data, visibilityStructure, prefix, callback) {
    return this.processQuestion(item, forceToInvisible, data, visibilityStructure, prefix, callback);
  };

  VisibilityCalculator.prototype.processTimer = function(instruction, forceToInvisible, data, visibilityStructure, prefix, callback) {
    return this.processQuestion(item, forceToInvisible, data, visibilityStructure, prefix, callback);
  };

  VisibilityCalculator.prototype.processRoster = function(rosterGroup, forceToInvisible, data, visibilityStructure, prefix, callback) {
    var conditions, dataId, isVisible, subData;
    if (rosterGroup._type !== 'RosterGroup' && rosterGroup._type !== 'RosterMatrix') {
      throw new Error('Should be a RosterGroup or RosterMatrix');
    }
    if (forceToInvisible) {
      isVisible = false;
    } else if ((rosterGroup.conditions != null) && rosterGroup.conditions.length > 0) {
      conditions = conditionUtils.compileConditions(rosterGroup.conditions, this.formDesign);
      isVisible = conditions(data);
    } else {
      isVisible = true;
    }
    visibilityStructure[rosterGroup._id] = isVisible;
    if (rosterGroup.rosterId != null) {
      dataId = rosterGroup.rosterId;
    } else {
      dataId = rosterGroup._id;
    }
    subData = data[dataId];
    if (subData != null) {
      return async.forEachOf(subData, (function(_this) {
        return function(entry, index, cb) {
          return async.each(rosterGroup.contents, function(item, cb2) {
            var newPrefix;
            newPrefix = dataId + "." + index + ".";
            return _this.processItem(item, isVisible === false, entry.data, visibilityStructure, newPrefix, cb2);
          }, cb);
        };
      })(this), callback);
    } else {
      return callback(null);
    }
  };

  return VisibilityCalculator;

})();
