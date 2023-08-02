import _ from "lodash"
import "./index.css"

export * as formUtils from "./formUtils"
export * as formRenderUtils from "./formRenderUtils"

export * from "./form"
export * from "./formDesign"
export * from "./response"

export * from "./formContext"

export { default as LocationEditorComponent, Location } from "./LocationEditorComponent"
export { default as LocationFinder } from "./LocationFinder"
export { default as ResponseRow } from "./ResponseRow"
export { default as ImageEditorComponent } from "./ImageEditorComponent"
export { default as ImagelistEditorComponent } from "./ImagelistEditorComponent"
export { default as DateTimePickerComponent } from "./DateTimePickerComponent"
export { default as FormComponent } from "./FormComponent"
export { default as ResponseModel } from "./ResponseModel"
export { default as ResponseViewEditComponent } from "./ResponseViewEditComponent"
export { default as ImageUploaderModalComponent } from "./ImageUploaderModalComponent"
export { CustomTablesetSchemaBuilder } from "./CustomTablesetSchemaBuilder"
export { default as RotationAwareImageComponent } from "./RotationAwareImageComponent"
export { default as FormSchemaBuilder } from "./FormSchemaBuilder"
export { default as ResponseDataExprValueUpdater } from "./ResponseDataExprValueUpdater"

export * as conditionUtils from "./conditionUtils"
export * as utils from "./utils"
export { default as ResponseAnswersComponent } from "./ResponseAnswersComponent"
export { default as AnswerValidator } from "./answers/AnswerValidator"
export { default as FormModel } from "./FormModel"
export { default as ResponseDisplayComponent } from "./ResponseDisplayComponent"
export * as formContextTypes from "./formContextTypes"
export { default as AssignmentModel } from "./AssignmentModel"

export let schemaVersion = 22 // Version of the schema that this package supports (cannot compile if higher)
export let minSchemaVersion = 1 // Minimum version of forms schema that can be compiled

// JSON schema of form. Note: Not the mwater-expressions schema of the form, but rather the Json schema of the form design
export * as schema from "./schema"
