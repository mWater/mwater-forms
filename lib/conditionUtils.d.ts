declare let _compileCondition: (cond: any) => (data: any) => boolean;
export { _compileCondition as compileCondition };
export declare let compileConditions: (conds: any) => (data: any) => boolean;
export declare function applicableOps(lhsQuestion: any): {
    id: string;
    text: string;
}[];
declare function _rhsType(lhsQuestion: any, op: any): "text" | "number" | "choices" | "choice" | "date" | null;
export { _rhsType as rhsType };
export declare function rhsChoices(lhsQuestion: any, op: any): any;
export declare function validateCondition(cond: any, formDesign: any): boolean;
export declare function summarizeConditions(conditions: never[] | undefined, formDesign: any, locale: any): string;
export declare function summarizeCondition(cond: any, formDesign: any, locale: any): any;
