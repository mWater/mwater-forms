"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var FormModel,
    _,
    formUtils,
    indexOf = [].indexOf;

_ = require('lodash');
formUtils = require('./formUtils'); // Model of a form object that allows manipulation and asking of questions

module.exports = FormModel = /*#__PURE__*/function () {
  function FormModel(form) {
    (0, _classCallCheck2["default"])(this, FormModel);
    this.form = form;
  } // Gets all subjects that must be able to see form because of deployments


  (0, _createClass2["default"])(FormModel, [{
    key: "getDeploymentSubjects",
    value: function getDeploymentSubjects() {
      var deploySubs, getDeploymentSubs;

      getDeploymentSubs = function getDeploymentSubs(deployment) {
        var approvers;
        approvers = _.flatten(_.map(deployment.approvalStages, function (stage) {
          return stage.approvers;
        }));
        return _.union(approvers, deployment.enumerators, deployment.viewers, deployment.admins);
      }; // Get all deployment subjects


      deploySubs = _.uniq(_.flatten(_.map(this.form.deployments, getDeploymentSubs)));
      return deploySubs;
    } // Corrects viewing roles to ensure that appropriate subjects can see form

  }, {
    key: "correctViewers",
    value: function correctViewers() {
      var needed; // Compute viewers needed who don't have roles

      needed = _.difference(this.getDeploymentSubjects(), _.map(this.form.roles, function (r) {
        return r.id;
      }));
      return this.form.roles = this.form.roles.concat(_.map(needed, function (n) {
        return {
          id: n,
          role: "view"
        };
      }));
    } // Checks if the role must remain as a role due to being in a deployment or being only admin

  }, {
    key: "canDeleteRole",
    value: function canDeleteRole(role) {
      if (role.role === "admin" && _.where(this.form.roles, {
        role: "admin"
      }).length <= 1) {
        return false;
      }

      return !_.contains(this.getDeploymentSubjects(), role.id);
    } // Checks if the subject must remain as a role due to being only admin

  }, {
    key: "canChangeRole",
    value: function canChangeRole(role) {
      if (role.role === "admin" && _.where(this.form.roles, {
        role: "admin"
      }).length <= 1) {
        return false;
      }

      return true;
    } // Check if user is an admin

  }, {
    key: "amAdmin",
    value: function amAdmin(user, groups) {
      var subjects;
      subjects = ["all", "user:" + user];
      subjects = subjects.concat(_.map(groups, function (g) {
        return "group:" + g;
      }));
      return _.any(this.form.roles, function (r) {
        var ref;
        return (ref = r.id, indexOf.call(subjects, ref) >= 0) && r.role === 'admin';
      });
    } // Check if user is admin or deploy

  }, {
    key: "amDeploy",
    value: function amDeploy(user, groups) {
      var subjects;
      subjects = ["all", "user:" + user];
      subjects = subjects.concat(_.map(groups, function (g) {
        return "group:" + g;
      }));
      return _.any(this.form.roles, function (r) {
        var ref, ref1;
        return (ref = r.id, indexOf.call(subjects, ref) >= 0) && ((ref1 = r.role) === 'admin' || ref1 === 'deploy');
      });
    } // Check if user is admin of a deployment

  }, {
    key: "amDeploymentAdmin",
    value: function amDeploymentAdmin(user, groups) {
      var subjects;
      subjects = ["all", "user:" + user];
      subjects = subjects.concat(_.map(groups, function (g) {
        return "group:" + g;
      }));
      return _.any(this.form.deployments, function (dep) {
        return _.intersection(dep.admins, subjects).length > 0;
      });
    }
  }]);
  return FormModel;
}();