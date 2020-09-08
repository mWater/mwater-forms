"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var ResponseModel,
    _,
    formUtils,
    indexOf = [].indexOf;

_ = require('lodash');
formUtils = require('./formUtils'); // Model of a response object that allows manipulation and asking of questions
// Options are:
// response: response object. Required
// form: form object. Required
// user: current username. Required
// groups: group names of user

module.exports = ResponseModel = /*#__PURE__*/function () {
  function ResponseModel(options) {
    (0, _classCallCheck2["default"])(this, ResponseModel);
    this.response = options.response;
    this.form = options.form;
    this.user = options.user;
    this.username = options.username;
    this.groups = options.groups || [];
  } // Setup draft. deploymentId is optional _id of deployment to use for cases where ambiguous


  (0, _createClass2["default"])(ResponseModel, [{
    key: "draft",
    value: function draft(deploymentId) {
      var deployments;

      if (this.response._id) {
        throw new Error("Response already has _id");
      }

      this.response._id = formUtils.createUid();
      this.response.form = this.form._id;
      this.response.user = this.user;
      this.response.username = this.username;
      this.response.startedOn = new Date().toISOString();
      this.response.data = {};
      this.response.approvals = [];
      this.response.events = []; // Create code. Not unique, but unique per user if logged in once.

      this.response.code = this.username + "-" + formUtils.createBase32TimeCode(new Date());
      this.response.formRev = this.form._rev;
      this.response.status = "draft";

      this._addEvent("draft");

      if (deploymentId) {
        this.response.deployment = deploymentId;
      } else if (!this.response.deployment) {
        // Select first deployment if not specified and not already present
        deployments = this.listEnumeratorDeployments();

        if (deployments.length === 0) {
          throw new Error("No matching deployments for ".concat(this.form._id, " user ").concat(this.username));
        }

        this.response.deployment = deployments[0]._id;
      }

      this.fixRoles();
      return this.updateEntities();
    } // Switch back to draft mode

  }, {
    key: "redraft",
    value: function redraft() {
      // Add event if not in draft
      if (this.response.status !== "draft") {
        this._addEvent("draft");
      } // Unfinalize if final


      if (this.response.status === "final") {
        this._unfinalize();
      }

      this.response.status = "draft";
      this.response.approvals = [];
      this.fixRoles();
      return this.updateEntities();
    } // Return all active deployments that the user can enumerate

  }, {
    key: "listEnumeratorDeployments",
    value: function listEnumeratorDeployments() {
      var subjects;
      subjects = ["user:" + this.user, "all"];
      subjects = subjects.concat(_.map(this.groups, function (g) {
        return "group:" + g;
      }));
      return _.filter(this.form.deployments, function (dep) {
        return _.intersection(dep.enumerators, subjects).length > 0 && dep.active;
      });
    } // Save for later. Does no state transitions, but updates any entity references
    // and other housekeeping before saving it

  }, {
    key: "saveForLater",
    value: function saveForLater() {
      this.fixRoles();
      return this.updateEntities();
    } // Submit (either to final or pending as appropriate)

  }, {
    key: "submit",
    value: function submit() {
      var deployment;
      this.response.submittedOn = new Date().toISOString();
      deployment = _.findWhere(this.form.deployments, {
        _id: this.response.deployment
      });

      if (!deployment) {
        throw new Error("No matching deployments for ".concat(this.form._id, " user ").concat(this.username));
      } // If no approval stages


      if (deployment.approvalStages.length === 0) {
        this._finalize();
      } else {
        this.response.status = "pending";
        this.response.approvals = [];
      }

      this._addEvent("submit");

      this.fixRoles();
      return this.updateEntities();
    } // Can submit if in draft/rejected and am enumerator or admin

  }, {
    key: "canSubmit",
    value: function canSubmit() {
      var admins, deployment, ref, subjects;

      if ((ref = this.response.status) !== 'draft' && ref !== 'rejected') {
        return false;
      } // Anonymous can submit


      if (!this.response.user) {
        return true;
      }

      deployment = _.findWhere(this.form.deployments, {
        _id: this.response.deployment
      });

      if (!deployment) {
        throw new Error("No matching deployments for ".concat(this.form._id, " user ").concat(this.username));
      } // Get list of admins at both deployment and form level 


      admins = _.union(_.pluck(_.where(this.form.roles, {
        role: "admin"
      }), "id"), deployment.admins); // Add enumerator 

      admins = _.union(admins, ["user:".concat(this.response.user)]);
      subjects = ["user:" + this.user, "all"];
      subjects = subjects.concat(_.map(this.groups, function (g) {
        return "group:" + g;
      }));
      return _.intersection(admins, subjects).length > 0;
    } // Approve response

  }, {
    key: "approve",
    value: function approve() {
      var approval, approvers, deployment, ref, subjects;

      if (!this.canApprove()) {
        throw new Error("Cannot approve");
      }

      deployment = _.findWhere(this.form.deployments, {
        _id: this.response.deployment
      });

      if (!deployment) {
        throw new Error("No matching deployments for ".concat(this.form._id, " user ").concat(this.username));
      }

      approval = {
        by: this.user,
        on: new Date().toISOString()
      }; // Determine if approver (vs admin)

      approvers = ((ref = deployment.approvalStages[this.response.approvals.length]) != null ? ref.approvers : void 0) || [];
      subjects = ["user:" + this.user];
      subjects = subjects.concat(_.map(this.groups, function (g) {
        return "group:" + g;
      }));

      if (_.intersection(approvers, subjects).length === 0) {
        approval.override = true;
      }

      this.response.approvals.push(approval); // Check if last stage

      if (this.response.approvals.length >= deployment.approvalStages.length) {
        this._finalize();
      }

      this._addEvent("approve", {
        override: _.intersection(approvers, subjects).length === 0
      });

      this.fixRoles();
      return this.updateEntities();
    } // Reject a response with a specific rejection message

  }, {
    key: "reject",
    value: function reject(message) {
      var deployment;

      if (!this.canReject()) {
        throw new Error("Cannot reject");
      }

      deployment = _.findWhere(this.form.deployments, {
        _id: this.response.deployment
      });

      if (!deployment) {
        throw new Error("No matching deployments for ".concat(this.form._id, " user ").concat(this.username));
      } // Unfinalize if final


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
    } // Record that an edit was done, if not by enumerator

  }, {
    key: "recordEdit",
    value: function recordEdit() {
      if (this.user !== this.response.user) {
        return this._addEvent("edit");
      }
    } // Performs special operation when a response becomes final. Also sets status

  }, {
    key: "_finalize",
    value: function _finalize() {
      // Set response status
      return this.response.status = "final";
    } // Performs special operation when a response goes from final to other

  }, {
    key: "_unfinalize",
    value: function _unfinalize() {} // Updates entities field. Stores a list of all entity references in the response

  }, {
    key: "updateEntities",
    value: function updateEntities() {
      return this.response.entities = formUtils.extractEntityReferences(this.form.design, this.response.data);
    } // Fixes roles to reflect status and approved fields

  }, {
    key: "fixRoles",
    value: function fixRoles() {
      var admins, approvalStage, deployment, i, j, k, len, ref, ref1, ref2, ref3, viewers; // Determine deployment

      deployment = _.findWhere(this.form.deployments, {
        _id: this.response.deployment
      });

      if (!deployment) {
        admins = _.pluck(_.where(this.form.roles, {
          role: "admin"
        }), "id");

        if (this.response.user) {
          admins.push("user:" + this.response.user);
        }

        this.response.roles = _.map(admins, function (s) {
          return {
            id: s,
            role: "admin"
          };
        });
        return;
      } // If deleted, no viewers


      if (this.form.state === "deleted") {
        return this.response.roles = [];
      } // If pending and more or equal approvals than approval stages, response is final


      if (this.response.status === "pending" && this.response.approvals != null && this.response.approvals.length >= deployment.approvalStages.length) {
        this._finalize();
      } // User is always admin unless final and not enumeratorAdminFinal flag, then viewer
      // However, if deployment inactive, user can't see responses


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
      } // Add form admins always


      admins = _.union(admins, _.pluck(_.where(this.form.roles, {
        role: "admin"
      }), "id")); // Add deployment admins

      admins = _.union(admins, deployment.admins); // Approvers are admins unless at their stage, otherwise they are viewers

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
      } // Viewers of deployment can see if final


      if (this.response.status === 'final') {
        viewers = _.union(viewers, deployment.viewers);
      } // If already admin, don't include in viewers


      viewers = _.difference(viewers, admins);
      this.response.roles = _.map(admins, function (s) {
        return {
          id: s,
          role: "admin"
        };
      });
      return this.response.roles = this.response.roles.concat(_.map(viewers, function (s) {
        return {
          id: s,
          role: "view"
        };
      }));
    } // Determine if can approve response

  }, {
    key: "canApprove",
    value: function canApprove() {
      var admins, deployment, ref, subjects;
      deployment = _.findWhere(this.form.deployments, {
        _id: this.response.deployment
      });

      if (!deployment) {
        throw new Error("No matching deployments for ".concat(this.form._id, " user ").concat(this.username));
      }

      if (this.response.status !== "pending") {
        return false;
      } // Get list of admins at both deployment and form level and add approvers


      admins = _.union(_.pluck(_.where(this.form.roles, {
        role: "admin"
      }), "id"), deployment.admins, ((ref = deployment.approvalStages[this.response.approvals.length]) != null ? ref.approvers : void 0) || []);
      subjects = ["user:" + this.user, "all"];
      subjects = subjects.concat(_.map(this.groups, function (g) {
        return "group:" + g;
      }));

      if (_.intersection(admins, subjects).length > 0) {
        return true;
      }

      return false;
    } // Determine if am an approver for the response, as opposed to admin who could still approve

  }, {
    key: "amApprover",
    value: function amApprover() {
      var approvers, deployment, ref, subjects;
      deployment = _.findWhere(this.form.deployments, {
        _id: this.response.deployment
      });

      if (!deployment) {
        throw new Error("No matching deployments for ".concat(this.form._id, " user ").concat(this.username));
      }

      if (this.response.status !== "pending") {
        return false;
      } // Get list of approvers


      approvers = ((ref = deployment.approvalStages[this.response.approvals.length]) != null ? ref.approvers : void 0) || [];
      subjects = ["user:" + this.user, "all"];
      subjects = subjects.concat(_.map(this.groups, function (g) {
        return "group:" + g;
      }));

      if (_.intersection(approvers, subjects).length > 0) {
        return true;
      }

      return false;
    } // Determine if can delete response

  }, {
    key: "canDelete",
    value: function canDelete() {
      var admins, approvalStage, deployment, ref, subjects;
      deployment = _.findWhere(this.form.deployments, {
        _id: this.response.deployment
      });

      if (!deployment) {
        throw new Error("No matching deployments for ".concat(this.form._id, " user ").concat(this.username));
      } // Get list of admins at both deployment and form level 


      admins = _.union(_.pluck(_.where(this.form.roles, {
        role: "admin"
      }), "id"), deployment.admins); // Add approvers if level allows editing

      if (this.response.status === "pending") {
        approvalStage = deployment.approvalStages[this.response.approvals.length];

        if (approvalStage != null && !approvalStage.preventEditing) {
          admins = _.union(admins, approvalStage.approvers);
        }
      } // Add enumerator if in draft or rejected


      if (((ref = this.response.status) === 'draft' || ref === 'rejected') && this.response.user) {
        admins = _.union(admins, ["user:".concat(this.response.user)]);
      } // Add enumerator if final and enumeratorAdminFinal


      if (this.response.status === "final" && this.response.user && deployment.enumeratorAdminFinal) {
        admins = _.union(admins, ["user:".concat(this.response.user)]);
      }

      subjects = ["user:" + this.user, "all"];
      subjects = subjects.concat(_.map(this.groups, function (g) {
        return "group:" + g;
      }));
      return _.intersection(admins, subjects).length > 0;
    } // Determine if can edit response

  }, {
    key: "canEdit",
    value: function canEdit() {
      var admins, approvalStage, deployment, ref, subjects;
      deployment = _.findWhere(this.form.deployments, {
        _id: this.response.deployment
      });

      if (!deployment) {
        throw new Error("No matching deployments for ".concat(this.form._id, " user ").concat(this.username));
      } // Get list of admins at both deployment and form level 


      admins = _.union(_.pluck(_.where(this.form.roles, {
        role: "admin"
      }), "id"), deployment.admins); // Add approvers if level allows editing

      if (this.response.status === "pending") {
        approvalStage = deployment.approvalStages[this.response.approvals.length];

        if (approvalStage != null && !approvalStage.preventEditing) {
          admins = _.union(admins, approvalStage.approvers);
        }
      } // Add enumerator if in draft or rejected (can delete but not edit)


      if (((ref = this.response.status) === 'draft' || ref === 'rejected') && this.response.user) {
        admins = _.union(admins, ["user:".concat(this.response.user)]);
      }

      subjects = ["user:" + this.user, "all"];
      subjects = subjects.concat(_.map(this.groups, function (g) {
        return "group:" + g;
      }));
      return _.intersection(admins, subjects).length > 0;
    } // Determine if can switch back to draft phase. Only enumerators can do this and only if pending, rejected, draft or enumerators can edit final

  }, {
    key: "canRedraft",
    value: function canRedraft() {
      var deployment, ref, ref1, ref2, subjects; // Cannot redraft anonymous responses

      if (!this.response.user) {
        return false;
      }

      deployment = _.findWhere(this.form.deployments, {
        _id: this.response.deployment
      });

      if (!deployment) {
        throw new Error("No matching deployments for ".concat(this.form._id, " user ").concat(this.username));
      }

      subjects = ["user:" + this.user, "all"];
      subjects = subjects.concat(_.map(this.groups, function (g) {
        return "group:" + g;
      }));

      if ((ref = this.response.status) === 'pending' || ref === 'rejected' || ref === 'draft') {
        return ref1 = "user:".concat(this.response.user), indexOf.call(subjects, ref1) >= 0; // Final
      } else {
        return (ref2 = "user:".concat(this.response.user), indexOf.call(subjects, ref2) >= 0) && deployment.enumeratorAdminFinal;
      }
    } // Determine if can reject response

  }, {
    key: "canReject",
    value: function canReject() {
      var admins, deployment, ref, subjects; // Cannot reject anonymous responses

      if (!this.response.user) {
        return false;
      }

      deployment = _.findWhere(this.form.deployments, {
        _id: this.response.deployment
      });

      if (!deployment) {
        throw new Error("No matching deployments for ".concat(this.form._id, " user ").concat(this.username));
      }

      if (this.response.status === "draft" || this.response.status === "rejected") {
        return false;
      }

      if (this.response.status === "pending") {
        // Get list of admins at both deployment and form level and add approvers
        admins = _.union(_.pluck(_.where(this.form.roles, {
          role: "admin"
        }), "id"), deployment.admins, ((ref = deployment.approvalStages[this.response.approvals.length]) != null ? ref.approvers : void 0) || []);
        subjects = ["user:" + this.user, "all"];
        subjects = subjects.concat(_.map(this.groups, function (g) {
          return "group:" + g;
        }));

        if (_.intersection(admins, subjects).length > 0) {
          return true;
        }

        return false;
      } else if (this.response.status === "final") {
        // Admins can reject final
        admins = _.union(_.pluck(_.where(this.form.roles, {
          role: "admin"
        }), "id"), deployment.admins);
        subjects = ["user:" + this.user, "all"];
        subjects = subjects.concat(_.map(this.groups, function (g) {
          return "group:" + g;
        }));
        return _.intersection(admins, subjects).length > 0;
      }
    } // Add an event

  }, {
    key: "_addEvent",
    value: function _addEvent(type) {
      var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var event;
      event = _.extend({
        type: type,
        by: this.user,
        on: new Date().toISOString()
      }, attrs);
      this.response.events = this.response.events || [];
      return this.response.events.push(event);
    }
  }]);
  return ResponseModel;
}();