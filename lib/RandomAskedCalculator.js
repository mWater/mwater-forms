'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RandomAskedCalculator, _, formUtils;

formUtils = require('./formUtils');

_ = require('lodash');

// The RandomAskedCalculator sets the randomAsked property of visible answers, determining if the question will be visible.
// If question has randomAskProbability, it is visible unless randomAsked is set to false, which this class determines.
module.exports = RandomAskedCalculator = function () {
  function RandomAskedCalculator(formDesign) {
    _classCallCheck(this, RandomAskedCalculator);

    this.formDesign = formDesign;
  }

  _createClass(RandomAskedCalculator, [{
    key: 'calculateRandomAsked',
    value: function calculateRandomAsked(data, visibilityStructure) {
      var entryData, entryIndex, item, items, key, newData, parts, visible;
      // NOTE: Always remember that data is immutable
      newData = _.cloneDeep(data);
      // Index all items by _id
      items = _.indexBy(formUtils.allItems(this.formDesign), "_id");
      // For each item in visibility structure
      for (key in visibilityStructure) {
        visible = visibilityStructure[key];
        // Do nothing with invisible
        if (!visible) {
          continue;
        }
        parts = key.split(".");
        // If simple key
        if (parts.length === 1) {
          item = items[parts[0]];
          if (!item) {
            continue;
          }
          if (item.randomAskProbability != null) {
            newData[item._id] = newData[item._id] || {};
            if (newData[item._id].randomAsked == null) {
              newData[item._id].randomAsked = this.generateRandomValue(item.randomAskProbability);
            }
          }
        } else {

          // If not roster, skip
          if (!parts[1].match(/^\d+$/)) {
            continue;
          }
          // Lookup question in roster
          item = items[parts[2]];
          if (!item) {
            continue;
          }
          // Get roster index
          entryIndex = parseInt(parts[1]);
          if (item.randomAskProbability != null) {
            // Get enty data
            entryData = newData[parts[0]][entryIndex].data;
            // Create structure
            entryData[item._id] = entryData[item._id] || {};
            // Set randomAsked
            if (entryData[item._id].randomAsked == null) {
              entryData[item._id].randomAsked = this.generateRandomValue(item.randomAskProbability);
            }
          }
        }
      }
      return newData;
    }

    // Randomly determine asked

  }, {
    key: 'generateRandomValue',
    value: function generateRandomValue(probability) {
      return Math.random() < probability;
    }
  }]);

  return RandomAskedCalculator;
}();