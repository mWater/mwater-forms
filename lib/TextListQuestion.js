var $, Question, TextListQuestion, _,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

Question = require('./Question');

_ = require('underscore');

$ = require('jquery');

module.exports = TextListQuestion = (function(_super) {
  __extends(TextListQuestion, _super);

  function TextListQuestion() {
    return TextListQuestion.__super__.constructor.apply(this, arguments);
  }

  TextListQuestion.prototype.events = {
    "input .box": "record",
    "click .remove": "removeItem"
  };

  TextListQuestion.prototype.renderAnswer = function(answerEl) {
    return answerEl.html('<table style="width:100%">\n</table>');
  };

  TextListQuestion.prototype.updateAnswer = function(answerEl) {
    var i, index, items, _i, _j, _k, _ref, _ref1, _ref2;
    items = this.getAnswerValue() || [];
    while (this.$("tr").length < items.length + 1) {
      index = this.$("tr").length;
      this.$("table").append($(_.template('<tr id="row_<%=index%>">\n  <td id="position_<%=index%>"></td>\n  <td>\n    <div class="input-group">\n      <input type="text" id="input_<%=index%>" class="form-control box">\n      <span class="input-group-btn">\n        <button class="btn btn-link remove" id="remove_<%=index%>" data-index="<%=index%>" type="button">\n          <span class="glyphicon glyphicon-remove"></span>\n        </button>\n      </span>\n    </div>\n  </td>\n</tr>        ')({
        index: index
      })));
    }
    while (this.$("tr").length > items.length + 1) {
      this.$("tr:last-child").remove();
    }
    for (i = _i = 0, _ref = items.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      this.$("#input_" + i).val(items[i]);
    }
    for (i = _j = 0, _ref1 = items.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
      this.$("#position_" + i).html(_.template("<b><%=position%>.&nbsp;</b>")({
        position: i + 1
      }));
    }
    this.$("#position_" + items.length).html("");
    for (i = _k = 0, _ref2 = items.length; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; i = 0 <= _ref2 ? ++_k : --_k) {
      this.$("#remove_" + i).css('visibility', 'visible');
    }
    return this.$("#remove_" + items.length).css('visibility', 'hidden');
  };

  TextListQuestion.prototype.record = function() {
    var box, items, _i, _len, _ref;
    items = [];
    _ref = this.$(".box");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      box = _ref[_i];
      box = $(box);
      items.push(box.val());
    }
    if (_.last(items) === "") {
      items = items.slice(0, -1);
    }
    return this.setAnswerValue(items);
  };

  TextListQuestion.prototype.removeItem = function(ev) {
    var index, items;
    items = _.clone(this.getAnswerValue());
    index = parseInt($(ev.currentTarget).data("index"));
    items.splice(index, 1);
    return this.setAnswerValue(items);
  };

  return TextListQuestion;

})(Question);
