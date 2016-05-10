var $, DropdownQuestion, Question, _,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Question = require('./Question');

_ = require('lodash');

$ = require('jquery');

module.exports = DropdownQuestion = (function(superClass) {
  extend(DropdownQuestion, superClass);

  function DropdownQuestion() {
    return DropdownQuestion.__super__.constructor.apply(this, arguments);
  }

  DropdownQuestion.prototype.events = {
    "change select": "changed",
    "change .specify-input": "specifyChange"
  };

  DropdownQuestion.prototype.setOptions = function(options) {
    this.options.choices = options;
    return this.render();
  };

  DropdownQuestion.prototype.changed = function(e) {
    var index, specify, val, value;
    val = $(e.target).val();
    if ((val == null) || val === "") {
      this.setAnswerValue(null);
    } else {
      index = parseInt(val);
      value = this.options.choices[index].id;
      this.setAnswerValue(value);
    }
    specify = _.clone(this.getAnswerField('specify') || {});
    specify = _.pick(specify, [value || ""]);
    return this.setAnswerField('specify', specify);
  };

  DropdownQuestion.prototype.specifyChange = function(e) {
    var specify;
    specify = _.clone(this.getAnswerField('specify') || {});
    specify[$(e.currentTarget).data('id')] = $(e.currentTarget).val();
    return this.setAnswerField('specify', specify);
  };

  DropdownQuestion.prototype.updateAnswer = function(answerEl) {
    var choice, html, itemSelected;
    html = _.template("<select class=\"form-control\" style=\"width: auto;\"><%=renderDropdownOptions()%></select>")(this);
    choice = _.findWhere(this.options.choices, {
      id: this.getAnswerValue()
    });
    if (choice != null) {
      itemSelected = _.indexOf(this.options.choices, choice);
      if (this.options.choices[itemSelected].specify) {
        html += _.template('<input class="form-control specify-input" data-id="<%=id%>" type="text" id="specify_<%=id%>" value="<%=specifyValue%>">')({
          id: this.options.choices[itemSelected].id,
          specifyValue: (this.model.get(this.id) != null) && (this.model.get(this.id).specify != null) ? this.model.get(this.id).specify[this.options.choices[itemSelected].id] : void 0
        });
      }
    }
    return answerEl.html(html);
  };

  DropdownQuestion.prototype.renderDropdownOptions = function() {
    var data, html, i, j, ref, selected;
    html = "";
    html += "<option value=\"\"></option>";
    for (i = j = 0, ref = this.options.choices.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      selected = this.getAnswerValue() === this.options.choices[i].id;
      data = {
        id: this.options.choices[i].id,
        position: i,
        text: this.options.choices[i].label,
        selected: selected,
        hint: this.options.choices[i].hint
      };
      html += require("./templates/DropdownQuestionChoice.hbs")(data, {
        helpers: {
          T: this.T
        }
      });
    }
    return html;
  };

  return DropdownQuestion;

})(Question);
