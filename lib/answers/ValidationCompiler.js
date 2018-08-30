"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ValidationCompiler, _;

_ = require('lodash');

// Compiles validations
module.exports = ValidationCompiler = function () {
  function ValidationCompiler(locale) {
    _classCallCheck(this, ValidationCompiler);

    this.compileString = this.compileString.bind(this);
    this.compileValidationMessage = this.compileValidationMessage.bind(this);
    this.compileValidation = this.compileValidation.bind(this);
    this.compileValidations = this.compileValidations.bind(this);
    this.locale = locale;
  }

  _createClass(ValidationCompiler, [{
    key: "compileString",
    value: function compileString(str) {
      // If no base or null, return null
      if (str == null || !str._base) {
        return null;
      }
      // Return for locale if present
      if (str[this.locale || "en"]) {
        return str[this.locale || "en"];
      }
      // Return base if present
      return str[str._base] || "";
    }
  }, {
    key: "compileValidationMessage",
    value: function compileValidationMessage(val) {
      var str;
      str = this.compileString(val.message);
      if (str) {
        return str;
      }
      return true;
    }
  }, {
    key: "compileValidation",
    value: function compileValidation(val) {
      var _this = this;

      switch (val.op) {
        case "lengthRange":
          return function (answer) {
            var len, value;
            value = answer != null && answer.value != null ? answer.value : "";
            len = value.length;
            if (val.rhs.literal.min != null && len < val.rhs.literal.min) {
              return _this.compileValidationMessage(val);
            }
            if (val.rhs.literal.max != null && len > val.rhs.literal.max) {
              return _this.compileValidationMessage(val);
            }
            return null;
          };
        case "regex":
          return function (answer) {
            var value;
            value = answer != null && answer.value != null ? answer.value : "";
            if (value.match(val.rhs.literal)) {
              return null;
            }
            return _this.compileValidationMessage(val);
          };
        case "range":
          return function (answer) {
            var value;
            value = answer != null && answer.value != null ? answer.value : 0;
            // For units question, get quantity
            if (value.quantity != null) {
              value = value.quantity;
            }
            if (val.rhs.literal.min != null && value < val.rhs.literal.min) {
              return _this.compileValidationMessage(val);
            }
            if (val.rhs.literal.max != null && value > val.rhs.literal.max) {
              return _this.compileValidationMessage(val);
            }
            return null;
          };
        default:
          throw new Error("Unknown validation op " + val.op);
      }
    }
  }, {
    key: "compileValidations",
    value: function compileValidations(vals) {
      var compVals;
      compVals = _.map(vals, this.compileValidation);
      return function (answer) {
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
    }
  }]);

  return ValidationCompiler;
}();