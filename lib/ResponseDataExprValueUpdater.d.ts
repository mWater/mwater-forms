import { DataSource, Expr, FieldExpr, OpExpr, Schema } from "mwater-expressions";
import { ResponseDataValidatorError } from "./ResponseDataValidator";
import { FormDesign, Item, Question } from "./formDesign";
import { Answer, ResponseData } from "./response";
import { ResponseRow } from ".";
/** Updates data in a response given an expression (mWater expression, see FormSchemaBuilder and also mwater-expressions package) and a value
 * When updates are complete for data, cleanData must be called to clean data (removing values that are invisble because of conditions).
 * and then call validateData to ensure that is valid
 */
export default class ResponseDataExprValueUpdater {
    formDesign: FormDesign;
    schema: Schema;
    dataSource: DataSource;
    formItems: {
        [id: string]: Item;
    };
    constructor(formDesign: FormDesign, schema: Schema, dataSource: DataSource);
    /** True if an expression can be updated */
    canUpdate(expr: Expr): boolean;
    /** Cleans data. Must be called after last update is done.
     * createResponseRow takes one parameter (data) and returns a response row
     */
    cleanData(data: ResponseData, createResponseRow: (data: ResponseData) => ResponseRow): Promise<ResponseData>;
    cleanData(data: ResponseData, createResponseRow: (data: ResponseData) => ResponseRow, callback: (error: any, cleanedData?: ResponseData) => void): void;
    /** Validates the data. Clean first. */
    validateData(data: ResponseData, responseRow: ResponseRow): Promise<ResponseDataValidatorError | null>;
    validateData(data: ResponseData, responseRow: ResponseRow, callback: (error: any, result?: ResponseDataValidatorError | null) => void): void;
    /** Updates the data of a response, given multiple expressions and their values.
     * This is the preferred way to do multiple updates instead of calling updateData repeatedly,
     * as some expressions may depend on another. For example, if there are two scalar expressions
     * for the same join, then the search for the underlying id value must take into account
     * both constraints (e.g. updating based on water point name and type)
     */
    updateDataMultiple(data: ResponseData, exprValues: {
        expr: Expr;
        value: any;
    }[]): Promise<ResponseData>;
    /** Updates the data of a response, given an expression and its value. For example,
     * if there is a text field in question q1234, the expression { type: "field", table: "responses:form123", column: "data:q1234:value" }
     * refers to the text field value. Setting it will set data.q1234.value in the data.
     */
    updateData(data: ResponseData, expr: Expr, value: any): Promise<ResponseData>;
    updateData(data: ResponseData, expr: Expr, value: any, callback: (error: any, responseData?: ResponseData) => void): void;
    updateCascadingList(data: ResponseData, expr: FieldExpr, value: any, callback: (error: any, responseData?: ResponseData) => void): void;
    updateValue(data: ResponseData, expr: FieldExpr, value: any, callback: (error: any, responseData?: ResponseData) => void): void | Promise<void>;
    updateLocationLatLng(data: ResponseData, expr: OpExpr, value: any, callback: (error: any, responseData?: ResponseData) => void): void;
    updateLocationMethod(data: ResponseData, expr: FieldExpr, value: any, callback: (error: any, responseData?: ResponseData) => void): void;
    updateLocationAccuracy(data: ResponseData, expr: FieldExpr, value: any, callback: (error: any, responseData?: ResponseData) => void): void;
    updateLocationAltitude(data: ResponseData, expr: FieldExpr, value: any, callback: (error: any, responseData?: ResponseData) => void): void;
    updateQuantity(data: ResponseData, expr: FieldExpr, value: any, callback: (error: any, responseData?: ResponseData) => void): void;
    updateUnits(data: ResponseData, expr: FieldExpr, value: any, callback: (error: any, responseData?: ResponseData) => void): void;
    updateCBTField(data: ResponseData, expr: FieldExpr, value: any, cbtField: string, callback: (error: any, responseData?: ResponseData) => void): void;
    updateCBTImage(data: ResponseData, expr: FieldExpr, value: any, callback: (error: any, responseData?: ResponseData) => void): void;
    updateEnumsetContains(data: ResponseData, expr: OpExpr, value: any, callback: (error: any, responseData?: ResponseData) => void): void;
    updateSpecify(data: ResponseData, expr: FieldExpr, value: any, callback: (error: any, responseData?: ResponseData) => void): void;
    updateItemsChoices(data: ResponseData, expr: FieldExpr, value: any, callback: (error: any, responseData?: ResponseData) => void): void;
    updateMatrix(data: ResponseData, expr: FieldExpr, value: any, callback: (error: any, responseData?: ResponseData) => void): void;
    updateComments(data: ResponseData, expr: FieldExpr, value: any, callback: (error: any, responseData?: ResponseData) => void): void;
    updateAlternate(data: ResponseData, expr: FieldExpr, value: any, callback: (error: any, responseData?: ResponseData) => void): void;
    setAnswer(data: ResponseData, question: Question, answer: Answer): ResponseData;
    setValue(data: ResponseData, question: Question, value: any): ResponseData;
    /** Update a scalar, which may have multiple expressions to determine the row referenced */
    updateScalar(data: ResponseData, join: string, exprValues: {
        expr: Expr;
        value: any;
    }[]): Promise<ResponseData>;
}
