export default class ValidationCompiler {
    constructor(locale: any);
    compileString: (str: any) => any;
    compileValidationMessage: (val: any) => any;
    compileValidation: (val: any) => (answer: any) => any;
    compileValidations: (vals: any) => (answer: any) => any;
}
