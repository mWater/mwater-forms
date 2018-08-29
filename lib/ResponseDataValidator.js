'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AnswerValidator, ResponseDataValidator, formUtils;

AnswerValidator = require('./answers/AnswerValidator');

formUtils = require('./formUtils');

// ResponseDataValidator checks whether the entire data is valid for a response
module.exports = ResponseDataValidator = function () {
  function ResponseDataValidator() {
    _classCallCheck(this, ResponseDataValidator);
  }

  _createClass(ResponseDataValidator, [{
    key: 'validate',

    // It returns null if everything is fine
    // It makes sure required questions are properly answered
    // It checks custom validations
    // It returns the id of the question that caused the error, the error and a message which is includes the error and question
    // e.g. { questionId: someid, error: true for required, message otherwise, message: complete message including question text }
    //     If the question causing the error is nested (like a Matrix), the questionId is separated by a .
    //     RosterMatrix   -> matrixId.index.columnId
    //     RosterGroup   -> rosterGroupId.index.questionId
    //     QuestionMatrix -> matrixId.itemId.columnId
    value: function validate(formDesign, visibilityStructure, data) {
      return this.validateParentItem(formDesign, visibilityStructure, data, "");
    }

    // Validates an parent row
    //   keyPrefix: the part before the row id in the visibility structure. For rosters

  }, {
    key: 'validateParentItem',
    value: function validateParentItem(parentItem, visibilityStructure, data, keyPrefix) {
      var answer, answerId, answerValidator, cellData, column, columnIndex, completedId, entry, error, i, index, item, j, k, key, l, len, len1, len2, len3, ref, ref1, ref2, ref3, ref4, ref5, result, rosterData, row, rowIndex, validationError;
      // Create validator
      answerValidator = new AnswerValidator();
      ref = parentItem.contents;
      // For each item
      for (i = 0, len = ref.length; i < len; i++) {
        item = ref[i];
        // If not visible, ignore
        if (!visibilityStructure['' + keyPrefix + item._id]) {
          continue;
        }
        if (item._type === "Section" || item._type === "Group") {
          result = this.validateParentItem(item, visibilityStructure, data, keyPrefix);
          if (result != null) {
            return result;
          }
        }
        if ((ref1 = item._type) === "RosterGroup" || ref1 === "RosterMatrix") {
          answerId = item.rosterId || item._id;
          rosterData = data[answerId] || [];
          for (index = j = 0, len1 = rosterData.length; j < len1; index = ++j) {
            entry = rosterData[index];
            // Key prefix is itemid.indexinroster.
            result = this.validateParentItem(item, visibilityStructure, entry.data, '' + keyPrefix + answerId + '.' + index + '.');
            if (result != null) {
              return {
                questionId: item._id + '.' + index + '.' + result.questionId,
                error: result.error,
                message: formUtils.localizeString(item.name) + (' (' + (index + 1) + ')') + result.message
              };
            }
          }
        }
        if (formUtils.isQuestion(item)) {
          answer = data[item._id] || {};
          if (item._type === 'MatrixQuestion') {
            ref2 = item.items;
            for (rowIndex = k = 0, len2 = ref2.length; k < len2; rowIndex = ++k) {
              row = ref2[rowIndex];
              ref3 = item.columns;
              // For each column
              for (columnIndex = l = 0, len3 = ref3.length; l < len3; columnIndex = ++l) {
                column = ref3[columnIndex];
                key = row.id + '.' + column._id;
                completedId = item._id + '.' + key;
                cellData = (ref4 = answer.value) != null ? (ref5 = ref4[row.id]) != null ? ref5[column._id] : void 0 : void 0;
                if (column.required && (cellData != null ? cellData.value : void 0) == null || (cellData != null ? cellData.value : void 0) === '') {
                  return {
                    questionId: completedId,
                    error: true,
                    message: formUtils.localizeString(item.text) + (' (' + (rowIndex + 1) + ') ') + formUtils.localizeString(column.text) + " is required"
                  };
                }
                if (column.validations && column.validations.length > 0) {
                  validationError = answerValidator.compileValidations(column.validations)(cellData);
                  if (validationError) {
                    return {
                      questionId: completedId,
                      error: validationError,
                      message: formUtils.localizeString(item.text) + (' (' + (rowIndex + 1) + ')') + formUtils.localizeString(column.text) + (' ' + validationError)
                    };
                    return [completedId, validationError];
                  }
                }
              }
            }
          } else {
            error = answerValidator.validate(item, answer);
            if (error != null) {
              return {
                questionId: item._id,
                error: error,
                message: formUtils.localizeString(item.text) + " " + (error === true ? "is required" : error)
              };
            }
          }
        }
      }
      return null;
    }
  }]);

  return ResponseDataValidator;
}();