var FormModel, _, formUtils,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

_ = require('lodash');

formUtils = require('./formUtils');

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
    var subjects;
    subjects = ["all", "user:" + user];
    subjects = subjects.concat(_.map(groups, function(g) {
      return "group:" + g;
    }));
    return _.any(this.form.roles, function(r) {
      var ref;
      return (ref = r.id, indexOf.call(subjects, ref) >= 0) && r.role === 'admin';
    });
  };

  FormModel.prototype.amDeploy = function(user, groups) {
    var subjects;
    subjects = ["all", "user:" + user];
    subjects = subjects.concat(_.map(groups, function(g) {
      return "group:" + g;
    }));
    return _.any(this.form.roles, function(r) {
      var ref, ref1;
      return (ref = r.id, indexOf.call(subjects, ref) >= 0) && ((ref1 = r.role) === 'admin' || ref1 === 'deploy');
    });
  };

  FormModel.prototype.amDeploymentAdmin = function(user, groups) {
    var subjects;
    subjects = ["all", "user:" + user];
    subjects = subjects.concat(_.map(groups, function(g) {
      return "group:" + g;
    }));
    return _.any(this.form.deployments, (function(_this) {
      return function(dep) {
        return _.intersection(dep.admins, subjects).length > 0;
      };
    })(this));
  };

  return FormModel;

})();
