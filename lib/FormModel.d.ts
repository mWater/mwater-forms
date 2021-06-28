declare const _default: {
    new (form: any): {
        getDeploymentSubjects(): any[];
        correctViewers(): any;
        canDeleteRole(role: any): boolean;
        canChangeRole(role: any): boolean;
        amAdmin(user: any, groups: any): boolean;
        amDeploy(user: any, groups: any): boolean;
        amDeploymentAdmin(user: any, groups: any): boolean;
    };
};
export default _default;
