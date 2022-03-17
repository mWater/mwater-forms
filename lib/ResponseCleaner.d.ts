import { FormDesign, ResponseData, ResponseRow } from ".";
import DefaultValueApplier from "./DefaultValueApplier";
import RandomAskedCalculator from "./RandomAskedCalculator";
import VisibilityCalculator, { VisibilityStructure } from "./VisibilityCalculator";
import { Schema } from "mwater-expressions";
export default class ResponseCleaner {
    /**
     * Cleans data, calling back with { data: cleaned data, visibilityStructure: final visibility structure (since expensive to compute) }
     * The old visibility structure is needed as defaulting of values requires knowledge of how visibility has changed
     * The process of computing visibility, cleaning data and applying stickyData/defaultValue can trigger more changes
     * and should be repeated until the visibilityStructure is stable.
     * A simple case: Question A, B and C with B only visible if A is set and C only visible if B is set and B containing a defaultValue
     * Setting a value to A will make B visible and set to defaultValue, but C will remain invisible until the process is repeated
     * responseRowFactory: returns responseRow when called with data
     */
    cleanData: (design: FormDesign, visibilityCalculator: VisibilityCalculator, defaultValueApplier: DefaultValueApplier, randomAskedCalculator: RandomAskedCalculator | null, data: ResponseData, responseRowFactory: (data: ResponseData) => ResponseRow, oldVisibilityStructure: VisibilityStructure | null, callback: (err: any, result?: {
        data: ResponseData;
        visibilityStructure: VisibilityStructure;
    } | undefined) => void) => void;
    cleanDataBasedOnVisibility(data: any, visibilityStructure: any): any;
    cleanDataBasedOnChoiceConditions(data: any, visibilityStructure: VisibilityStructure, design: FormDesign, responseRow: ResponseRow, schema: Schema): Promise<any>;
    cleanDataCascadingLists(data: any, visibilityStructure: any, design: any): any;
}
