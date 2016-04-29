var Question, TextQuestion, _,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Question = require('./Question');

_ = require('lodash');

module.exports = TextQuestion = (function(superClass) {
  extend(TextQuestion, superClass);

  function TextQuestion() {
    return TextQuestion.__super__.constructor.apply(this, arguments);
  }

  TextQuestion.prototype.renderAnswer = function(answerEl) {
    if (this.options.format === "multiline") {
      answerEl.html(_.template("<textarea id=\"input\" class=\"form-control\" rows=\"5\"/>")(this));
      if (this.options.readonly) {
        return answerEl.find("textarea").attr("readonly", "readonly");
      }
    } else {
      answerEl.html(_.template("<input id=\"input\" class=\"form-control\" type=\"text\"/>")(this));
      if (this.options.readonly) {
        return answerEl.find("input").attr("readonly", "readonly");
      }
    }
  };

  TextQuestion.prototype.updateAnswer = function(answerEl) {
    return answerEl.find("#input").val(this.getAnswerValue());
  };

  TextQuestion.prototype.events = {
    "change #input": "changed",
    "keydown #input": "inputKeydown"
  };

  TextQuestion.prototype.getText = function() {
    return this.$("#input").val();
  };

  TextQuestion.prototype.changed = function() {
    return this.setAnswerValue(this.getText());
  };

  TextQuestion.prototype.validateInternal = function() {
    if (this.getText() === "") {
      return false;
    }
    if (this.options.format === "email") {
      if (this.getText().match(/[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
        return false;
      }
      return true;
    }
    if (this.options.format === "url") {
      if (this.getText().match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/)) {
        return false;
      }
      return true;
    }
    return false;
  };

  TextQuestion.prototype.setFocus = function() {
    var input;
    input = this.$("#input");
    input.focus();
    return input.select();
  };

  return TextQuestion;

})(Question);
