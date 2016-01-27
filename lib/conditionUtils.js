var _, formUtils, getOpDetails;

_ = require('lodash');

formUtils = require('./formUtils');

getOpDetails = function(op) {
  switch (op) {
    case "present":
      return {
        id: "present",
        text: "was answered"
      };
    case "!present":
      return {
        id: "!present",
        text: "was not answered"
      };
    case "contains":
      return {
        id: "contains",
        text: "contains text"
      };
    case "!contains":
      return {
        id: "!contains",
        text: "does not contain text"
      };
    case "=":
      return {
        id: "=",
        text: "is equal to"
      };
    case ">":
      return {
        id: ">",
        text: "is greater than"
      };
    case "<":
      return {
        id: "<",
        text: "is less than"
      };
    case "!=":
      return {
        id: "!=",
        text: "is not equal to"
      };
    case "is":
      return {
        id: "is",
        text: "is"
      };
    case "isnt":
      return {
        id: "isnt",
        text: "isn't"
      };
    case "includes":
      return {
        id: "includes",
        text: "includes"
      };
    case "!includes":
      return {
        id: "!includes",
        text: "does not include"
      };
    case "isoneof":
      return {
        id: "isoneof",
        text: "is one of"
      };
    case "isntoneof":
      return {
        id: "isntoneof",
        text: "isn't one of"
      };
    case "before":
      return {
        id: "before",
        text: " is before"
      };
    case "after":
      return {
        id: "after",
        text: "is after"
      };
    case "true":
      return {
        id: "true",
        text: " is checked"
      };
    case "false":
      return {
        id: "false",
        text: "is not checked"
      };
    default:
      throw new Error("Unknown op");
  }
};

exports.applicableOps = function(lhsQuestion) {
  var ops;
  ops = (function() {
    switch (lhsQuestion._type) {
      case "TextQuestion":
        return ['present', '!present', 'contains', '!contains'];
      case "NumberQuestion":
        return ['present', '!present', '=', '!=', '>', '<'];
      case "DropdownQuestion":
        return ['present', '!present', 'is', 'isnt', 'isoneof', 'isntoneof'];
      case "RadioQuestion":
        return ['present', '!present', 'is', 'isnt', 'isoneof', 'isntoneof'];
      case "MulticheckQuestion":
        return ['present', '!present', 'includes', '!includes', 'isoneof', 'isntoneof'];
      case "DateQuestion":
        return ['present', '!present', 'before', 'after'];
      case "CheckQuestion":
        return ['true', 'false'];
      default:
        return ['present', '!present'];
    }
  })();
  if (_.keys(lhsQuestion.alternates).length > 0) {
    if (lhsQuestion._type !== "MulticheckQuestion") {
      ops = _.union(ops, ['is', 'isnt', 'isoneof', 'isntoneof']);
    }
  }
  return _.map(ops, getOpDetails);
};

exports.rhsType = function(lhsQuestion, op) {
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

exports.rhsChoices = function(lhsQuestion, op) {
  var choices;
  choices = _.map(lhsQuestion.choices, function(choice) {
    return {
      id: choice.id,
      text: choice.label[choice.label._base || "en"]
    };
  });
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

exports.validateCondition = function(cond, form) {
  var lhsQuestion, rhsType;
  if ((cond.lhs == null) || !cond.lhs.question) {
    return false;
  }
  lhsQuestion = formUtils.findItem(form, cond.lhs.question);
  if (!lhsQuestion) {
    return false;
  }
  if (!cond.op) {
    return false;
  }
  if (!_.contains(_.pluck(exports.applicableOps(lhsQuestion), "id"), cond.op)) {
    return false;
  }
  rhsType = exports.rhsType(lhsQuestion, cond.op);
  if (rhsType) {
    if (!cond.rhs || (cond.rhs.literal == null)) {
      return false;
    }
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
          if (lhsQuestion.alternates && lhsQuestion.alternates[cond.rhs.literal]) {
            return true;
          }
          return false;
        }
        break;
      case "choices":
        return _.all(cond.rhs.literal, function(c) {
          if (!_.findWhere(lhsQuestion.choices, {
            id: c
          })) {
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
