import { Schema, Column, Section } from "mwater-expressions";
import ConditionsExprCompiler from "./ConditionsExprCompiler";
import { Form } from "./form";
import { IndicatorCalculation } from ".";
import { FormDesign, Item } from "./formDesign";
/** Adds a form to a mwater-expressions schema */
export default class FormSchemaBuilder {
    /** indicators is at least all indicators referenced in indicator calculations. Can be empty and indicator calculations will be omitted */
    addForm(schema: Schema, form: Form, cloneFormsDeprecated?: boolean, isAdmin?: boolean, indicators?: any): Schema;
    addReverseJoins(schema: Schema, form: Form, reverseJoins: {
        table: string;
        column: Column;
    }[]): Schema;
    addRosterTables(schema: any, design: any, conditionsExprCompiler: any, reverseJoins: any, tableId: any): any;
    addIndicatorCalculations(schema: Schema, form: Form, indicators: any[]): Schema;
    createIndicatorCalculationSection(indicatorCalculation: IndicatorCalculation, schema: Schema, indicators: any[], form: Form): Section | null;
    addConfidentialDataForRosters(schema: Schema, form: Form, conditionsExprCompiler: ConditionsExprCompiler): Schema;
    addConfidentialData(schema: Schema, form: Form, conditionsExprCompiler: ConditionsExprCompiler): Schema;
    addFormItem(item: Item | FormDesign, contents: any, tableId: any, conditionsExprCompiler?: any, existingConditionExpr?: any, reverseJoins?: {
        table: string;
        column: Column;
    }[], confidentialData?: boolean): any;
    addCalculations(schema: any, form: any): any;
}
