var AnswerValidator, _, siteCodes,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('lodash');

siteCodes = require('../siteCodes');

module.exports = AnswerValidator = (function() {
  function AnswerValidator() {
    this.compileValidations = bind(this.compileValidations, this);
    this.compileValidation = bind(this.compileValidation, this);
    this.compileValidationMessage = bind(this.compileValidationMessage, this);
    this.compileString = bind(this.compileString, this);
  }

  AnswerValidator.prototype.validate = function(question, answer) {
    var i, item, len1, ref, specificValidation;
    if (answer.alternate != null) {
      return null;
    }
    if (question.required) {
      if ((answer.value == null) || answer.value === '') {
        return true;
      }
      if ((answer.value != null) && (answer.value.quantity != null) && answer.value.quantity === '') {
        return true;
      }
      if (question._type === 'LikertQuestion') {
        ref = question.items;
        for (i = 0, len1 = ref.length; i < len1; i++) {
          item = ref[i];
          if (answer.value[item.id] == null) {
            return true;
          }
        }
      }
      if (question._type === 'AquagenxCBTQuestion') {
        if (answer.value.cbt == null) {
          return true;
        }
      }
    }
    specificValidation = this.validateSpecificAnswerType(question, answer);
    if (specificValidation != null) {
      return specificValidation;
    }
    if ((answer.value == null) || answer.value === '') {
      return null;
    }
    if (question.validations != null) {
      return this.compileValidations(question.validations)(answer);
    }
    return null;
  };

  AnswerValidator.prototype.validateSpecificAnswerType = function(question, answer) {
    switch (question._type) {
      case "TextQuestion":
        return this.validateTextQuestion(question, answer);
      case "UnitsQuestion":
        return this.validateUnitsQuestion(question, answer);
      case "NumbersQuestion":
        return this.validateNumberQuestion(question, answer);
      case "SiteQuestion":
        return this.validateSiteQuestion(question, answer);
      case "LikertQuestion":
        return this.validateLikertQuestion(question, answer);
      default:
        return null;
    }
  };

  AnswerValidator.prototype.validateSiteQuestion = function(question, answer) {
    var ref;
    if (!(answer != null ? (ref = answer.value) != null ? ref.code : void 0 : void 0)) {
      return true;
    }
    if (siteCodes.isValid(answer.value.code)) {
      return null;
    } else {
      return "Invalid code";
    }
  };

  AnswerValidator.prototype.validateTextQuestion = function(question, answer) {
    if ((answer.value == null) || answer.value === '') {
      return null;
    }
    if (question.format === "email") {
      if (answer.value.match(/[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
        return null;
      } else {
        return "Invalid format";
      }
    } else if (question.format === "url") {
      if (answer.value.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/)) {
        return null;
      } else {
        return "Invalid format";
      }
    }
    return null;
  };

  AnswerValidator.prototype.validateUnitsQuestion = function(question, answer) {
    if ((answer.value == null) || answer.value === '') {
      return null;
    }
    if ((answer.value.quantity != null) && answer.value.quantity !== '') {
      if ((answer.value.units == null) || answer.value.units === '') {
        return 'units field is required when a quantity is set';
      }
    }
    return null;
  };

  AnswerValidator.prototype.validateLikertQuestion = function(question, answer) {
    var choiceId, item, ref;
    if ((answer.value == null) || answer.value === '') {
      return null;
    }
    ref = answer.value;
    for (item in ref) {
      choiceId = ref[item];
      if (_.findWhere(question.choices, {
        id: choiceId
      }) == null) {
        return 'Invalid choice';
      }
    }
    return null;
  };

  AnswerValidator.prototype.validateNumberQuestion = function(question, answer) {
    if ((answer.value == null) || answer.value === '') {
      return null;
    }
    return null;
  };

  AnswerValidator.prototype.compileString = function(str) {
    if ((str == null) || !str._base) {
      return null;
    }
    if (str[this.locale || "en"]) {
      return str[this.locale || "en"];
    }
    return str[str._base] || "";
  };

  AnswerValidator.prototype.compileValidationMessage = function(val) {
    var str;
    str = this.compileString(val.message);
    if (str) {
      return str;
    }
    return true;
  };

  AnswerValidator.prototype.compileValidation = function(val) {
    switch (val.op) {
      case "lengthRange":
        return (function(_this) {
          return function(answer) {
            var len, value;
            value = (answer != null) && (answer.value != null) ? answer.value : "";
            len = value.length;
            if ((val.rhs.literal.min != null) && len < val.rhs.literal.min) {
              return _this.compileValidationMessage(val);
            }
            if ((val.rhs.literal.max != null) && len > val.rhs.literal.max) {
              return _this.compileValidationMessage(val);
            }
            return null;
          };
        })(this);
      case "regex":
        return (function(_this) {
          return function(answer) {
            var value;
            value = (answer != null) && (answer.value != null) ? answer.value : "";
            if (value.match(val.rhs.literal)) {
              return null;
            }
            return _this.compileValidationMessage(val);
          };
        })(this);
      case "range":
        return (function(_this) {
          return function(answer) {
            var value;
            value = (answer != null) && (answer.value != null) ? answer.value : 0;
            if (value.quantity != null) {
              value = value.quantity;
            }
            if ((val.rhs.literal.min != null) && value < val.rhs.literal.min) {
              return _this.compileValidationMessage(val);
            }
            if ((val.rhs.literal.max != null) && value > val.rhs.literal.max) {
              return _this.compileValidationMessage(val);
            }
            return null;
          };
        })(this);
      default:
        throw new Error("Unknown validation op " + val.op);
    }
  };

  AnswerValidator.prototype.compileValidations = function(vals) {
    var compVals;
    compVals = _.map(vals, this.compileValidation);
    return (function(_this) {
      return function(answer) {
        var compVal, i, len1, result;
        for (i = 0, len1 = compVals.length; i < len1; i++) {
          compVal = compVals[i];
          result = compVal(answer);
          if (result) {
            return result;
          }
        }
        return null;
      };
    })(this);
  };

  return AnswerValidator;

})();
