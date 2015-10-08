var $, Question, RadioQuestion, _,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Question = require('./Question');

_ = require('lodash');

$ = require('jquery');

module.exports = RadioQuestion = (function(superClass) {
  extend(RadioQuestion, superClass);

  function RadioQuestion() {
    return RadioQuestion.__super__.constructor.apply(this, arguments);
  }

  RadioQuestion.prototype.events = {
    "click .answer .touch-radio": "checked",
    "change .specify-input": "specifyChange"
  };

  RadioQuestion.prototype.checked = function(e) {
    var index, specify, value;
    if (this.options.readonly) {
      return;
    }
    index = parseInt(e.currentTarget.getAttribute("data-value"));
    value = this.options.choices[index].id;
    if (value === this.getAnswerValue()) {
      this.setAnswerValue(null);
    } else {
      this.setAnswerValue(value);
    }
    specify = _.clone(this.getAnswerField('specify') || {});
    specify = _.pick(specify, [value]);
    return this.setAnswerField('specify', specify);
  };

  RadioQuestion.prototype.specifyChange = function(e) {
    var specify;
    specify = _.clone(this.getAnswerField('specify') || {});
    specify[$(e.currentTarget).data('id')] = $(e.currentTarget).val();
    return this.setAnswerField('specify', specify);
  };

  RadioQuestion.prototype.updateAnswer = function(answerEl) {
    answerEl.html(_.template("<div class=\"touch-radio-group\"><%=renderRadioOptions()%></div>")(this));
    if (this.options.readonly) {
      return answerEl.find(".radio-group").addClass("readonly");
    }
  };

  RadioQuestion.prototype.renderRadioOptions = function() {
    var checked, data, html, i, j, ref;
    html = "";
    for (i = j = 0, ref = this.options.choices.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      checked = this.getAnswerValue() === this.options.choices[i].id;
      data = {
        id: this.options.choices[i].id,
        position: i,
        text: this.options.choices[i].label,
        checked: checked,
        hint: this.options.choices[i].hint,
        specify: checked && this.options.choices[i].specify,
        specifyValue: (this.model.get(this.id) != null) && (this.model.get(this.id).specify != null) ? this.model.get(this.id).specify[this.options.choices[i].id] : void 0
      };
      html += require("./templates/RadioQuestionChoice.hbs")(data, {
        helpers: {
          T: this.T
        }
      });
    }
    return html;
  };

  return RadioQuestion;

})(Question);
