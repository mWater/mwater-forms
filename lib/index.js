var $, Backbone, _;

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

exports.EntityQuestion = require('./EntityQuestion');

exports.Instructions = require('./Instructions');

exports.ECPlates = require('./ECPlates');

exports.TextListQuestion = require('./TextListQuestion');

exports.UnitsQuestion = require('./UnitsQuestion');

exports.FormCompiler = require('./FormCompiler');

exports.LocationView = require('./LocationView');

exports.utils = require('./utils');

exports.LocationFinder = require('./LocationFinder');

exports.FormModel = require('./FormModel');

exports.ResponseModel = require('./ResponseModel');

exports.ResponseDisplayComponent = require('./ResponseDisplayComponent');

exports.FormComponent = require('./FormComponent');

exports.schemaVersion = 11;

exports.minSchemaVersion = 1;

exports.templateView = function(template) {
  return {
    el: $('<div></div>'),
    load: function(data) {
      return $(this.el).html(template(data));
    }
  };
};

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
