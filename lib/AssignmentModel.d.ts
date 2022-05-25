import { Form } from "./form";
export default class AssignmentModel {
    assignment: any;
    form: Form;
    user: string;
    groups: string[];
    constructor(options: {
        assignment: any;
        form: Form;
        user: string;
        groups: string[];
    });
    fixRoles(): void;
    canManage(): boolean;
    canView(): boolean;
}
