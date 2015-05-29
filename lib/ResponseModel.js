var Backbone, FormCompiler, ResponseModel, _, formUtils, uuid;

_ = require('lodash');

formUtils = require('./formUtils');

FormCompiler = require('./FormCompiler');

uuid = require('node-uuid');

Backbone = require('backbone');

module.exports = ResponseModel = (function() {
  function ResponseModel(options) {
    this.response = options.response;
    this.form = options.form;
    this.user = options.user;
    this.groups = options.groups || [];
    this.formCtx = options.formCtx || {};
  }

  ResponseModel.prototype.draft = function() {
    var deployment, subjects;
    if (this.response.status === "final") {
      this._unfinalize();
    }
    if (!this.response._id) {
      this.response._id = formUtils.createUid();
      this.response.form = this.form._id;
      this.response.user = this.user;
      this.response.startedOn = new Date().toISOString();
      this.response.data = {};
      this.response.approvals = [];
      this.response.code = this.user + "-" + formUtils.createBase32TimeCode(new Date());
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
      throw new Error("No matching deployments");
    }
    if (deployment.approvalStages.length === 0) {
      this._finalize();
    } else {
      this.response.status = "pending";
      this.response.approvals = [];
    }
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
      this._finalize();
    }
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
      throw new Error("No matching deployments");
    }
    if (this.response.status === "final") {
      this._unfinalize();
    }
    this.response.status = "rejected";
    this.response.rejectionMessage = message;
    this.response.approvals = [];
    this.fixRoles();
    return this._updateEntities();
  };

  ResponseModel.prototype._finalize = function() {
    this.response.status = "final";
    this.response.pendingEntityUpdates = this._generateEntityUpdates();
    return this.response.pendingEntityCreates = this._generateEntityCreates();
  };

  ResponseModel.prototype._unfinalize = function() {
    var create, j, len, ref;
    if (this.response.pendingEntityCreates) {
      ref = this.response.pendingEntityCreates;
      for (j = 0, len = ref.length; j < len; j++) {
        create = ref[j];
        this.response.data[create.questionId].value = null;
      }
    }
    this.response.pendingEntityUpdates = [];
    return this.response.pendingEntityCreates = [];
  };

  ResponseModel.prototype._generateEntityCreates = function() {
    var compiler, create, creates, deployment, entity, j, k, len, len1, model, question, ref, ref1, role, roles, settings;
    creates = [];
    model = new Backbone.Model(this.response.data);
    compiler = new FormCompiler({
      model: model,
      ctx: this.formCtx
    });
    if (this.form.design.entitySettings && (this.formCtx.formEntity == null)) {
      creates.push({
        entityType: _.last(this.form.design.entitySettings.entityType.split(":")),
        entity: _.extend(compiler.compileSaveLinkedAnswers(this.form.design.entitySettings.propertyLinks)(), {
          _id: uuid.v4(),
          _roles: [
            {
              to: "user:" + this.user,
              role: "admin"
            }, {
              to: "all",
              role: "view"
            }
          ]
        })
      });
    }
    ref = formUtils.priorQuestions(this.form.design);
    for (j = 0, len = ref.length; j < len; j++) {
      question = ref[j];
      if (question._type === "EntityQuestion" && question.propertyLinks && question.createEntity) {
        if (!model.get(question._id) || !model.get(question._id).value) {
          entity = compiler.compileSaveLinkedAnswers(question.propertyLinks)();
          entity._id = uuid.v4();
          entity._roles = [
            {
              to: "user:" + this.user,
              role: "admin"
            }, {
              to: "all",
              role: "view"
            }
          ];
          this.response.data[question._id] = {
            value: entity._id
          };
          create = {
            entityType: question.entityType,
            entity: entity,
            questionId: question._id
          };
          deployment = _.findWhere(this.form.deployments, {
            _id: this.response.deployment
          });
          if (deployment.entityCreationSettings) {
            settings = _.findWhere(deployment.entityCreationSettings, {
              questionId: question._id
            });
            if (settings.createdFor) {
              create.entity._created_for = settings.createdFor;
            }
            roles = [];
            if (settings.enumeratorRole) {
              roles.push({
                to: "user:" + this.response.user,
                role: settings.enumeratorRole
              });
            }
            if (settings.otherRoles) {
              ref1 = settings.otherRoles;
              for (k = 0, len1 = ref1.length; k < len1; k++) {
                role = ref1[k];
                if (!_.findWhere(roles, {
                  to: role.id
                })) {
                  roles.push({
                    to: role.id,
                    role: role.role
                  });
                }
              }
            }
            create.entity._roles = roles;
          }
          creates.push(create);
        }
      }
    }
    return creates;
  };

  ResponseModel.prototype._generateEntityUpdates = function() {
    var compiler, j, len, model, propertyUpdates, question, ref, updates;
    updates = [];
    model = new Backbone.Model(this.response.data);
    compiler = new FormCompiler({
      model: model,
      ctx: this.formCtx
    });
    if (this.form.design.entitySettings && (this.formCtx.formEntity != null)) {
      updates.push({
        questionId: null,
        entityId: this.formCtx.formEntity._id,
        entityType: _.last(this.form.design.entitySettings.entityType.split(":")),
        updates: compiler.compileSaveLinkedAnswers(this.form.design.entitySettings.propertyLinks)()
      });
    }
    ref = formUtils.priorQuestions(this.form.design);
    for (j = 0, len = ref.length; j < len; j++) {
      question = ref[j];
      if (question._type === "EntityQuestion" && question.propertyLinks) {
        if (model.get(question._id) && model.get(question._id).value) {
          propertyUpdates = compiler.compileSaveLinkedAnswers(question.propertyLinks)();
          if (_.keys(propertyUpdates).length > 0) {
            updates.push({
              entityId: model.get(question._id).value,
              entityType: question.entityType,
              updates: propertyUpdates,
              questionId: question._id
            });
          }
        }
      }
    }
    return updates;
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
            entityId: this.response.data[question._id].value
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
      throw new Error("No matching deployments");
    }
    if (this.response.status === "pending" && (this.response.approvals != null) && this.response.approvals.length >= deployment.approvalStages.length) {
      this._finalize();
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
