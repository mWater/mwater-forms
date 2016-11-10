var _, compileCondition;

_ = require('lodash');

exports.compileCondition = compileCondition = (function(_this) {
  return function(cond) {
    var getAlternate, getValue;
    getValue = function(data) {
      var answer;
      answer = data[cond.lhs.question] || {};
      return answer.value;
    };
    getAlternate = function(data) {
      var answer;
      answer = data[cond.lhs.question] || {};
      return answer.alternate;
    };
    switch (cond.op) {
      case "present":
        return function(data) {
          var key, present, v, value;
          value = getValue(data);
          present = (value != null) && value !== '' && !(value instanceof Array && value.length === 0);
          if (!present) {
            return false;
          } else {
            if (value instanceof Object) {
              for (key in value) {
                v = value[key];
                if (v != null) {
                  return true;
                }
              }
              return false;
            } else {
              return true;
            }
          }
        };
      case "!present":
        return function(data) {
          var key, notPresent, v, value;
          value = getValue(data);
          notPresent = (value == null) || value === '' || (value instanceof Array && value.length === 0);
          if (notPresent) {
            return true;
          } else {
            if (value instanceof Object) {
              for (key in value) {
                v = value[key];
                if (v != null) {
                  return false;
                }
              }
              return true;
            } else {
              return false;
            }
          }
        };
      case "contains":
        return function(data) {
          return (getValue(data) || "").indexOf(cond.rhs.literal) !== -1;
        };
      case "!contains":
        return function(data) {
          return (getValue(data) || "").indexOf(cond.rhs.literal) === -1;
        };
      case "=":
        return function(data) {
          return getValue(data) === cond.rhs.literal;
        };
      case ">":
      case "after":
        return function(data) {
          return getValue(data) > cond.rhs.literal;
        };
      case "<":
      case "before":
        return function(data) {
          return getValue(data) < cond.rhs.literal;
        };
      case "!=":
        return function(data) {
          return getValue(data) !== cond.rhs.literal;
        };
      case "includes":
        return function(data) {
          return _.contains(getValue(data) || [], cond.rhs.literal) || cond.rhs.literal === getAlternate(data);
        };
      case "!includes":
        return function(data) {
          return !_.contains(getValue(data) || [], cond.rhs.literal) && cond.rhs.literal !== getAlternate(data);
        };
      case "is":
        return function(data) {
          return getValue(data) === cond.rhs.literal || getAlternate(data) === cond.rhs.literal;
        };
      case "isnt":
        return function(data) {
          return getValue(data) !== cond.rhs.literal && getAlternate(data) !== cond.rhs.literal;
        };
      case "isoneof":
        return function(data) {
          var value;
          value = getValue(data);
          if (_.isArray(value)) {
            return _.intersection(cond.rhs.literal, value).length > 0 || _.contains(cond.rhs.literal, getAlternate(data));
          } else {
            return _.contains(cond.rhs.literal, value) || _.contains(cond.rhs.literal, getAlternate(data));
          }
        };
      case "isntoneof":
        return function(data) {
          var value;
          value = getValue(data);
          if (_.isArray(value)) {
            return _.intersection(cond.rhs.literal, value).length === 0 && !_.contains(cond.rhs.literal, getAlternate(data));
          } else {
            return !_.contains(cond.rhs.literal, value) && !_.contains(cond.rhs.literal, getAlternate(data));
          }
        };
      case "true":
        return function(data) {
          return getValue(data) === true;
        };
      case "false":
        return function(data) {
          return getValue(data) !== true;
        };
      default:
        throw new Error("Unknown condition op " + cond.op);
    }
  };
})(this);

exports.compileConditions = (function(_this) {
  return function(conds) {
    var compConds;
    compConds = _.map(conds, _this.compileCondition);
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
  };
})(this);
