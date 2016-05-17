var AssignmentModel, _, formUtils, uuid;

_ = require('lodash');

formUtils = require('./formUtils');

uuid = require('node-uuid');

module.exports = AssignmentModel = (function() {
  function AssignmentModel(options) {
    this.assignment = options.assignment;
    this.form = options.form;
    this.user = options.user;
    this.groups = options.groups || [];
    this.fixRoles();
  }

  AssignmentModel.prototype.fixRoles = function() {
    var admins, deployment, viewers;
    deployment = _.findWhere(this.form.deployments, {
      _id: this.assignment.deployment
    });
    if (!deployment) {
      throw new Error("No matching deployments for " + this.form._id + " user " + this.user);
    }
    admins = [];
    viewers = this.assignment.assignedTo;
    admins = _.union(admins, _.pluck(_.where(this.form.roles, {
      role: "admin"
    }), "id"));
    admins = _.union(admins, deployment.admins);
    viewers = _.difference(viewers, admins);
    this.assignment.roles = _.map(admins, function(s) {
      return {
        id: s,
        role: "admin"
      };
    });
    return this.assignment.roles = this.assignment.roles.concat(_.map(viewers, function(s) {
      return {
        id: s,
        role: "view"
      };
    }));
  };

  AssignmentModel.prototype.canManage = function() {
    var admins, subjects;
    admins = _.pluck(_.where(this.assignment.roles, {
      role: "admin"
    }), "id");
    subjects = ["user:" + this.user, "all"];
    subjects = subjects.concat(_.map(this.groups, function(g) {
      return "group:" + g;
    }));
    return _.intersection(admins, subjects).length > 0;
  };

  AssignmentModel.prototype.canView = function() {
    var admins, subjects;
    if (this.canManage()) {
      return true;
    }
    admins = _.pluck(_.where(this.assignment.roles, {
      role: "view"
    }), "id");
    subjects = ["user:" + this.user, "all"];
    subjects = subjects.concat(_.map(this.groups, function(g) {
      return "group:" + g;
    }));
    return _.intersection(admins, subjects).length > 0;
  };

  return AssignmentModel;

})();
