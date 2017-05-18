var RandomAskedCalculator, _, formUtils;

formUtils = require('./formUtils');

_ = require('lodash');

module.exports = RandomAskedCalculator = (function() {
  function RandomAskedCalculator(formDesign) {
    this.formDesign = formDesign;
  }

  RandomAskedCalculator.prototype.calculateRandomAsked = function(data, visibilityStructure) {
    var entryData, entryIndex, item, items, key, newData, parts, visible;
    newData = _.cloneDeep(data);
    items = _.indexBy(formUtils.allItems(this.formDesign), "_id");
    for (key in visibilityStructure) {
      visible = visibilityStructure[key];
      if (!visible) {
        continue;
      }
      parts = key.split(".");
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
        if (!parts[1].match(/^\d+$/)) {
          continue;
        }
        item = items[parts[2]];
        if (!item) {
          continue;
        }
        entryIndex = parseInt(parts[1]);
        if (item.randomAskProbability != null) {
          entryData = newData[parts[0]][entryIndex].data;
          entryData[item._id] = entryData[item._id] || {};
          if (entryData[item._id].randomAsked == null) {
            entryData[item._id].randomAsked = this.generateRandomValue(item.randomAskProbability);
          }
        }
      }
    }
    return newData;
  };

  RandomAskedCalculator.prototype.generateRandomValue = function(probability) {
    return Math.random() < probability;
  };

  return RandomAskedCalculator;

})();
