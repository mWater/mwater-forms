var DefaultValueApplier, formUtils;

formUtils = require('./formUtils');

module.exports = DefaultValueApplier = (function() {
  function DefaultValueApplier(formDesign, stickyStorage, entity, entityType) {
    this.formDesign = formDesign;
    this.stickyStorage = stickyStorage;
    this.entity = entity;
    this.entityType = entityType;
  }

  DefaultValueApplier.prototype.setStickyData = function(data, previousVisibilityStructure, newVisibilityStructure) {
    var dataEntry, defaultValue, key, newData, nowVisible, questionId, questions, values;
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
        dataEntry = data[questionId];
        if ((dataEntry == null) || ((dataEntry.value == null) && (dataEntry.alternate == null))) {
          defaultValue = this.getHighestPriorityDefaultValue(questionId);
          if ((defaultValue != null) && defaultValue !== '') {
            if (dataEntry == null) {
              newData[questionId] = dataEntry = {};
            }
            dataEntry.value = defaultValue;
          }
        }
      }
    }
    return newData;
  };

  DefaultValueApplier.prototype.getHighestPriorityDefaultValue = function(questionId) {
    var entityType, question, siteType;
    question = formUtils.findItem(this.formDesign, questionId);
    if (question == null) {
      return null;
    }
    if ((this.entityType != null) && (this.entity != null) && (question._type === 'SiteQuestion' || question._type === 'EntityQuestion')) {
      if (question._type === 'SiteQuestion') {
        siteType = (question.siteTypes ? question.siteTypes[0] : void 0) || "Water point";
        entityType = siteType.toLowerCase().replace(new RegExp(' ', 'g'), "_");
      } else {
        entityType = question.entityType;
      }
      if (entityType === this.entityType) {
        if (question._type === 'SiteQuestion') {
          return {
            code: this.entity.code
          };
        } else {
          return this.entity._id;
        }
      }
    }
    if (question.sticky) {
      return this.stickyStorage.get(questionId);
    }
    return question.defaultValue;
  };

  return DefaultValueApplier;

})();
