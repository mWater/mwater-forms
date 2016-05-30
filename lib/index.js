var $, _;

$ = require('jquery');

_ = require('lodash');

exports.ImageEditorComponent = require('./ImageEditorComponent');

exports.ImagelistEditorComponent = require('./ImagelistEditorComponent');

exports.ResponseAnswersComponent = require('./ResponseAnswersComponent');

exports.LocationView = require('./legacy/LocationView');

exports.formUtils = require('./formUtils');

exports.conditionsUtils = require('./conditionsUtils');

exports.AnswerValidator = require('./answers/AnswerValidator');

exports.formRenderUtils = require('./formRenderUtils');

exports.ECPlates = require('./ECPlates');

exports.utils = require('./utils');

exports.LocationFinder = require('./LocationFinder');

exports.LocationEditorComponent = require('./LocationEditorComponent');

exports.AdminRegionDataSource = require('./AdminRegionDataSource');

exports.AdminRegionSelectComponent = require('./AdminRegionSelectComponent');

exports.AdminRegionDisplayComponent = require('./AdminRegionDisplayComponent');

exports.DateTimePickerComponent = require('./DateTimePickerComponent');

exports.FormModel = require('./FormModel');

exports.ResponseModel = require('./ResponseModel');

exports.ResponseDisplayComponent = require('./ResponseDisplayComponent');

exports.FormComponent = require('./FormComponent');

exports.formContextTypes = require('./formContextTypes');

exports.FormSchemaBuilder = require('./FormSchemaBuilder');

exports.AssignmentModel = require('./AssignmentModel');

exports.ResponseDataExprValueUpdater = require('./ResponseDataExprValueUpdater');

exports.schemaVersion = 14;

exports.minSchemaVersion = 1;

exports.schema = require('./schema');

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
