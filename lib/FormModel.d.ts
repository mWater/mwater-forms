export default class FormModel {
    constructor(form: any);
    getDeploymentSubjects(): any[];
    correctViewers(): any;
    canDeleteRole(role: any): boolean;
    canChangeRole(role: any): boolean;
    amAdmin(user: any, groups: any): boolean;
    amDeploy(user: any, groups: any): boolean;
    amDeploymentAdmin(user: any, groups: any): boolean;
}
