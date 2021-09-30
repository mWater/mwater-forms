export default class ValidationCompiler {
    locale: string;
    constructor(locale: string);
    compileString: (str: any) => any;
    compileValidationMessage: (val: any) => any;
    compileValidation: (val: any) => (answer: any) => any;
    compileValidations: (vals: any) => (answer: any) => any;
}
