import { LocalizedString, Expr, EnumValue } from "mwater-expressions";
/** This is the design of a form which is stored in the "design" field of forms in mWater */
export interface FormDesign {
    /** Specifies that this is the root Form element */
    _type: "Form";
    _schema: 1 | 2 | 3 | 4 | 5 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22;
    /** Name of the form */
    name: LocalizedString;
    /** When set to true, the response will be assigned a name at creation (instead of only when being saved as a draft) */
    draftNameRequired?: boolean;
    /** When set to true, users will be able to add questions with confidential answers */
    confidentialMode?: boolean;
    /** Contents of the form
     * Organized by a list of sections (that contain items), or a list of items with no sections */
    contents: Section[] | BasicItem[];
    /** List of locales */
    locales: Locale[];
    /** Form-level localized strings, such as "Discard", "Clear", etc. */
    localizedStrings?: LocalizedString[];
    /** Calculated values */
    calculations: Calculation[];
}
export interface Calculation {
    /** Unique id of calculation */
    _id: string;
    /** Name of the calculation */
    name: LocalizedString;
    /** Description of the calculation (optional) */
    desc?: LocalizedString;
    /** Id of roster if from a roster */
    roster?: string;
    /** Expression (mwater-expression) for the value of the calculation of type number */
    expr: Expr;
}
export interface Locale {
    /** Language code (2 character) */
    code: string;
    /** Localized name of language (e.g. Kiswahili) */
    name: string;
    /** True if code and name are not from the official locales list */
    custom?: boolean;
}
/**  A section of a form has a name and a series of items (questions, etc.) that validate as a group. Forms are
 * either made only of sections or not at all. */
export interface Section {
    _id: string;
    _type: "Section";
    /** Name of the section */
    name: LocalizedString;
    /** Contains a list of items */
    contents: BasicItem[];
    /** Conditions for visibility of the section */
    conditions?: Conditions;
    /** Condition expression (mwater-expression) for visiblity of the section */
    conditionExpr?: Expr;
    /** _id of the section that this section is a duplicate of. */
    _basedOn?: string;
}
/** All item types including sections and roster matrix columns */
export declare type Item = BasicItem | MatrixColumn | Section;
/** Item such as a question or instruction that make up the basic building block of a form. Does not include roster matrix column or section */
export declare type BasicItem = Question | Instructions | RosterGroup | RosterMatrix | Group | Timer;
/** Question of various types which records an answer in the response */
export interface QuestionBase {
    _id: string;
    /** All question types end in "Question" */
    _type: string;
    /** Question code which is displayed before the question in the survey
     * and is used for export column header */
    code?: string;
    /** Text (prompt of the question) */
    text: LocalizedString;
    /** Array of mWater expressions to substitute into text field for {0}, {1}, etc. */
    textExprs?: Expr[];
    /** True if the question is required to be answered */
    required?: boolean;
    /** True if the question is disabled (will never be shown in live form) */
    disabled?: boolean;
    /** Conditions for visibility of the question */
    conditions: Conditions;
    /** Condition expression (mwater-expression) for visiblity of the question */
    conditionExpr?: Expr;
    /** Localized hint which is displayed with question text */
    hint?: LocalizedString;
    /** Localized markdown help which can be opened */
    help?: LocalizedString;
    /** True to copy answer from previous time form was filled */
    sticky?: boolean;
    /** True to record location where question was first answered */
    recordLocation?: boolean;
    /** True to record timestamp when question was first answered */
    recordTimestamp?: boolean;
    /** True to include a comment field with question */
    commentsField?: boolean;
    /** True if text field contains a sensor id TODO remove? */
    sensor?: boolean;
    /** Id used for exporting responses */
    exportId?: string;
    /** True if the question contains confidential data */
    confidential?: boolean;
    /** Distance in meters to scramble coordinates by */
    confidentialRadius?: number;
    /** Alternative answers that are non-answers to the specific question such as "Don't Know" or "Not Applicable" */
    alternates?: {
        /** True to display Not Applicable option */
        na?: boolean;
        /** True to display Don't Know option */
        dontknow: boolean;
    };
    /** Validations that are question-specific */
    validations: Validation[];
    /** Advanced validations */
    advancedValidations?: AdvancedValidation[];
    /** _id of the item that this item is a duplicate of */
    _basedOn?: string;
    /** If present, only ask with this probability, hide otherwise. 0-1 */
    randomAskProbability?: number;
}
export declare type Question = TextQuestion | NumberQuestion | DropdownQuestion | RadioQuestion | MulticheckQuestion | DateQuestion | UnitsQuestion | CheckQuestion | LocationQuestion | ImageQuestion | ImagesQuestion | TextListQuestion | SiteQuestion | BarcodeQuestion | EntityQuestion | AdminRegionQuestion | StopwatchQuestion | MatrixQuestion | LikertQuestion | AquagenxCBTQuestion | CascadingListQuestion | CascadingRefQuestion | RankedQuestion;
/** Instructional text item */
export interface Instructions {
    _id: string;
    _type: "Instructions";
    /** Markdown text on a per-language basis */
    text: LocalizedString;
    /** Array of mWater expressions to substitute into text field for {0}, {1}, etc. */
    textExprs?: Expr[];
    /** Conditions for visibility of the instructions */
    conditions: Conditions;
    /** Condition expression (mwater-expression) for visiblity of the instructions */
    conditionExpr?: Expr;
    /** True if the instructions are disabled (will never be shown in live form) */
    disabled?: boolean;
}
/** Timer item */
export interface Timer {
    _id: string;
    _type: "Timer";
    /** Markdown text on a per-language basis */
    text: LocalizedString;
    /** Localized hint which is displayed with question text */
    hint?: LocalizedString;
    /** Initial time, stored in ms */
    duration: number;
    /** Conditions for visibility of the instructions */
    conditions: Conditions;
    /** Condition expression (mwater-expression) for visiblity of the instructions */
    conditionExpr?: Expr;
}
/** Group of questions which are repeated */
export interface RosterGroup {
    _id: string;
    _type: "RosterGroup";
    /** _id under which roster is stored. Can reference another roster or self (in which case is null) */
    rosterId: string | null;
    /** Name of roster group (displayed above list) */
    name: LocalizedString;
    /** Hint of roster group (displayed below list) */
    hint?: LocalizedString;
    /** Conditions for visibility of the group */
    conditions: Conditions;
    /** Condition expression (mwater-expression) for visiblity of the group */
    conditionExpr?: Expr;
    /** True if the roster group is disabled (will never be shown in live form) */
    disabled?: boolean;
    /** Allow user to add items */
    allowAdd?: boolean;
    /** Allow user to remove items */
    allowRemove?: boolean;
    /** Prompt below when empty (defaults to "Click +Add to add an item") */
    emptyPrompt?: LocalizedString;
    /** Title of each entry */
    entryTitle: LocalizedString;
    /** Array of mWater expressions to substitute into entry title field for {0}, {1}, etc. */
    entryTitleExprs?: Expr[];
    /** Contains a list of items */
    contents: BasicItem[];
}
/** Matrix of columns and rows. Each column is of a specific type. */
export interface RosterMatrix {
    _id: string;
    _type: "RosterMatrix";
    /** _id under which roster is stored. Can reference another roster or self (in which case is null) */
    rosterId: string | null;
    /** Name of roster group (displayed above matrix) */
    name: LocalizedString;
    /** Hint of roster group (displayed below matrix) */
    hint?: LocalizedString;
    /** Conditions for visibility of the matrix */
    conditions: Conditions;
    /** Condition expression (mwater-expression) for visiblity of the matrix */
    conditionExpr?: Expr;
    /** True if the roster matrix is disabled (will never be shown in live form) */
    disabled?: boolean;
    /** Allow user to add items */
    allowAdd?: boolean;
    /** Allow user to remove items */
    allowRemove?: boolean;
    /** Prompt below when empty (defaults to "Click +Add to add an item") */
    emptyPrompt?: LocalizedString;
    /** Contains a list of items */
    contents: MatrixColumn[];
}
/** Columns of a matrix question or roster matrix */
export interface MatrixColumn {
    _id: string;
    _type: "TextColumnQuestion" | "NumberColumnQuestion" | "CheckColumnQuestion" | "DropdownColumnQuestion" | "UnitsColumnQuestion" | "TextColumn" | "SiteColumnQuestion" | "DateColumnQuestion" | "Calculation";
    /** Header of roster column */
    text: LocalizedString;
    /** Code, unique within the question that should be used for exporting */
    code?: string;
    /** ExportID, user defined ID within the question that should be used for exporting */
    exportId?: string;
    /** True if the column is required to be answered */
    required?: boolean;
    /** For number columns */
    decimal?: boolean;
    /** List of units displayed for unit questions */
    units?: Units;
    /** Whether units are before or after quantity */
    unitsPosition?: "prefix" | "suffix";
    /** Default units (id) or null */
    defaultUnits?: string | null;
    /** For dropdown columns. Do not allow specify. */
    choices?: Choices;
    /** Site type (e.g. "water_point"). Required for SiteColumnQuestion */
    siteType?: string;
    /** Expression for calculation type column */
    expr?: Expr;
    /** For TextColumn */
    cellText?: LocalizedString;
    /** For TextColumn */
    cellTextExprs?: Expr[];
    /** True to default to current date/time for DateColumnQuestions */
    defaultNow?: boolean;
    /** moment.js format of the displayed date (is always stored in ISO 8601) */
    format?: string;
    placeholder?: string;
    /** True if the column contains confidential data */
    confidential?: boolean;
    /** Validations for various types */
    validations: Validation[];
}
/** Group of questions which can have conditions as a whole */
export interface Group {
    _id: string;
    _type: "Group";
    /** Name of group (displayed above list). Can be blank */
    name?: LocalizedString;
    /** Conditions for visibility of the group */
    conditions: Conditions;
    /** Condition expression (mwater-expression) for visiblity of the group */
    conditionExpr?: Expr;
    /** True if the group is disabled (will never be shown in live form) */
    disabled?: boolean;
    /** Contains a list of items */
    contents: BasicItem[];
}
/**  Conditions on an item or section that determine if it is visible. All must be true to be visible */
export declare type Conditions = Condition[];
export declare type Condition = UnaryCondition | TextCondition | NumberCondition | ChoiceCondition | ChoicesCondition | DateCondition;
export interface BaseCondition {
    /** Left-hand side of the condition inequality */
    lhs: {
        /** Question whose answer to use as left-hand side of the condition inequality */
        question: string;
    };
}
/** Unary type conditions */
export interface UnaryCondition extends BaseCondition {
    op: "present" /** If question was answered */ | "!present" /** If question was not answered */ | "true" /** If answer is true */ | "false"; /** If answer is false */
}
/** Conditions with text as right-hand side */
export interface TextCondition extends BaseCondition {
    op: "contains" /** If answer contains text in RHS */ | "!contains"; /** If answer does not contain text in RHS */
    rhs: {
        literal: string;
    };
}
/** Conditions with number as right-hand side */
export interface NumberCondition extends BaseCondition {
    op: "=" /** If answer equals a value */ | "!=" /** If answer does not equal a value */ | ">" /** If answer is greater than */ | "<"; /** If answer is less than */
    rhs: {
        literal: number;
    };
}
/** Conditions with choice as right-hand side */
export interface ChoiceCondition extends BaseCondition {
    op: "is" /** If answer is a certain choice */ | "isnt" /** If answer is not a choice */ | "includes" /** If answer is includes a choice (multi-check) */ | "!includes"; /** If answer doesn't include a choice (multi-check) */
    /** Id of the choice */
    rhs: {
        literal: string;
    };
}
/** Conditions with choices as right-hand side */
export interface ChoicesCondition extends BaseCondition {
    op: "isoneof" /** If answer is in a list of choices */ | "isntoneof"; /** If answer isn't in a list of choice */
    /** Ids of the choices */
    rhs: {
        literal: string[];
    };
}
/** Conditions with date as right-hand side */
export interface DateCondition extends BaseCondition {
    op: "before" /** If answer is before a date */ | "after"; /** If answer is after a date */
    /** Ids of the choices */
    rhs: {
        literal: string;
    };
}
declare type Validation = LengthRangeValidation | RangeValidation | RegexValidation;
/** Validations are a condition that the answer must pass
 * The type is specific to the question type, but have a
 * common structure */
export interface BaseValidation {
    /** Message to be displayed when the validation fails */
    message: LocalizedString;
}
/** Validation which constrains length of text field in characters */
export interface LengthRangeValidation extends BaseValidation {
    op: "lengthRange";
    rhs: {
        /** Literal contains min and max length */
        literal: {
            /** Minimum length of the string */
            min?: number;
            /** Maximum length of the string */
            max?: number;
        };
    };
}
/** Validation which constrains range of a number answer. Range is inclusive */
export interface RangeValidation extends BaseValidation {
    op: "range";
    rhs: {
        /** Literal contains min and max value */
        literal: {
            /** Minimum value */
            min?: number;
            /** Maximum value */
            max?: number;
        };
    };
}
/** Validation which matches regex */
export interface RegexValidation extends BaseValidation {
    op: "regex";
    rhs: {
        /** Literal regex to match*/
        literal: string;
    };
}
/** Simple text question, single or multi-line */
export interface TextQuestion extends QuestionBase {
    _type: "TextQuestion";
    format: "singleline" /** single line of text */ | "multiline" /** paragraph of text */ | "email" /** valid email address */ | "url"; /** valid URL */
    validations: (LengthRangeValidation | RegexValidation)[];
}
/** Number question, integer or decimal */
export interface NumberQuestion extends QuestionBase {
    _type: "NumberQuestion";
    /** True to allow decimals */
    decimal: boolean;
    validations: RangeValidation[];
}
/** Displays a stopwatch with manual edit option */
export interface StopwatchQuestion extends QuestionBase {
    _type: "StopwatchQuestion";
    /** No validation available */
    validations: [];
}
/** Displays choices in a dropdown */
export interface DropdownQuestion extends QuestionBase {
    _type: "DropdownQuestion";
    /** Choices of the dropdown */
    choices: Choices;
    /** No validation available */
    validations: [];
}
export interface RadioQuestion extends QuestionBase {
    _type: "RadioQuestion";
    /** Choices of the radio buttons */
    choices: Choices;
    /** Display mode (defaults to "vertical" which is a vertical radio buttons. Toggle is a series of buttons) */
    displayMode?: "vertical" | "toggle";
    /** No validation available */
    validations: [];
}
/** Displays same choices for each item */
export interface LikertQuestion extends QuestionBase {
    _type: "LikertQuestion";
    /** Choices of the radio buttons */
    choices: Choices;
    /** Items to rate */
    items: Choices;
    /** No validation available */
    validations: [];
}
/** Allows multiple checked values */
export interface MulticheckQuestion extends QuestionBase {
    _type: "MulticheckQuestion";
    /** Choices of the check boxes */
    choices: Choices;
    /** No validation available */
    validations: [];
}
/** Date question */
export interface DateQuestion extends QuestionBase {
    _type: "DateQuestion";
    /** moment.js format of the displayed date (is always stored in ISO 8601) */
    format: string;
    /** True to default to current date/time */
    defaultNow?: boolean;
    /** No validation available */
    validations: [];
}
/** Allows value with units selectable */
export interface UnitsQuestion extends QuestionBase {
    _type: "UnitsQuestion";
    /** moment.js format of the displayed date (is always stored in ISO 8601) */
    format: string;
    /** True to allow decimals */
    decimal: boolean;
    /** Units to display */
    units: Units;
    /** Whether units are before or after quantity */
    unitsPosition: "prefix" | "suffix";
    /** Default units (id) or null */
    defaultUnits: string | null;
    validations: RangeValidation[];
}
/** Single checkbox question */
export interface CheckQuestion extends QuestionBase {
    _type: "CheckQuestion";
    /** No validation available */
    validations: [];
}
/** Location (lat/lng) question */
export interface LocationQuestion extends QuestionBase {
    _type: "LocationQuestion";
    /** True if should calculate the admin region (done on the fly, server-side for now) */
    calculateAdminRegion?: boolean;
    /** True to disable using map to set location */
    disableSetByMap?: boolean;
    /** True to disable using manual lat/lng coordinates to set location */
    disableManualLatLng?: boolean;
    /** No validation available */
    validations: [];
}
/** Single image question */
export interface ImageQuestion extends QuestionBase {
    _type: "ImageQuestion";
    /** Optional yes/no question asked before an image is registered
     * As in "Does the subject consent to the photo?" */
    consentPrompt?: LocalizedString;
    /** No validation available */
    validations: [];
}
/** Multiple image question */
export interface ImagesQuestion extends QuestionBase {
    _type: "ImagesQuestion";
    /** Optional yes/no question asked before an image is registered
     * As in "Does the subject consent to the photo?" */
    consentPrompt?: LocalizedString;
    /** No validation available */
    validations: [];
}
/** List of text values question */
export interface TextListQuestion extends QuestionBase {
    _type: "TextListQuestion";
    /** No validation available */
    validations: [];
}
/** Selects a single site (entity) */
export interface SiteQuestion extends QuestionBase {
    _type: "SiteQuestion";
    /** Optional list of site types to include. e.g. "water_point", "community"
     * LEGACY: Used to contain "Water point", "Community". As a result, always use .toLowerCase().replace(new RegExp(' ', 'g'), "_")
     * Should only be one in array.
     * If none, defaults to "water_point" */
    siteTypes?: [string];
    /** No validation available */
    validations: [];
}
/** Scans a barcode */
export interface BarcodeQuestion extends QuestionBase {
    _type: "BarcodeQuestion";
    /** No validation available */
    validations: [];
}
/** Single entity selection (DEPRECATED!) */
export interface EntityQuestion extends QuestionBase {
    _type: "EntityQuestion";
    /** Entity type that can be selected. e.g water_point */
    entityType: string;
    /** Filter for the entities that can be chosen. MongoDb-style */
    entityFilter?: object;
    /** Text of select button */
    selectText?: LocalizedString;
    /** How selection is made */
    selectionMode?: "external";
    /** No validation available */
    validations: [];
}
/** Admin region selection (DEPRECATED!) */
export interface AdminRegionQuestion extends QuestionBase {
    _type: "AdminRegionQuestion";
    /** Default value (id of admin region) */
    defaultValue: number;
    /** No validation available */
    validations: [];
}
/** Matrix of questions with fixed columns */
export interface MatrixQuestion extends QuestionBase {
    _type: "MatrixQuestion";
    /** Items, each representing a row */
    items: Choices;
    /** Contains a list of columns */
    columns: MatrixColumn[];
    /** No validation available */
    validations: [];
}
/** Compartment bag test */
export interface AquagenxCBTQuestion extends QuestionBase {
    _type: "AquagenxCBTQuestion";
    /** No validation available */
    validations: [];
}
/** Single row of list that the cascading question chooses from */
export interface CascadingListRow {
    /** ID of the row */
    id: string;
    /** Rest of column values */
    [columnId: string]: string;
}
/** Column of a cascading question's data */
export interface CascadingListColumn {
    /** Unique id of the column. "c0", "c1", etc */
    id: string;
    /** For now, all columns are enum */
    type: "enum";
    /** Name of the column */
    name: LocalizedString;
    /** Values that column can have */
    enumValues: EnumValue[];
}
export interface CascadingListQuestion extends QuestionBase {
    _type: "CascadingListQuestion";
    /** Rows in the list to choose from */
    rows: CascadingListRow[];
    /** Columns in the table that are displayed also as dropdowns to choose the row */
    columns: CascadingListColumn[];
    /** True to sort items alphabetically */
    sortOptions?: boolean;
    /** No validation available */
    validations: [];
}
/** Single dropdown dropdown */
export interface CascadingRefDropdown {
    /** Column that is referenced */
    columnId: string;
    /** Name of the dropdown */
    name: LocalizedString;
    /** Localized hint which is displayed with dropdown */
    hint?: LocalizedString;
}
/** Question that references a custom table */
export interface CascadingRefQuestion extends QuestionBase {
    _type: "CascadingRefQuestion";
    /** Table that question references (e.g. "custom.abc.x") */
    tableId: string;
    /** Dropdowns that reference columns in the table that are displayed as dropdowns to choose the row */
    dropdowns: CascadingRefDropdown[];
    /** No validation available */
    validations: [];
}
/** List of choices for a dropdown, radio or multicheck */
declare type Choices = Choice[];
export interface Choice {
    /** Unique (within the question) id of the choice. Cannot be "na" or "dontknow" as they are reserved for alternates */
    id: string;
    /** Code, unique within the question that should be used for exporting */
    code?: string;
    /** Label of the choice, localized */
    label: LocalizedString;
    /** Hint associated with a choice */
    hint?: LocalizedString;
    /** True to require a text field to specify the value when selected. Usually used for "Other" options. Value is stored in specify[id] */
    specify?: boolean;
    /** Conditions for visibility of the choice */
    conditions?: Conditions;
    /** Condition expression (mwater-expression) for visiblity of the choice */
    conditionExpr?: Expr;
}
/** List of units for a units question */
declare type Units = Unit[];
export interface Unit {
    /** Unique (within the question) id of the choice. Cannot be "na" or "dontknow" as they are reserved for alternates */
    id: string;
    /** Code, unique within the question that should be used for exporting */
    code?: string;
    /** Label of the choice, localized */
    label: LocalizedString;
    /** Hint associated with a choice */
    hint?: LocalizedString;
}
/** Expression-based validation */
export interface AdvancedValidation {
    /** mwater-expression that should evaluate to true */
    expr: Expr;
    /** Message that is shown if expr is not true */
    message: LocalizedString;
}
export interface RankedQuestion extends QuestionBase {
    _type: "RankedQuestion";
    items: Choices;
}
export {};
