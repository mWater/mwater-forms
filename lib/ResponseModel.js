var ResponseModel, _, formUtils, uuid;

_ = require('lodash');

formUtils = require('./formUtils');

uuid = require('node-uuid');

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
    if (!this.response._id) {
      this.response._id = formUtils.createUid();
      this.response.form = this.form._id;
      this.response.user = this.user;
      this.response.startedOn = new Date().toISOString();
      this.response.data = {};
      this.response.approvals = [];
      this.response.events = [];
      this.response.code = this.username + "-" + formUtils.createBase32TimeCode(new Date());
    }
    if (this.response.status !== "draft") {
      this._addEvent("draft");
    }
    if (this.response.status === "final") {
      this._unfinalize();
    }
    this.response.formRev = this.form._rev;
    this.response.status = "draft";
    if (deploymentId) {
      this.response.deployment = deploymentId;
    } else {
      deployments = this.listEnumeratorDeployments();
      if (deployments.length === 0) {
        throw new Error("No matching deployments for " + this.form._id + " user " + this.username);
      }
      this.response.deployment = deployments[0]._id;
    }
    this.fixRoles();
    return this._updateEntities();
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
    return this._updateEntities();
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
    return this._updateEntities();
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
      throw new Error("No matching deployments for " + this.form._id + " user " + this.username);
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
      this._finalize();
    }
    this._addEvent("approve", {
      override: _.intersection(approvers, subjects).length === 0
    });
    this.fixRoles();
    return this._updateEntities();
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
    return this._updateEntities();
  };

  ResponseModel.prototype.recordEdit = function() {
    if (this.user !== this.response.user) {
      return this._addEvent("edit");
    }
  };

  ResponseModel.prototype._finalize = function() {
    return this.response.status = "final";
  };

  ResponseModel.prototype._unfinalize = function() {
    var create, j, len, ref;
    if (this.response.pendingEntityCreates) {
      ref = this.response.pendingEntityCreates;
      for (j = 0, len = ref.length; j < len; j++) {
        create = ref[j];
        this.response.data[create.questionId].value = null;
        delete this.response.data[create.questionId].created;
      }
    }
    this.response.pendingEntityUpdates = [];
    return this.response.pendingEntityCreates = [];
  };

  ResponseModel.prototype._updateEntities = function() {
    var entities, j, len, question, ref;
    entities = [];
    ref = formUtils.priorQuestions(this.form.design);
    for (j = 0, len = ref.length; j < len; j++) {
      question = ref[j];
      if (question._type === "EntityQuestion") {
        if (this.response.data && this.response.data[question._id] && this.response.data[question._id].value) {
          entities.push({
            questionId: question._id,
            entityType: question.entityType,
            entityId: this.response.data[question._id].value,
            created: this.response.data[question._id].created === true
          });
        }
      }
    }
    return this.response.entities = entities;
  };

  ResponseModel.prototype.fixRoles = function() {
    var admins, approvalStage, deployment, i, j, k, len, ref, ref1, viewers;
    deployment = _.findWhere(this.form.deployments, {
      _id: this.response.deployment
    });
    if (!deployment) {
      throw new Error("No matching deployments for " + this.form._id + " user " + this.username);
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
        viewers = ["user:" + this.response.user];
      } else {
        admins = ["user:" + this.response.user];
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
      throw new Error("No matching deployments for " + this.form._id + " user " + this.username);
    }
    if (this.response.status !== "pending") {
      return false;
    }
    admins = _.union(_.pluck(_.where(this.form.roles, {
      role: "admin"
    }), "id"), deployment.admins, deployment.approvalStages[this.response.approvals.length].approvers);
    subjects = ["user:" + this.user, "all"];
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
    subjects = ["user:" + this.user, "all"];
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
      throw new Error("No matching deployments for " + this.form._id + " user " + this.username);
    }
    if (this.response.status === "draft" || this.response.status === "rejected") {
      return false;
    }
    if (this.response.status === "pending") {
      admins = _.union(_.pluck(_.where(this.form.roles, {
        role: "admin"
      }), "id"), deployment.admins, deployment.approvalStages[this.response.approvals.length].approvers);
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
