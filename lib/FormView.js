var Backbone, FormView, _,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

_ = require('lodash');

Backbone = require('backbone');

module.exports = FormView = (function(_super) {
  __extends(FormView, _super);

  function FormView() {
    return FormView.__super__.constructor.apply(this, arguments);
  }

  FormView.prototype.initialize = function(options) {
    var content, _i, _len, _ref;
    this.options = options || {};
    this.contents = options.contents;
    _ref = options.contents;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      content = _ref[_i];
      this.$el.append(content.el);
      this.listenTo(content, 'close', (function(_this) {
        return function() {
          return _this.trigger('close');
        };
      })(this));
      this.listenTo(content, 'complete', (function(_this) {
        return function() {
          return _this.trigger('complete');
        };
      })(this));
      this.listenTo(content, 'discard', (function(_this) {
        return function() {
          return _this.trigger('discard');
        };
      })(this));
    }
    this.listenTo(this.model, 'change', (function(_this) {
      return function() {
        return _this.trigger('change');
      };
    })(this));
    if (options.save) {
      return this.save = options.save;
    }
  };

  FormView.prototype.remove = function() {
    var content, _i, _len, _ref;
    _ref = this.contents;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      content = _ref[_i];
      content.remove();
    }
    return FormView.__super__.remove.call(this);
  };

  FormView.prototype.load = function(data) {
    this.model.clear();
    return this.model.set(_.cloneDeep(data));
  };

  FormView.prototype.save = function() {
    return this.model.toJSON();
  };

  return FormView;

})(Backbone.View);
