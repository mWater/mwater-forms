var Backbone, Instructions, _,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Backbone = require('backbone');

_ = require('underscore');

module.exports = Instructions = (function(superClass) {
  extend(Instructions, superClass);

  function Instructions() {
    this.shouldBeVisible = bind(this.shouldBeVisible, this);
    return Instructions.__super__.constructor.apply(this, arguments);
  }

  Instructions.prototype.initialize = function(options) {
    this.options = options || {};
    this.$el.html(_.template('<div class="well well-small"><%=html%><%-text%></div>')({
      html: this.options.html,
      text: this.options.text
    }));
    if (this.model != null) {
      this.listenTo(this.model, "change", this.updateVisibility);
    }
    this.visible = true;
    if (!this.shouldBeVisible()) {
      this.$el.hide();
      return this.visible = false;
    }
  };

  Instructions.prototype.updateVisibility = function(e) {
    if (this.shouldBeVisible() && !this.visible) {
      this.$el.slideDown();
    }
    if (!this.shouldBeVisible() && this.visible) {
      this.$el.slideUp();
    }
    return this.visible = this.shouldBeVisible();
  };

  Instructions.prototype.shouldBeVisible = function() {
    if (!this.options.conditional) {
      return true;
    }
    return this.options.conditional(this.model) === true;
  };

  Instructions.prototype.setFocus = function(offset) {
    return $('html, body').animate({
      scrollTop: $("#" + this.id).offset().top - offset
    }, 1000);
  };

  return Instructions;

})(Backbone.View);
