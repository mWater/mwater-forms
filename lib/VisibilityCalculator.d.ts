import { PromiseExprEvaluatorRow, Schema } from "mwater-expressions";
import { FormDesign } from "./formDesign";
import { ResponseData } from "./response";
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
    createVisibilityStructure(data: ResponseData, responseRow: PromiseExprEvaluatorRow, callback: (error: any, visibilityStructure?: VisibilityStructure) => void): void;
    processGroup(item: any, forceToInvisible: any, data: any, responseRow: any, visibilityStructure: any, prefix: any, callback: any): void;
    processItem(item: any, forceToInvisible: any, data: any, responseRow: any, visibilityStructure: any, prefix: any, callback: any): any;
    processQuestion(question: any, forceToInvisible: any, data: any, responseRow: any, visibilityStructure: any, prefix: any, callback: any): any;
    processRoster(rosterGroup: any, forceToInvisible: any, data: any, responseRow: any, visibilityStructure: any, prefix: any, callback: any): any;
}
/** Non-rosters are just referenced by id: e.g. { "somequestionid": true }
 * Unless it is a matrix, in which case it is referenced by "questionid.itemid.columnid"
 * Rosters are referenced by entry index: e.g. { "somerosterid.2.somequestionid": true }
 */
export interface VisibilityStructure {
    [key: string]: boolean;
}
