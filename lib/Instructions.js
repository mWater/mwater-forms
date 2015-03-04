var Backbone, _;

Backbone = require('backbone');

_ = require('underscore');

module.exports = Backbone.View.extend({
  initialize: function(options) {
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
  },
  updateVisibility: function(e) {
    if (this.shouldBeVisible() && !this.visible) {
      this.$el.slideDown();
    }
    if (!this.shouldBeVisible() && this.visible) {
      this.$el.slideUp();
    }
    return this.visible = this.shouldBeVisible();
  },
  shouldBeVisible: function() {
    if (!this.options.conditional) {
      return true;
    }
    return this.options.conditional(this.model) === true;
  }
});
