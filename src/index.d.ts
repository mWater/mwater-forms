export { default as formUtils } from "./formUtils"
export { default as formRenderUtils } from "./formRenderUtils"

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
export { CustomTablesetSchemaBuilder } from './CustomTablesetSchemaBuilder'
export { default as RotationAwareImageComponent } from './RotationAwareImageComponent'
export { default as FormSchemaBuilder } from './FormSchemaBuilder'
export { default as ResponseDataExprValueUpdater } from './ResponseDataExprValueUpdater'

// export class AdminRegionDataSource {
//   constructor(apiUrl: any);
//   getAdminRegionPath(id: any, callback: any): any;
//   getSubAdminRegions(id: any, level: any, callback: any): any;
//   findAdminRegionByLatLng(lat: any, lng: any, callback: any): any;
//   apiUrl: any;
// }
// export class AdminRegionDisplayComponent {
//   constructor(...args: any[]);
//   componentWillMount(): any;
//   componentWillReceiveProps(nextProps: any): any;
//   componentWillUnmount(): any;
//   forceLoad(): any;
//   forceUpdate(callback: any): void;
//   isLoadNeeded(newProps: any, oldProps: any): any;
//   load(props: any, prevProps: any, callback: any): any;
//   render(): any;
//   setState(partialState: any, callback: any): void;
// }
// export namespace AdminRegionDisplayComponent {
//   namespace propTypes {
//     function T(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function getAdminRegionPath(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function value(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace value {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//   }
// }
// export class AdminRegionSelectComponent {
//   constructor(...args: any[]);
//   componentWillMount(props: any): any;
//   componentWillReceiveProps(nextProps: any): any;
//   componentWillUnmount(): any;
//   forceLoad(): any;
//   forceUpdate(callback: any): void;
//   handleChange(level: any, ev: any): any;
//   isLoadNeeded(newProps: any, oldProps: any): any;
//   load(props: any, prevProps: any, callback: any): any;
//   render(): any;
//   renderLevel(level: any): any;
//   setState(partialState: any, callback: any): void;
// }
// export namespace AdminRegionSelectComponent {
//   namespace propTypes {
//     function T(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function getAdminRegionPath(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function getSubAdminRegions(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function onChange(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function value(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace value {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//   }
// }
// export class AnswerValidator {
//   constructor(schema: any, responseRow: any, locale: any);
//   schema: any;
//   responseRow: any;
//   locale: any;
//   validate(_x: any, _x2: any, ...args: any[]): any;
//   validateLikertQuestion(question: any, answer: any): any;
//   validateMatrixQuestion(question: any, answer: any): any;
//   validateNumberQuestion(question: any, answer: any): any;
//   validateSiteQuestion(question: any, answer: any): any;
//   validateSpecificAnswerType(question: any, answer: any): any;
//   validateTextQuestion(question: any, answer: any): any;
//   validateUnitsQuestion(question: any, answer: any): any;
// }
// export class AssignmentModel {
//   constructor(options: any);
//   assignment: any;
//   form: any;
//   user: any;
//   groups: any;
//   canManage(): any;
//   canView(): any;
//   fixRoles(): any;
// }
// export class DateTimePickerComponent {
//   static defaultProps: {
//     timepicker: boolean;
//   };
//   constructor(...args: any[]);
//   componentDidMount(): any;
//   componentWillReceiveProps(nextProps: any): any;
//   componentWillUnmount(): any;
//   createNativeComponent(props: any): any;
//   destroyNativeComponent(): any;
//   forceUpdate(callback: any): void;
//   handleInputFocus(): any;
//   onChange(event: any): any;
//   render(): any;
//   setState(partialState: any, callback: any): void;
// }
// export namespace DateTimePickerComponent {
//   namespace propTypes {
//     function date(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace date {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function defaultDate(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace defaultDate {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function format(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace format {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function onChange(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace onChange {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function showClear(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace showClear {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function showTodayButton(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace showTodayButton {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function timepicker(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace timepicker {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//   }
// }
// export namespace ECPlates {
//   function isAvailable(success: any, error: any): any;
//   function processImage(imgUrl: any, success: any, error: any): any;
// }
// export class EntitySchemaBuilder {
//   addEntities(schema: any, entityTypes: any, propFilter: any): any;
// }
// export class FormComponent {
//   constructor(props: any);
//   componentDidUpdate(prevProps: any): any;
//   componentWillMount(): any;
//   componentWillReceiveProps(nextProps: any): any;
//   createLocalizer(design: any, locale: any): any;
//   createResponseRow(data: any): any;
//   forceUpdate(callback: any): void;
//   getChildContext(): any;
//   handleDataChange(data: any): any;
//   handleNext(): any;
//   handleSubmit(...args: any[]): any;
//   isVisible(itemId: any): any;
//   render(): any;
//   setState(partialState: any, callback: any): void;
// }
// export namespace FormComponent {
//   namespace childContextTypes {
//     function T(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function canEditEntity(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace canEditEntity {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function disableConfidentialFields(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace disableConfidentialFields {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function displayMap(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace displayMap {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function editEntity(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace editEntity {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function findAdminRegionByLatLng(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function getAdminRegionPath(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function getEntityByCode(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace getEntityByCode {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function getEntityById(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace getEntityById {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function getSubAdminRegions(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function imageAcquirer(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace imageAcquirer {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function imageManager(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function locale(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace locale {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function locationFinder(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace locationFinder {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function renderEntityListItemView(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function renderEntitySummaryView(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function scanBarcode(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace scanBarcode {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function selectEntity(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace selectEntity {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function stickyStorage(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace stickyStorage {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//   }
//   namespace propTypes {
//     function data(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function deployment(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function design(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function disableConfidentialFields(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace disableConfidentialFields {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function discardLabel(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace discardLabel {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function entity(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace entity {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function entityType(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace entityType {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function formCtx(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function locale(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace locale {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function onDataChange(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function onDiscard(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace onDiscard {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function onSaveLater(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace onSaveLater {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function onSubmit(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace onSubmit {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function saveLaterLabel(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace saveLaterLabel {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function schema(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function singlePageMode(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace singlePageMode {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function submitLabel(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace submitLabel {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//   }
// }
// export class FormModel {
//   constructor(form: any);
//   form: any;
//   amAdmin(user: any, groups: any): any;
//   amDeploy(user: any, groups: any): any;
//   amDeploymentAdmin(user: any, groups: any): any;
//   canChangeRole(role: any): any;
//   canDeleteRole(role: any): any;
//   correctViewers(): any;
//   getDeploymentSubjects(): any;
// }
// export class FormSchemaBuilder {
//   addCalculations(schema: any, form: any): any;
//   addConfidentialData(schema: any, form: any, conditionsExprCompiler: any): any;
//   addConfidentialDataForRosters(schema: any, form: any, conditionsExprCompiler: any): any;
//   addForm(schema: any, form: any, cloneFormsDeprecated: any, ...args: any[]): any;
//   addFormItem(item: any, contents: any, tableId: any, conditionsExprCompiler: any, existingConditionExpr: any, ...args: any[]): any;
//   addIndicatorCalculations(schema: any, form: any, indicators: any): any;
//   addReverseJoins(schema: any, form: any, reverseJoins: any): any;
//   addRosterTables(schema: any, design: any, conditionsExprCompiler: any, reverseJoins: any, tableId: any): any;
//   createIndicatorCalculationSection(indicatorCalculation: any, schema: any, indicators: any, form: any): any;
// }
// export class ImageEditorComponent {
//   constructor(...args: any[]);
//   forceUpdate(callback: any): void;
//   getChildContext(): any;
//   render(): any;
//   setState(partialState: any, callback: any): void;
// }
// export namespace ImageEditorComponent {
//   namespace childContextTypes {
//     function T(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function imageAcquirer(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace imageAcquirer {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function imageManager(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//   }
//   namespace propTypes {
//     function T(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function consentPrompt(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace consentPrompt {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function image(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace image {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function imageAcquirer(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace imageAcquirer {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function imageManager(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function onImageChange(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace onImageChange {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//   }
// }
// export class ImageUploaderModalComponent {
//   static show(apiUrl: any, client: any, T: any, success: any, forceCamera: any): any;
//   constructor(props: any);
//   forceUpdate(callback: any): void;
//   handleCancel(): any;
//   handleFileSelected(ev: any): any;
//   handleUploadCanceled(evt: any): any;
//   handleUploadComplete(evt: any): any;
//   handleUploadFailed(evt: any): any;
//   handleUploadProgress(evt: any): any;
//   render(): any;
//   renderContents(): any;
//   setState(partialState: any, callback: any): void;
// }
// export namespace ImageUploaderModalComponent {
//   namespace propTypes {
//     function T(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function apiUrl(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function client(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace client {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function forceCamera(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace forceCamera {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function onCancel(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function onSuccess(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//   }
// }
// export class ImagelistEditorComponent {
//   constructor(...args: any[]);
//   forceUpdate(callback: any): void;
//   getChildContext(): any;
//   render(): any;
//   setState(partialState: any, callback: any): void;
// }
// export namespace ImagelistEditorComponent {
//   namespace childContextTypes {
//     function T(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function imageAcquirer(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace imageAcquirer {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function imageManager(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//   }
//   namespace propTypes {
//     function T(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function imageAcquirer(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace imageAcquirer {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function imageManager(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function imagelist(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace imagelist {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function onImagelistChange(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace onImagelistChange {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//   }
// }
// export class LocationEditorComponent {
//   constructor(...args: any[]);
//   componentDidMount(): any;
//   componentWillReceiveProps(nextProps: any): any;
//   componentWillUnmount(): any;
//   forceUpdate(callback: any): void;
//   render(): any;
//   setState(partialState: any, callback: any): void;
// }
// export namespace LocationEditorComponent {
//   namespace propTypes {
//     function T(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace T {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function location(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace location {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function locationFinder(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace locationFinder {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function onLocationChange(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace onLocationChange {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function onUseMap(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace onUseMap {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//   }
// }
// export class LocationFinder {
//   constructor(...args: any[]);
//   pause(): any;
//   resume(): any;
//   storage: any;
//   watchCount: any;
//   cacheLocation(pos: any): any;
//   getCachedLocation(): any;
//   getLocation(success: any, error: any): any;
//   startWatch(): any;
//   stopWatch(): any;
// }
// export class ResponseAnswersComponent {
//   constructor(...args: any[]);
//   collectItemsReferencingRoster(items: any, contents: any, rosterId: any): any;
//   componentWillMount(): any;
//   componentWillReceiveProps(nextProps: any): any;
//   componentWillUnmount(): any;
//   forceLoad(): any;
//   forceUpdate(callback: any): void;
//   handleLocationClick(location: any): any;
//   isLoadNeeded(newProps: any, oldProps: any): any;
//   load(props: any, prevProps: any, callback: any): any;
//   render(): any;
//   renderAnswer(q: any, answer: any): any;
//   renderItem(item: any, visibilityStructure: any, dataId: any): any;
//   renderLocation(location: any): any;
//   renderMatrixAnswer(q: any, answer: any, prevAnswer: any): any;
//   renderQuestion(q: any, dataId: any): any;
//   setState(partialState: any, callback: any): void;
// }
// export namespace ResponseAnswersComponent {
//   namespace propTypes {
//     function T(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function data(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function formCtx(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function formDesign(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function hideEmptyAnswers(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace hideEmptyAnswers {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function hideUnchangedAnswers(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace hideUnchangedAnswers {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function highlightChanges(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace highlightChanges {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function locale(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace locale {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function onChangedLinkClick(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace onChangedLinkClick {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function onCompleteHistoryLinkClick(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace onCompleteHistoryLinkClick {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function prevData(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace prevData {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function schema(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function showChangedLink(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace showChangedLink {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function showPrevAnswers(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace showPrevAnswers {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//   }
// }
// export class ResponseDataExprValueUpdater {
//   constructor(formDesign: any, schema: any, dataSource: any);
//   formDesign: any;
//   schema: any;
//   dataSource: any;
//   formItems: any;
//   canUpdate(expr: any): any;
//   cleanData(data: any, createResponseRow: any, callback: any): any;
//   setAnswer(data: any, question: any, answer: any): any;
//   setValue(data: any, question: any, value: any): any;
//   updateAlternate(data: any, expr: any, value: any, callback: any): any;
//   updateCBTField(data: any, expr: any, value: any, cbtField: any, callback: any): any;
//   updateCBTImage(data: any, expr: any, value: any, callback: any): any;
//   updateComments(data: any, expr: any, value: any, callback: any): any;
//   updateData(data: any, expr: any, value: any, callback: any): any;
//   updateEnumsetContains(data: any, expr: any, value: any, callback: any): any;
//   updateItemsChoices(data: any, expr: any, value: any, callback: any): any;
//   updateLocationAccuracy(data: any, expr: any, value: any, callback: any): any;
//   updateLocationAltitude(data: any, expr: any, value: any, callback: any): any;
//   updateLocationLatLng(data: any, expr: any, value: any, callback: any): any;
//   updateMatrix(data: any, expr: any, value: any, callback: any): any;
//   updateQuantity(data: any, expr: any, value: any, callback: any): any;
//   updateScalar(data: any, expr: any, value: any, callback: any): any;
//   updateSpecify(data: any, expr: any, value: any, callback: any): any;
//   updateUnits(data: any, expr: any, value: any, callback: any): any;
//   updateValue(data: any, expr: any, value: any, callback: any): any;
//   validateData(data: any, responseRow: any, callback: any): any;
// }
// export class ResponseDisplayComponent {
//   constructor(props: any);
//   componentDidMount(): any;
//   componentWillMount(): any;
//   componentWillReceiveProps(nextProps: any): any;
//   createLocalizer(design: any, locale: any): any;
//   forceUpdate(callback: any): void;
//   getChildContext(): any;
//   handleHideHistory(): any;
//   handleShowHistory(): any;
//   loadEventUsernames(events: any): any;
//   loadHistory(props: any): any;
//   render(): any;
//   renderArchives(): any;
//   renderEvent(ev: any): any;
//   renderHeader(): any;
//   renderHistory(): any;
//   renderStatus(): any;
//   setState(partialState: any, callback: any): void;
// }
// export namespace ResponseDisplayComponent {
//   namespace childContextTypes {
//     function T(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function canEditEntity(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace canEditEntity {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function displayMap(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace displayMap {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function editEntity(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace editEntity {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function findAdminRegionByLatLng(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function getAdminRegionPath(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function getEntityByCode(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace getEntityByCode {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function getEntityById(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace getEntityById {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function getSubAdminRegions(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function imageAcquirer(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace imageAcquirer {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function imageManager(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function locale(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace locale {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function locationFinder(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace locationFinder {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function renderEntityListItemView(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function renderEntitySummaryView(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function scanBarcode(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace scanBarcode {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function selectEntity(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace selectEntity {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function stickyStorage(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace stickyStorage {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//   }
//   namespace propTypes {
//     function apiUrl(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace apiUrl {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function forceCompleteHistory(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace forceCompleteHistory {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function form(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function formCtx(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function locale(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace locale {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function login(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace login {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function response(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function schema(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//   }
// }
// export class ResponseModel {
//   constructor(options: any);
//   response: any;
//   form: any;
//   user: any;
//   username: any;
//   groups: any;
//   amApprover(): any;
//   approve(): any;
//   canApprove(): any;
//   canDelete(): any;
//   canEdit(): any;
//   canRedraft(): any;
//   canReject(): any;
//   canSubmit(): any;
//   draft(deploymentId: any): any;
//   fixRoles(): any;
//   listEnumeratorDeployments(): any;
//   recordEdit(): any;
//   redraft(): any;
//   reject(message: any): any;
//   saveForLater(): any;
//   submit(): any;
//   updateEntities(): any;
// }
// export class ResponseViewEditComponent {
//   constructor(props: any);
//   createResponseModel(response: any): any;
//   forceUpdate(callback: any): void;
//   handleApprove(): any;
//   handleDataChange(data: any): any;
//   handleDelete(): any;
//   handleDiscard(): any;
//   handleEdit(): any;
//   handleLocaleChange(ev: any): any;
//   handleReject(): any;
//   handleSaveLater(): any;
//   handleSubmit(): any;
//   handleUnreject(): any;
//   render(): any;
//   renderLocales(): any;
//   renderOperations(): any;
//   setState(partialState: any, callback: any): void;
// }
// export namespace ResponseViewEditComponent {
//   namespace propTypes {
//     function apiUrl(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function form(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function formCtx(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function locale(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace locale {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function login(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace login {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function onDeleteResponse(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function onUpdateResponse(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function response(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function schema(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//   }
// }
// export class RotationAwareImageComponent {
//   constructor(...args: any[]);
//   componentWillMount(): any;
//   componentWillReceiveProps(nextProps: any): any;
//   componentWillUnmount(): any;
//   forceLoad(): any;
//   forceUpdate(callback: any): void;
//   isLoadNeeded(newProps: any, oldProps: any): any;
//   load(props: any, prevProps: any, callback: any): any;
//   render(): any;
//   setState(partialState: any, callback: any): void;
// }
// export namespace RotationAwareImageComponent {
//   namespace propTypes {
//     function height(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace height {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function image(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function imageManager(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     function onClick(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace onClick {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//     function thumbnail(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     namespace thumbnail {
//       function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//     }
//   }
// }
// export namespace conditionUtils {
//   function applicableOps(lhsQuestion: any): any;
//   function compileCondition(cond: any): any;
//   function compileConditions(conds: any): any;
//   function rhsChoices(lhsQuestion: any, op: any): any;
//   function rhsType(lhsQuestion: any, op: any): any;
//   function summarizeCondition(cond: any, formDesign: any, locale: any): any;
//   function summarizeConditions(...args: any[]): any;
//   function validateCondition(cond: any, formDesign: any): any;
// }
// export function createBase32TimeCode(date: any): any;
// export namespace formContextTypes {
//   function canEditEntity(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//   namespace canEditEntity {
//     function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//   }
//   function displayMap(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//   namespace displayMap {
//     function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//   }
//   function editEntity(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//   namespace editEntity {
//     function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//   }
//   function findAdminRegionByLatLng(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//   function getAdminRegionPath(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//   function getEntityByCode(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//   namespace getEntityByCode {
//     function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//   }
//   function getEntityById(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//   namespace getEntityById {
//     function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//   }
//   function getSubAdminRegions(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//   function imageAcquirer(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//   namespace imageAcquirer {
//     function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//   }
//   function imageManager(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//   function locationFinder(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//   namespace locationFinder {
//     function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//   }
//   function renderEntityListItemView(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//   function renderEntitySummaryView(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//   function scanBarcode(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//   namespace scanBarcode {
//     function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//   }
//   function selectEntity(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//   namespace selectEntity {
//     function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//   }
//   function stickyStorage(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//   namespace stickyStorage {
//     function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
//   }
// }
// export namespace formRenderUtils {
//   function renderItem(item: any, data: any, responseRow: any, schema: any, onDataChange: any, isVisible: any, onNext: any, ref: any): any;
// }

// export function instantiateView(viewStr: any, options: any): any;
// export const minSchemaVersion: number;
// export const schema: {
//   additionalProperties: boolean;
//   properties: {
//     created: {
//       additionalProperties: boolean;
//       properties: {
//         by: any;
//         on: any;
//       };
//       required: any[];
//       type: string;
//     };
//     dashboard: {
//       type: string;
//     };
//     deployments: {
//       items: {
//         additionalProperties: any;
//         properties: any;
//         required: any;
//         type: any;
//       };
//       type: string;
//     };
//     design: {
//       $schema: string;
//       additionalProperties: boolean;
//       definitions: {
//         AdminRegionQuestion: any;
//         AquagenxCBTQuestion: any;
//         BarcodeQuestion: any;
//         CheckQuestion: any;
//         DateQuestion: any;
//         DropdownQuestion: any;
//         EntityQuestion: any;
//         ImageQuestion: any;
//         ImagesQuestion: any;
//         LikertQuestion: any;
//         LocationQuestion: any;
//         MatrixQuestion: any;
//         MulticheckQuestion: any;
//         NumberQuestion: any;
//         RadioQuestion: any;
//         SiteQuestion: any;
//         StopwatchQuestion: any;
//         TextListQuestion: any;
//         TextQuestion: any;
//         UnitsQuestion: any;
//         advancedValidation: any;
//         choices: any;
//         condition: any;
//         conditionTypes: any;
//         conditions: any;
//         group: any;
//         instructions: any;
//         item: any;
//         locales: any;
//         localizedString: any;
//         matrixColumn: any;
//         propertyId: any;
//         propertyLink: any;
//         question: any;
//         rosterGroup: any;
//         rosterMatrix: any;
//         section: any;
//         timer: any;
//         units: any;
//         uuid: any;
//         validations: any;
//       };
//       properties: {
//         calculations: any;
//         confidentialMode: any;
//         contents: any;
//         draftNameRequired: any;
//         entitySettings: any;
//         locales: any;
//         localizedStrings: any;
//         name: any;
//       };
//       required: any[];
//       type: string;
//     };
//     indicatorCalculations: {
//       items: {
//         additionalProperties: any;
//         properties: any;
//         required: any;
//         type: any;
//       };
//       type: string;
//     };
//     isMaster: {
//       type: string;
//     };
//     masterForm: {
//       type: string;
//     };
//     modified: {
//       additionalProperties: boolean;
//       properties: {
//         by: any;
//         on: any;
//       };
//       required: any[];
//       type: string;
//     };
//     removed: {
//       additionalProperties: boolean;
//       properties: {
//         by: any;
//         on: any;
//       };
//       required: any[];
//       type: string;
//     };
//     roles: {
//       items: {
//         additionalProperties: any;
//         properties: any;
//         required: any;
//         type: any;
//       };
//       minItems: number;
//       type: string;
//     };
//     state: {
//       enum: any[];
//     };
//   };
//   required: string[];
//   title: string;
//   type: string;
// };
// export const schemaVersion: number;
// export function templateView(template: any): any;
// export namespace utils {
//   function calculateGPSStrength(pos: any): any;
//   function formatGPSStrength(pos: any, T: any): any;
//   function formatRelativeLocation(relLoc: any, T: any): any;
//   function getCompassBearing(angle: any, T: any): any;
//   function getRelativeLocation(fromLoc: any, toLoc: any): any;
// }
