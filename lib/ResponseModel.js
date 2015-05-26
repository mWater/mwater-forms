var ResponseModel, _, createBase32TimeCode, createUid;

_ = require('lodash');

createUid = require('./formUtils').createUid;

createBase32TimeCode = require('./formUtils').createBase32TimeCode;

module.exports = ResponseModel = (function() {
  function ResponseModel(response, form, user, groups) {
    this.response = response;
    this.form = form;
    this.user = user;
    this.groups = groups;
  }

  ResponseModel.prototype.draft = function() {
    var deployment, subjects;
    if (!this.response._id) {
      this.response._id = createUid();
      this.response.form = this.form._id;
      this.response.user = this.user;
      this.response.startedOn = new Date().toISOString();
      this.response.data = {};
      this.response.approvals = [];
      this.response.code = this.user + "-" + createBase32TimeCode(new Date());
    }
    this.response.formRev = this.form._rev;
    this.response.status = "draft";
    subjects = ["user:" + this.user, "all"];
    subjects = subjects.concat(_.map(this.groups, function(g) {
      return "group:" + g;
    }));
    deployment = _.find(this.form.deployments, (function(_this) {
      return function(dep) {
        return _.intersection(dep.enumerators, subjects).length > 0 && dep.active;
      };
    })(this));
    if (!deployment) {
      throw new Error("No matching deployments");
    }
    this.response.deployment = deployment._id;
    return this.fixRoles();
  };

  ResponseModel.prototype.submit = function() {
    var deployment;
    this.response.submittedOn = new Date().toISOString();
    deployment = _.findWhere(this.form.deployments, {
      _id: this.response.deployment
    });
    if (!deployment) {
      throw new Error("No matching deployments");
    }
    if (deployment.approvalStages.length === 0) {
      this.response.status = "final";
    } else {
      this.response.status = "pending";
      this.response.approvals = [];
    }
    return this.fixRoles();
  };

  ResponseModel.prototype.approve = function() {
    var approval, approvers, deployment, subjects;
    if (!this.canApprove()) {
      throw new Error("Cannot approve");
    }
    deployment = _.findWhere(this.form.deployments, {
      _id: this.response.deployment
    });
    if (!deployment) {
      throw new Error("No matching deployments");
    }
    approval = {
      by: this.user,
      on: new Date().toISOString()
    };
    approvers = deployment.approvalStages[this.response.approvals.length].approvers;
    subjects = ["user:" + this.user];
    subjects = subjects.concat(_.map(this.groups, function(g) {
      return "group:" + g;
    }));
    if (_.intersection(approvers, subjects).length === 0) {
      approval.override = true;
    }
    this.response.approvals.push(approval);
    if (this.response.approvals.length >= deployment.approvalStages.length) {
      this.response.status = "final";
    }
    return this.fixRoles();
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
      throw new Error("No matching deployments");
    }
    this.response.status = "rejected";
    this.response.rejectionMessage = message;
    this.response.approvals = [];
    return this.fixRoles();
  };

  ResponseModel.prototype.fixRoles = function() {
    var admins, approvalStage, deployment, i, j, k, len, ref, ref1, viewers;
    deployment = _.findWhere(this.form.deployments, {
      _id: this.response.deployment
    });
    if (!deployment) {
      throw new Error("No matching deployments");
    }
    if (this.response.status === "pending" && (this.response.approvals != null) && this.response.approvals.length >= deployment.approvalStages.length) {
      this.response.status = "final";
    }
    if (this.response.status === 'final') {
      admins = [];
      viewers = ["user:" + this.response.user];
    } else {
      admins = ["user:" + this.response.user];
      viewers = [];
    }
    admins = _.union(admins, _.pluck(_.where(this.form.roles, {
      role: "admin"
    }), "id"));
    admins = _.union(admins, deployment.admins);
    if (this.response.status === 'pending') {
      for (i = j = 0, ref = deployment.approvalStages.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        if (this.response.approvals.length === i) {
          admins = _.union(admins, deployment.approvalStages[i].approvers);
        } else {
          viewers = _.union(viewers, deployment.approvalStages[i].approvers);
        }
      }
    } else {
      ref1 = deployment.approvalStages;
      for (k = 0, len = ref1.length; k < len; k++) {
        approvalStage = ref1[k];
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
    var admins, deployment, subjects;
    deployment = _.findWhere(this.form.deployments, {
      _id: this.response.deployment
    });
    if (!deployment) {
      throw new Error("No matching deployments");
    }
    if (this.response.status !== "pending") {
      return false;
    }
    admins = _.union(_.pluck(_.where(this.form.roles, {
      role: "admin"
    }), "id"), deployment.admins, deployment.approvalStages[this.response.approvals.length].approvers);
    subjects = ["user:" + this.user];
    subjects = subjects.concat(_.map(this.groups, function(g) {
      return "group:" + g;
    }));
    if (_.intersection(admins, subjects).length > 0) {
      return true;
    }
    return false;
  };

  ResponseModel.prototype.canDelete = function() {
    var admins, subjects;
    admins = _.pluck(_.where(this.response.roles, {
      role: "admin"
    }), "id");
    subjects = ["user:" + this.user];
    subjects = subjects.concat(_.map(this.groups, function(g) {
      return "group:" + g;
    }));
    return _.intersection(admins, subjects).length > 0;
  };

  ResponseModel.prototype.canEdit = function() {
    if (this.response.status === "pending" && !this.canApprove()) {
      return false;
    }
    return this.canDelete();
  };

  ResponseModel.prototype.canRedraft = function() {
    return this.canDelete();
  };

  ResponseModel.prototype.canReject = function() {
    var admins, deployment, subjects;
    deployment = _.findWhere(this.form.deployments, {
      _id: this.response.deployment
    });
    if (!deployment) {
      throw new Error("No matching deployments");
    }
    if (this.response.status === "draft" || this.response.status === "rejected") {
      return false;
    }
    if (this.response.status === "pending") {
      admins = _.union(_.pluck(_.where(this.form.roles, {
        role: "admin"
      }), "id"), deployment.admins, deployment.approvalStages[this.response.approvals.length].approvers);
      subjects = ["user:" + this.user];
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
      subjects = ["user:" + this.user];
      subjects = subjects.concat(_.map(this.groups, function(g) {
        return "group:" + g;
      }));
      return _.intersection(admins, subjects).length > 0;
    }
  };

  return ResponseModel;

})();
