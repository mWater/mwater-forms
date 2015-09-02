var Question, UnitsQuestion, _,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Question = require('./Question');

_ = require('underscore');

module.exports = UnitsQuestion = (function(superClass) {
  extend(UnitsQuestion, superClass);

  function UnitsQuestion() {
    return UnitsQuestion.__super__.constructor.apply(this, arguments);
  }

  UnitsQuestion.prototype.events = {
    "change #quantity": "changed",
    "change #units": "changed"
  };

  UnitsQuestion.prototype.renderAnswer = function(answerEl) {
    var data, units;
    units = _.map(this.options.units, (function(_this) {
      return function(item) {
        return {
          id: item.id,
          value: item.label
        };
      };
    })(this));
    data = {
      units: units,
      prefix: this.options.unitsPosition === "prefix",
      defaultUnits: this.options.defaultUnits
    };
    return answerEl.html(require('./templates/UnitsQuestion.hbs')(data, {
      helpers: {
        T: this.T
      }
    }));
  };

  UnitsQuestion.prototype.updateAnswer = function(answerEl) {
    var val;
    val = this.getAnswerValue() || {};
    answerEl.find("#quantity").val(val.quantity);
    return answerEl.find("#units").val(val.units || this.options.defaultUnits);
  };

  UnitsQuestion.prototype.isAnswered = function() {
    var val;
    val = this.getAnswerValue();
    if (val == null) {
      return false;
    }
    if ((val.quantity == null) || !val.units) {
      return false;
    }
    return true;
  };

  UnitsQuestion.prototype.setUnits = function(units) {
    this.options.units = units;
    return this.render();
  };

  UnitsQuestion.prototype.changed = function() {
    var quantity, units;
    quantity = this.options.decimal ? parseFloat(this.$("#quantity").val()) : parseInt(this.$("#quantity").val());
    units = this.$("#units").val();
    units = units ? units : this.options.defaultUnits;
    if (isNaN(quantity)) {
      quantity = null;
    }
    return this.setAnswerValue({
      units: units,
      quantity: quantity
    });
  };

  UnitsQuestion.prototype.validateInternal = function() {
    var quantity;
    quantity = this.$("#quantity").val();
    if (this.options.decimal && quantity.length > 0) {
      if (isNaN(parseFloat(quantity))) {
        return true;
      }
    } else if (quantity.length > 0) {
      if (!quantity.match(/^-?\d+$/)) {
        return true;
      }
    }
    if (quantity && !this.$("#units").val()) {
      return true;
    }
    return null;
  };

  UnitsQuestion.prototype.setFocus = function() {
    this.$("#quantity").focus();
    return this.$("#quantity").select();
  };

  return UnitsQuestion;

})(Question);
