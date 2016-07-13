var ResponseCleaner, _, conditionsUtils, formUtils;

_ = require('lodash');

formUtils = require('./formUtils');

conditionsUtils = require('./conditionsUtils');

module.exports = ResponseCleaner = (function() {
  function ResponseCleaner() {}

  ResponseCleaner.prototype.cleanData = function(data, visibilityStructure, design) {
    var newData;
    newData = _.clone(data);
    this.cleanDataBasedOnVisibility(newData, visibilityStructure);
    this.cleanDataBasedOnChoiceConditions(newData, visibilityStructure, design);
    return newData;
  };

  ResponseCleaner.prototype.cleanDataBasedOnVisibility = function(newData, visibilityStructure) {
    var answerToClean, index, key, questionId, results, rosterGroupId, values, visible;
    results = [];
    for (key in visibilityStructure) {
      visible = visibilityStructure[key];
      if (!visible) {
        values = key.split('.');
        if (values.length === 1) {
          results.push(delete newData[key]);
        } else {
          rosterGroupId = values[0];
          index = parseInt(values[1]);
          questionId = values[2];
          if ((newData[rosterGroupId] != null) && (newData[rosterGroupId][index] != null)) {
            answerToClean = newData[rosterGroupId][index];
            results.push(delete answerToClean[questionId]);
          } else {
            results.push(void 0);
          }
        }
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  ResponseCleaner.prototype.cleanDataBasedOnChoiceConditions = function(newData, visibilityStructure, design) {
    var choice, deleteAnswer, index, key, question, questionId, ref, ref1, ref2, ref3, results, rosterGroupId, selectedChoice, values, visible;
    results = [];
    for (key in visibilityStructure) {
      visible = visibilityStructure[key];
      if (visible) {
        values = key.split('.');
        selectedChoice = null;
        if (values.length === 1) {
          questionId = key;
          selectedChoice = (ref = newData[questionId]) != null ? ref.value : void 0;
          deleteAnswer = function() {
            return delete newData[questionId];
          };
        } else {
          rosterGroupId = values[0];
          index = parseInt(values[1]);
          questionId = values[2];
          if ((newData[rosterGroupId] != null) && (newData[rosterGroupId][index] != null)) {
            selectedChoice = newData != null ? (ref1 = newData[rosterGroupId]) != null ? (ref2 = ref1[index]) != null ? (ref3 = ref2[questionId]) != null ? ref3.value : void 0 : void 0 : void 0 : void 0;
            deleteAnswer = function() {
              var answerToClean;
              answerToClean = newData[rosterGroupId][index];
              return delete answerToClean[questionId];
            };
          }
        }
        if (selectedChoice != null) {
          question = formUtils.findItem(design, questionId);
          if (question._type === 'DropdownQuestion' || question._type === 'RadioQuestion' || question._type === 'DropdownColumnQuestion') {
            results.push((function() {
              var i, len, ref4, results1;
              ref4 = question.choices;
              results1 = [];
              for (i = 0, len = ref4.length; i < len; i++) {
                choice = ref4[i];
                if (choice.conditions) {
                  if (choice.id === selectedChoice) {
                    if (!conditionsUtils.compileConditions(choice.conditions)(newData)) {
                      results1.push(deleteAnswer());
                    } else {
                      results1.push(void 0);
                    }
                  } else {
                    results1.push(void 0);
                  }
                } else {
                  results1.push(void 0);
                }
              }
              return results1;
            })());
          } else {
            results.push(void 0);
          }
        } else {
          results.push(void 0);
        }
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  return ResponseCleaner;

})();
