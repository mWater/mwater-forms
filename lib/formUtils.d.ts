import { Item, FormDesign, Question, QuestionBase, SiteQuestion } from "./formDesign";
import { LocalizedString } from "mwater-expressions";
export declare type AnswerType = "text" | "number" | "choice" | "choices" | "date" | "units" | "boolean" | "location" | "image" | "images" | "texts" | "site" | "entity" | "admin_region" | "items_choices" | "matrix" | "aquagenx_cbt" | "cascading_list" | "cascading_ref";
/** Create ~ 128-bit uid without dashes */
export declare function createUid(): any;
/** Create short unique id, with ~42 bits randomness to keep unique amoung a few choices */
export declare function createShortUid(): string;
/** Create medium unique id, with ~58 bits randomness to keep unique amoung a 1,000,000 choices */
export declare function createMediumUid(): string;
export declare function createBase32TimeCode(date: any): string;
/** Determine if item is a question */
export declare function isQuestion(item: Item): item is Question;
/** Determine if item is an expression */
export declare function isExpression(item: Item): boolean;
/** Localize a localized string */
export declare function localizeString(str?: LocalizedString | null, locale?: string): string;
export declare function priorQuestions(formDesign: FormDesign, refItem?: Item | null, rosterId?: string | null): Question[];
export declare function getRosterIds(formDesign: any): unknown[];
export declare function findItem(formDesign: FormDesign, itemId: string): Item | undefined;
export declare function allItems(rootItem: FormDesign | Item): (Item | FormDesign)[];
export declare function prepareQuestion(q: any): any;
export declare function changeQuestionType(question: any, newType: any): any;
export declare function getAnswerType(q: QuestionBase): AnswerType;
export declare function isSectioned(form: any): boolean;
export declare function duplicateItem(item: any, idMap?: any): any;
export declare function extractLocalizedStrings(obj: any): any;
export declare function updateLocalizations(formDesign: any): (boolean | undefined)[];
export declare function hasLocalizations(obj: any, locale: any): boolean;
export declare function findEntityQuestion(formDesign: any, entityType: any): unknown;
export declare function extractEntityReferences(formDesign: any, responseData: any): ({
    question: any;
    entityType: any;
    property: string;
    value: any;
    roster?: undefined;
} | {
    question: any;
    roster: any;
    entityType: any;
    property: string;
    value: any;
})[];
export declare function getSiteEntityType(question: SiteQuestion): string;
/** Get list of custom table ids referenced by a form (cascading ref questions) */
export declare function getCustomTablesReferenced(formDesign: FormDesign): string[];
