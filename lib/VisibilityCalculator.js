var VisibilityCalculator, formUtils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

formUtils = require('./formUtils');

module.exports = VisibilityCalculator = (function() {
  function VisibilityCalculator(formDesign) {
    this.compileConditions = bind(this.compileConditions, this);
    this.compileCondition = bind(this.compileCondition, this);
    this.formDesign = formDesign;
    this.visibilityStructure = {};
  }

  VisibilityCalculator.prototype.createVisibilityStructure = function(data) {
    this.visibilityStructure = {};
    this.processForm(data);
    return this.visibilityStructure;
  };

  VisibilityCalculator.prototype.processForm = function(data) {
    var content, i, j, len, len1, ref, ref1, results, results1;
    if (this.formDesign._type !== 'Form') {
      throw new Error('Should be a form');
    }
    if (this.formDesign.contents[0] && this.formDesign.contents[0]._type === "Section") {
      ref = this.formDesign.contents;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        content = ref[i];
        results.push(this.processGroupOrSection(content, data));
      }
      return results;
    } else {
      ref1 = this.formDesign.contents;
      results1 = [];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        content = ref1[j];
        results1.push(this.processItem(content, false, data, ''));
      }
      return results1;
    }
  };

  VisibilityCalculator.prototype.processGroupOrSection = function(groupOrSection, data) {
    var conditions, content, i, isVisible, len, ref, results;
    if (groupOrSection._type !== 'Section' && groupOrSection._type !== 'Group') {
      throw new Error('Should be a section or a group');
    }
    if ((groupOrSection.conditions != null) && groupOrSection.conditions.length > 0) {
      conditions = this.compileConditions(groupOrSection.conditions, this.formDesign);
      isVisible = conditions(data);
    } else {
      isVisible = true;
    }
    this.visibilityStructure[groupOrSection._id] = isVisible;
    ref = groupOrSection.contents;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      content = ref[i];
      results.push(this.processItem(content, isVisible === false, data, ''));
    }
    return results;
  };

  VisibilityCalculator.prototype.processItem = function(item, forceToInvisible, data, prefix) {
    if (formUtils.isQuestion(item)) {
      return this.processQuestion(item, forceToInvisible, data, prefix);
    } else if (item._type === "Instructions") {
      return this.processInstruction(item, forceToInvisible, data, prefix);
    } else if (item._type === "RosterGroup" || item._type === "RosterMatrix") {
      return this.processRoster(item, forceToInvisible, data, prefix);
    } else if (item._type === "Group") {
      return this.processGroupOrSection(item, forceToInvisible, data);
    } else {
      throw new Error('Unknow item type');
    }
  };

  VisibilityCalculator.prototype.processQuestion = function(question, forceToInvisible, data, prefix) {
    var conditions, isVisible;
    if (forceToInvisible) {
      isVisible = false;
    } else if ((question.conditions != null) && question.conditions.length > 0) {
      conditions = this.compileConditions(question.conditions, this.formDesign);
      isVisible = conditions(data);
    } else {
      isVisible = true;
    }
    return this.visibilityStructure[prefix + question._id] = isVisible;
  };

  VisibilityCalculator.prototype.processInstruction = function(instruction, forceToInvisible, data, prefix) {
    return this.processQuestion(instruction, forceToInvisible, data, prefix);
  };

  VisibilityCalculator.prototype.processRoster = function(rosterGroup, forceToInvisible, data, prefix) {
    var conditions, content, dataId, i, index, isVisible, len, newPrefix, results, rosterGroupData, subData;
    if (rosterGroup._type !== 'RosterGroup' && rosterGroup._type !== 'RosterMatrix') {
      throw new Error('Should be a RosterGroup or RosterMatrix');
    }
    if (forceToInvisible) {
      isVisible = false;
    } else if ((rosterGroup.conditions != null) && rosterGroup.conditions.length > 0) {
      conditions = this.compileConditions(rosterGroup.conditions, this.formDesign);
      isVisible = conditions(data);
    } else {
      isVisible = true;
    }
    this.visibilityStructure[rosterGroup._id] = isVisible;
    if (rosterGroup.rosterId != null) {
      dataId = rosterGroup.rosterId;
    } else {
      dataId = rosterGroup._id;
    }
    subData = data[dataId];
    if (subData != null) {
      results = [];
      for (index = i = 0, len = subData.length; i < len; index = ++i) {
        rosterGroupData = subData[index];
        results.push((function() {
          var j, len1, ref, results1;
          ref = rosterGroup.contents;
          results1 = [];
          for (j = 0, len1 = ref.length; j < len1; j++) {
            content = ref[j];
            newPrefix = dataId + "." + index + ".";
            results1.push(this.processItem(content, isVisible === false, rosterGroupData, newPrefix));
          }
          return results1;
        }).call(this));
      }
      return results;
    }
  };

  VisibilityCalculator.prototype.compileCondition = function(cond) {
    var getAlternate, getValue;
    getValue = (function(_this) {
      return function(data) {
        var answer;
        answer = data[cond.lhs.question] || {};
        return answer.value;
      };
    })(this);
    getAlternate = (function(_this) {
      return function(data) {
        var answer;
        answer = data[cond.lhs.question] || {};
        return answer.alternate;
      };
    })(this);
    switch (cond.op) {
      case "present":
        return (function(_this) {
          return function(data) {
            var value;
            value = getValue(data);
            return !(!value) && !(value instanceof Array && value.length === 0);
          };
        })(this);
      case "!present":
        return (function(_this) {
          return function(data) {
            var value;
            value = getValue(data);
            return (!value) || (value instanceof Array && value.length === 0);
          };
        })(this);
      case "contains":
        return (function(_this) {
          return function(data) {
            return (getValue(data) || "").indexOf(cond.rhs.literal) !== -1;
          };
        })(this);
      case "!contains":
        return (function(_this) {
          return function(data) {
            return (getValue(data) || "").indexOf(cond.rhs.literal) === -1;
          };
        })(this);
      case "=":
        return (function(_this) {
          return function(data) {
            return getValue(data) === cond.rhs.literal;
          };
        })(this);
      case ">":
      case "after":
        return (function(_this) {
          return function(data) {
            return getValue(data) > cond.rhs.literal;
          };
        })(this);
      case "<":
      case "before":
        return (function(_this) {
          return function(data) {
            return getValue(data) < cond.rhs.literal;
          };
        })(this);
      case "!=":
        return (function(_this) {
          return function(data) {
            return getValue(data) !== cond.rhs.literal;
          };
        })(this);
      case "includes":
        return (function(_this) {
          return function(data) {
            return _.contains(getValue(data) || [], cond.rhs.literal) || cond.rhs.literal === getAlternate(data);
          };
        })(this);
      case "!includes":
        return (function(_this) {
          return function(data) {
            return !_.contains(getValue(data) || [], cond.rhs.literal) && cond.rhs.literal !== getAlternate(data);
          };
        })(this);
      case "is":
        return (function(_this) {
          return function(data) {
            return getValue(data) === cond.rhs.literal || getAlternate(data) === cond.rhs.literal;
          };
        })(this);
      case "isnt":
        return (function(_this) {
          return function(data) {
            return getValue(data) !== cond.rhs.literal && getAlternate(data) !== cond.rhs.literal;
          };
        })(this);
      case "isoneof":
        return (function(_this) {
          return function(data) {
            var value;
            value = getValue(data);
            if (_.isArray(value)) {
              return _.intersection(cond.rhs.literal, value).length > 0 || _.contains(cond.rhs.literal, getAlternate(data));
            } else {
              return _.contains(cond.rhs.literal, value) || _.contains(cond.rhs.literal, getAlternate(data));
            }
          };
        })(this);
      case "isntoneof":
        return (function(_this) {
          return function(data) {
            var value;
            value = getValue(data);
            if (_.isArray(value)) {
              return _.intersection(cond.rhs.literal, value).length === 0 && !_.contains(cond.rhs.literal, getAlternate(data));
            } else {
              return !_.contains(cond.rhs.literal, value) && !_.contains(cond.rhs.literal, getAlternate(data));
            }
          };
        })(this);
      case "true":
        return (function(_this) {
          return function(data) {
            return getValue(data) === true;
          };
        })(this);
      case "false":
        return (function(_this) {
          return function(data) {
            return getValue(data) !== true;
          };
        })(this);
      default:
        throw new Error("Unknown condition op " + cond.op);
    }
  };

  VisibilityCalculator.prototype.compileConditions = function(conds) {
    var compConds;
    compConds = _.map(conds, this.compileCondition);
    return (function(_this) {
      return function(data) {
        var compCond, i, len;
        for (i = 0, len = compConds.length; i < len; i++) {
          compCond = compConds[i];
          if (!compCond(data)) {
            return false;
          }
        }
        return true;
      };
    })(this);
  };

  return VisibilityCalculator;

})();
