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

  FormModel.prototype.correctDeployments = function() {
    var deployment, i, j, len, len1, q, qid, questionIds, ref, ref1, results;
    questionIds = [];
    ref = formUtils.priorQuestions(this.form.design);
    for (i = 0, len = ref.length; i < len; i++) {
      q = ref[i];
      if (q._type === "EntityQuestion" && q.createEntity) {
        questionIds.push(q._id);
      }
    }
    ref1 = this.form.deployments || [];
    results = [];
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      deployment = ref1[j];
      if (!deployment.entityCreationSettings) {
        deployment.entityCreationSettings = [];
      }
      deployment.entityCreationSettings = _.filter(deployment.entityCreationSettings, (function(_this) {
        return function(ecs) {
          var ref2;
          return ref2 = ecs.questionId, indexOf.call(questionIds, ref2) >= 0;
        };
      })(this));
      results.push((function() {
        var k, len2, results1;
        results1 = [];
        for (k = 0, len2 = questionIds.length; k < len2; k++) {
          qid = questionIds[k];
          if (!_.any(deployment.entityCreationSettings, (function(_this) {
            return function(ecs) {
              return ecs.questionId === qid;
            };
          })(this))) {
            results1.push(deployment.entityCreationSettings.push({
              questionId: qid,
              enumeratorRole: "admin",
              otherRoles: []
            }));
          } else {
            results1.push(void 0);
          }
        }
        return results1;
      }).call(this));
    }
    return results;
  };

  return FormModel;

})();
