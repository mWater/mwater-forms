"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var AnswerValidator, ExprEvaluator, ValidationCompiler, _, formUtils, siteCodes;

_ = require('lodash');
siteCodes = require('../siteCodes');
ExprEvaluator = require('mwater-expressions').ExprEvaluator;
ValidationCompiler = require('./ValidationCompiler');
formUtils = require('../formUtils'); // AnswerValidator gets called when a form is submitted (or on next)
// Only the validate method is not internal

module.exports = AnswerValidator =
/*#__PURE__*/
function () {
  function AnswerValidator(schema, responseRow, locale) {
    (0, _classCallCheck2["default"])(this, AnswerValidator);
    this.schema = schema;
    this.responseRow = responseRow;
    this.locale = locale;
  } // It returns null if everything is fine
  // It makes sure required questions are properly answered
  // It checks answer type specific validations
  // It checks custom validations


  (0, _createClass2["default"])(AnswerValidator, [{
    key: "validate",
    value: function validate(question, answer) {
      var choiceOption, expr, exprEvaluator, i, item, j, k, len, len1, len2, message, ref, ref1, ref2, result, selectedChoice, selectedSpecifyChoicecs, specificValidation, specifyChoices, value, _ref2$k;

      return _regenerator["default"].async(function validate$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(answer.alternate != null)) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return", null);

            case 2:
              if (!(question.disabled != null)) {
                _context.next = 4;
                break;
              }

              return _context.abrupt("return", null);

            case 4:
              if (!question.required) {
                _context.next = 40;
                break;
              }

              if (!(answer.value == null || answer.value === '')) {
                _context.next = 7;
                break;
              }

              return _context.abrupt("return", true);

            case 7:
              if (!question.choices) {
                _context.next = 25;
                break;
              }

              if (!_.isArray(answer.value)) {
                _context.next = 22;
                break;
              }

              specifyChoices = question.choices.filter(function (c) {
                return c.specify;
              }).map(function (c) {
                return c.id;
              });
              selectedSpecifyChoicecs = _.intersection(specifyChoices, answer.value);

              if (!(selectedSpecifyChoicecs.length > 0)) {
                _context.next = 20;
                break;
              }

              i = 0, len = selectedSpecifyChoicecs.length;

            case 13:
              if (!(i < len)) {
                _context.next = 20;
                break;
              }

              selectedChoice = selectedSpecifyChoicecs[i];

              if ((ref = answer.specify) != null ? ref[selectedChoice] : void 0) {
                _context.next = 17;
                break;
              }

              return _context.abrupt("return", true);

            case 17:
              i++;
              _context.next = 13;
              break;

            case 20:
              _context.next = 25;
              break;

            case 22:
              // RadioQuestion
              choiceOption = _.find(question.choices, {
                specify: true
              });

              if (!(choiceOption && answer.value === choiceOption.id && !answer.specify)) {
                _context.next = 25;
                break;
              }

              return _context.abrupt("return", true);

            case 25:
              if (!(answer.value != null && answer.value.quantity != null && answer.value.quantity === '')) {
                _context.next = 27;
                break;
              }

              return _context.abrupt("return", true);

            case 27:
              if (!(question._type === 'LikertQuestion')) {
                _context.next = 37;
                break;
              }

              ref1 = question.items;
              j = 0, len1 = ref1.length;

            case 30:
              if (!(j < len1)) {
                _context.next = 37;
                break;
              }

              item = ref1[j];

              if (!(answer.value[item.id] == null)) {
                _context.next = 34;
                break;
              }

              return _context.abrupt("return", true);

            case 34:
              j++;
              _context.next = 30;
              break;

            case 37:
              if (!(question._type === 'AquagenxCBTQuestion')) {
                _context.next = 40;
                break;
              }

              if (!(answer.value.cbt == null)) {
                _context.next = 40;
                break;
              }

              return _context.abrupt("return", true);

            case 40:
              // Check internal validation
              specificValidation = this.validateSpecificAnswerType(question, answer);

              if (!(specificValidation != null)) {
                _context.next = 43;
                break;
              }

              return _context.abrupt("return", specificValidation);

            case 43:
              if (!(answer.value == null || answer.value === '')) {
                _context.next = 45;
                break;
              }

              return _context.abrupt("return", null);

            case 45:
              if (!(question.validations != null)) {
                _context.next = 49;
                break;
              }

              result = new ValidationCompiler(this.locale).compileValidations(question.validations)(answer);

              if (!result) {
                _context.next = 49;
                break;
              }

              return _context.abrupt("return", result);

            case 49:
              if (!(question.advancedValidations != null && this.responseRow)) {
                _context.next = 66;
                break;
              }

              ref2 = question.advancedValidations;
              k = 0, len2 = ref2.length;

            case 52:
              if (!(k < len2)) {
                _context.next = 66;
                break;
              }

              _ref2$k = ref2[k];
              expr = _ref2$k.expr;
              message = _ref2$k.message;

              if (!expr) {
                _context.next = 63;
                break;
              }

              // Evaluate expression
              exprEvaluator = new ExprEvaluator(this.schema);
              _context.next = 60;
              return _regenerator["default"].awrap(exprEvaluator.evaluate(expr, {
                row: this.responseRow
              }));

            case 60:
              value = _context.sent;

              if (!(value !== true)) {
                _context.next = 63;
                break;
              }

              return _context.abrupt("return", formUtils.localizeString(message, this.locale) || true);

            case 63:
              k++;
              _context.next = 52;
              break;

            case 66:
              return _context.abrupt("return", null);

            case 67:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "validateSpecificAnswerType",
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
    } // Valid if null or empty
    // Valid if code is valid (checksum)

  }, {
    key: "validateSiteQuestion",
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
    } // Valid if null or empty
    // Valid if not email or url format
    // Else a match is performed on the anser value

  }, {
    key: "validateTextQuestion",
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
    } // Valid if null or empty
    // Valid if quantity is not set
    // Invalid if quantity is set but not units

  }, {
    key: "validateUnitsQuestion",
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
    } // Valid if null or empty
    // Valid if quantity is not set
    // Invalid if quantity is set but not units

  }, {
    key: "validateLikertQuestion",
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
    } // Valid if null or empty

  }, {
    key: "validateNumberQuestion",
    value: function validateNumberQuestion(question, answer) {
      if (answer.value == null || answer.value === '') {
        return null;
      }

      return null;
    }
  }, {
    key: "validateMatrixQuestion",
    value: function validateMatrixQuestion(question, answer) {
      var column, columnIndex, data, i, item, j, key, len, len1, ref, ref1, ref2, ref3, rowIndex, validationError, validationErrors;
      validationErrors = {};
      ref = question.items; // For each entry

      for (rowIndex = i = 0, len = ref.length; i < len; rowIndex = ++i) {
        item = ref[rowIndex];
        ref1 = question.columns; // For each column

        for (columnIndex = j = 0, len1 = ref1.length; j < len1; columnIndex = ++j) {
          column = ref1[columnIndex];
          key = "".concat(item.id, "_").concat(column._id);
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