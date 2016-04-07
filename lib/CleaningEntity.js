var CleaningEntity;

module.exports = CleaningEntity = (function() {
  function CleaningEntity() {}

  CleaningEntity.prototype.cleanData = function(data, visibilityStructure) {
    var answerToClean, index, key, newData, questionId, rosterGroupId, values, visible;
    newData = _.clone(data);
    for (key in visibilityStructure) {
      visible = visibilityStructure[key];
      if (!visible) {
        values = key.split('.');
        if (values.length === 1) {
          delete newData[key];
        } else {
          rosterGroupId = values[0];
          index = parseInt(values[1]);
          questionId = values[2];
          if ((newData[rosterGroupId] != null) && (newData[rosterGroupId][index] != null)) {
            answerToClean = newData[rosterGroupId][index];
            delete answerToClean[questionId];
          }
        }
      }
    }
    return newData;
  };

  return CleaningEntity;

})();
