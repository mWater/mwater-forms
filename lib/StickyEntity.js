var CleaningEntity, formUtils;

formUtils = require('./formUtils');

module.exports = CleaningEntity = (function() {
  function CleaningEntity() {}

  CleaningEntity.prototype.setStickyData = function(form, data, stickyStorage, previousVisibilityStructure, newVisibilityStructure) {
    var dataEntry, key, newData, previousVisible, question, questionId, questions, stickyValue, values;
    newData = _.cloneDeep(data);
    questions = [];
    for (key in previousVisibilityStructure) {
      previousVisible = previousVisibilityStructure[key];
      if (!previousVisible && newVisibilityStructure[key]) {
        values = key.split('.');
        if (values.length === 1) {
          questionId = values[0];
        } else {
          questionId = values[2];
        }
        question = formUtils.findItem(form, questionId);
        if ((question != null) && question.sticky) {
          stickyValue = stickyStorage.get(questionId);
          if ((stickyValue != null) && stickyValue !== '') {
            dataEntry = data[questionId];
            if ((dataEntry == null) || (dataEntry.value == null)) {
              if (dataEntry == null) {
                newData[questionId] = dataEntry = {};
              }
              dataEntry.value = stickyValue;
            }
          }
        }
      }
    }
    return newData;
  };

  return CleaningEntity;

})();
