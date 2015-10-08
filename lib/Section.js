var Backbone, ControlList, Section, _,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Backbone = require('backbone');

_ = require('lodash');

ControlList = require('./ControlList');

module.exports = Section = (function(superClass) {
  extend(Section, superClass);

  function Section() {
    this.shouldBeVisible = bind(this.shouldBeVisible, this);
    return Section.__super__.constructor.apply(this, arguments);
  }

  Section.prototype.className = "section";

  Section.prototype.template = _.template("<div class=\"contents\"></div>");

  Section.prototype.initialize = function(options) {
    this.options = options || {};
    this.name = this.options.name;
    this.contents = this.options.contents;
    this.controlList = new ControlList(this.contents, this);
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
    return this.controlList.validate();
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
    var content, i, len, ref;
    ref = this.contents;
    for (i = 0, len = ref.length; i < len; i++) {
      content = ref[i];
      content.remove();
    }
    return Section.__super__.remove.call(this);
  };

  return Section;

})(Backbone.View);
