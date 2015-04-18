var $, Question, TextListQuestion, _,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Question = require('./Question');

_ = require('underscore');

$ = require('jquery');

module.exports = TextListQuestion = (function(superClass) {
  extend(TextListQuestion, superClass);

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
    var i, index, items, j, k, l, ref, ref1, ref2;
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
    for (i = j = 0, ref = items.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      this.$("#input_" + i).val(items[i]);
    }
    for (i = k = 0, ref1 = items.length; 0 <= ref1 ? k < ref1 : k > ref1; i = 0 <= ref1 ? ++k : --k) {
      this.$("#position_" + i).html(_.template("<b><%=position%>.&nbsp;</b>")({
        position: i + 1
      }));
    }
    this.$("#position_" + items.length).html("");
    for (i = l = 0, ref2 = items.length; 0 <= ref2 ? l < ref2 : l > ref2; i = 0 <= ref2 ? ++l : --l) {
      this.$("#remove_" + i).css('visibility', 'visible');
    }
    return this.$("#remove_" + items.length).css('visibility', 'hidden');
  };

  TextListQuestion.prototype.record = function() {
    var box, items, j, len, ref;
    items = [];
    ref = this.$(".box");
    for (j = 0, len = ref.length; j < len; j++) {
      box = ref[j];
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
