"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const formUtils = __importStar(require("./formUtils"));
/** Model of a response object that allows manipulation and asking of questions */
class ResponseModel {
    constructor(options) {
        this.response = options.response;
        this.form = options.form;
        this.user = options.user;
        this.username = options.username;
        this.groups = options.groups || [];
    }
    /** Setup draft. deploymentId is optional _id of deployment to use for cases where ambiguous */
    draft(deploymentId) {
        if (!this.response._id) {
            this.response._id = formUtils.createUid();
        }
        this.response.form = this.form._id;
        this.response.user = this.user;
        this.response.username = this.username;
        this.response.startedOn = new Date().toISOString();
        this.response.data = {};
        this.response.approvals = [];
        this.response.events = [];
        // Create code. Not unique, but unique per user if logged in once.
        this.response.code = this.username + "-" + formUtils.createBase32TimeCode(new Date());
        this.response.formRev = this.form._rev;
        this.response.status = "draft";
        this._addEvent("draft");
        if (deploymentId) {
            this.response.deployment = deploymentId;
        }
        else if (!this.response.deployment) {
            // Select first deployment if not specified and not already present
            const deployments = this.listEnumeratorDeployments();
            if (deployments.length === 0) {
                throw new Error(`No matching deployments for ${this.form._id} user ${this.username}`);
            }
            this.response.deployment = deployments[0]._id;
        }
        this.fixRoles();
        this.updateEntities();
    }
    /** Switch back to draft mode */
    redraft() {
        // Add event if not in draft
        if (this.response.status !== "draft") {
            this._addEvent("draft");
        }
        // Unfinalize if final
        if (this.response.status === "final") {
            this._unfinalize();
        }
        this.response.status = "draft";
        this.response.approvals = [];
        this.fixRoles();
        return this.updateEntities();
    }
    /** Return all active deployments that the user can enumerate */
    listEnumeratorDeployments() {
        let subjects = ["user:" + this.user, "all"];
        subjects = subjects.concat(lodash_1.default.map(this.groups, (g) => "group:" + g));
        return lodash_1.default.filter(this.form.deployments, (dep) => {
            return lodash_1.default.intersection(dep.enumerators, subjects).length > 0 && dep.active;
        });
    }
    /** Save for later. Does no state transitions, but updates any entity references
     * and other housekeeping before saving it */
    saveForLater() {
        this.fixRoles();
        this.updateEntities();
    }
    /** Submit (either to final or pending as appropriate) */
    submit() {
        this.response.submittedOn = new Date().toISOString();
        const deployment = lodash_1.default.findWhere(this.form.deployments, { _id: this.response.deployment });
        if (!deployment) {
            throw new Error(`No matching deployments for ${this.form._id} user ${this.username}`);
        }
        // If no approval stages
        if (deployment.approvalStages.length === 0) {
            this._finalize();
        }
        else {
            this.response.status = "pending";
            this.response.approvals = [];
        }
        this._addEvent("submit");
        this.fixRoles();
        this.updateEntities();
    }
    /** Can submit if in draft/rejected and am enumerator or admin */
    canSubmit() {
        if (!["draft", "rejected"].includes(this.response.status)) {
            return false;
        }
        // Anonymous can submit
        if (!this.response.user) {
            return true;
        }
        const deployment = lodash_1.default.findWhere(this.form.deployments, { _id: this.response.deployment });
        if (!deployment) {
            return false;
        }
        // Get list of admins at both deployment and form level
        let admins = lodash_1.default.union(lodash_1.default.pluck(lodash_1.default.where(this.form.roles, { role: "admin" }), "id"), deployment.admins);
        // Add enumerator
        admins = lodash_1.default.union(admins, [`user:${this.response.user}`]);
        let subjects = ["user:" + this.user, "all"];
        subjects = subjects.concat(lodash_1.default.map(this.groups, (g) => "group:" + g));
        return lodash_1.default.intersection(admins, subjects).length > 0;
    }
    /** Approve response */
    approve() {
        var _a;
        if (!this.canApprove()) {
            throw new Error("Cannot approve");
        }
        const deployment = lodash_1.default.findWhere(this.form.deployments, { _id: this.response.deployment });
        if (!deployment) {
            throw new Error(`No matching deployments for ${this.form._id} user ${this.username}`);
        }
        const approval = { by: this.user, on: new Date().toISOString() };
        // Determine if approver (vs admin)
        const approvers = ((_a = deployment.approvalStages[this.response.approvals.length]) === null || _a === void 0 ? void 0 : _a.approvers) || [];
        let subjects = ["user:" + this.user];
        subjects = subjects.concat(lodash_1.default.map(this.groups, (g) => "group:" + g));
        if (lodash_1.default.intersection(approvers, subjects).length === 0) {
            approval.override = true;
        }
        this.response.approvals.push(approval);
        // Check if last stage
        if (this.response.approvals.length >= deployment.approvalStages.length) {
            this._finalize();
        }
        this._addEvent("approve", { override: lodash_1.default.intersection(approvers, subjects).length === 0 });
        this.fixRoles();
        this.updateEntities();
    }
    /** Reject a response with a specific rejection message */
    reject(message) {
        if (!this.canReject()) {
            throw new Error("Cannot reject");
        }
        const deployment = lodash_1.default.findWhere(this.form.deployments, { _id: this.response.deployment });
        if (!deployment) {
            throw new Error(`No matching deployments for ${this.form._id} user ${this.username}`);
        }
        // Unfinalize if final
        if (this.response.status === "final") {
            this._unfinalize();
        }
        this.response.status = "rejected";
        this.response.rejectionMessage = message;
        this.response.approvals = [];
        this._addEvent("reject", { message });
        this.fixRoles();
        this.updateEntities();
    }
    /** Record that an edit was done, if not by enumerator */
    recordEdit() {
        if (this.user !== this.response.user) {
            this._addEvent("edit");
        }
    }
    // Performs special operation when a response becomes final. Also sets status
    _finalize() {
        // Set response status
        return (this.response.status = "final");
    }
    // Performs special operation when a response goes from final to other
    _unfinalize() { }
    /** Updates entities field. Stores a list of all entity references in the response */
    updateEntities() {
        this.response.entities = formUtils.extractEntityReferences(this.form.design, this.response.data);
    }
    /** Fixes roles to reflect status and approved fields */
    fixRoles() {
        var _a, _b;
        // Determine deployment
        let admins, viewers;
        const deployment = lodash_1.default.findWhere(this.form.deployments, { _id: this.response.deployment });
        if (!deployment) {
            admins = lodash_1.default.pluck(lodash_1.default.where(this.form.roles, { role: "admin" }), "id");
            if (this.response.user) {
                admins.push("user:" + this.response.user);
            }
            this.response.roles = lodash_1.default.map(admins, (s) => ({
                id: s,
                role: "admin"
            }));
            return;
        }
        // If deleted, no viewers
        if (this.form.state === "deleted") {
            return (this.response.roles = []);
        }
        // If pending and more or equal approvals than approval stages, response is final
        if (this.response.status === "pending" &&
            this.response.approvals != null &&
            this.response.approvals.length >= deployment.approvalStages.length) {
            this._finalize();
        }
        // User is always admin unless final and not enumeratorAdminFinal flag, then viewer
        // However, if deployment inactive, user can't see responses
        if (deployment.active) {
            if (this.response.status === "final" && !deployment.enumeratorAdminFinal) {
                admins = [];
                if (this.response.user) {
                    viewers = ["user:" + this.response.user];
                }
                else {
                    viewers = [];
                }
            }
            else {
                if (this.response.user) {
                    admins = ["user:" + this.response.user];
                }
                else {
                    admins = [];
                }
                viewers = [];
            }
        }
        else {
            admins = [];
            viewers = [];
        }
        // Add form admins always
        admins = lodash_1.default.union(admins, lodash_1.default.pluck(lodash_1.default.where(this.form.roles, { role: "admin" }), "id"));
        // Add deployment admins
        admins = lodash_1.default.union(admins, deployment.admins);
        // Approvers are admins unless at their stage, otherwise they are viewers
        if (this.response.status === "pending") {
            for (let i = 0, end = deployment.approvalStages.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
                if (this.response.approvals.length === i) {
                    admins = lodash_1.default.union(admins, ((_a = deployment.approvalStages[i]) === null || _a === void 0 ? void 0 : _a.approvers) || []);
                }
                else {
                    viewers = lodash_1.default.union(viewers, ((_b = deployment.approvalStages[i]) === null || _b === void 0 ? void 0 : _b.approvers) || []);
                }
            }
        }
        else {
            for (let approvalStage of deployment.approvalStages) {
                viewers = lodash_1.default.union(viewers, approvalStage.approvers);
            }
        }
        // Viewers of deployment can see if final
        if (this.response.status === "final") {
            viewers = lodash_1.default.union(viewers, deployment.viewers);
        }
        // If already admin, don't include in viewers
        viewers = lodash_1.default.difference(viewers, admins);
        this.response.roles = lodash_1.default.map(admins, (s) => ({
            id: s,
            role: "admin"
        }));
        this.response.roles = this.response.roles.concat(lodash_1.default.map(viewers, (s) => ({
            id: s,
            role: "view"
        })));
    }
    /** Determine if can approve response */
    canApprove() {
        var _a;
        const deployment = lodash_1.default.findWhere(this.form.deployments, { _id: this.response.deployment });
        if (!deployment) {
            return false;
        }
        if (this.response.status !== "pending") {
            return false;
        }
        // Get list of admins at both deployment and form level and add approvers
        const admins = lodash_1.default.union(lodash_1.default.pluck(lodash_1.default.where(this.form.roles, { role: "admin" }), "id"), deployment.admins, ((_a = deployment.approvalStages[this.response.approvals.length]) === null || _a === void 0 ? void 0 : _a.approvers) || []);
        let subjects = ["user:" + this.user, "all"];
        subjects = subjects.concat(lodash_1.default.map(this.groups, (g) => "group:" + g));
        if (lodash_1.default.intersection(admins, subjects).length > 0) {
            return true;
        }
        return false;
    }
    /** Determine if am an approver for the response, as opposed to admin who could still approve */
    amApprover() {
        var _a;
        const deployment = lodash_1.default.findWhere(this.form.deployments, { _id: this.response.deployment });
        if (!deployment) {
            return false;
        }
        if (this.response.status !== "pending") {
            return false;
        }
        // Get list of approvers
        const approvers = ((_a = deployment.approvalStages[this.response.approvals.length]) === null || _a === void 0 ? void 0 : _a.approvers) || [];
        let subjects = ["user:" + this.user, "all"];
        subjects = subjects.concat(lodash_1.default.map(this.groups, (g) => "group:" + g));
        if (lodash_1.default.intersection(approvers, subjects).length > 0) {
            return true;
        }
        return false;
    }
    /** Determine if can delete response */
    canDelete() {
        let subjects = ["user:" + this.user, "all"];
        subjects = subjects.concat(lodash_1.default.map(this.groups, (g) => "group:" + g));
        const deployment = lodash_1.default.findWhere(this.form.deployments, { _id: this.response.deployment });
        if (!deployment) {
            // Only delete if admin
            return lodash_1.default.intersection(lodash_1.default.pluck(lodash_1.default.where(this.form.roles, { role: "admin" }), "id"), subjects).length > 0;
        }
        // Get list of admins at both deployment and form level
        let admins = lodash_1.default.union(lodash_1.default.pluck(lodash_1.default.where(this.form.roles, { role: "admin" }), "id"), deployment.admins);
        // Add approvers if level allows editing
        if (this.response.status === "pending") {
            const approvalStage = deployment.approvalStages[this.response.approvals.length];
            if (approvalStage != null && !approvalStage.preventEditing) {
                admins = lodash_1.default.union(admins, approvalStage.approvers);
            }
        }
        // Add enumerator if in draft or rejected
        if (["draft", "rejected"].includes(this.response.status) && this.response.user) {
            admins = lodash_1.default.union(admins, [`user:${this.response.user}`]);
        }
        // Add enumerator if final and enumeratorAdminFinal
        if (this.response.status === "final" && this.response.user && deployment.enumeratorAdminFinal) {
            admins = lodash_1.default.union(admins, [`user:${this.response.user}`]);
        }
        return lodash_1.default.intersection(admins, subjects).length > 0;
    }
    /** Determine if can edit response */
    canEdit() {
        const deployment = lodash_1.default.findWhere(this.form.deployments, { _id: this.response.deployment });
        if (!deployment) {
            return false;
        }
        // Get list of admins at both deployment and form level
        let admins = lodash_1.default.union(lodash_1.default.pluck(lodash_1.default.where(this.form.roles, { role: "admin" }), "id"), deployment.admins);
        // Add approvers if level allows editing
        if (this.response.status === "pending") {
            const approvalStage = deployment.approvalStages[this.response.approvals.length];
            if (approvalStage != null && !approvalStage.preventEditing) {
                admins = lodash_1.default.union(admins, approvalStage.approvers);
            }
        }
        // Add enumerator if in draft or rejected (can delete but not edit)
        if (["draft", "rejected"].includes(this.response.status) && this.response.user) {
            admins = lodash_1.default.union(admins, [`user:${this.response.user}`]);
        }
        let subjects = ["user:" + this.user, "all"];
        subjects = subjects.concat(lodash_1.default.map(this.groups, (g) => "group:" + g));
        return lodash_1.default.intersection(admins, subjects).length > 0;
    }
    /** Determine if can switch back to draft phase. Only enumerators can do this and only if pending, rejected, draft or enumerators can edit final */
    canRedraft() {
        // Cannot redraft anonymous responses
        if (!this.response.user) {
            return false;
        }
        const deployment = lodash_1.default.findWhere(this.form.deployments, { _id: this.response.deployment });
        if (!deployment) {
            return false;
        }
        let subjects = ["user:" + this.user, "all"];
        subjects = subjects.concat(lodash_1.default.map(this.groups, (g) => "group:" + g));
        if (["pending", "rejected", "draft"].includes(this.response.status)) {
            return subjects.includes(`user:${this.response.user}`);
        }
        else {
            // Final
            return subjects.includes(`user:${this.response.user}`) && deployment.enumeratorAdminFinal;
        }
    }
    // Determine if can reject response
    canReject() {
        var _a;
        // Cannot reject anonymous responses
        let admins, subjects;
        if (!this.response.user) {
            return false;
        }
        const deployment = lodash_1.default.findWhere(this.form.deployments, { _id: this.response.deployment });
        if (!deployment) {
            return false;
        }
        if (this.response.status === "draft" || this.response.status === "rejected") {
            return false;
        }
        if (this.response.status === "pending") {
            // Get list of admins at both deployment and form level and add approvers
            admins = lodash_1.default.union(lodash_1.default.pluck(lodash_1.default.where(this.form.roles, { role: "admin" }), "id"), deployment.admins, ((_a = deployment.approvalStages[this.response.approvals.length]) === null || _a === void 0 ? void 0 : _a.approvers) || []);
            subjects = ["user:" + this.user, "all"];
            subjects = subjects.concat(lodash_1.default.map(this.groups, (g) => "group:" + g));
            if (lodash_1.default.intersection(admins, subjects).length > 0) {
                return true;
            }
            return false;
        }
        else if (this.response.status === "final") {
            // Admins can reject final
            admins = lodash_1.default.union(lodash_1.default.pluck(lodash_1.default.where(this.form.roles, { role: "admin" }), "id"), deployment.admins);
            subjects = ["user:" + this.user, "all"];
            subjects = subjects.concat(lodash_1.default.map(this.groups, (g) => "group:" + g));
            return lodash_1.default.intersection(admins, subjects).length > 0;
        }
    }
    // Add an event
    _addEvent(type, attrs = {}) {
        const event = lodash_1.default.extend({ type, by: this.user, on: new Date().toISOString() }, attrs);
        this.response.events = this.response.events || [];
        return this.response.events.push(event);
    }
}
exports.default = ResponseModel;
