var Question;

Question = require('./Question');

module.exports = Question.extend({
  renderAnswer: function(answerEl) {
    var data;
    data = {
      prefix: this.options.prefix,
      suffix: this.options.suffix,
      decimal: this.options.decimal,
      prefixOrSuffix: this.options.prefix || this.options.suffix
    };
    return answerEl.html(require('./templates/NumberQuestion.hbs')(data, {
      helpers: {
        T: this.T
      }
    }));
  },
  updateAnswer: function(answerEl) {
    return answerEl.find("input").val(this.getAnswerValue());
  },
  events: {
    "change .answer input": "changed",
    "input .answer input": "checkValidation"
  },
  validateInternal: function() {
    var val;
    val = this.$(".answer input").val();
    if (this.isValid(val)) {
      return null;
    } else {
      return true;
    }
  },
  isValid: function(val) {
    if (val.length === 0) {
      return true;
    }
    if (this.options.decimal) {
      return val.match(/^-?[0-9]*\.?[0-9]+$/) && !isNaN(parseFloat(val));
    } else {
      return val.match(/^-?\d+$/);
    }
  },
  checkValidation: function() {
    var val;
    val = this.$(".answer input").val();
    return this.$(".answer").toggleClass("has-error", !this.isValid(val));
  },
  changed: function() {
    var val;
    val = this.$(".answer input").val();
    if (this.isValid(val)) {
      val = this.options.decimal ? parseFloat(val) : parseInt(val);
      if (isNaN(val)) {
        val = null;
      }
      return this.setAnswerValue(val);
    }
  }
});
