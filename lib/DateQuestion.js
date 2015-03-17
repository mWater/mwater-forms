var $, DateQuestion, Question, moment, _,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

_ = require('underscore');

$ = require('jquery');

Question = require('./Question');

moment = require('moment');

require('bootstrap-datetimepicker/src/js/bootstrap-datetimepicker');

module.exports = DateQuestion = (function(_super) {
  __extends(DateQuestion, _super);

  function DateQuestion() {
    return DateQuestion.__super__.constructor.apply(this, arguments);
  }

  DateQuestion.prototype.initialize = function(options) {
    if (options == null) {
      options = {};
    }
    _.defaults(options, {
      format: "YYYY-MM-DD"
    });
    if (options.format.match(/ss|LLL|lll/)) {
      this.detailLevel = 5;
    } else if (options.format.match(/m/)) {
      this.detailLevel = 4;
    } else if (options.format.match(/h|H/)) {
      this.detailLevel = 3;
    } else if (options.format.match(/D|l|L/)) {
      this.detailLevel = 2;
      this.isoFormat = "YYYY-MM-DD";
    } else if (options.format.match(/M/)) {
      this.detailLevel = 1;
      this.isoFormat = "YYYY-MM";
    } else if (options.format.match(/Y/)) {
      this.detailLevel = 0;
      this.isoFormat = "YYYY";
    } else {
      throw new Error("Invalid format: " + options.format);
    }
    if (!options.placeholder) {
      if (!options.format.match(/l|L/)) {
        options.placeholder = options.format;
      }
    }
    return DateQuestion.__super__.initialize.call(this, options);
  };

  DateQuestion.prototype.events = {
    "dp.change #datetimepicker": function() {
      this.$(".form-group").removeClass("has-error");
      return this.save();
    },
    "dp.error #datetimepicker": function() {
      if (this.$("#date_input").val()) {
        return this.$(".form-group").addClass("has-error");
      }
    }
  };

  DateQuestion.prototype.save = function() {
    var date;
    date = this.$('#datetimepicker').data("DateTimePicker").date();
    if (!date) {
      this.setAnswerValue(null);
      return;
    }
    if (this.isoFormat) {
      date = date.format(this.isoFormat);
    } else {
      date = date.toISOString();
    }
    switch (this.detailLevel) {
      case 0:
        date = date.substring(0, 4);
        break;
      case 1:
        date = date.substring(0, 7);
        break;
      case 2:
        date = date.substring(0, 10);
        break;
      case 3:
        date = date.substring(0, 13) + "Z";
        break;
      case 4:
        date = date.substring(0, 16) + "Z";
        break;
      case 5:
        date = date.substring(0, 19) + "Z";
        break;
      default:
        throw new Error("Invalid detail level");
    }
    return this.setAnswerValue(date);
  };

  DateQuestion.prototype.renderAnswer = function(answerEl) {
    var pickerOptions;
    answerEl.html(require('./templates/DateQuestion.hbs')({
      placeholder: this.options.placeholder
    }));
    if (this.options.readonly) {
      return answerEl.find("input").attr('readonly', 'readonly');
    } else {
      pickerOptions = {
        format: this.options.format,
        useCurrent: false,
        showTodayButton: true
      };
      return this.$('#datetimepicker').datetimepicker(pickerOptions);
    }
  };

  DateQuestion.prototype.updateAnswer = function(answerEl) {
    var dateTimePicker, value;
    value = this.getAnswerValue();
    if (value) {
      if (this.isoFormat) {
        value = moment(value, this.isoFormat);
      } else {
        value = moment(value, moment.ISO_8601);
      }
    }
    if (this.options.readonly) {
      if (value) {
        return this.$("#date_input").val(value.format(this.options.format));
      } else {
        return this.$("#date_input").val("");
      }
    } else {
      dateTimePicker = this.$('#datetimepicker').data("DateTimePicker");
      if (dateTimePicker) {
        return dateTimePicker.date(value || null);
      } else {
        return _.defer((function(_this) {
          return function() {
            dateTimePicker = _this.$('#datetimepicker').data("DateTimePicker");
            if (dateTimePicker) {
              return dateTimePicker.date(value || null);
            }
          };
        })(this));
      }
    }
  };

  DateQuestion.prototype.validateInternal = function() {
    return this.$(".form-group").hasClass("has-error");
  };

  DateQuestion.prototype.remove = function() {
    var dateTimePicker;
    dateTimePicker = this.$('#datetimepicker').data("DateTimePicker");
    if (dateTimePicker) {
      this.$('#datetimepicker').data("DateTimePicker").destroy();
    }
    return DateQuestion.__super__.remove.call(this);
  };

  return DateQuestion;

})(Question);
