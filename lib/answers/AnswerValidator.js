'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AnswerValidator, ExprEvaluator, ValidationCompiler, _, formUtils, siteCodes;

_ = require('lodash');

siteCodes = require('../siteCodes');

ExprEvaluator = require('mwater-expressions').ExprEvaluator;

ValidationCompiler = require('./ValidationCompiler');

formUtils = require('../formUtils');

// AnswerValidator gets called when a form is submitted (or on next)
// Only the validate method is not internal
module.exports = AnswerValidator = function () {
  function AnswerValidator(schema, responseRow, locale) {
    (0, _classCallCheck3.default)(this, AnswerValidator);

    this.schema = schema;
    this.responseRow = responseRow;
    this.locale = locale;
  }

  // It returns null if everything is fine
  // It makes sure required questions are properly answered
  // It checks answer type specific validations
  // It checks custom validations


  (0, _createClass3.default)(AnswerValidator, [{
    key: 'validate',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(question, answer) {
        var expr, exprEvaluator, i, item, j, len, len1, message, ref, ref1, result, specificValidation, value, _ref1$j;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(answer.alternate != null)) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt('return', null);

              case 2:
                if (!(question.disabled != null)) {
                  _context.next = 4;
                  break;
                }

                return _context.abrupt('return', null);

              case 4:
                if (!question.required) {
                  _context.next = 22;
                  break;
                }

                if (!(answer.value == null || answer.value === '')) {
                  _context.next = 7;
                  break;
                }

                return _context.abrupt('return', true);

              case 7:
                if (!(answer.value != null && answer.value.quantity != null && answer.value.quantity === '')) {
                  _context.next = 9;
                  break;
                }

                return _context.abrupt('return', true);

              case 9:
                if (!(question._type === 'LikertQuestion')) {
                  _context.next = 19;
                  break;
                }

                ref = question.items;
                i = 0, len = ref.length;

              case 12:
                if (!(i < len)) {
                  _context.next = 19;
                  break;
                }

                item = ref[i];

                if (!(answer.value[item.id] == null)) {
                  _context.next = 16;
                  break;
                }

                return _context.abrupt('return', true);

              case 16:
                i++;
                _context.next = 12;
                break;

              case 19:
                if (!(question._type === 'AquagenxCBTQuestion')) {
                  _context.next = 22;
                  break;
                }

                if (!(answer.value.cbt == null)) {
                  _context.next = 22;
                  break;
                }

                return _context.abrupt('return', true);

              case 22:
                // Check internal validation
                specificValidation = this.validateSpecificAnswerType(question, answer);

                if (!(specificValidation != null)) {
                  _context.next = 25;
                  break;
                }

                return _context.abrupt('return', specificValidation);

              case 25:
                if (!(answer.value == null || answer.value === '')) {
                  _context.next = 27;
                  break;
                }

                return _context.abrupt('return', null);

              case 27:
                if (!(question.validations != null)) {
                  _context.next = 31;
                  break;
                }

                result = new ValidationCompiler(this.locale).compileValidations(question.validations)(answer);

                if (!result) {
                  _context.next = 31;
                  break;
                }

                return _context.abrupt('return', result);

              case 31:
                if (!(question.advancedValidations != null && this.responseRow)) {
                  _context.next = 47;
                  break;
                }

                ref1 = question.advancedValidations;
                j = 0, len1 = ref1.length;

              case 34:
                if (!(j < len1)) {
                  _context.next = 47;
                  break;
                }

                // Evaluate expression
                _ref1$j = ref1[j];
                expr = _ref1$j.expr;
                message = _ref1$j.message;
                exprEvaluator = new ExprEvaluator(this.schema);
                _context.next = 41;
                return exprEvaluator.evaluate(expr, {
                  row: this.responseRow
                });

              case 41:
                value = _context.sent;

                if (!(value !== true)) {
                  _context.next = 44;
                  break;
                }

                return _context.abrupt('return', formUtils.localizeString(message, this.locale));

              case 44:
                j++;
                _context.next = 34;
                break;

              case 47:
                return _context.abrupt('return', null);

              case 48:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function validate(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return validate;
    }()
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