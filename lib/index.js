var $, Backbone, SurveyView, WaterTestEditView, _,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

$ = require('jquery');

Backbone = require('backbone');

_ = require('underscore');

exports.formUtils = require('./formUtils');

exports.Sections = require('./Sections');

exports.Section = require('./Section');

exports.Question = require('./Question');

exports.RadioQuestion = require('./RadioQuestion');

exports.CheckQuestion = require('./CheckQuestion');

exports.TextQuestion = require('./TextQuestion');

exports.LocationQuestion = require('./LocationQuestion');

exports.DateQuestion = require('./DateQuestion');

exports.DropdownQuestion = require('./DropdownQuestion');

exports.NumberQuestion = require('./NumberQuestion');

exports.QuestionGroup = require('./QuestionGroup');

exports.MulticheckQuestion = require('./MulticheckQuestion');

exports.SaveCancelForm = require('./SaveCancelForm');

exports.SiteQuestion = require('./SiteQuestion');

exports.BarcodeQuestion = require('./BarcodeQuestion');

exports.ImageQuestion = require('./ImageQuestion');

exports.ImagesQuestion = require('./ImagesQuestion');

exports.Instructions = require('./Instructions');

exports.ECPlates = require('./ECPlates');

exports.TextListQuestion = require('./TextListQuestion');

exports.UnitsQuestion = require('./UnitsQuestion');

exports.FormCompiler = require('./FormCompiler');

exports.LocationView = require('./LocationView');

exports.FormView = require('./FormView');

exports.utils = require('./utils');

exports.LocationFinder = require('./LocationFinder');

exports.schemaVersion = 5;

exports.minSchemaVersion = 1;

exports.templateView = function(template) {
  return {
    el: $('<div></div>'),
    load: function(data) {
      return $(this.el).html(template(data));
    }
  };
};

exports.SurveyView = SurveyView = (function(_super) {
  __extends(SurveyView, _super);

  function SurveyView() {
    return SurveyView.__super__.constructor.apply(this, arguments);
  }

  return SurveyView;

})(exports.FormView);

exports.WaterTestEditView = WaterTestEditView = (function(_super) {
  __extends(WaterTestEditView, _super);

  function WaterTestEditView() {
    return WaterTestEditView.__super__.constructor.apply(this, arguments);
  }

  WaterTestEditView.prototype.initialize = function(options) {
    WaterTestEditView.__super__.initialize.call(this, options);
    return this.$el.append($('<div>\n    <button id="discard_button" type="button" class="btn btn-default"><span class="glyphicon glyphicon-trash"></span> Discard</button>\n    &nbsp;\n    <button id="close_button" type="button" class="btn btn-default margined">Save for Later</button>\n    &nbsp;\n    <button id="complete_button" type="button" class="btn btn-primary margined"><span class="glyphicon glyphicon-ok"></span> Complete</button>\n</div>'));
  };

  WaterTestEditView.prototype.events = {
    "click #discard_button": "discard",
    "click #close_button": "close",
    "click #complete_button": "complete"
  };

  WaterTestEditView.prototype.validate = function() {
    var items;
    items = _.filter(this.contents, function(c) {
      return c.visible && c.validate;
    });
    return !_.any(_.map(items, function(item) {
      return item.validate();
    }));
  };

  WaterTestEditView.prototype.close = function() {
    return this.trigger('close');
  };

  WaterTestEditView.prototype.discard = function() {
    return this.trigger('discard');
  };

  WaterTestEditView.prototype.complete = function() {
    if (this.validate()) {
      return this.trigger('complete');
    }
  };

  return WaterTestEditView;

})(exports.FormView);

exports.instantiateView = (function(_this) {
  return function(viewStr, options) {
    var viewFunc;
    viewFunc = new Function("options", viewStr);
    return viewFunc(options);
  };
})(this);

exports.createBase32TimeCode = function(date) {
  var base, chars, code, diff, num;
  chars = "23456789ABCDEFGHJLKMNPQRSTUVWXYZ";
  base = new Date(2013, 6, 1, 0, 0, 0, 0);
  diff = Math.floor((date.getTime() - base.getTime()) / 1000);
  code = "";
  while (diff >= 1) {
    num = diff % 32;
    diff = Math.floor(diff / 32);
    code = chars[num] + code;
  }
  return code;
};
