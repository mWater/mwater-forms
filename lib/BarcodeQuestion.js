var BarcodeQuestion, Question, _,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

Question = require('./Question');

_ = require('lodash');

module.exports = BarcodeQuestion = (function(_super) {
  __extends(BarcodeQuestion, _super);

  function BarcodeQuestion() {
    return BarcodeQuestion.__super__.constructor.apply(this, arguments);
  }

  BarcodeQuestion.prototype.updateAnswer = function(answerEl) {
    var html, val;
    val = this.getAnswerValue();
    html = require("./templates/BarcodeQuestion.hbs")({
      supported: this.ctx.scanBarcode != null,
      value: val
    }, {
      helpers: {
        T: this.T
      }
    });
    return answerEl.html(html);
  };

  BarcodeQuestion.prototype.events = {
    'click #scan': "scan",
    'click #clear': "clear"
  };

  BarcodeQuestion.prototype.scan = function() {
    return this.ctx.scanBarcode({
      success: (function(_this) {
        return function(text) {
          return _this.setAnswerValue(text);
        };
      })(this)
    });
  };

  BarcodeQuestion.prototype.clear = function() {
    return this.setAnswerValue(null);
  };

  return BarcodeQuestion;

})(Question);
