import { LocalizedString } from "mwater-expressions";
export declare type AnswerType = "text" | "number" | "choice" | "choices" | "date" | "units" | "boolean" | "location" | "image" | "images" | "texts" | "site" | "entity" | "admin_region" | "items_choices" | "matrix" | "aquagenx_cbt" | "cascading_list" | "cascading_ref";
export declare function createUid(): any;
export declare function createShortUid(): string;
export declare function createMediumUid(): string;
export declare function createBase32TimeCode(date: any): string;
export declare function isQuestion(item: any): any;
export declare function isExpression(item: any): boolean;
export declare function localizeString(str: LocalizedString | null | undefined, locale?: string): string;
export declare function priorQuestions(formDesign: any, refItem?: null, rosterId?: null): any;
export declare function getRosterIds(formDesign: any): unknown[];
export declare function findItem(formDesign: any, itemId: any): any;
export declare function allItems(rootItem: any): any[];
export declare function prepareQuestion(q: any): any;
export declare function changeQuestionType(question: any, newType: any): any;
export declare function getAnswerType(q: any): "image" | "text" | "number" | "boolean" | "date" | "expr" | "choices" | "units" | "choice" | "location" | "images" | "texts" | "site" | "entity" | "admin_region" | "matrix" | "items_choices" | "aquagenx_cbt" | "cascading_list" | "cascading_ref";
export declare function isSectioned(form: any): boolean;
export declare function duplicateItem(item: any, idMap: any): any;
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
export declare function getSiteEntityType(question: any): any;
export declare function getCustomTablesReferenced(formDesign: any): any[];
