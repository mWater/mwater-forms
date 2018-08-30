'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AnswerValidator, ExprEvaluator, ValidationCompiler, _, siteCodes;

_ = require('lodash');

siteCodes = require('../siteCodes');

ExprEvaluator = require('mwater-expressions').ExprEvaluator;

ValidationCompiler = require('./ValidationCompiler');

// AnswerValidator gets called when a form is submitted (or on next)
// Only the validate method is not internal
module.exports = AnswerValidator = function () {
  function AnswerValidator(schema, responseRow, locale) {
    _classCallCheck(this, AnswerValidator);

    this.schema = schema;
    this.responseRow = responseRow;
    this.locale = locale;
  }

  // It returns null if everything is fine
  // It makes sure required questions are properly answered
  // It checks answer type specific validations
  // It checks custom validations


  _createClass(AnswerValidator, [{
    key: 'validate',
    value: function validate(question, answer) {
      var i, item, len, ref, specificValidation;
      // If it has an alternate value, it cannot be invalid
      if (answer.alternate != null) {
        return null;
      }
      if (question.disabled != null) {
        return null;
      }
      // Check required and answered
      if (question.required) {
        if (answer.value == null || answer.value === '') {
          return true;
        }
        // Handling empty string for Units values
        if (answer.value != null && answer.value.quantity != null && answer.value.quantity === '') {
          return true;
        }
        // A required LikertQuestion needs an answer for all items
        if (question._type === 'LikertQuestion') {
          ref = question.items;
          for (i = 0, len = ref.length; i < len; i++) {
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
      // Check internal validation
      specificValidation = this.validateSpecificAnswerType(question, answer);
      if (specificValidation != null) {
        return specificValidation;
      }
      // Skip validation if value is not set
      if (answer.value == null || answer.value === '') {
        return null;
      }
      // Check custom validation
      if (question.validations != null) {
        return new ValidationCompiler(this.locale).compileValidations(question.validations)(answer);
      }
      // if question.validationExprs? and @responseRow
      //   for { expr, message } in question.validationExprs
      //     # Evaluate expression
      //     exprEvaluator = new ExprEvaluator(@schema)
      //     value = await exprEvaluator.evaluate(expr, { row: @responseRow })
      //     if value != true
      //       return message
      return null;
    }
  }, {
    key: 'validateSpecificAnswerType',
    value: function validateSpecificAnswerType(question, answer) {
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
        case "MatrixQuestion":
          return this.validateMatrixQuestion(question, answer);
        default:
          return null;
      }
    }

    // Valid if null or empty
    // Valid if code is valid (checksum)

  }, {
    key: 'validateSiteQuestion',
    value: function validateSiteQuestion(question, answer) {
      var ref;
      if (!answer.value) {
        return null;
      }
      if (!((ref = answer.value) != null ? ref.code : void 0)) {
        return true;
      }
      if (siteCodes.isValid(answer.value.code)) {
        return null;
      } else {
        return "Invalid code";
      }
    }

    // Valid if null or empty
    // Valid if not email or url format
    // Else a match is performed on the anser value

  }, {
    key: 'validateTextQuestion',
    value: function validateTextQuestion(question, answer) {
      if (answer.value == null || answer.value === '') {
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
    }

    // Valid if null or empty
    // Valid if quantity is not set
    // Invalid if quantity is set but not units

  }, {
    key: 'validateUnitsQuestion',
    value: function validateUnitsQuestion(question, answer) {
      if (answer.value == null || answer.value === '') {
        return null;
      }
      if (answer.value.quantity != null && answer.value.quantity !== '') {
        if (answer.value.units == null || answer.value.units === '') {
          return 'units field is required when a quantity is set';
        }
      }
      return null;
    }

    // Valid if null or empty
    // Valid if quantity is not set
    // Invalid if quantity is set but not units

  }, {
    key: 'validateLikertQuestion',
    value: function validateLikertQuestion(question, answer) {
      var choiceId, item, ref;
      if (answer.value == null || answer.value === '') {
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
    }

    // Valid if null or empty

  }, {
    key: 'validateNumberQuestion',
    value: function validateNumberQuestion(question, answer) {
      if (answer.value == null || answer.value === '') {
        return null;
      }
      return null;
    }
  }, {
    key: 'validateMatrixQuestion',
    value: function validateMatrixQuestion(question, answer) {
      var column, columnIndex, data, i, item, j, key, len, len1, ref, ref1, ref2, ref3, rowIndex, validationError, validationErrors;
      validationErrors = {};
      ref = question.items;
      // For each entry
      for (rowIndex = i = 0, len = ref.length; i < len; rowIndex = ++i) {
        item = ref[rowIndex];
        ref1 = question.columns;
        // For each column
        for (columnIndex = j = 0, len1 = ref1.length; j < len1; columnIndex = ++j) {
          column = ref1[columnIndex];
          key = item.id + '_' + column._id;
          data = (ref2 = answer.value) != null ? (ref3 = ref2[item.id]) != null ? ref3[column._id] : void 0 : void 0;
          if (column.required && ((data != null ? data.value : void 0) == null || (data != null ? data.value : void 0) === '')) {
            return true;
          }
          if (column.validations && column.validations.length > 0) {
            validationError = new ValidationCompiler(this.locale).compileValidations(column.validations)(data);
            if (validationError) {
              return validationError;
            }
          }
        }
      }
      return null;
    }
  }]);

  return AnswerValidator;
}();