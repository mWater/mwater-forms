declare const _default: {
    new (schema: any, responseRow: any, locale: any): {
        validate(question: any, answer: any): Promise<any>;
        validateSpecificAnswerType(question: any, answer: any): any;
        validateSiteQuestion(question: any, answer: any): true | "Invalid code" | null;
        validateTextQuestion(question: any, answer: any): "Invalid format" | null;
        validateUnitsQuestion(question: any, answer: any): "units field is required when a quantity is set" | null;
        validateLikertQuestion(question: any, answer: any): "Invalid choice" | null;
        validateNumberQuestion(question: any, answer: any): null;
        validateMatrixQuestion(question: any, answer: any): any;
    };
};
export default _default;
