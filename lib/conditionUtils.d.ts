import { Condition, Question } from "./formDesign";
export declare function compileCondition(cond: Condition): (data: any) => boolean;
export declare function compileConditions(conds: Condition[]): (data: any) => boolean;
export declare function applicableOps(lhsQuestion: any): {
    id: string;
    text: string;
}[];
declare function _rhsType(lhsQuestion: any, op: any): "text" | "number" | "date" | "choice" | "choices" | null;
export { _rhsType as rhsType };
export declare function rhsChoices(lhsQuestion: Question, op: any): {
    id: string;
    text: string;
}[];
export declare function validateCondition(cond: any, formDesign: any): boolean;
export declare function summarizeConditions(conditions: never[] | undefined, formDesign: any, locale: any): string;
export declare function summarizeCondition(cond: any, formDesign: any, locale: any): string;
