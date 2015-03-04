var Backbone, FormControls, ezlocalize, _,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

Backbone = require('backbone');

_ = require('underscore');

ezlocalize = require('ez-localize');

module.exports = FormControls = (function(_super) {
  __extends(FormControls, _super);

  function FormControls() {
    return FormControls.__super__.constructor.apply(this, arguments);
  }

  FormControls.prototype.className = "survey";

  FormControls.prototype.initialize = function(options) {
    this.options = options || {};
    this.contents = this.options.contents;
    this.T = options.T || ezlocalize.defaultT;
    return this.render();
  };

  FormControls.prototype.events = {
    "click #discard": "discard",
    "click #close": "close",
    "click .finish": "finish"
  };

  FormControls.prototype.validate = function() {
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

  FormControls.prototype.finish = function() {
    if (this.validate()) {
      return this.trigger("complete");
    }
  };

  FormControls.prototype.close = function() {
    return this.trigger("close");
  };

  FormControls.prototype.discard = function() {
    return this.trigger("discard");
  };

  FormControls.prototype.render = function() {
    this.$el.html(require('./templates/FormControls.hbs')({}, {
      helpers: {
        T: this.T
      }
    }));
    _.each(this.contents, (function(_this) {
      return function(c) {
        return _this.$("#contents").append(c.$el);
      };
    })(this));
    return this;
  };

  FormControls.prototype.remove = function() {
    var content, _i, _len, _ref;
    _ref = this.contents;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      content = _ref[_i];
      content.remove();
    }
    return FormControls.__super__.remove.call(this);
  };

  return FormControls;

})(Backbone.View);
