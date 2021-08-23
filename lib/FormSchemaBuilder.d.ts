import { Schema } from "mwater-expressions";
import { Form } from "./form";
export default class FormSchemaBuilder {
    addForm(schema: Schema, form: Form, cloneFormsDeprecated: any, isAdmin: boolean | undefined, indicators: any): Schema;
    addReverseJoins(schema: any, form: any, reverseJoins: any): any;
    addRosterTables(schema: any, design: any, conditionsExprCompiler: any, reverseJoins: any, tableId: any): any;
    addIndicatorCalculations(schema: any, form: any, indicators: any): any;
    createIndicatorCalculationSection(indicatorCalculation: any, schema: any, indicators: any, form: any): {
        type: string;
        name: any;
        contents: {}[];
    } | null;
    addConfidentialDataForRosters(schema: any, form: any, conditionsExprCompiler: any): any;
    addConfidentialData(schema: any, form: any, conditionsExprCompiler: any): any;
    addFormItem(item: any, contents: any, tableId: any, conditionsExprCompiler: any, existingConditionExpr: any, reverseJoins?: never[], confidentialData?: boolean): any;
    addCalculations(schema: any, form: any): any;
}
