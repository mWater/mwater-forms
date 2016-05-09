var $, CheckQuestion, Question, _,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Question = require('./Question');

_ = require('lodash');

$ = require('jquery');

module.exports = CheckQuestion = (function(superClass) {
  extend(CheckQuestion, superClass);

  function CheckQuestion() {
    this.checked = bind(this.checked, this);
    return CheckQuestion.__super__.constructor.apply(this, arguments);
  }

  CheckQuestion.prototype.events = {
    "click .prompt": "checked"
  };

  CheckQuestion.prototype.checked = function(e) {
    if (this.$("#toggle_help").length > 0 && $.contains(this.$("#toggle_help")[0], e.target)) {
      return;
    }
    return this.setAnswerValue(!this.getAnswerValue());
  };

  CheckQuestion.prototype.renderAnswer = function() {
    return this.$(".prompt").addClass("touch-checkbox");
  };

  CheckQuestion.prototype.updateAnswer = function(answerEl) {
    if (this.getAnswerValue()) {
      return this.$(".prompt").addClass("checked");
    } else {
      return this.$(".prompt").removeClass("checked");
    }
  };

  return CheckQuestion;

})(Question);
