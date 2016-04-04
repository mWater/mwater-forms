var VisibilityEntity, conditionUtils, formUtils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

conditionUtils = require('./conditionUtils');

formUtils = require('./formUtils');

module.exports = VisibilityEntity = (function() {
  function VisibilityEntity(form) {
    this.compileConditions = bind(this.compileConditions, this);
    this.compileCondition = bind(this.compileCondition, this);
    this.form = form;
  }

  VisibilityEntity.prototype.createVisibilityStructure = function(data) {
    this.data = data;
    this.visibilityStructure = {};
    this.parseForm();
    return this.visibilityStructure;
  };

  VisibilityEntity.prototype.parseForm = function() {
    var content, i, j, len, len1, ref, ref1, results, results1;
    if (this.form._type !== 'Form') {
      throw new Error('Should be a form');
    }
    if (this.form.contents[0] && this.form.contents[0]._type === "Section") {
      ref = this.form.contents;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        content = ref[i];
        results.push(this.parseSection(content));
      }
      return results;
    } else {
      ref1 = this.form.contents;
      results1 = [];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        content = ref1[j];
        results1.push(this.parseItem(content));
      }
      return results1;
    }
  };

  VisibilityEntity.prototype.parseSection = function(section) {
    var content, i, len, ref, results;
    if (section._type !== 'Section') {
      throw new Error('Should be a section');
    }
    if ((section.conditions != null) && section.conditions.length > 0) {
      compileConditions(section.conditions, forms);
      this.visibilityStructure[section._id] = conditions();
    } else {
      this.visibilityStructure[section._id] = true;
    }
    ref = section.contents;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      content = ref[i];
      results.push(this.parseItem(content));
    }
    return results;
  };

  VisibilityEntity.prototype.parseItem = function(item) {
    if (formUtils.isQuestion(item)) {
      return this.parseQuestion(item);
    } else if (this.props.item._type === "Instructions") {
      return this.parseInstruction(item);
    } else if (this.props.item._type === "RosterGroup") {
      return this.parseRosterGroup(item);
    } else if (this.props.item._type === "RosterMatrix") {
      return this.parseRosterMatrix(item);
    } else {
      throw new Error('Unknow item type');
    }
  };

  VisibilityEntity.prototype.parseQuestion = function(question) {
    var conditions;
    if ((question.conditions != null) && question.conditions.length > 0) {
      conditions = this.compileConditions(question.conditions, this.form);
      return this.visibilityStructure[question._id] = conditions();
    } else {
      return this.visibilityStructure[question._id] = true;
    }
  };

  VisibilityEntity.prototype.parseInstruction = function(instruction) {
    return this.parseQuestion(instruction);
  };

  VisibilityEntity.prototype.parseRosterGroup = function(question) {
    return null;
  };

  VisibilityEntity.prototype.parseRosterMatrix = function(question) {
    return null;
  };

  VisibilityEntity.prototype.getQuestionData = function(questionId) {
    return this.data[questionId];
  };

  VisibilityEntity.prototype.compileCondition = function(cond) {
    var getAlternate, getValue;
    getValue = (function(_this) {
      return function() {
        var answer;
        answer = _this.getQuestionData(cond.lhs.question) || {};
        return answer.value;
      };
    })(this);
    getAlternate = (function(_this) {
      return function() {
        var answer;
        answer = _this.getQuestion(cond.lhs.question) || {};
        return answer.alternate;
      };
    })(this);
    switch (cond.op) {
      case "present":
        return (function(_this) {
          return function() {
            var value;
            value = getValue();
            return !(!value) && !(value instanceof Array && value.length === 0);
          };
        })(this);
      case "!present":
        return (function(_this) {
          return function() {
            var value;
            value = getValue();
            return (!value) || (value instanceof Array && value.length === 0);
          };
        })(this);
      case "contains":
        return (function(_this) {
          return function() {
            return (getValue() || "").indexOf(cond.rhs.literal) !== -1;
          };
        })(this);
      case "!contains":
        return (function(_this) {
          return function() {
            return (getValue() || "").indexOf(cond.rhs.literal) === -1;
          };
        })(this);
      case "=":
        return (function(_this) {
          return function() {
            return getValue() === cond.rhs.literal;
          };
        })(this);
      case ">":
      case "after":
        return (function(_this) {
          return function() {
            return getValue() > cond.rhs.literal;
          };
        })(this);
      case "<":
      case "before":
        return (function(_this) {
          return function() {
            return getValue() < cond.rhs.literal;
          };
        })(this);
      case "!=":
        return (function(_this) {
          return function() {
            return getValue() !== cond.rhs.literal;
          };
        })(this);
      case "includes":
        return (function(_this) {
          return function() {
            return _.contains(getValue() || [], cond.rhs.literal) || cond.rhs.literal === getAlternate();
          };
        })(this);
      case "!includes":
        return (function(_this) {
          return function() {
            return !_.contains(getValue() || [], cond.rhs.literal) && cond.rhs.literal !== getAlternate();
          };
        })(this);
      case "is":
        return (function(_this) {
          return function() {
            return getValue() === cond.rhs.literal || getAlternate() === cond.rhs.literal;
          };
        })(this);
      case "isnt":
        return (function(_this) {
          return function() {
            return getValue() !== cond.rhs.literal && getAlternate() !== cond.rhs.literal;
          };
        })(this);
      case "isoneof":
        return (function(_this) {
          return function() {
            var value;
            value = getValue();
            if (_.isArray(value)) {
              return _.intersection(cond.rhs.literal, value).length > 0 || _.contains(cond.rhs.literal, getAlternate());
            } else {
              return _.contains(cond.rhs.literal, value) || _.contains(cond.rhs.literal, getAlternate());
            }
          };
        })(this);
      case "isntoneof":
        return (function(_this) {
          return function() {
            var value;
            value = getValue();
            if (_.isArray(value)) {
              return _.intersection(cond.rhs.literal, value).length === 0 && !_.contains(cond.rhs.literal, getAlternate());
            } else {
              return !_.contains(cond.rhs.literal, value) && !_.contains(cond.rhs.literal, getAlternate());
            }
          };
        })(this);
      case "true":
        return (function(_this) {
          return function() {
            return getValue() === true;
          };
        })(this);
      case "false":
        return (function(_this) {
          return function() {
            return getValue() !== true;
          };
        })(this);
      default:
        throw new Error("Unknown condition op " + cond.op);
    }
  };

  VisibilityEntity.prototype.compileConditions = function(conds, form) {
    var compConds;
    if (form != null) {
      conds = _.filter(conds, function(cond) {
        return conditionUtils.validateCondition(cond, form);
      });
    }
    compConds = _.map(conds, this.compileCondition);
    return (function(_this) {
      return function() {
        var compCond, i, len;
        for (i = 0, len = compConds.length; i < len; i++) {
          compCond = compConds[i];
          if (!compCond()) {
            return false;
          }
        }
        return true;
      };
    })(this);
  };

  return VisibilityEntity;

})();
