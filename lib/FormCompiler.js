var BarcodeQuestion, CheckQuestion, DateQuestion, DropdownQuestion, FormCompiler, FormControls, FormView, ImageQuestion, ImagesQuestion, Instructions, LocationQuestion, MulticheckQuestion, NumberQuestion, RadioQuestion, Section, Sections, SiteQuestion, TextListQuestion, TextQuestion, UnitsQuestion, ezlocalize, formUtils, markdown, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('underscore');

markdown = require("markdown").markdown;

ezlocalize = require('ez-localize');

formUtils = require('./formUtils');

TextQuestion = require('./TextQuestion');

NumberQuestion = require('./NumberQuestion');

RadioQuestion = require('./RadioQuestion');

DropdownQuestion = require('./DropdownQuestion');

MulticheckQuestion = require('./MulticheckQuestion');

DateQuestion = require('./DateQuestion');

UnitsQuestion = require('./UnitsQuestion');

LocationQuestion = require('./LocationQuestion');

ImageQuestion = require('./ImageQuestion');

ImagesQuestion = require('./ImagesQuestion');

CheckQuestion = require('./CheckQuestion');

TextListQuestion = require('./TextListQuestion');

SiteQuestion = require('./SiteQuestion');

BarcodeQuestion = require('./BarcodeQuestion');

Instructions = require('./Instructions');

Section = require('./Section');

Sections = require('./Sections');

FormView = require('./FormView');

FormControls = require('./FormControls');

module.exports = FormCompiler = (function() {
  function FormCompiler(options) {
    this.compileSection = __bind(this.compileSection, this);
    this.compileItem = __bind(this.compileItem, this);
    this.compileInstructions = __bind(this.compileInstructions, this);
    this.compileQuestion = __bind(this.compileQuestion, this);
    this.compileConditions = __bind(this.compileConditions, this);
    this.compileCondition = __bind(this.compileCondition, this);
    this.compileChoice = __bind(this.compileChoice, this);
    this.compileValidations = __bind(this.compileValidations, this);
    this.compileValidation = __bind(this.compileValidation, this);
    this.compileValidationMessage = __bind(this.compileValidationMessage, this);
    this.compileString = __bind(this.compileString, this);
    this.model = options.model;
    this.locale = options.locale || "en";
    this.ctx = options.ctx || {};
  }

  FormCompiler.prototype.compileString = function(str) {
    if ((str == null) || !str._base) {
      return null;
    }
    if (str[this.locale || "en"]) {
      return str[this.locale || "en"];
    }
    return str[str._base] || "";
  };

  FormCompiler.prototype.compileValidationMessage = function(val) {
    var str;
    str = this.compileString(val.message);
    if (str) {
      return str;
    }
    return true;
  };

  FormCompiler.prototype.compileValidation = function(val) {
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

  FormCompiler.prototype.compileValidations = function(vals) {
    var compVals;
    compVals = _.map(vals, this.compileValidation);
    return (function(_this) {
      return function(answer) {
        var compVal, result, _i, _len;
        for (_i = 0, _len = compVals.length; _i < _len; _i++) {
          compVal = compVals[_i];
          result = compVal(answer);
          if (result) {
            return result;
          }
        }
        return null;
      };
    })(this);
  };

  FormCompiler.prototype.compileChoice = function(choice) {
    return {
      id: choice.id,
      label: this.compileString(choice.label),
      hint: this.compileString(choice.hint),
      specify: choice.specify
    };
  };

  FormCompiler.prototype.compileChoices = function(choices) {
    return _.map(choices, this.compileChoice);
  };

  FormCompiler.prototype.compileCondition = function(cond) {
    var getAlternate, getValue;
    getValue = (function(_this) {
      return function() {
        var answer;
        answer = _this.model.get(cond.lhs.question) || {};
        return answer.value;
      };
    })(this);
    getAlternate = (function(_this) {
      return function() {
        var answer;
        answer = _this.model.get(cond.lhs.question) || {};
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
            return _.contains(getValue() || [], cond.rhs.literal);
          };
        })(this);
      case "!includes":
        return (function(_this) {
          return function() {
            return !_.contains(getValue() || [], cond.rhs.literal);
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
            return _.contains(cond.rhs.literal, getValue()) || _.contains(cond.rhs.literal, getAlternate());
          };
        })(this);
      case "isntoneof":
        return (function(_this) {
          return function() {
            return !_.contains(cond.rhs.literal, getValue()) && !_.contains(cond.rhs.literal, getAlternate());
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
            return getValue() === false;
          };
        })(this);
      default:
        throw new Error("Unknown condition op " + cond.op);
    }
  };

  FormCompiler.prototype.compileConditions = function(conds) {
    var compConds;
    compConds = _.map(conds, this.compileCondition);
    return (function(_this) {
      return function() {
        var compCond, _i, _len;
        for (_i = 0, _len = compConds.length; _i < _len; _i++) {
          compCond = compConds[_i];
          if (!compCond()) {
            return false;
          }
        }
        return true;
      };
    })(this);
  };

  FormCompiler.prototype.compileQuestion = function(q, T) {
    var compiledValidations, options;
    T = T || ezlocalize.defaultT;
    compiledValidations = this.compileValidations(q.validations);
    options = {
      model: this.model,
      id: q._id,
      required: q.required,
      prompt: this.compileString(q.text),
      code: q.code,
      hint: this.compileString(q.hint),
      help: this.compileString(q.help) ? markdown.toHTML(this.compileString(q.help)) : void 0,
      commentsField: q.commentsField,
      recordTimestamp: q.recordTimestamp,
      recordLocation: q.recordLocation,
      sticky: q.sticky,
      validate: (function(_this) {
        return function() {
          var answer;
          answer = _this.model.get(q._id);
          return compiledValidations(answer);
        };
      })(this),
      conditional: q.conditions && q.conditions.length > 0 ? this.compileConditions(q.conditions) : void 0,
      ctx: this.ctx,
      T: T
    };
    if (q.alternates) {
      options.alternates = [];
      if (q.alternates.na) {
        options.alternates.push({
          id: "na",
          label: T("Not Applicable")
        });
      }
      if (q.alternates.dontknow) {
        options.alternates.push({
          id: "dontknow",
          label: T("Don't know")
        });
      }
    }
    switch (q._type) {
      case "TextQuestion":
        options.format = q.format;
        return new TextQuestion(options);
      case "NumberQuestion":
        options.decimal = q.decimal;
        return new NumberQuestion(options);
      case "RadioQuestion":
        options.choices = this.compileChoices(q.choices);
        options.radioAlternates = true;
        return new RadioQuestion(options);
      case "DropdownQuestion":
        options.choices = this.compileChoices(q.choices);
        return new DropdownQuestion(options);
      case "MulticheckQuestion":
        options.choices = this.compileChoices(q.choices);
        return new MulticheckQuestion(options);
      case "DateQuestion":
        options.format = q.format;
        return new DateQuestion(options);
      case "UnitsQuestion":
        options.decimal = q.decimal;
        options.units = this.compileChoices(q.units);
        options.defaultUnits = q.defaultUnits;
        options.unitsPosition = q.unitsPosition;
        return new UnitsQuestion(options);
      case "LocationQuestion":
        return new LocationQuestion(options);
      case "ImageQuestion":
        if (q.consentPrompt) {
          options.consentPrompt = this.compileString(q.consentPrompt);
        }
        return new ImageQuestion(options);
      case "ImagesQuestion":
        if (q.consentPrompt) {
          options.consentPrompt = this.compileString(q.consentPrompt);
        }
        return new ImagesQuestion(options);
      case "CheckQuestion":
        options.label = this.compileString(q.label);
        return new CheckQuestion(options);
      case "TextListQuestion":
        return new TextListQuestion(options);
      case "SiteQuestion":
        options.siteTypes = q.siteTypes;
        return new SiteQuestion(options);
      case "BarcodeQuestion":
        return new BarcodeQuestion(options);
    }
    throw new Error("Unknown question type");
  };

  FormCompiler.prototype.compileInstructions = function(item, T) {
    var options;
    T = T || ezlocalize.defaultT;
    options = {
      model: this.model,
      id: item._id,
      html: this.compileString(item.text) ? markdown.toHTML(this.compileString(item.text)) : void 0,
      conditional: item.conditions && item.conditions.length > 0 ? this.compileConditions(item.conditions) : void 0,
      ctx: this.ctx,
      T: T
    };
    return new Instructions(options);
  };

  FormCompiler.prototype.compileItem = function(item, T) {
    if (formUtils.isQuestion(item)) {
      return this.compileQuestion(item, T);
    }
    if (item._type === "Instructions") {
      return this.compileInstructions(item, T);
    }
    throw new Error("Unknown item type: " + item._type);
  };

  FormCompiler.prototype.compileSection = function(section, T) {
    var contents, options;
    T = T || ezlocalize.defaultT;
    contents = _.map(section.contents, (function(_this) {
      return function(item) {
        return _this.compileItem(item, T);
      };
    })(this));
    options = {
      model: this.model,
      id: section._id,
      ctx: this.ctx,
      T: T,
      name: this.compileString(section.name),
      contents: contents,
      conditional: section.conditions && section.conditions.length > 0 ? this.compileConditions(section.conditions) : void 0
    };
    return new Section(options);
  };

  FormCompiler.prototype.compileForm = function(form) {
    var T, contents, formControls, localizedStrings, localizerData, options, sections, sectionsView;
    if (!form._schema) {
      form._schema = require('./index').schemaVersion;
    }
    if (form._schema < require('./index').minSchemaVersion) {
      throw new Error("Schema version too low");
    }
    if (form._schema > require('./index').schemaVersion) {
      throw new Error("Schema version too high");
    }
    localizedStrings = form.localizedStrings || [];
    localizerData = {
      locales: form.locales,
      strings: localizedStrings
    };
    T = new ezlocalize.Localizer(localizerData, this.locale).T;
    if (formUtils.isSectioned(form)) {
      sections = _.map(form.contents, (function(_this) {
        return function(item) {
          return _this.compileSection(item, T);
        };
      })(this));
      sectionsView = new Sections({
        sections: sections,
        model: this.model,
        ctx: this.ctx,
        T: T
      });
      contents = [sectionsView];
    } else {
      contents = _.map(form.contents, (function(_this) {
        return function(item) {
          return _this.compileItem(item, T);
        };
      })(this));
      formControls = new FormControls({
        contents: contents,
        model: this.model,
        ctx: this.ctx,
        T: T
      });
      contents = [formControls];
    }
    options = {
      model: this.model,
      id: form._id,
      ctx: this.ctx,
      T: T,
      name: this.compileString(form.name),
      contents: contents
    };
    return new FormView(options);
  };

  return FormCompiler;

})();
