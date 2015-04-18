var Backbone, FormView, _,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require('lodash');

Backbone = require('backbone');

module.exports = FormView = (function(superClass) {
  extend(FormView, superClass);

  function FormView() {
    return FormView.__super__.constructor.apply(this, arguments);
  }

  FormView.prototype.initialize = function(options) {
    var content, i, len, ref;
    this.options = options || {};
    this.contents = options.contents;
    this.setEntity = options.setEntity || (function() {
      throw new Error("Not supported");
    });
    this.getEntityCreates = options.getEntityCreates || (function() {
      return [];
    });
    this.getEntityUpdates = options.getEntityUpdates || (function() {
      return [];
    });
    ref = options.contents;
    for (i = 0, len = ref.length; i < len; i++) {
      content = ref[i];
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
    var content, i, len, ref;
    ref = this.contents;
    for (i = 0, len = ref.length; i < len; i++) {
      content = ref[i];
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
