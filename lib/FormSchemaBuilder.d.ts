import { Schema, Column } from "mwater-expressions";
import { Form } from "./form";
import { IndicatorCalculation } from ".";
/** Adds a form to a mwater-expressions schema */
export default class FormSchemaBuilder {
    /** indicators is at least all indicators referenced in indicator calculations. Can be empty and indicator calculations will be omitted */
    addForm(schema: Schema, form: Form, cloneFormsDeprecated?: boolean, isAdmin?: boolean, indicators?: any): Schema;
    addReverseJoins(schema: any, form: any, reverseJoins: any): any;
    addRosterTables(schema: any, design: any, conditionsExprCompiler: any, reverseJoins: any, tableId: any): any;
    addIndicatorCalculations(schema: any, form: any, indicators: any): any;
    createIndicatorCalculationSection(indicatorCalculation: IndicatorCalculation, schema: Schema, indicators: any[], form: Form): {
        type: string;
        name: any;
        contents: Column[];
    } | null;
    addConfidentialDataForRosters(schema: any, form: any, conditionsExprCompiler: any): any;
    addConfidentialData(schema: any, form: any, conditionsExprCompiler: any): any;
    addFormItem(item: any, contents: any, tableId: any, conditionsExprCompiler?: any, existingConditionExpr?: any, reverseJoins?: never[], confidentialData?: boolean): any;
    addCalculations(schema: any, form: any): any;
}
