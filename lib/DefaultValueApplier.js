"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var DefaultValueApplier, _, formUtils;

_ = require('lodash');
formUtils = require('./formUtils'); // The DefaultValueApplier applies a value stored in the stickyStorage as a default answer to a question.
// It uses the following logic:
//    - The question needs to be newly visible
//    - The question needs to have a default value
//    - The data for that question needs to be undefined or null, alternate needs to be null or undefined

module.exports = DefaultValueApplier =
/*#__PURE__*/
function () {
  // entity is an object
  // entityType is a string
  function DefaultValueApplier(formDesign, stickyStorage, entity, entityType) {
    (0, _classCallCheck2["default"])(this, DefaultValueApplier);
    this.formDesign = formDesign;
    this.stickyStorage = stickyStorage;
    this.entity = entity;
    this.entityType = entityType;
  }

  (0, _createClass2["default"])(DefaultValueApplier, [{
    key: "setStickyData",
    value: function setStickyData(data, previousVisibilityStructure, newVisibilityStructure) {
      var dataEntry, defaultValue, key, newData, nowVisible, questionId, questions, values; // NOTE: Always remember that data is immutable

      newData = _.cloneDeep(data);
      questions = [];

      for (key in newVisibilityStructure) {
        nowVisible = newVisibilityStructure[key]; // If it wasn't visible and it now is

        if (nowVisible && !previousVisibilityStructure[key]) {
          values = key.split('.');

          if (values.length === 1) {
            questionId = values[0];
          } else {
            questionId = values[2];
          }

          dataEntry = data[questionId]; // The data for that question needs to be undefined or null
          // Alternate for that question needs to be undefined or null

          if (dataEntry == null || dataEntry.value == null && dataEntry.alternate == null) {
            defaultValue = this.getHighestPriorityDefaultValue(questionId); // Makes sure that a defaultValue has been found

            if (defaultValue != null && defaultValue !== '') {
              // Create the dataEntry if not present
              if (dataEntry == null) {
                newData[questionId] = dataEntry = {};
              }

              dataEntry.value = defaultValue;
            }
          }
        }
      }

      return newData;
    } // 3 different sources exist for default values.
    // This function returns the one with highest priority:
    // - entityType/entity
    // - sticky with a stored sticky value
    // - defaultValue

  }, {
    key: "getHighestPriorityDefaultValue",
    value: function getHighestPriorityDefaultValue(questionId) {
      var entityType, question, siteType;
      question = formUtils.findItem(this.formDesign, questionId);

      if (question == null) {
        return null;
      }

      if (this.entityType != null && this.entity != null && (question._type === 'SiteQuestion' || question._type === 'EntityQuestion')) {
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
      } // If it's a sticky question or if it has a defaultValue
      // Tries to use a sticky value if possible, if not it tries to use the defaultValue field


      if (question.sticky) {
        // Uses stickyStorage.get(questionId) to find any sticky value
        return this.stickyStorage.get(questionId);
      }

      return question.defaultValue;
    }
  }]);
  return DefaultValueApplier;
}();