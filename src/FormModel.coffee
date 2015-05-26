_ = require 'lodash'

# Model of a form object that allows manipulation and asking of questions
module.exports = class FormModel
  constructor: (form) ->
    @form = form

  # Gets all subjects that must be able to see form because of deployments
  getDeploymentSubjects: ->
    getDeploymentSubs = (deployment) ->
      approvers = _.flatten(_.map(deployment.approvalStages, (stage) -> stage.approvers))
      return _.union(approvers, deployment.enumerators, deployment.viewers, deployment.admins)

    # Get all deployment subjects
    deploySubs = _.uniq(_.flatten(_.map(@form.deployments, getDeploymentSubs)))
    return deploySubs


  # Corrects viewing roles to ensure that appropriate subjects can see form
  correctViewers: ->
    # Compute viewers needed who don't have roles
    needed = _.difference(@getDeploymentSubjects(), _.map(@form.roles, (r) -> r.id))
    @form.roles = @form.roles.concat(_.map(needed, (n) -> { id: n, role: "view"}))

  # Checks if the role must remain as a role due to being in a deployment or being only admin
  canDeleteRole: (role) ->
    if role.role == "admin" and _.where(@form.roles, { role: "admin" }).length <= 1
      return false

    return not _.contains(@getDeploymentSubjects(), role.id)

  # Checks if the subject must remain as a role due to being only admin
  canChangeRole: (role) ->
    if role.role == "admin" and _.where(@form.roles, { role: "admin" }).length <= 1
      return false
    return true

  # Check if user is an admin
  amAdmin: (user, groups) ->
    subjects = ["user:" + user]
    subjects = subjects.concat(_.map groups, (g) -> "group:" + g)

    admins = _.pluck(_.where(@form.roles, { role: "admin"}), "id")

    return _.intersection(admins, subjects).length > 0

