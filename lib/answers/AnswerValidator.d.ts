import { Schema } from "mwater-expressions";
import { Answer, Question, ResponseRow } from "..";
import { MatrixColumnQuestion } from "../formDesign";
export default class AnswerValidator {
    schema: Schema;
    responseRow: ResponseRow;
    locale: string;
    constructor(schema: Schema, responseRow: ResponseRow, locale: string);
    validate(question: Question | MatrixColumnQuestion, answer: Answer): Promise<any>;
    validateSpecificAnswerType(question: any, answer: any): any;
    validateSiteQuestion(question: any, answer: any): true | "Invalid code" | null;
    validateTextQuestion(question: any, answer: any): "Invalid format" | null;
    validateUnitsQuestion(question: any, answer: any): "units field is required when a quantity is set" | null;
    validateLikertQuestion(question: any, answer: any): "Invalid choice" | null;
    validateNumberQuestion(question: any, answer: any): null;
    validateMatrixQuestion(question: any, answer: any): any;
}
