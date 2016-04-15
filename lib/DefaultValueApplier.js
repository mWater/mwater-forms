var DefaultValueApplier, formUtils;

formUtils = require('./formUtils');

module.exports = DefaultValueApplier = (function() {
  function DefaultValueApplier() {}

  DefaultValueApplier.prototype.setStickyData = function(form, data, stickyStorage, previousVisibilityStructure, newVisibilityStructure) {
    var dataEntry, defaultValue, key, newData, nowVisible, question, questionId, questions, values;
    newData = _.cloneDeep(data);
    questions = [];
    for (key in newVisibilityStructure) {
      nowVisible = newVisibilityStructure[key];
      if (nowVisible && !previousVisibilityStructure[key]) {
        values = key.split('.');
        if (values.length === 1) {
          questionId = values[0];
        } else {
          questionId = values[2];
        }
        question = formUtils.findItem(form, questionId);
        if ((question != null) && (question.sticky || (question.defaultValue != null))) {
          if (question.sticky) {
            defaultValue = stickyStorage.get(questionId);
          }
          if ((defaultValue == null) || defaultValue === '') {
            defaultValue = question.defaultValue;
          }
          if ((defaultValue != null) && defaultValue !== '') {
            dataEntry = data[questionId];
            if ((dataEntry == null) || ((dataEntry.value == null) && (dataEntry.alternate == null))) {
              if (dataEntry == null) {
                newData[questionId] = dataEntry = {};
              }
              dataEntry.value = defaultValue;
            }
          }
        }
      }
    }
    return newData;
  };

  return DefaultValueApplier;

})();
