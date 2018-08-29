'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ResponseCleaner, _, async, conditionUtils, formUtils;

_ = require('lodash');

formUtils = require('./formUtils');

conditionUtils = require('./conditionUtils');

async = require('async');

/*
ResponseCleaner removes the data entry (answer) of invisible questions and defaults values

The process of cleaning data is an iterative one, as making a question invisible removes its answer, which in turn may make
other questions invisible or visible. 

To further complicate it, when a question becomes visible, it may get a default value, which may in turn trigger other visibility changes

Therefore, it's an iterative process which is also asynchronous, as condition evaluation is asynchronous.

*/
module.exports = ResponseCleaner = function () {
  function ResponseCleaner() {
    _classCallCheck(this, ResponseCleaner);

    // Cleans data, calling back with { data: cleaned data, visibilityStructure: final visibility structure (since expensive to compute) }
    // The old visibility structure is needed as defaulting of values requires knowledge of how visibility has changed
    // The process of computing visibility, cleaning data and applying stickyData/defaultValue can trigger more changes
    // and should be repeated until the visibilityStructure is stable.
    // A simple case: Question A, B and C with B only visible if A is set and C only visible if B is set and B containing a defaultValue
    // Setting a value to A will make B visible and set to defaultValue, but C will remain invisible until the process is repeated
    // responseRowFactory: returns responseRow when called with data
    this.cleanData = this.cleanData.bind(this);
  }

  _createClass(ResponseCleaner, [{
    key: 'cleanData',
    value: function cleanData(design, visibilityCalculator, defaultValueApplier, randomAskedCalculator, data, responseRowFactory, oldVisibilityStructure, callback) {
      var _this = this;

      var complete, nbIterations, newData, newVisibilityStructure;
      nbIterations = 0;
      complete = false;
      newData = data;
      newVisibilityStructure = null;
      // This needs to be repeated until it stabilizes
      return async.whilst(function () {
        return !complete;
      }, function (cb) {
        // Compute visibility
        return visibilityCalculator.createVisibilityStructure(newData, responseRowFactory(newData), function (error, visibilityStructure) {
          if (error) {
            return cb(error);
          }
          newVisibilityStructure = visibilityStructure;
          // Clean data
          newData = _this.cleanDataBasedOnVisibility(newData, newVisibilityStructure);
          newData = _this.cleanDataBasedOnChoiceConditions(newData, newVisibilityStructure, design);
          // Default values
          if (defaultValueApplier) {
            newData = defaultValueApplier.setStickyData(newData, oldVisibilityStructure, newVisibilityStructure);
          }
          // Set random asked
          if (randomAskedCalculator) {
            newData = randomAskedCalculator.calculateRandomAsked(newData, newVisibilityStructure);
          }
          // Increment iterations
          nbIterations++;
          // If the visibilityStructure is still the same twice, the process is now stable.
          if (_.isEqual(newVisibilityStructure, oldVisibilityStructure)) {
            complete = true;
          }
          if (nbIterations >= 10) {
            return cb(new Error('Impossible to compute question visibility. The question conditions must be looping'));
          }

          // New is now old
          oldVisibilityStructure = newVisibilityStructure;
          return cb(null);
        });
      }, function (error) {
        if (error) {
          return callback(error);
        }
        return callback(null, {
          data: newData,
          visibilityStructure: newVisibilityStructure
        });
      });
    }

    // Remove data entries for all the invisible questions

  }, {
    key: 'cleanDataBasedOnVisibility',
    value: function cleanDataBasedOnVisibility(data, visibilityStructure) {
      var answerToClean, index, itemId, key, matrixId, newData, questionId, ref, ref1, ref2, ref3, rosterGroupId, values, visible;
      newData = _.cloneDeep(data);
      for (key in visibilityStructure) {
        visible = visibilityStructure[key];
        if (!visible) {
          values = key.split('.');
          // If the key doesn't contain any '.', simply remove the data entry unless has randomAsked
          if (values.length === 1) {
            if (((ref = newData[key]) != null ? ref.randomAsked : void 0) != null) {
              newData[key] = {
                randomAsked: newData[key].randomAsked
              };
            } else {
              delete newData[key];
            }
            // Check if value is an array, which indicates roster
          } else if (_.isArray(newData[values[0]])) {
            // The id of the roster containing the data
            rosterGroupId = values[0];
            // The index of the answer
            index = parseInt(values[1]);
            // The id of the answered question
            questionId = values[2];
            // If a data entry exist for that roster and that answer index
            if (newData[rosterGroupId] != null && newData[rosterGroupId][index] != null) {
              // Delete the entry, but keep randomAsked
              answerToClean = newData[rosterGroupId][index].data;
              if (answerToClean) {
                if (((ref1 = answerToClean[questionId]) != null ? ref1.randomAsked : void 0) != null) {
                  answerToClean[questionId] = {
                    randomAsked: answerToClean[questionId].randomAsked
                  };
                } else {
                  delete answerToClean[questionId];
                }
              }
            }
          } else {
            matrixId = values[0];
            itemId = values[1];
            questionId = values[2];
            if (itemId && questionId && ((ref2 = newData[matrixId]) != null ? (ref3 = ref2[itemId]) != null ? ref3[questionId] : void 0 : void 0)) {
              delete newData[matrixId][itemId][questionId];
            }
          }
        }
      }
      return newData;
    }

    // Remove data entries for all the conditional choices that are false
    // 'DropdownQuestion', 'RadioQuestion' and 'DropdownColumnQuestion' can have choices that are only present if a condition
    // is filled. If the condition is no longer filled, the answer data needs to be removed

  }, {
    key: 'cleanDataBasedOnChoiceConditions',
    value: function cleanDataBasedOnChoiceConditions(data, visibilityStructure, design) {
      var choice, conditionData, deleteAnswer, i, index, key, len, newData, question, questionId, ref, ref1, ref2, rosterGroupId, selectedChoice, values, visible;
      newData = _.cloneDeep(data);
      for (key in visibilityStructure) {
        visible = visibilityStructure[key];
        if (visible) {
          values = key.split('.');
          selectedChoice = null;
          // FIRST: Setup what is needed for the cleaning the data (different for rosters)
          // If the key doesn't contain any '.', simply remove the data entry
          if (values.length === 1) {
            questionId = key;
            conditionData = newData;
            selectedChoice = (ref = newData[questionId]) != null ? ref.value : void 0;
            // A simple delete
            deleteAnswer = function deleteAnswer() {
              return delete newData[questionId];
            };
            // Check if value is an array, which indicates roster
          } else if (_.isArray(newData[values[0]])) {
            // The id of the roster containing the data
            rosterGroupId = values[0];
            // The index of the answer
            index = parseInt(values[1]);
            // The id of the answered question
            questionId = values[2];
            if (newData[rosterGroupId] != null && newData[rosterGroupId][index] != null) {
              // Delete the entry
              conditionData = newData[rosterGroupId][index].data;
              selectedChoice = conditionData != null ? (ref1 = conditionData[questionId]) != null ? ref1.value : void 0 : void 0;
              deleteAnswer = function deleteAnswer() {
                var answerToClean;
                // Need to find what needs to be cleaned first (with roster data)
                answerToClean = newData[rosterGroupId][index].data;
                return delete answerToClean[questionId];
              };
            }
          }
          // SECOND: look for conditional choices and delete their answer if the conditions are false
          if (selectedChoice != null) {
            // Get the question
            question = formUtils.findItem(design, questionId);
            // Of dropdown or radio type (types with conditional choices)
            if (question._type === 'DropdownQuestion' || question._type === 'RadioQuestion' || question._type === 'DropdownColumnQuestion') {
              ref2 = question.choices;
              for (i = 0, len = ref2.length; i < len; i++) {
                choice = ref2[i];
                // If one of the choice is conditional
                if (choice.conditions) {
                  // And it's the selected choice
                  if (choice.id === selectedChoice) {
                    // Test the condition
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
    }
  }]);

  return ResponseCleaner;
}();