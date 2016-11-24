var ResponseCleaner, _, async, conditionUtils, formUtils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('lodash');

formUtils = require('./formUtils');

conditionUtils = require('./conditionUtils');

async = require('async');


/*
ResponseCleaner removes the data entry (answer) of invisible questions and defaults values

The process of cleaning data is an iterative one, as making a question invisible removes its answer, which in turn may make
other questions invisible or visible. 

To further complicate it, when a question becomes visible, it may get a default value, which may in turn trigger other visibility changes

Therefore, it's an iterative process which is also asynchronous, as
 */

module.exports = ResponseCleaner = (function() {
  function ResponseCleaner() {
    this.cleanData = bind(this.cleanData, this);
  }

  ResponseCleaner.prototype.cleanData = function(design, visibilityCalculator, defaultValueApplier, data, responseRowFactory, oldVisibilityStructure, callback) {
    var complete, nbIterations, newData, newVisibilityStructure;
    nbIterations = 0;
    complete = false;
    newData = data;
    newVisibilityStructure = null;
    return async.whilst((function() {
      return !complete;
    }), (function(_this) {
      return function(cb) {
        return visibilityCalculator.createVisibilityStructure(newData, responseRowFactory(newData), function(error, visibilityStructure) {
          if (error) {
            return cb(error);
          }
          newVisibilityStructure = visibilityStructure;
          newData = _this.cleanDataBasedOnVisibility(newData, newVisibilityStructure);
          newData = _this.cleanDataBasedOnChoiceConditions(newData, newVisibilityStructure, design);
          if (defaultValueApplier) {
            newData = defaultValueApplier.setStickyData(newData, oldVisibilityStructure, newVisibilityStructure);
          }
          nbIterations++;
          if (_.isEqual(newVisibilityStructure, oldVisibilityStructure)) {
            complete = true;
          }
          if (nbIterations >= 10) {
            return cb(new Error('Impossible to compute question visibility. The question conditions must be looping'));
          }
          oldVisibilityStructure = newVisibilityStructure;
          return cb(null);
        });
      };
    })(this), (function(_this) {
      return function(error) {
        if (error) {
          return callback(error);
        }
        return callback(null, {
          data: newData,
          visibilityStructure: newVisibilityStructure
        });
      };
    })(this));
  };

  ResponseCleaner.prototype.cleanDataBasedOnVisibility = function(data, visibilityStructure) {
    var answerToClean, index, itemId, key, matrixId, newData, questionId, ref, ref1, rosterGroupId, values, visible;
    newData = _.cloneDeep(data);
    for (key in visibilityStructure) {
      visible = visibilityStructure[key];
      if (!visible) {
        values = key.split('.');
        if (values.length === 1) {
          delete newData[key];
        } else if (_.isArray(newData[values[0]])) {
          rosterGroupId = values[0];
          index = parseInt(values[1]);
          questionId = values[2];
          if ((newData[rosterGroupId] != null) && (newData[rosterGroupId][index] != null)) {
            answerToClean = newData[rosterGroupId][index].data;
            if (answerToClean) {
              delete answerToClean[questionId];
            }
          }
        } else {
          matrixId = values[0];
          itemId = values[1];
          questionId = values[2];
          if (itemId && questionId && ((ref = newData[matrixId]) != null ? (ref1 = ref[itemId]) != null ? ref1[questionId] : void 0 : void 0)) {
            delete newData[matrixId][itemId][questionId];
          }
        }
      }
    }
    return newData;
  };

  ResponseCleaner.prototype.cleanDataBasedOnChoiceConditions = function(data, visibilityStructure, design) {
    var choice, conditionData, deleteAnswer, i, index, key, len, newData, question, questionId, ref, ref1, ref2, rosterGroupId, selectedChoice, values, visible;
    newData = _.cloneDeep(data);
    for (key in visibilityStructure) {
      visible = visibilityStructure[key];
      if (visible) {
        values = key.split('.');
        selectedChoice = null;
        if (values.length === 1) {
          questionId = key;
          conditionData = newData;
          selectedChoice = (ref = newData[questionId]) != null ? ref.value : void 0;
          deleteAnswer = function() {
            return delete newData[questionId];
          };
        } else if (_.isArray(newData[values[0]])) {
          rosterGroupId = values[0];
          index = parseInt(values[1]);
          questionId = values[2];
          if ((newData[rosterGroupId] != null) && (newData[rosterGroupId][index] != null)) {
            conditionData = newData[rosterGroupId][index].data;
            selectedChoice = conditionData != null ? (ref1 = conditionData[questionId]) != null ? ref1.value : void 0 : void 0;
            deleteAnswer = function() {
              var answerToClean;
              answerToClean = newData[rosterGroupId][index].data;
              return delete answerToClean[questionId];
            };
          }
        }
        if (selectedChoice != null) {
          question = formUtils.findItem(design, questionId);
          if (question._type === 'DropdownQuestion' || question._type === 'RadioQuestion' || question._type === 'DropdownColumnQuestion') {
            ref2 = question.choices;
            for (i = 0, len = ref2.length; i < len; i++) {
              choice = ref2[i];
              if (choice.conditions) {
                if (choice.id === selectedChoice) {
                  if (!conditionUtils.compileConditions(choice.conditions)(conditionData)) {
                    deleteAnswer();
                  }
                }
              }
            }
          }
        }
      }
    }
    return newData;
  };

  return ResponseCleaner;

})();
