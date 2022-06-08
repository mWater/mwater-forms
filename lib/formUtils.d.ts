import { Item, FormDesign, Question, QuestionBase, SiteQuestion, Choice, MatrixColumn, Section, RosterMatrix, RosterGroup, Group, MatrixColumnQuestion } from "./formDesign";
import { LocalizedString, Schema } from "mwater-expressions";
import { EntityRef, ResponseData } from "./response";
import ResponseRow from "./ResponseRow";
export declare type AnswerType = "text" | "number" | "choice" | "choices" | "date" | "units" | "boolean" | "location" | "image" | "images" | "texts" | "site" | "entity" | "admin_region" | "items_choices" | "matrix" | "aquagenx_cbt" | "cascading_list" | "cascading_ref" | "ranked";
/** Create ~ 128-bit uid without dashes */
export declare function createUid(): string;
/** Create short unique id, with ~42 bits randomness to keep unique amoung a few choices */
export declare function createShortUid(): string;
/** Create medium unique id, with ~58 bits randomness to keep unique amoung a 1,000,000 choices */
export declare function createMediumUid(): string;
export declare function createBase32TimeCode(date: any): string;
/** Determine if item is a question or a matrix column (which is similar and makes up
 * the contents of RosterMatrix) */
export declare function isQuestionOrMatrixColumnQuestion(item: Item | FormDesign): item is Question | MatrixColumnQuestion;
/** Determine if item is a question */
export declare function isQuestion(item: Item | FormDesign): item is Question;
/** Determine if item is a matrix column (which is similar and makes up
 * the contents of RosterMatrix) */
export declare function isMatrixColumnQuestion(item: Item | FormDesign): item is MatrixColumnQuestion;
/** Determine if item is an expression */
export declare function isExpression(item: Item): boolean;
/** Determine if item is of type with contents */
export declare function isTypeWithContents(item: Item | FormDesign): item is Section | Group | RosterMatrix | RosterGroup | FormDesign;
/** Determine if item is roster matrix or roster group */
export declare function isRoster(item: Item | FormDesign): item is RosterGroup | RosterMatrix;
/** Determine if is form design type */
export declare function isFormDesign(item: Item | FormDesign): item is FormDesign;
/** Determine if is matrix column */
export declare function isMatrixColumn(item: Item | FormDesign): item is MatrixColumn;
/** Localize a localized string */
export declare function localizeString(str?: LocalizedString | null, locale?: string): string;
/** Gets all questions in form before reference item specified
 * refItem can be null for all questions
 * rosterId is the rosterId to use. null for only top-level
 */
export declare function priorQuestions(formDesign: FormDesign, refItem?: Item | null, rosterId?: string | null): (Question | MatrixColumn)[];
export declare function getRosterIds(formDesign: any): string[];
export declare function findItem(formDesign: FormDesign, itemId: string): Item | undefined;
export declare function allItems(rootItem: FormDesign | Item): (Item | FormDesign)[];
export declare function prepareQuestion(q: any): any;
export declare function changeQuestionType(question: any, newType: any): any;
export declare function getAnswerType(q: QuestionBase | MatrixColumnQuestion): AnswerType;
export declare function isSectioned(form: FormDesign): boolean;
export declare function duplicateItem(item: any, idMap?: any): any;
export declare function extractLocalizedStrings(obj: any): LocalizedString[];
export declare function updateLocalizations(formDesign: any): (boolean | undefined)[];
export declare function hasLocalizations(obj: any, locale: any): boolean;
export declare function findEntityQuestion(formDesign: any, entityType: any): Question | MatrixColumn | null;
export declare function extractEntityReferences(formDesign: any, responseData: any): EntityRef[];
export declare function getSiteEntityType(question: SiteQuestion): string;
/** Get list of custom table ids referenced by a form (cascading ref questions) */
export declare function getCustomTablesReferenced(formDesign: FormDesign): string[];
/** Determine if a choice is visible */
export declare function isChoiceVisible(choice: Choice, data: ResponseData, responseRow: ResponseRow, schema: Schema): Promise<boolean>;
