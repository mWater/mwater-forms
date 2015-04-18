var $, MulticheckQuestion, Question, _,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Question = require('./Question');

_ = require('underscore');

$ = require('jquery');

module.exports = MulticheckQuestion = (function(superClass) {
  extend(MulticheckQuestion, superClass);

  function MulticheckQuestion() {
    return MulticheckQuestion.__super__.constructor.apply(this, arguments);
  }

  MulticheckQuestion.prototype.events = {
    "click .choice": "checked",
    "change .specify-input": "specifyChange"
  };

  MulticheckQuestion.prototype.checked = function(e) {
    var opts, specify, value;
    value = [];
    opts = this.options.choices;
    $(e.currentTarget).toggleClass("checked");
    this.$(".choice").each(function(index, el) {
      var pos;
      pos = parseInt($(el).data("value"));
      if ($(this).hasClass("checked")) {
        return value.push(opts[pos].id);
      }
    });
    this.setAnswerValue(value);
    specify = _.clone(this.getAnswerField('specify') || {});
    specify = _.pick(specify, value);
    return this.setAnswerField('specify', specify);
  };

  MulticheckQuestion.prototype.specifyChange = function(e) {
    var specify;
    specify = _.clone(this.getAnswerField('specify') || {});
    specify[$(e.currentTarget).data('id')] = $(e.currentTarget).val();
    return this.setAnswerField('specify', specify);
  };

  MulticheckQuestion.prototype.updateAnswer = function(answerEl) {
    var checked, data, html, i, j, ref, results;
    answerEl.empty();
    results = [];
    for (i = j = 0, ref = this.options.choices.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      checked = this.getAnswerValue() && _.contains(this.getAnswerValue(), this.options.choices[i].id);
      data = {
        id: this.options.choices[i].id,
        position: i,
        text: this.options.choices[i].label,
        checked: checked,
        hint: this.options.choices[i].hint,
        specify: checked && this.options.choices[i].specify,
        specifyValue: (this.model.get(this.id) != null) && (this.model.get(this.id).specify != null) ? this.model.get(this.id).specify[this.options.choices[i].id] : void 0
      };
      html = require("./templates/MulticheckQuestionChoice.hbs")(data, {
        helpers: {
          T: this.T
        }
      });
      results.push(answerEl.append($(html)));
    }
    return results;
  };

  return MulticheckQuestion;

})(Question);
