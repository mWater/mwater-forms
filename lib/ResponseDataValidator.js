var AnswerValidator, ResponseDataValidator, formUtils;

AnswerValidator = require('./answers/AnswerValidator');

formUtils = require('./formUtils');

module.exports = ResponseDataValidator = (function() {
  function ResponseDataValidator() {}

  ResponseDataValidator.prototype.validate = function(formDesign, visibilityStructure, data) {
    return this.validateParentItem(formDesign, visibilityStructure, data, "");
  };

  ResponseDataValidator.prototype.validateParentItem = function(parentItem, visibilityStructure, data, keyPrefix) {
    var answer, answerId, answerValidator, cellData, column, columnIndex, completedId, entry, error, i, index, item, j, k, key, l, len, len1, len2, len3, ref, ref1, ref2, ref3, ref4, result, rosterData, row, rowIndex, validationError;
    answerValidator = new AnswerValidator();
    ref = parentItem.contents;
    for (i = 0, len = ref.length; i < len; i++) {
      item = ref[i];
      if (!visibilityStructure["" + keyPrefix + item._id]) {
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
          result = this.validateParentItem(item, visibilityStructure, entry.data, "" + keyPrefix + answerId + "." + index + ".");
          if (result != null) {
            return {
              questionId: item._id + "." + index + "." + result.questionId,
              error: result.error,
              message: formUtils.localizeString(item.name) + (" (" + (index + 1) + ")") + result.message
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
            for (columnIndex = l = 0, len3 = ref3.length; l < len3; columnIndex = ++l) {
              column = ref3[columnIndex];
              key = row.id + "." + column._id;
              completedId = item._id + '.' + key;
              cellData = (ref4 = answer[row.id]) != null ? ref4[column._id] : void 0;
              if (column.required && ((cellData != null ? cellData.value : void 0) == null) || (cellData != null ? cellData.value : void 0) === '') {
                return {
                  questionId: completedId,
                  error: true,
                  message: formUtils.localizeString(item.text) + (" (" + (index + 1) + ") ") + formUtils.localizeString(column.text) + " is required"
                };
              }
              if (column.validations && column.validations.length > 0) {
                validationError = answerValidator.compileValidations(column.validations)(cellData);
                if (validationError) {
                  return {
                    questionId: completedId,
                    error: validationError,
                    message: formUtils.localizeString(item.text) + (" (" + (index + 1) + ")") + formUtils.localizeString(column.text) + (" " + validationError)
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
  };

  return ResponseDataValidator;

})();
