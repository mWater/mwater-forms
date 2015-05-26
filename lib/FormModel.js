var FormModel, _;

_ = require('lodash');

module.exports = FormModel = (function() {
  function FormModel(form) {
    this.form = form;
  }

  FormModel.prototype.getDeploymentSubjects = function() {
    var deploySubs, getDeploymentSubs;
    getDeploymentSubs = function(deployment) {
      var approvers;
      approvers = _.flatten(_.map(deployment.approvalStages, function(stage) {
        return stage.approvers;
      }));
      return _.union(approvers, deployment.enumerators, deployment.viewers, deployment.admins);
    };
    deploySubs = _.uniq(_.flatten(_.map(this.form.deployments, getDeploymentSubs)));
    return deploySubs;
  };

  FormModel.prototype.correctViewers = function() {
    var needed;
    needed = _.difference(this.getDeploymentSubjects(), _.map(this.form.roles, function(r) {
      return r.id;
    }));
    return this.form.roles = this.form.roles.concat(_.map(needed, function(n) {
      return {
        id: n,
        role: "view"
      };
    }));
  };

  FormModel.prototype.canDeleteRole = function(role) {
    if (role.role === "admin" && _.where(this.form.roles, {
      role: "admin"
    }).length <= 1) {
      return false;
    }
    return !_.contains(this.getDeploymentSubjects(), role.id);
  };

  FormModel.prototype.canChangeRole = function(role) {
    if (role.role === "admin" && _.where(this.form.roles, {
      role: "admin"
    }).length <= 1) {
      return false;
    }
    return true;
  };

  FormModel.prototype.amAdmin = function(user, groups) {
    var admins, subjects;
    subjects = ["user:" + user];
    subjects = subjects.concat(_.map(groups, function(g) {
      return "group:" + g;
    }));
    admins = _.pluck(_.where(this.form.roles, {
      role: "admin"
    }), "id");
    return _.intersection(admins, subjects).length > 0;
  };

  return FormModel;

})();
