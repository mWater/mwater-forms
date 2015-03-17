var Backbone, QuestionGroup, _,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

_ = require('underscore');

Backbone = require('backbone');

module.exports = QuestionGroup = (function(_super) {
  __extends(QuestionGroup, _super);

  function QuestionGroup() {
    return QuestionGroup.__super__.constructor.apply(this, arguments);
  }

  QuestionGroup.prototype.initialize = function(options) {
    this.options = options || {};
    this.contents = options.contents;
    return this.render();
  };

  QuestionGroup.prototype.validate = function() {
    var items;
    items = _.filter(this.contents, function(c) {
      return c.visible && c.validate;
    });
    return !_.any(_.map(items, function(item) {
      return item.validate();
    }));
  };

  QuestionGroup.prototype.render = function() {
    this.$el.html("");
    _.each(this.contents, (function(_this) {
      return function(c) {
        return _this.$el.append(c.$el);
      };
    })(this));
    return this;
  };

  QuestionGroup.prototype.remove = function() {
    var content, _i, _len, _ref;
    _ref = this.contents;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      content = _ref[_i];
      content.remove();
    }
    return QuestionGroup.__super__.remove.call(this);
  };

  return QuestionGroup;

})(Backbone.View);
