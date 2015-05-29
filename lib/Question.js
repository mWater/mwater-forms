var $, Backbone, LocationFinder, Question, _, ezlocalize,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

$ = require('jquery');

Backbone = require('backbone');

_ = require('underscore');

LocationFinder = require('./LocationFinder');

ezlocalize = require('ez-localize');

module.exports = Question = (function(superClass) {
  extend(Question, superClass);

  function Question() {
    this.shouldBeVisible = bind(this.shouldBeVisible, this);
    return Question.__super__.constructor.apply(this, arguments);
  }

  Question.prototype.className = "question";

  Question.prototype.initialize = function(options) {
    var value;
    if (options == null) {
      options = {};
    }
    this.options = options;
    this.T = options.T || ezlocalize.defaultT;
    this.$el.addClass("question-" + (this.options.style || "default"));
    if (this.options.conditional) {
      this.listenTo(this.model, "change", this.updateVisibility);
    }
    this.listenTo(this.model, "change:" + this.id, this.update);
    this.required = this.options.required;
    this.visible = true;
    this.helpVisible = false;
    this.ctx = this.options.ctx || {};
    if (this.options.sticky && this.ctx.stickyStorage && (this.model.get(this.id) == null)) {
      value = this.ctx.stickyStorage.get(this.id);
      if (value != null) {
        this.setAnswerField("value", value);
      }
    }
    this.render();
    this.$el.on("change", "#comments", (function(_this) {
      return function() {
        return _this.setAnswerField('comments', _this.$("#comments").val());
      };
    })(this));
    this.$el.on("click", "#toggle_help", (function(_this) {
      return function() {
        _this.helpVisible = !_this.helpVisible;
        return _this.$(".help").slideToggle(_this.helpVisible);
      };
    })(this));
    return this.$el.on("click", ".alternate", (function(_this) {
      return function(ev) {
        if (_this.getAnswerField('alternate') !== ev.currentTarget.id) {
          _this.cachedAnswer = _this.getAnswerValue();
          _this.setAnswerValue(null);
          return _this.setAnswerField('alternate', ev.currentTarget.id);
        } else {
          _this.setAnswerValue(_this.cachedAnswer);
          return _this.setAnswerField('alternate', null);
        }
      };
    })(this));
  };

  Question.prototype.isAnswered = function() {
    return (this.getAnswerValue() != null) && this.getAnswerValue() !== "";
  };

  Question.prototype.validate = function() {
    var val;
    val = void 0;
    if (this.required) {
      if (!this.isAnswered() && !this.getAnswerField('alternate')) {
        val = true;
      }
    }
    if (!val && this.validateInternal) {
      val = this.validateInternal();
    }
    if (!val && this.options.validate && this.isAnswered()) {
      val = this.options.validate();
    }
    if (val) {
      this.$el.addClass("invalid");
      if (typeof val === "string") {
        this.$(".validation-message").text(val);
      } else {
        this.$(".validation-message").text("");
      }
    } else {
      this.$el.removeClass("invalid");
      this.$(".validation-message").text("");
    }
    return val;
  };

  Question.prototype.updateVisibility = function(e) {
    if (this.shouldBeVisible() && !this.visible) {
      this.$el.slideDown();
    }
    if (!this.shouldBeVisible() && this.visible) {
      this.$el.slideUp();
    }
    return this.visible = this.shouldBeVisible();
  };

  Question.prototype.shouldBeVisible = function() {
    if (!this.options.conditional) {
      return true;
    }
    return this.options.conditional(this.model) === true;
  };

  Question.prototype.renderAnswer = function(answerEl) {};

  Question.prototype.updateAnswer = function(answerEl) {};

  Question.prototype.update = function(initial) {
    if (initial == null) {
      initial = false;
    }
    if (initial || !_.isEqual(this.getAnswerValue(), this.currentAnswer)) {
      this.updateAnswer(this.$(".answer"));
      this.currentAnswer = this.getAnswerValue();
    }
    if (this.options.commentsField) {
      this.$("#comments").val(this.getAnswerField('comments'));
    }
    this.$(".alternate").removeClass("checked");
    if (this.options.alternates) {
      if ((this.getAnswerValue() != null) && this.getAnswerField('alternate')) {
        this.setAnswerField('alternate', null);
      }
      if (this.getAnswerField('alternate')) {
        return this.$("#" + this.getAnswerField('alternate')).addClass("checked");
      }
    }
  };

  Question.prototype.render = function() {
    this.$el.html(require("./Question.hbs")(this, {
      helpers: {
        T: this.T
      }
    }));
    if (!this.shouldBeVisible()) {
      this.$el.hide();
      this.visible = false;
    }
    this.renderAnswer(this.$(".answer"));
    this.update(true);
    this.currentAnswer = this.getAnswerValue();
    return this;
  };

  Question.prototype.setAnswerField = function(field, val) {
    var entry;
    entry = this.model.get(this.id) || {};
    entry = _.clone(entry);
    entry[field] = val;
    return this.model.set(this.id, entry);
  };

  Question.prototype.setAnswerValue = function(val) {
    var locationFinder;
    this.setAnswerField('value', val);
    if (this.options.recordTimestamp && !this.getAnswerField('timestamp')) {
      this.setAnswerField('timestamp', new Date().toISOString());
    }
    if (this.options.recordLocation && !this.getAnswerField('location')) {
      locationFinder = this.ctx.locationFinder || new LocationFinder();
      locationFinder.getLocation((function(_this) {
        return function(loc) {
          if (loc != null) {
            return _this.setAnswerField('location', _.pick(loc.coords, "latitude", "longitude", "accuracy", "altitude", "altitudeAccuracy"));
          }
        };
      })(this), function() {
        return console.log("Location not found for recordLocation in Question");
      });
    }
    if (this.options.sticky && this.ctx.stickyStorage) {
      return this.ctx.stickyStorage.set(this.id, val);
    }
  };

  Question.prototype.getAnswerField = function(field) {
    var entry;
    entry = this.model.get(this.id) || {};
    return entry[field];
  };

  Question.prototype.getAnswerValue = function() {
    return this.getAnswerField('value');
  };

  return Question;

})(Backbone.View);
