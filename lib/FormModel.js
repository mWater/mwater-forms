"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
// Model of a form object that allows manipulation and asking of questions
class FormModel {
    constructor(form) {
        this.form = form;
    }
    // Gets all subjects that must be able to see form because of deployments
    getDeploymentSubjects() {
        function getDeploymentSubs(deployment) {
            const approvers = lodash_1.default.flatten(lodash_1.default.map(deployment.approvalStages, (stage) => stage.approvers));
            return lodash_1.default.union(approvers, deployment.enumerators, deployment.viewers, deployment.admins);
        }
        // Get all deployment subjects
        const deploySubs = lodash_1.default.uniq(lodash_1.default.flatten(lodash_1.default.map(this.form.deployments || [], getDeploymentSubs)));
        return deploySubs;
    }
    // Corrects viewing roles to ensure that appropriate subjects can see form
    correctViewers() {
        // Compute viewers needed who don't have roles
        const needed = lodash_1.default.difference(this.getDeploymentSubjects(), lodash_1.default.map(this.form.roles, (r) => r.id));
        this.form.roles = this.form.roles.concat(lodash_1.default.map(needed, (n) => ({
            id: n,
            role: "view"
        })));
    }
    // Checks if the role must remain as a role due to being in a deployment or being only admin
    canDeleteRole(role) {
        if (role.role === "admin" && lodash_1.default.where(this.form.roles, { role: "admin" }).length <= 1) {
            return false;
        }
        return !lodash_1.default.contains(this.getDeploymentSubjects(), role.id);
    }
    // Checks if the subject must remain as a role due to being only admin
    canChangeRole(role) {
        if (role.role === "admin" && lodash_1.default.where(this.form.roles, { role: "admin" }).length <= 1) {
            return false;
        }
        return true;
    }
    // Check if user is an admin
    amAdmin(user, groups) {
        let subjects = ["all", "user:" + user];
        subjects = subjects.concat(lodash_1.default.map(groups, (g) => "group:" + g));
        return lodash_1.default.any(this.form.roles, (r) => subjects.includes(r.id) && r.role === "admin");
    }
    // Check if user is admin or deploy
    amDeploy(user, groups) {
        let subjects = ["all", "user:" + user];
        subjects = subjects.concat(lodash_1.default.map(groups, (g) => "group:" + g));
        return lodash_1.default.any(this.form.roles, (r) => subjects.includes(r.id) && ["admin", "deploy"].includes(r.role));
    }
    // Check if user is admin of a deployment
    amDeploymentAdmin(user, groups) {
        let subjects = ["all", "user:" + user];
        subjects = subjects.concat(lodash_1.default.map(groups, (g) => "group:" + g));
        return lodash_1.default.any(this.form.deployments || [], (dep) => lodash_1.default.intersection(dep.admins, subjects).length > 0);
    }
}
exports.default = FormModel;
