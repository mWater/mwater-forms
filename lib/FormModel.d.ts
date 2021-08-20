import { Form } from "./form";
export default class FormModel {
    form: Form;
    constructor(form: Form);
    getDeploymentSubjects(): string[];
    correctViewers(): void;
    canDeleteRole(role: any): boolean;
    canChangeRole(role: any): boolean;
    amAdmin(user: any, groups: any): boolean;
    amDeploy(user: any, groups: any): boolean;
    amDeploymentAdmin(user: any, groups: any): boolean;
}
