import { DataSource, Expr, FieldExpr, OpExpr, ScalarExpr, Schema } from 'mwater-expressions';
import { ResponseDataValidatorError } from './ResponseDataValidator';
import { FormDesign, Item, Question } from './formDesign';
import { Answer, ResponseData } from './response';
import { ResponseRow } from '.';
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
    cleanData(data: ResponseData, createResponseRow: (data: ResponseData) => ResponseRow, callback: (error: any, cleanedData?: ResponseData) => void): void;
    validateData(data: ResponseData, responseRow: ResponseRow, callback: (error: any, result?: ResponseDataValidatorError | null) => void): void;
    updateData(data: ResponseData, expr: Expr, value: any, callback: (error: any, responseData?: ResponseData) => void): void;
    updateCascadingList(data: ResponseData, expr: FieldExpr, value: any, callback: (error: any, responseData?: ResponseData) => void): void;
    updateValue(data: ResponseData, expr: FieldExpr, value: any, callback: (error: any, responseData?: ResponseData) => void): void;
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
    updateScalar(data: ResponseData, expr: ScalarExpr, value: any, callback: (error: any, responseData?: ResponseData) => void): void;
}
