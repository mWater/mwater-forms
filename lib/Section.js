var Backbone, Section, _,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

Backbone = require('backbone');

_ = require('underscore');

module.exports = Section = (function(_super) {
  __extends(Section, _super);

  function Section() {
    return Section.__super__.constructor.apply(this, arguments);
  }

  Section.prototype.className = "section";

  Section.prototype.template = _.template("<div class=\"contents\"></div>");

  Section.prototype.initialize = function(options) {
    this.options = options || {};
    this.name = this.options.name;
    this.contents = this.options.contents;
    this.$el.hide();
    this.render();
  };

  Section.prototype.shouldBeVisible = function() {
    if (!this.options.conditional) {
      return true;
    }
    return this.options.conditional(this.model);
  };

  Section.prototype.validate = function() {
    var i, items, results, _i, _ref;
    items = _.filter(this.contents, function(c) {
      return c.visible && c.validate;
    });
    results = _.map(items, function(item) {
      return item.validate();
    });
    for (i = _i = 0, _ref = items.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      if (results[i]) {
        items[i].$el.scrollintoview();
      }
    }
    return !_.any(results);
  };

  Section.prototype.render = function() {
    var contentsEl;
    this.$el.html(this.template(this));
    contentsEl = this.$(".contents");
    _.each(this.contents, function(c) {
      return contentsEl.append(c.$el);
    });
    return this;
  };

  Section.prototype.remove = function() {
    var content, _i, _len, _ref;
    _ref = this.contents;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      content = _ref[_i];
      content.remove();
    }
    return Section.__super__.remove.call(this);
  };

  return Section;

})(Backbone.View);
