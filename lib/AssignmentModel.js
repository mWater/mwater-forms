'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AssignmentModel, _, formUtils;

_ = require('lodash');

formUtils = require('./formUtils');

// Model of an assignment object that allows manipulation
// Options are:
// assignment: assignment object. Required
// form: form object. Required
// user: current username. Required
// groups: group names of user
module.exports = AssignmentModel = function () {
  function AssignmentModel(options) {
    (0, _classCallCheck3.default)(this, AssignmentModel);

    this.assignment = options.assignment;
    this.form = options.form;
    this.user = options.user;
    this.groups = options.groups || [];
    this.fixRoles();
  }

  // Fixes roles to reflect status and approved fields


  (0, _createClass3.default)(AssignmentModel, [{
    key: 'fixRoles',
    value: function fixRoles() {
      var admins, deployment, viewers;
      // Determine deployment
      deployment = _.findWhere(this.form.deployments, {
        _id: this.assignment.deployment
      });
      if (!deployment) {
        throw new Error('No matching deployments for ' + this.form._id + ' user ' + this.user);
      }
      admins = [];
      viewers = this.assignment.assignedTo;
      // Add form admins always
      admins = _.union(admins, _.pluck(_.where(this.form.roles, {
        role: "admin"
      }), "id"));
      // Add deployment admins
      admins = _.union(admins, deployment.admins);
      // If already admin, don't include in viewers
      viewers = _.difference(viewers, admins);
      this.assignment.roles = _.map(admins, function (s) {
        return {
          id: s,
          role: "admin"
        };
      });
      return this.assignment.roles = this.assignment.roles.concat(_.map(viewers, function (s) {
        return {
          id: s,
          role: "view"
        };
      }));
    }
  }, {
    key: 'canManage',
    value: function canManage() {
      var admins, subjects;
      admins = _.pluck(_.where(this.assignment.roles, {
        role: "admin"
      }), "id");
      subjects = ["user:" + this.user, "all"];
      subjects = subjects.concat(_.map(this.groups, function (g) {
        return "group:" + g;
      }));
      return _.intersection(admins, subjects).length > 0;
    }
  }, {
    key: 'canView',
    value: function canView() {
      var admins, subjects;
      if (this.canManage()) {
        return true;
      }
      admins = _.pluck(_.where(this.assignment.roles, {
        role: "view"
      }), "id");
      subjects = ["user:" + this.user, "all"];
      subjects = subjects.concat(_.map(this.groups, function (g) {
        return "group:" + g;
      }));
      return _.intersection(admins, subjects).length > 0;
    }
  }]);
  return AssignmentModel;
}();