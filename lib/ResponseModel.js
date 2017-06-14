var ResponseModel, _, formUtils,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

_ = require('lodash');

formUtils = require('./formUtils');

module.exports = ResponseModel = (function() {
  function ResponseModel(options) {
    this.response = options.response;
    this.form = options.form;
    this.user = options.user;
    this.username = options.username;
    this.groups = options.groups || [];
  }

  ResponseModel.prototype.draft = function(deploymentId) {
    var deployments;
    if (this.response._id) {
      throw new Error("Response already has _id");
    }
    this.response._id = formUtils.createUid();
    this.response.form = this.form._id;
    this.response.user = this.user;
    this.response.startedOn = new Date().toISOString();
    this.response.data = {};
    this.response.approvals = [];
    this.response.events = [];
    this.response.code = this.username + "-" + formUtils.createBase32TimeCode(new Date());
    this.response.formRev = this.form._rev;
    this.response.status = "draft";
    this._addEvent("draft");
    if (deploymentId) {
      this.response.deployment = deploymentId;
    } else if (!this.response.deployment) {
      deployments = this.listEnumeratorDeployments();
      if (deployments.length === 0) {
        throw new Error("No matching deployments for " + this.form._id + " user " + this.username);
      }
      this.response.deployment = deployments[0]._id;
    }
    this.fixRoles();
    return this.updateEntities();
  };

  ResponseModel.prototype.redraft = function() {
    if (this.response.status !== "draft") {
      this._addEvent("draft");
    }
    if (this.response.status === "final") {
      this._unfinalize();
    }
    this.response.status = "draft";
    this.response.approvals = [];
    this.fixRoles();
    return this.updateEntities();
  };

  ResponseModel.prototype.listEnumeratorDeployments = function() {
    var subjects;
    subjects = ["user:" + this.user, "all"];
    subjects = subjects.concat(_.map(this.groups, function(g) {
      return "group:" + g;
    }));
    return _.filter(this.form.deployments, (function(_this) {
      return function(dep) {
        return _.intersection(dep.enumerators, subjects).length > 0 && dep.active;
      };
    })(this));
  };

  ResponseModel.prototype.saveForLater = function() {
    this.fixRoles();
    return this.updateEntities();
  };

  ResponseModel.prototype.submit = function() {
    var deployment;
    this.response.submittedOn = new Date().toISOString();
    deployment = _.findWhere(this.form.deployments, {
      _id: this.response.deployment
    });
    if (!deployment) {
      throw new Error("No matching deployments for " + this.form._id + " user " + this.username);
    }
    if (deployment.approvalStages.length === 0) {
      this._finalize();
    } else {
      this.response.status = "pending";
      this.response.approvals = [];
    }
    this._addEvent("submit");
    this.fixRoles();
    return this.updateEntities();
  };

  ResponseModel.prototype.canSubmit = function() {
    var admins, deployment, ref, subjects;
    if ((ref = this.response.status) !== 'draft' && ref !== 'rejected') {
      return false;
    }
    if (!this.response.user) {
      return true;
    }
    deployment = _.findWhere(this.form.deployments, {
      _id: this.response.deployment
    });
    if (!deployment) {
      throw new Error("No matching deployments for " + this.form._id + " user " + this.username);
    }
    admins = _.union(_.pluck(_.where(this.form.roles, {
      role: "admin"
    }), "id"), deployment.admins);
    admins = _.union(admins, ["user:" + this.response.user]);
    subjects = ["user:" + this.user, "all"];
    subjects = subjects.concat(_.map(this.groups, function(g) {
      return "group:" + g;
    }));
    return _.intersection(admins, subjects).length > 0;
  };

  ResponseModel.prototype.approve = function() {
    var approval, approvers, deployment, ref, subjects;
    if (!this.canApprove()) {
      throw new Error("Cannot approve");
    }
    deployment = _.findWhere(this.form.deployments, {
      _id: this.response.deployment
    });
    if (!deployment) {
      throw new Error("No matching deployments for " + this.form._id + " user " + this.username);
    }
    approval = {
      by: this.user,
      on: new Date().toISOString()
    };
    approvers = ((ref = deployment.approvalStages[this.response.approvals.length]) != null ? ref.approvers : void 0) || [];
    subjects = ["user:" + this.user];
    subjects = subjects.concat(_.map(this.groups, function(g) {
      return "group:" + g;
    }));
    if (_.intersection(approvers, subjects).length === 0) {
      approval.override = true;
    }
    this.response.approvals.push(approval);
    if (this.response.approvals.length >= deployment.approvalStages.length) {
      this._finalize();
    }
    this._addEvent("approve", {
      override: _.intersection(approvers, subjects).length === 0
    });
    this.fixRoles();
    return this.updateEntities();
  };

  ResponseModel.prototype.reject = function(message) {
    var deployment;
    if (!this.canReject()) {
      throw new Error("Cannot reject");
    }
    deployment = _.findWhere(this.form.deployments, {
      _id: this.response.deployment
    });
    if (!deployment) {
      throw new Error("No matching deployments for " + this.form._id + " user " + this.username);
    }
    if (this.response.status === "final") {
      this._unfinalize();
    }
    this.response.status = "rejected";
    this.response.rejectionMessage = message;
    this.response.approvals = [];
    this._addEvent("reject", {
      message: message
    });
    this.fixRoles();
    return this.updateEntities();
  };

  ResponseModel.prototype.recordEdit = function() {
    if (this.user !== this.response.user) {
      return this._addEvent("edit");
    }
  };

  ResponseModel.prototype._finalize = function() {
    return this.response.status = "final";
  };

  ResponseModel.prototype._unfinalize = function() {};

  ResponseModel.prototype.updateEntities = function() {
    return this.response.entities = formUtils.extractEntityReferences(this.form.design, this.response.data);
  };

  ResponseModel.prototype.fixRoles = function() {
    var admins, approvalStage, deployment, i, j, k, len, ref, ref1, ref2, ref3, viewers;
    deployment = _.findWhere(this.form.deployments, {
      _id: this.response.deployment
    });
    if (!deployment) {
      throw new Error("Deployment " + this.response.deployment + " not found for form " + this.form._id);
    }
    if (this.form.state === "deleted") {
      return this.response.roles = [];
    }
    if (this.response.status === "pending" && (this.response.approvals != null) && this.response.approvals.length >= deployment.approvalStages.length) {
      this._finalize();
    }
    if (deployment.active) {
      if (this.response.status === 'final' && !deployment.enumeratorAdminFinal) {
        admins = [];
        if (this.response.user) {
          viewers = ["user:" + this.response.user];
        } else {
          viewers = [];
        }
      } else {
        if (this.response.user) {
          admins = ["user:" + this.response.user];
        } else {
          admins = [];
        }
        viewers = [];
      }
    } else {
      admins = [];
      viewers = [];
    }
    admins = _.union(admins, _.pluck(_.where(this.form.roles, {
      role: "admin"
    }), "id"));
    admins = _.union(admins, deployment.admins);
    if (this.response.status === 'pending') {
      for (i = j = 0, ref = deployment.approvalStages.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        if (this.response.approvals.length === i) {
          admins = _.union(admins, ((ref1 = deployment.approvalStages[i]) != null ? ref1.approvers : void 0) || []);
        } else {
          viewers = _.union(viewers, ((ref2 = deployment.approvalStages[i]) != null ? ref2.approvers : void 0) || []);
        }
      }
    } else {
      ref3 = deployment.approvalStages;
      for (k = 0, len = ref3.length; k < len; k++) {
        approvalStage = ref3[k];
        viewers = _.union(viewers, approvalStage.approvers);
      }
    }
    if (this.response.status === 'final') {
      viewers = _.union(viewers, deployment.viewers);
    }
    viewers = _.difference(viewers, admins);
    this.response.roles = _.map(admins, function(s) {
      return {
        id: s,
        role: "admin"
      };
    });
    return this.response.roles = this.response.roles.concat(_.map(viewers, function(s) {
      return {
        id: s,
        role: "view"
      };
    }));
  };

  ResponseModel.prototype.canApprove = function() {
    var admins, deployment, ref, subjects;
    deployment = _.findWhere(this.form.deployments, {
      _id: this.response.deployment
    });
    if (!deployment) {
      throw new Error("No matching deployments for " + this.form._id + " user " + this.username);
    }
    if (this.response.status !== "pending") {
      return false;
    }
    admins = _.union(_.pluck(_.where(this.form.roles, {
      role: "admin"
    }), "id"), deployment.admins, ((ref = deployment.approvalStages[this.response.approvals.length]) != null ? ref.approvers : void 0) || []);
    subjects = ["user:" + this.user, "all"];
    subjects = subjects.concat(_.map(this.groups, function(g) {
      return "group:" + g;
    }));
    if (_.intersection(admins, subjects).length > 0) {
      return true;
    }
    return false;
  };

  ResponseModel.prototype.amApprover = function() {
    var approvers, deployment, ref, subjects;
    deployment = _.findWhere(this.form.deployments, {
      _id: this.response.deployment
    });
    if (!deployment) {
      throw new Error("No matching deployments for " + this.form._id + " user " + this.username);
    }
    if (this.response.status !== "pending") {
      return false;
    }
    approvers = ((ref = deployment.approvalStages[this.response.approvals.length]) != null ? ref.approvers : void 0) || [];
    subjects = ["user:" + this.user, "all"];
    subjects = subjects.concat(_.map(this.groups, function(g) {
      return "group:" + g;
    }));
    if (_.intersection(approvers, subjects).length > 0) {
      return true;
    }
    return false;
  };

  ResponseModel.prototype.canDelete = function() {
    var admins, approvalStage, deployment, ref, subjects;
    deployment = _.findWhere(this.form.deployments, {
      _id: this.response.deployment
    });
    if (!deployment) {
      throw new Error("No matching deployments for " + this.form._id + " user " + this.username);
    }
    admins = _.union(_.pluck(_.where(this.form.roles, {
      role: "admin"
    }), "id"), deployment.admins);
    if (this.response.status === "pending") {
      approvalStage = deployment.approvalStages[this.response.approvals.length];
      if ((approvalStage != null) && !approvalStage.preventEditing) {
        admins = _.union(admins, approvalStage.approvers);
      }
    }
    if (((ref = this.response.status) === 'draft' || ref === 'rejected') && this.response.user) {
      admins = _.union(admins, ["user:" + this.response.user]);
    }
    subjects = ["user:" + this.user, "all"];
    subjects = subjects.concat(_.map(this.groups, function(g) {
      return "group:" + g;
    }));
    return _.intersection(admins, subjects).length > 0;
  };

  ResponseModel.prototype.canEdit = function() {
    return this.canDelete();
  };

  ResponseModel.prototype.canRedraft = function() {
    var deployment, ref, ref1, ref2, subjects;
    if (!this.response.user) {
      return false;
    }
    deployment = _.findWhere(this.form.deployments, {
      _id: this.response.deployment
    });
    if (!deployment) {
      throw new Error("No matching deployments for " + this.form._id + " user " + this.username);
    }
    subjects = ["user:" + this.user, "all"];
    subjects = subjects.concat(_.map(this.groups, function(g) {
      return "group:" + g;
    }));
    if ((ref = this.response.status) === 'pending' || ref === 'rejected' || ref === 'draft') {
      return ref1 = "user:" + this.response.user, indexOf.call(subjects, ref1) >= 0;
    } else {
      return (ref2 = "user:" + this.response.user, indexOf.call(subjects, ref2) >= 0) && deployment.enumeratorAdminFinal;
    }
  };

  ResponseModel.prototype.canReject = function() {
    var admins, deployment, ref, subjects;
    if (!this.response.user) {
      return false;
    }
    deployment = _.findWhere(this.form.deployments, {
      _id: this.response.deployment
    });
    if (!deployment) {
      throw new Error("No matching deployments for " + this.form._id + " user " + this.username);
    }
    if (this.response.status === "draft" || this.response.status === "rejected") {
      return false;
    }
    if (this.response.status === "pending") {
      admins = _.union(_.pluck(_.where(this.form.roles, {
        role: "admin"
      }), "id"), deployment.admins, ((ref = deployment.approvalStages[this.response.approvals.length]) != null ? ref.approvers : void 0) || []);
      subjects = ["user:" + this.user, "all"];
      subjects = subjects.concat(_.map(this.groups, function(g) {
        return "group:" + g;
      }));
      if (_.intersection(admins, subjects).length > 0) {
        return true;
      }
      return false;
    } else if (this.response.status === "final") {
      admins = _.union(_.pluck(_.where(this.form.roles, {
        role: "admin"
      }), "id"), deployment.admins);
      subjects = ["user:" + this.user, "all"];
      subjects = subjects.concat(_.map(this.groups, function(g) {
        return "group:" + g;
      }));
      return _.intersection(admins, subjects).length > 0;
    }
  };

  ResponseModel.prototype._addEvent = function(type, attrs) {
    var event;
    if (attrs == null) {
      attrs = {};
    }
    event = _.extend({
      type: type,
      by: this.user,
      on: new Date().toISOString()
    }, attrs);
    this.response.events = this.response.events || [];
    return this.response.events.push(event);
  };

  return ResponseModel;

})();
