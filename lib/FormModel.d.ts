import { Deployment, Form } from "./form";
/** Model of a form object that allows manipulation and asking of questions */
export default class FormModel {
    form: Form;
    constructor(form: Form);
    getDeploymentSubjects(): string[];
    correctViewers(): void;
    canDeleteRole(role: any): boolean;
    canChangeRole(role: any): boolean;
    /** Check if user is admin of entire form */
    amAdmin(user: string, groups: string[]): boolean;
    /** Check if user is admin or deploy of entire form */
    amDeploy(user: string, groups: string[]): boolean;
    /** Check if user is admin or superadmin of at least one deployment */
    amDeploymentAdmin(user: string, groups: string[]): boolean;
    /** Check if user is superadmin of at least one deployment */
    amDeploymentSuperadmin(user: string, groups: string[]): boolean;
    /** Check if user can edit deployment */
    canEditDeployment(deployment: Deployment, user: string, groups: string[]): boolean;
}
