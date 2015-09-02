var Backbone, ControlList, FormControls, _, ezlocalize,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Backbone = require('backbone');

_ = require('underscore');

ezlocalize = require('ez-localize');

ControlList = require('./ControlList');

module.exports = FormControls = (function(superClass) {
  extend(FormControls, superClass);

  function FormControls() {
    return FormControls.__super__.constructor.apply(this, arguments);
  }

  FormControls.prototype.className = "survey";

  FormControls.prototype.initialize = function(options) {
    this.options = options || {};
    this.contents = this.options.contents;
    this.T = options.T || ezlocalize.defaultT;
    this.controlList = new ControlList(this.contents, this);
    return this.render();
  };

  FormControls.prototype.events = {
    "click #discard": "discard",
    "click #close": "close",
    "click .finish": "finish"
  };

  FormControls.prototype.validate = function() {
    return this.controlList.validate();
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
    var content, i, len, ref;
    ref = this.contents;
    for (i = 0, len = ref.length; i < len; i++) {
      content = ref[i];
      content.remove();
    }
    return FormControls.__super__.remove.call(this);
  };

  return FormControls;

})(Backbone.View);
