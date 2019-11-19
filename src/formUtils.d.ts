import { Item, FormDesign, Question } from "./formDesign"
import { LocalizedString } from "mwater-expressions"

// function allItems(rootItem: any): any;
// function changeQuestionType(question: any, newType: any): any;
// function createBase32TimeCode(date: any): any;

/** Create short unique id, with ~42 bits randomness to keep unique amoung a few choices */
export function createShortUid(): string

/** Create medium unique id, with ~58 bits randomness to keep unique amoung a 1,000,000 choices */
export function createMediumUid(): string

/** Create ~ 128-bit uid without dashes */
export function createUid(): string;

// function duplicateItem(item: any, idMap: any): any;
// function extractEntityReferences(formDesign: any, responseData: any): any;
// function extractLocalizedStrings(obj: any): any;
// function findEntityQuestion(formDesign: any, entityType: any): any;
// function findItem(formDesign: any, itemId: any): any;
// function getAnswerType(q: any): any;
// function getRosterIds(formDesign: any): any;
// function hasLocalizations(obj: any, locale: any): any;

/** Determine if item is a question */
export function isQuestion(item: Item): boolean

/** Determine if item is an expression */
export function isExpression(item: Item): boolean

// function isSectioned(form: any): any;

/** Localize a localized string */
export function localizeString(str?: LocalizedString | null, locale?: string): string

// function prepareQuestion(q: any): any;

export function priorQuestions(formDesign: FormDesign, refItem?: Item, rosterId?: string | null): Question[]

// function updateLocalizations(formDesign: any): any;
