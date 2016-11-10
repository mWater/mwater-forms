var _, allOps, compileCondition, formUtils, getOpDetails;

_ = require('lodash');

formUtils = require('./formUtils');

allOps = [
  {
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
  }
];

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

getOpDetails = function(op) {
  var opDetail;
  opDetail = _.findWhere(allOps, {
    id: op
  });
  if (!opDetail) {
    throw new Error("Unknown op " + op);
  }
  return opDetail;
};

exports.applicableOps = function(lhsQuestion) {
  var ops;
  ops = (function() {
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
      case "LikertQuestion":
        return [];
      case "MatrixQuestion":
        return [];
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

exports.validateCondition = function(cond, formDesign) {
  var lhsQuestion, rhsType;
  if ((cond.lhs == null) || !cond.lhs.question) {
    return false;
  }
  lhsQuestion = formUtils.findItem(formDesign, cond.lhs.question);
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

exports.summarizeConditions = function(conditions, formDesign, locale) {
  if (conditions == null) {
    conditions = [];
  }
  return _.map(conditions, (function(_this) {
    return function(cond) {
      return exports.summarizeCondition(cond, formDesign, locale);
    };
  })(this)).join(" and ");
};

exports.summarizeCondition = function(cond, formDesign, locale) {
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
      str += " " + cond.rhs.literal;
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
      str += _.map(cond.rhs.literal, (function(_this) {
        return function(choice) {
          var ref3;
          return (ref3 = _.findWhere(choices, {
            id: choice
          })) != null ? ref3.text : void 0;
        };
      })(this)).join(", ");
      break;
    case "date":
    case "datetime":
      str += " " + cond.rhs.literal;
  }
  return str;
};
