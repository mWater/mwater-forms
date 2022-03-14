"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.minSchemaVersion = exports.schemaVersion = void 0;
require("./index.css");
exports.formUtils = __importStar(require("./formUtils"));
exports.formRenderUtils = __importStar(require("./formRenderUtils"));
__exportStar(require("./form"), exports);
__exportStar(require("./formDesign"), exports);
__exportStar(require("./response"), exports);
__exportStar(require("./formContext"), exports);
var LocationEditorComponent_1 = require("./LocationEditorComponent");
Object.defineProperty(exports, "LocationEditorComponent", { enumerable: true, get: function () { return LocationEditorComponent_1.default; } });
var LocationFinder_1 = require("./LocationFinder");
Object.defineProperty(exports, "LocationFinder", { enumerable: true, get: function () { return LocationFinder_1.default; } });
var ResponseRow_1 = require("./ResponseRow");
Object.defineProperty(exports, "ResponseRow", { enumerable: true, get: function () { return ResponseRow_1.default; } });
var ImageEditorComponent_1 = require("./ImageEditorComponent");
Object.defineProperty(exports, "ImageEditorComponent", { enumerable: true, get: function () { return ImageEditorComponent_1.default; } });
var ImagelistEditorComponent_1 = require("./ImagelistEditorComponent");
Object.defineProperty(exports, "ImagelistEditorComponent", { enumerable: true, get: function () { return ImagelistEditorComponent_1.default; } });
var DateTimePickerComponent_1 = require("./DateTimePickerComponent");
Object.defineProperty(exports, "DateTimePickerComponent", { enumerable: true, get: function () { return DateTimePickerComponent_1.default; } });
var FormComponent_1 = require("./FormComponent");
Object.defineProperty(exports, "FormComponent", { enumerable: true, get: function () { return FormComponent_1.default; } });
var ResponseModel_1 = require("./ResponseModel");
Object.defineProperty(exports, "ResponseModel", { enumerable: true, get: function () { return ResponseModel_1.default; } });
var ResponseViewEditComponent_1 = require("./ResponseViewEditComponent");
Object.defineProperty(exports, "ResponseViewEditComponent", { enumerable: true, get: function () { return ResponseViewEditComponent_1.default; } });
var ImageUploaderModalComponent_1 = require("./ImageUploaderModalComponent");
Object.defineProperty(exports, "ImageUploaderModalComponent", { enumerable: true, get: function () { return ImageUploaderModalComponent_1.default; } });
var CustomTablesetSchemaBuilder_1 = require("./CustomTablesetSchemaBuilder");
Object.defineProperty(exports, "CustomTablesetSchemaBuilder", { enumerable: true, get: function () { return CustomTablesetSchemaBuilder_1.CustomTablesetSchemaBuilder; } });
var RotationAwareImageComponent_1 = require("./RotationAwareImageComponent");
Object.defineProperty(exports, "RotationAwareImageComponent", { enumerable: true, get: function () { return RotationAwareImageComponent_1.default; } });
var FormSchemaBuilder_1 = require("./FormSchemaBuilder");
Object.defineProperty(exports, "FormSchemaBuilder", { enumerable: true, get: function () { return FormSchemaBuilder_1.default; } });
var ResponseDataExprValueUpdater_1 = require("./ResponseDataExprValueUpdater");
Object.defineProperty(exports, "ResponseDataExprValueUpdater", { enumerable: true, get: function () { return ResponseDataExprValueUpdater_1.default; } });
exports.conditionUtils = __importStar(require("./conditionUtils"));
exports.utils = __importStar(require("./utils"));
var ResponseAnswersComponent_1 = require("./ResponseAnswersComponent");
Object.defineProperty(exports, "ResponseAnswersComponent", { enumerable: true, get: function () { return ResponseAnswersComponent_1.default; } });
var AnswerValidator_1 = require("./answers/AnswerValidator");
Object.defineProperty(exports, "AnswerValidator", { enumerable: true, get: function () { return AnswerValidator_1.default; } });
exports.ECPlates = __importStar(require("./ECPlates"));
var AdminRegionDataSource_1 = require("./AdminRegionDataSource");
Object.defineProperty(exports, "AdminRegionDataSource", { enumerable: true, get: function () { return AdminRegionDataSource_1.default; } });
var AdminRegionSelectComponent_1 = require("./AdminRegionSelectComponent");
Object.defineProperty(exports, "AdminRegionSelectComponent", { enumerable: true, get: function () { return AdminRegionSelectComponent_1.default; } });
var AdminRegionDisplayComponent_1 = require("./AdminRegionDisplayComponent");
Object.defineProperty(exports, "AdminRegionDisplayComponent", { enumerable: true, get: function () { return AdminRegionDisplayComponent_1.default; } });
var FormModel_1 = require("./FormModel");
Object.defineProperty(exports, "FormModel", { enumerable: true, get: function () { return FormModel_1.default; } });
var ResponseDisplayComponent_1 = require("./ResponseDisplayComponent");
Object.defineProperty(exports, "ResponseDisplayComponent", { enumerable: true, get: function () { return ResponseDisplayComponent_1.default; } });
exports.formContextTypes = __importStar(require("./formContextTypes"));
var EntitySchemaBuilder_1 = require("./EntitySchemaBuilder");
Object.defineProperty(exports, "EntitySchemaBuilder", { enumerable: true, get: function () { return EntitySchemaBuilder_1.default; } });
var AssignmentModel_1 = require("./AssignmentModel");
Object.defineProperty(exports, "AssignmentModel", { enumerable: true, get: function () { return AssignmentModel_1.default; } });
exports.schemaVersion = 22; // Version of the schema that this package supports (cannot compile if higher)
exports.minSchemaVersion = 1; // Minimum version of forms schema that can be compiled
// JSON schema of form. Note: Not the mwater-expressions schema of the form, but rather the Json schema of the form design
exports.schema = __importStar(require("./schema"));
