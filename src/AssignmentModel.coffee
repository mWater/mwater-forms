_ = require 'lodash'
formUtils = require './formUtils'
uuid = require 'node-uuid'

# Model of an assignment object that allows manipulation
# Options are:
# assignment: assignment object. Required
# form: form object. Required
# user: current username. Required
# groups: group names of user
module.exports = class AssignmentModel
  constructor: (options) ->
    @assignment = options.assignment
    @form = options.form
    @user = options.user
    @groups = options.groups or []
    @fixRoles()

  # Fixes roles to reflect status and approved fields
  fixRoles: ->
    # Determine deployment
    deployment = _.findWhere(@form.deployments, { _id: @assignment.deployment })
    if not deployment
      throw new Error("No matching deployments for #{@form._id} user #{@user}")

    admins = []
    viewers = @assignment.assignedTo

    # Add form admins always
    admins = _.union admins, _.pluck(_.where(@form.roles, { role: "admin"}), "id")

    # Add deployment admins
    admins = _.union admins, deployment.admins

    # If already admin, don't include in viewers
    viewers = _.difference viewers, admins

    @assignment.roles = _.map admins, (s) -> { id: s, role: "admin" }
    @assignment.roles = @assignment.roles.concat(_.map(viewers, (s) -> { id: s, role: "view" }))

  canManage: ->
    admins = _.pluck(_.where(@assignment.roles, { role: "admin"}), "id")

    subjects = ["user:" + @user, "all"]
    subjects = subjects.concat(_.map @groups, (g) -> "group:" + g)

    return _.intersection(admins, subjects).length > 0

  canView: ->
    if @canManage()
      return true

    admins = _.pluck(_.where(@assignment.roles, { role: "view"}), "id")

    subjects = ["user:" + @user, "all"]
    subjects = subjects.concat(_.map @groups, (g) -> "group:" + g)

    return _.intersection(admins, subjects).length > 0
