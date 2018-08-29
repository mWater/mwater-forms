'use strict';

var _, allOps, compileCondition, formUtils, getOpDetails;

_ = require('lodash');

formUtils = require('./formUtils');

// Helpful utilities when building conditions
allOps = [{
  id: "present",
  text: "was answered"
}, {
  id: "!present",
  text: "was not answered"
}, {
  id: "contains",
  text: "contains text"
}, {
  id: "!contains",
  text: "does not contain text"
}, {
  id: "=",
  text: "is equal to"
}, {
  id: ">",
  text: "is greater than"
}, {
  id: "<",
  text: "is less than"
}, {
  id: "!=",
  text: "is not equal to"
}, {
  id: "is",
  text: "is"
}, {
  id: "isnt",
  text: "isn't"
}, {
  id: "includes",
  text: "includes"
}, {
  id: "!includes",
  text: "does not include"
}, {
  id: "isoneof",
  text: "is one of"
}, {
  id: "isntoneof",
  text: "isn't one of"
}, {
  id: "before",
  text: "is before"
}, {
  id: "after",
  text: "is after"
}, {
  id: "true",
  text: "is checked"
}, {
  id: "false",
  text: "is not checked"
}];

// This code has been copied from FromCompiler, only getValue and getAlternate have been changed
exports.compileCondition = compileCondition = function compileCondition(cond) {
  var getAlternate, getValue;
  getValue = function getValue(data) {
    var answer;
    answer = data[cond.lhs.question] || {};
    return answer.value;
  };
  getAlternate = function getAlternate(data) {
    var answer;
    answer = data[cond.lhs.question] || {};
    return answer.alternate;
  };
  switch (cond.op) {
    case "present":
      return function (data) {
        var key, present, v, value;
        value = getValue(data);
        present = value != null && value !== '' && !(value instanceof Array && value.length === 0);
        if (!present) {
          return false;
        } else {
          // If present, let's make sure that at least one field is set if it's an object
          if (value instanceof Object) {
            for (key in value) {
              v = value[key];
              if (v != null) {
                return true;
              }
            }
            // Not present, since the object has no set fields
            return false;
          } else {
            return true;
          }
        }
      };
    case "!present":
      return function (data) {
        var key, notPresent, v, value;
        value = getValue(data);
        notPresent = value == null || value === '' || value instanceof Array && value.length === 0;
        if (notPresent) {
          return true;
        } else {
          // If present, let's make sure that at least one field is set if it's an object
          if (value instanceof Object) {
            for (key in value) {
              v = value[key];
              if (v != null) {
                return false;
              }
            }
            // Not present, since the object has no set fields
            return true;
          } else {
            return false;
          }
        }
      };
    case "contains":
      return function (data) {
        return (getValue(data) || "").indexOf(cond.rhs.literal) !== -1;
      };
    case "!contains":
      return function (data) {
        return (getValue(data) || "").indexOf(cond.rhs.literal) === -1;
      };
    case "=":
      return function (data) {
        return getValue(data) === cond.rhs.literal;
      };
    case ">":
    case "after":
      return function (data) {
        return getValue(data) > cond.rhs.literal;
      };
    case "<":
    case "before":
      return function (data) {
        return getValue(data) < cond.rhs.literal;
      };
    case "!=":
      return function (data) {
        return getValue(data) !== cond.rhs.literal;
      };
    case "includes":
      return function (data) {
        return _.contains(getValue(data) || [], cond.rhs.literal) || cond.rhs.literal === getAlternate(data);
      };
    case "!includes":
      return function (data) {
        return !_.contains(getValue(data) || [], cond.rhs.literal) && cond.rhs.literal !== getAlternate(data);
      };
    case "is":
      return function (data) {
        return getValue(data) === cond.rhs.literal || getAlternate(data) === cond.rhs.literal;
      };
    case "isnt":
      return function (data) {
        return getValue(data) !== cond.rhs.literal && getAlternate(data) !== cond.rhs.literal;
      };
    case "isoneof":
      return function (data) {
        var value;
        value = getValue(data);
        if (_.isArray(value)) {
          return _.intersection(cond.rhs.literal, value).length > 0 || _.contains(cond.rhs.literal, getAlternate(data));
        } else {
          return _.contains(cond.rhs.literal, value) || _.contains(cond.rhs.literal, getAlternate(data));
        }
      };
    case "isntoneof":
      return function (data) {
        var value;
        value = getValue(data);
        if (_.isArray(value)) {
          return _.intersection(cond.rhs.literal, value).length === 0 && !_.contains(cond.rhs.literal, getAlternate(data));
        } else {
          return !_.contains(cond.rhs.literal, value) && !_.contains(cond.rhs.literal, getAlternate(data));
        }
      };
    case "true":
      return function (data) {
        return getValue(data) === true;
      };
    case "false":
      return function (data) {
        return getValue(data) !== true;
      };
    default:
      throw new Error("Unknown condition op " + cond.op);
  }
};

// This code has been copied from FromCompiler
exports.compileConditions = function (conds) {
  var compConds;
  compConds = _.map(conds, undefined.compileCondition);
  return function (data) {
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

// Maps op id to complete op info
getOpDetails = function getOpDetails(op) {
  var opDetail;
  opDetail = _.findWhere(allOps, {
    id: op
  });
  if (!opDetail) {
    throw new Error('Unknown op ' + op);
  }
  return opDetail;
};

// Gets list of applicable operators for a lhs question
// Return includes id and text for each one, suitable for a select2 control
exports.applicableOps = function (lhsQuestion) {
  var ops;
  ops = function () {
    switch (lhsQuestion._type) {
      case "TextQuestion":
      case "TextColumnQuestion":
        return ['present', '!present', 'contains', '!contains'];
      case "NumberQuestion":
      case "NumberColumnQuestion":
      case "StopwatchQuestion":
        return ['present', '!present', '=', '!=', '>', '<'];
      case "DropdownQuestion":
      case "DropdownColumnQuestion":
        return ['present', '!present', 'is', 'isnt', 'isoneof', 'isntoneof'];
      case "RadioQuestion":
        return ['present', '!present', 'is', 'isnt', 'isoneof', 'isntoneof'];
      case "MulticheckQuestion":
        return ['present', '!present', 'includes', '!includes', 'isoneof', 'isntoneof'];
      case "DateQuestion":
      case "DateColumnQuestion":
        return ['present', '!present', 'before', 'after'];
      case "CheckQuestion":
      case "CheckColumnQuestion":
        return ['true', 'false'];
      // TODO: ???
      case "LikertQuestion":
        return [];
      case "MatrixQuestion":
        return [];
      default:
        return ['present', '!present'];
    }
  }();
  // Add is, etc if alternates present, since we can do "is N/A"
  if (_.keys(lhsQuestion.alternates).length > 0) {
    // is/isn't is not applicable to Multicheck
    if (lhsQuestion._type !== "MulticheckQuestion") {
      ops = _.union(ops, ['is', 'isnt', 'isoneof', 'isntoneof']);
    }
  }
  return _.map(ops, getOpDetails);
};

// Gets rhs type for a question and operator. 
// Can be null (for unary), "text", "number", "choice", "choices", "date", "datetime"
exports.rhsType = function (lhsQuestion, op) {
  switch (op) {
    case "present":
    case "!present":
    case "true":
    case "false":
      return null;
    case "contains":
    case "!contains":
      return "text";
    case "=":
    case "!=":
      return "number";
    case ">":
    case "<":
      return "number";
    case "is":
    case "isnt":
      return "choice";
    case "isoneof":
    case "isntoneof":
      return "choices";
    case "includes":
    case "!includes":
      return "choice";
    case "before":
    case "after":
      return "date";
    default:
      throw new Error("Unknown op");
  }
};

// In the case of choice, returns choices for rhs (returns base localization)
// Return includes id and text for each one, suitable for a select2 control
exports.rhsChoices = function (lhsQuestion, op) {
  var choices;
  choices = _.map(lhsQuestion.choices, function (choice) {
    return {
      id: choice.id,
      text: choice.label[choice.label._base || "en"]
    };
  });
  // Add alternates
  if (lhsQuestion.alternates && lhsQuestion.alternates.dontknow) {
    choices.push({
      id: "dontknow",
      text: "Don't Know"
    });
  }
  if (lhsQuestion.alternates && lhsQuestion.alternates.na) {
    choices.push({
      id: "na",
      text: "Not Applicable"
    });
  }
  return choices;
};

// Checks if condition is valid. True for yes, false for no
exports.validateCondition = function (cond, formDesign) {
  var lhsQuestion, rhsType;
  // Check if lhs
  if (cond.lhs == null || !cond.lhs.question) {
    return false;
  }
  lhsQuestion = formUtils.findItem(formDesign, cond.lhs.question);
  if (!lhsQuestion) {
    return false;
  }
  // Check op
  if (!cond.op) {
    return false;
  }
  if (!_.contains(_.pluck(exports.applicableOps(lhsQuestion), "id"), cond.op)) {
    return false;
  }
  // Check rhs
  rhsType = exports.rhsType(lhsQuestion, cond.op);
  if (rhsType) {
    if (!cond.rhs || cond.rhs.literal == null) {
      return false;
    }
    // Check type
    switch (rhsType) {
      case "number":
        if (!(typeof cond.rhs.literal === "number")) {
          return false;
        }
        break;
      case "choice":
        if (!_.findWhere(lhsQuestion.choices, {
          id: cond.rhs.literal
        })) {
          // Check alternates
          if (lhsQuestion.alternates && lhsQuestion.alternates[cond.rhs.literal]) {
            return true;
          }
          return false;
        }
        break;
      case "choices":
        return _.all(cond.rhs.literal, function (c) {
          if (!_.findWhere(lhsQuestion.choices, {
            id: c
          })) {
            // Check alternates
            if (lhsQuestion.alternates && lhsQuestion.alternates[c]) {
              return true;
            }
            return false;
          }
          return true;
        });
      default:
        if (!(typeof cond.rhs.literal === "string")) {
          return false;
        }
    }
  }
  return true;
};

exports.summarizeConditions = function () {
  var conditions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var formDesign = arguments[1];
  var locale = arguments[2];

  return _.map(conditions, function (cond) {
    return exports.summarizeCondition(cond, formDesign, locale);
  }).join(" and ");
};

exports.summarizeCondition = function (cond, formDesign, locale) {
  var choices, lhsQuestion, ref, ref1, ref2, rhsType, str;
  if (!((ref = cond.lhs) != null ? ref.question : void 0)) {
    return "";
  }
  lhsQuestion = formUtils.findItem(formDesign, cond.lhs.question);
  if (!lhsQuestion) {
    return "";
  }
  str = formUtils.localizeString(lhsQuestion.text, locale);
  str += " " + ((ref1 = getOpDetails(cond.op)) != null ? ref1.text : void 0);
  rhsType = exports.rhsType(lhsQuestion, cond.op);
  switch (rhsType) {
    case "text":
    case "number":
      str += ' ' + cond.rhs.literal;
      break;
    case "choice":
      choices = exports.rhsChoices(lhsQuestion, cond.op);
      str += " " + ((ref2 = _.findWhere(choices, {
        id: cond.rhs.literal
      })) != null ? ref2.text : void 0);
      break;
    case "choices":
      choices = exports.rhsChoices(lhsQuestion, cond.op);
      str += " ";
      str += _.map(cond.rhs.literal, function (choice) {
        var ref3;
        return (ref3 = _.findWhere(choices, {
          id: choice
        })) != null ? ref3.text : void 0;
      }).join(", ");
      break;
    case "date":
    case "datetime":
      // TODO prettier
      str += ' ' + cond.rhs.literal;
  }
  return str;
};