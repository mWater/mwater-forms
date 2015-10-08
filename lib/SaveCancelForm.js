var Backbone, _, ezlocalize;

ezlocalize = require('ez-localize');

Backbone = require('backbone');

_ = require('lodash');

module.exports = Backbone.View.extend({
  initialize: function(options) {
    this.options = options || {};
    this.T = options.T || ezlocalize.defaultT;
    this.contents = this.options.contents;
    return this.render();
  },
  events: {
    'click #save_button': 'save',
    'click #cancel_button': 'cancel'
  },
  validate: function() {
    var items;
    items = _.filter(this.contents, function(c) {
      return c.visible && c.validate;
    });
    return !_.any(_.map(items, function(item) {
      return item.validate();
    }));
  },
  render: function() {
    this.$el.html('<div id="contents"></div>\n<div>\n    <button id="save_button" type="button" class="btn btn-primary margined">' + this.T("Save") + '</button>\n&nbsp;\n<button id="cancel_button" type="button" class="btn btn-default margined">' + this.T("Cancel") + '</button>\n</div>');
    _.each(this.contents, (function(_this) {
      return function(c) {
        return _this.$('#contents').append(c.$el);
      };
    })(this));
    return this;
  },
  save: function() {
    if (this.validate()) {
      return this.trigger('save');
    }
  },
  cancel: function() {
    return this.trigger('cancel');
  }
});
