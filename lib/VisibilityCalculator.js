var VisibilityCalculator, conditionUtils, formUtils;

formUtils = require('./formUtils');

conditionUtils = require('./conditionsUtils');

module.exports = VisibilityCalculator = (function() {
  function VisibilityCalculator(formDesign) {
    this.formDesign = formDesign;
    this.visibilityStructure = {};
  }

  VisibilityCalculator.prototype.createVisibilityStructure = function(data) {
    this.visibilityStructure = {};
    this.processForm(data);
    return this.visibilityStructure;
  };

  VisibilityCalculator.prototype.processForm = function(data) {
    var content, i, j, len, len1, ref, ref1, results, results1;
    if (this.formDesign._type !== 'Form') {
      throw new Error('Should be a form');
    }
    if (this.formDesign.contents[0] && this.formDesign.contents[0]._type === "Section") {
      ref = this.formDesign.contents;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        content = ref[i];
        results.push(this.processGroupOrSection(content, false, data, ''));
      }
      return results;
    } else {
      ref1 = this.formDesign.contents;
      results1 = [];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        content = ref1[j];
        results1.push(this.processItem(content, false, data, ''));
      }
      return results1;
    }
  };

  VisibilityCalculator.prototype.processGroupOrSection = function(groupOrSection, forceToInvisible, data, prefix) {
    var conditions, content, i, isVisible, len, ref, results;
    if (groupOrSection._type !== 'Section' && groupOrSection._type !== 'Group') {
      throw new Error('Should be a section or a group');
    }
    if (forceToInvisible) {
      isVisible = false;
    } else if ((groupOrSection.conditions != null) && groupOrSection.conditions.length > 0) {
      conditions = conditionUtils.compileConditions(groupOrSection.conditions, this.formDesign);
      isVisible = conditions(data);
    } else {
      isVisible = true;
    }
    this.visibilityStructure[prefix + groupOrSection._id] = isVisible;
    ref = groupOrSection.contents;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      content = ref[i];
      results.push(this.processItem(content, isVisible === false, data, prefix));
    }
    return results;
  };

  VisibilityCalculator.prototype.processItem = function(item, forceToInvisible, data, prefix) {
    if (formUtils.isQuestion(item)) {
      return this.processQuestion(item, forceToInvisible, data, prefix);
    } else if (item._type === 'TextColumn') {
      return this.processQuestion(item, forceToInvisible, data, prefix);
    } else if (item._type === "Instructions") {
      return this.processInstruction(item, forceToInvisible, data, prefix);
    } else if (item._type === "Timer") {
      return this.processTimer(item, forceToInvisible, data, prefix);
    } else if (item._type === "RosterGroup" || item._type === "RosterMatrix") {
      return this.processRoster(item, forceToInvisible, data, prefix);
    } else if (item._type === "Group") {
      return this.processGroupOrSection(item, forceToInvisible, data, prefix);
    } else {
      throw new Error('Unknow item type');
    }
  };

  VisibilityCalculator.prototype.processQuestion = function(question, forceToInvisible, data, prefix) {
    var column, conditions, i, isVisible, item, len, newPrefix, ref, results;
    if (forceToInvisible) {
      isVisible = false;
    } else if ((question.conditions != null) && question.conditions.length > 0) {
      conditions = conditionUtils.compileConditions(question.conditions, this.formDesign);
      isVisible = conditions(data);
    } else {
      isVisible = true;
    }
    this.visibilityStructure[prefix + question._id] = isVisible;
    if (question._type === 'MatrixQuestion') {
      ref = question.items;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        item = ref[i];
        results.push((function() {
          var j, len1, ref1, results1;
          ref1 = question.columns;
          results1 = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            column = ref1[j];
            newPrefix = question._id + "." + item.id + ".";
            results1.push(this.processItem(column, isVisible === false, data, newPrefix));
          }
          return results1;
        }).call(this));
      }
      return results;
    }
  };

  VisibilityCalculator.prototype.processInstruction = function(instruction, forceToInvisible, data, prefix) {
    return this.processQuestion(instruction, forceToInvisible, data, prefix);
  };

  VisibilityCalculator.prototype.processTimer = function(instruction, forceToInvisible, data, prefix) {
    return this.processQuestion(instruction, forceToInvisible, data, prefix);
  };

  VisibilityCalculator.prototype.processRoster = function(rosterGroup, forceToInvisible, data, prefix) {
    var conditions, content, dataId, i, index, isVisible, len, newPrefix, results, rosterGroupData, subData;
    if (rosterGroup._type !== 'RosterGroup' && rosterGroup._type !== 'RosterMatrix') {
      throw new Error('Should be a RosterGroup or RosterMatrix');
    }
    if (forceToInvisible) {
      isVisible = false;
    } else if ((rosterGroup.conditions != null) && rosterGroup.conditions.length > 0) {
      conditions = conditionUtils.compileConditions(rosterGroup.conditions, this.formDesign);
      isVisible = conditions(data);
    } else {
      isVisible = true;
    }
    this.visibilityStructure[rosterGroup._id] = isVisible;
    if (rosterGroup.rosterId != null) {
      dataId = rosterGroup.rosterId;
    } else {
      dataId = rosterGroup._id;
    }
    subData = data[dataId];
    if (subData != null) {
      results = [];
      for (index = i = 0, len = subData.length; i < len; index = ++i) {
        rosterGroupData = subData[index];
        results.push((function() {
          var j, len1, ref, results1;
          ref = rosterGroup.contents;
          results1 = [];
          for (j = 0, len1 = ref.length; j < len1; j++) {
            content = ref[j];
            newPrefix = dataId + "." + index + ".";
            results1.push(this.processItem(content, isVisible === false, rosterGroupData.data, newPrefix));
          }
          return results1;
        }).call(this));
      }
      return results;
    }
  };

  return VisibilityCalculator;

})();
