import { Schema } from "mwater-expressions";
import { FormDesign, Group, Instructions, Item, MatrixColumn, Question, RosterGroup, RosterMatrix, Section, Timer } from "./formDesign";
import { ResponseData } from "./response";
import ResponseRow from "./ResponseRow";
/**
Uses conditions to defines the visibility status of all the Sections, Questions, Instructions, Group, RosterGroup and RosterMatrix
The result is kept in the visibilityStructure. It contains an entry with true or false for each element (should never be null or undefined)
A parent (like a section or a group), will always force visible to false for all their children if they are invisible.
The usage is fairly simple. It's created with a form and then the visibilityStructure is recalculated with specify data each time it changes.

Visibility is based both on simple conditions (see conditionUtils), but also on conditionExpr (advanced conditions made of mwater-expressions)
which need access to the entities which the questions may reference.

Non-rosters are just referenced by id: e.g. { "somequestionid": true }

Unless it is a matrix, in which case it is referenced by "questionid.itemid.columnid"

Rosters are referenced by entry index: e.g. { "somerosterid.2.somequestionid": true }
*/
export default class VisibilityCalculator {
    formDesign: FormDesign;
    schema: Schema;
    constructor(formDesign: FormDesign, schema: Schema);
    /** Updates the visibilityStructure dictionary with one entry for each element
     * data is the data of the response
     * responseRow is a ResponseRow which represents the same row */
    createVisibilityStructure(data: ResponseData, responseRow: ResponseRow, callback: (error: any, visibilityStructure?: VisibilityStructure) => void): void;
    processGroup(item: FormDesign | Section | Group, forceToInvisible: any, data: any, responseRow: any, visibilityStructure: any, prefix: any, callback: any): void;
    processItem(item: Item | FormDesign, forceToInvisible: boolean, data: ResponseData, responseRow: ResponseRow, visibilityStructure: VisibilityStructure, prefix: any, callback: (error: any, visibilityStructure?: VisibilityStructure) => void): void;
    processQuestion(question: Question | MatrixColumn | Instructions | Timer | Section | Group, forceToInvisible: boolean, data: ResponseData, responseRow: ResponseRow, visibilityStructure: VisibilityStructure, prefix: any, callback: (error: any, visibilityStructure?: VisibilityStructure) => void): void | Promise<void>;
    processRoster(rosterGroup: RosterGroup | RosterMatrix, forceToInvisible: boolean, data: ResponseData, responseRow: ResponseRow, visibilityStructure: VisibilityStructure, prefix: any, callback: (error: any, visibilityStructure?: VisibilityStructure) => void): void | Promise<void>;
}
/** Non-rosters are just referenced by id: e.g. { "somequestionid": true }
 * Unless it is a matrix, in which case it is referenced by "questionid.itemid.columnid"
 * Rosters are referenced by entry index: e.g. { "somerosterid.2.somequestionid": true }
 */
export interface VisibilityStructure {
    [key: string]: boolean;
}
