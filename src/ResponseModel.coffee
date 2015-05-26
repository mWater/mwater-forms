_ = require 'lodash'

createUid = require('./formUtils').createUid
createBase32TimeCode = require('./formUtils').createBase32TimeCode

# Model of a response object that allows manipulation and asking of questions
module.exports = class ResponseModel
  constructor: (response, form, user, groups) ->
    @response = response
    @form = form
    @user = user
    @groups = groups

  # Setup draft
  draft: ->
    if not @response._id
      @response._id = createUid()
      @response.form = @form._id
      @response.user = @user
      @response.startedOn = new Date().toISOString()
      @response.data = {}
      @response.approvals = []
  
      # Create code. Not unique, but unique per user if logged in once.
      @response.code = @user + "-" + createBase32TimeCode(new Date())
    
    @response.formRev = @form._rev
    @response.status = "draft"

    # Select deployment
    subjects = ["user:" + @user, "all"]
    subjects = subjects.concat(_.map @groups, (g) -> "group:" + g)
    deployment = _.find @form.deployments, (dep) =>
      return _.intersection(dep.enumerators, subjects).length > 0 and dep.active
    if not deployment
      throw new Error("No matching deployments")
    @response.deployment = deployment._id

    @fixRoles()

  # Submit (either to final or pending as appropriate)
  submit: ->
    @response.submittedOn = new Date().toISOString()

    deployment = _.findWhere(@form.deployments, { _id: @response.deployment })
    if not deployment
      throw new Error("No matching deployments")

    # If no approval stages
    if deployment.approvalStages.length == 0
      @response.status = "final"    
    else
      @response.status = "pending"
      @response.approvals = []

    @fixRoles()

  # Approve response
  approve: ->
    if not @canApprove()
      throw new Error("Cannot approve")

    deployment = _.findWhere(@form.deployments, { _id: @response.deployment })
    if not deployment
      throw new Error("No matching deployments")

    approval = { by: @user, on: new Date().toISOString() }

    # Determine if approver (vs admin)
    approvers = deployment.approvalStages[@response.approvals.length].approvers
    subjects = ["user:" + @user]
    subjects = subjects.concat(_.map @groups, (g) -> "group:" + g)

    if _.intersection(approvers, subjects).length == 0
      approval.override = true

    @response.approvals.push approval

    # Check if last stage
    if @response.approvals.length >= deployment.approvalStages.length
      @response.status = "final"

    @fixRoles()

  # Reject a response with a specific rejection message
  reject: (message) ->
    if not @canReject()
      throw new Error("Cannot reject")

    deployment = _.findWhere(@form.deployments, { _id: @response.deployment })
    if not deployment
      throw new Error("No matching deployments")

    @response.status = "rejected"
    @response.rejectionMessage = message
    @response.approvals = []

    @fixRoles()

  # Fixes roles to reflect status and approved fields
  fixRoles: ->
    # Determine deployment
    deployment = _.findWhere(@form.deployments, { _id: @response.deployment })
    if not deployment
      throw new Error("No matching deployments")

    # If pending and more or equal approvals than approval stages, response is final
    if @response.status == "pending" and @response.approvals? and @response.approvals.length >= deployment.approvalStages.length
      @response.status = "final"

    # User is always admin, unless final, then viewer
    if @response.status == 'final'
      admins = []
      viewers = ["user:" + @response.user]
    else
      admins = ["user:" + @response.user]
      viewers = []

    # Add form admins always
    admins = _.union admins, _.pluck(_.where(@form.roles, { role: "admin"}), "id")

    # Add deployment admins
    admins = _.union admins, deployment.admins

    # Approvers are admins unless at their stage, otherwise they are viewers
    if @response.status == 'pending'
      for i in [0...deployment.approvalStages.length]
        if @response.approvals.length == i
          admins = _.union admins, deployment.approvalStages[i].approvers
        else
          viewers = _.union viewers, deployment.approvalStages[i].approvers
    else
      for approvalStage in deployment.approvalStages
        viewers = _.union viewers, approvalStage.approvers

    # Viewers of deployment can see if final
    if @response.status == 'final'
      viewers = _.union viewers, deployment.viewers

    # If already admin, don't include in viewers
    viewers = _.difference viewers, admins

    @response.roles = _.map admins, (s) -> { id: s, role: "admin" }
    @response.roles = @response.roles.concat(_.map(viewers, (s) -> { id: s, role: "view" }))

  # Determine if can approve response
  canApprove: ->
    deployment = _.findWhere(@form.deployments, { _id: @response.deployment })
    if not deployment
      throw new Error("No matching deployments")

    if @response.status != "pending"
      return false

    # Get list of admins at both deployment and form level and add approvers
    admins = _.union(_.pluck(_.where(@form.roles, { role: "admin"}), "id"), deployment.admins, deployment.approvalStages[@response.approvals.length].approvers)
    subjects = ["user:" + @user]
    subjects = subjects.concat(_.map @groups, (g) -> "group:" + g)

    if _.intersection(admins, subjects).length > 0
      return true
    return false

  # Determine if can delete response
  canDelete: ->
    admins = _.pluck(_.where(@response.roles, { role: "admin"}), "id")

    subjects = ["user:" + @user]
    subjects = subjects.concat(_.map @groups, (g) -> "group:" + g)

    return _.intersection(admins, subjects).length > 0

  # Determine if can edit response
  canEdit: ->
    # Cannot edit if in pending and are not an admin
    if @response.status == "pending" and not @canApprove()
      return false
    return @canDelete()

  # Determine if can switch back to draft phase
  canRedraft: ->
    return @canDelete()

  # Determine if can reject response
  canReject: ->
    deployment = _.findWhere(@form.deployments, { _id: @response.deployment })
    if not deployment
      throw new Error("No matching deployments")

    if @response.status == "draft" or @response.status == "rejected"
      return false

    if @response.status == "pending"
      # Get list of admins at both deployment and form level and add approvers
      admins = _.union(_.pluck(_.where(@form.roles, { role: "admin"}), "id"), deployment.admins, deployment.approvalStages[@response.approvals.length].approvers)
      subjects = ["user:" + @user]
      subjects = subjects.concat(_.map @groups, (g) -> "group:" + g)

      if _.intersection(admins, subjects).length > 0
        return true
      return false
    else if @response.status == "final"
      # Admins can reject final
      admins = _.union(_.pluck(_.where(@form.roles, { role: "admin"}), "id"), deployment.admins)

      subjects = ["user:" + @user]
      subjects = subjects.concat(_.map @groups, (g) -> "group:" + g)

      return _.intersection(admins, subjects).length > 0

