import $ from 'jquery';
import _ from 'lodash';
import './index.css';
export let ImageEditorComponent = require('./ImageEditorComponent');
export let ImagelistEditorComponent = require('./ImagelistEditorComponent');
export let ResponseAnswersComponent = require('./ResponseAnswersComponent');
export let formUtils = require('./formUtils');
export let conditionUtils = require('./conditionUtils');
export let AnswerValidator = require('./answers/AnswerValidator');
export let formRenderUtils = require('./formRenderUtils');
export let ECPlates = require('./ECPlates');
export let utils = require('./utils');
export let LocationFinder = require('./LocationFinder');
export let LocationEditorComponent = require('./LocationEditorComponent').default;
export let AdminRegionDataSource = require('./AdminRegionDataSource');
export let AdminRegionSelectComponent = require('./AdminRegionSelectComponent');
export let AdminRegionDisplayComponent = require('./AdminRegionDisplayComponent');
export let DateTimePickerComponent = require('./DateTimePickerComponent');
export let FormModel = require('./FormModel');
export let ResponseModel = require('./ResponseModel');
export let ResponseDisplayComponent = require('./ResponseDisplayComponent');
export let ResponseViewEditComponent = require('./ResponseViewEditComponent');
export let FormComponent = require('./FormComponent');
export let formContextTypes = require('./formContextTypes');
export let FormSchemaBuilder = require('./FormSchemaBuilder');
export let EntitySchemaBuilder = require('./EntitySchemaBuilder');
export let AssignmentModel = require('./AssignmentModel');

export let {
  CustomTablesetSchemaBuilder
} = require('./CustomTablesetSchemaBuilder');

export let ResponseDataExprValueUpdater = require('./ResponseDataExprValueUpdater').default;
export let ResponseRow = require('./ResponseRow').default;
export let RotationAwareImageComponent = require('./RotationAwareImageComponent');
export let ImageUploaderModalComponent = require('./ImageUploaderModalComponent');
export let schemaVersion = 22; // Version of the schema that this package supports (cannot compile if higher)
export let minSchemaVersion = 1; // Minimum version of forms schema that can be compiled

// JSON schema of form. Note: Not the mwater-expressions schema of the form, but rather the Json schema of the form design
export let schema = require('./schema');

// Simple form that displays a template based on loaded data
export function templateView(template) { 
  return {
    el: $('<div></div>'),
    load(data) {
      return $(this.el).html(template(data));
    }
  };
}

// Creates a form view from a string
export let instantiateView = (viewStr, options) => {
  const viewFunc = new Function("options", viewStr);
  return viewFunc(options);
};

// Create a base32 time code to write on forms
export function createBase32TimeCode(date) {
  // Characters to use (skip 1, I, 0, O)
  const chars = "23456789ABCDEFGHJLKMNPQRSTUVWXYZ";

  // Subtract date from July 1, 2013
  const base = new Date(2013, 6, 1, 0, 0, 0, 0);

  // Get seconds since
  let diff = Math.floor((date.getTime() - base.getTime()) / 1000);

  // Convert to array of base 32 characters
  let code = "";

  while (diff >= 1) {
    const num = diff % 32;
    diff = Math.floor(diff / 32);
    code = chars[num] + code;
  }

  return code;
}

