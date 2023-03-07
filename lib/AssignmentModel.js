"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
// Model of an assignment object that allows manipulation
// Options are:
// assignment: assignment object. Required
// form: form object. Required
// user: current user id. Required
// groups: group ids of user
class AssignmentModel {
    constructor(options) {
        this.assignment = options.assignment;
        this.form = options.form;
        this.user = options.user;
        this.groups = options.groups || [];
    }
    // Fixes roles to reflect status and approved fields
    fixRoles() {
        // Determine deployment
        const deployment = lodash_1.default.findWhere(this.form.deployments, { _id: this.assignment.deployment });
        if (!deployment) {
            throw new Error(`No matching deployments for ${this.form._id} user ${this.user}`);
        }
        let admins = [];
        let viewers = this.assignment.assignedTo;
        // Add form admins always
        admins = lodash_1.default.union(admins, lodash_1.default.pluck(lodash_1.default.where(this.form.roles, { role: "admin" }), "id"));
        // Add deployment admins
        admins = lodash_1.default.union(admins, deployment.admins, deployment.superadmins || []);
        // If already admin, don't include in viewers
        viewers = lodash_1.default.difference(viewers, admins);
        this.assignment.roles = lodash_1.default.map(admins, (s) => ({
            id: s,
            role: "admin"
        }));
        this.assignment.roles = this.assignment.roles.concat(lodash_1.default.map(viewers, (s) => ({
            id: s,
            role: "view"
        })));
    }
    canManage() {
        const admins = lodash_1.default.pluck(lodash_1.default.where(this.assignment.roles, { role: "admin" }), "id");
        let subjects = ["user:" + this.user, "all"];
        subjects = subjects.concat(lodash_1.default.map(this.groups, (g) => "group:" + g));
        return lodash_1.default.intersection(admins, subjects).length > 0;
    }
    canView() {
        if (this.canManage()) {
            return true;
        }
        const admins = lodash_1.default.pluck(lodash_1.default.where(this.assignment.roles, { role: "view" }), "id");
        let subjects = ["user:" + this.user, "all"];
        subjects = subjects.concat(lodash_1.default.map(this.groups, (g) => "group:" + g));
        return lodash_1.default.intersection(admins, subjects).length > 0;
    }
}
exports.default = AssignmentModel;
