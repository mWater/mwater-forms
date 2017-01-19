_ = require 'lodash'
formUtils = require './formUtils'

# Model of a response object that allows manipulation and asking of questions
# Options are:
# response: response object. Required
# form: form object. Required
# user: current username. Required
# groups: group names of user
module.exports = class ResponseModel
  constructor: (options) ->
    @response = options.response
    @form = options.form
    @user = options.user
    @username = options.username
    @groups = options.groups or []

  # Setup draft. deploymentId is optional _id of deployment to use for cases where ambiguous
  draft: (deploymentId) ->
    if not @response._id
      @response._id = formUtils.createUid()
      @response.form = @form._id
      @response.user = @user
      @response.startedOn = new Date().toISOString()
      @response.data = {}
      @response.approvals = []
      @response.events = []

      # Create code. Not unique, but unique per user if logged in once.
      @response.code = @username + "-" + formUtils.createBase32TimeCode(new Date())
  
    # Add event if not in draft
    if @response.status != "draft"
      @_addEvent("draft")

    # Unfinalize if final
    if @response.status == "final" then @_unfinalize()

    @response.formRev = @form._rev
    @response.status = "draft"

    if deploymentId
      @response.deployment = deploymentId
    else # Select deployment if not specified
      deployments = @listEnumeratorDeployments()

      if deployments.length == 0
        throw new Error("No matching deployments for #{@form._id} user #{@username}")
      @response.deployment = deployments[0]._id

    @fixRoles()
    @updateEntities()

  # Return all active deployments that the user can enumerate
  listEnumeratorDeployments: ->
    subjects = ["user:" + @user, "all"]
    subjects = subjects.concat(_.map @groups, (g) -> "group:" + g)

    return _.filter @form.deployments, (dep) =>
      return _.intersection(dep.enumerators, subjects).length > 0 and dep.active

  # Save for later. Does no state transitions, but updates any entity references
  # and other housekeeping before saving it
  saveForLater: ->
    @fixRoles()
    @updateEntities()

  # Submit (either to final or pending as appropriate)
  submit: ->
    @response.submittedOn = new Date().toISOString()

    deployment = _.findWhere(@form.deployments, { _id: @response.deployment })
    if not deployment
      throw new Error("No matching deployments for #{@form._id} user #{@username}")

    # If no approval stages
    if deployment.approvalStages.length == 0
      @_finalize()
    else
      @response.status = "pending"
      @response.approvals = []

    @_addEvent("submit")

    @fixRoles()
    @updateEntities()

  # Approve response
  approve: ->
    if not @canApprove()
      throw new Error("Cannot approve")

    deployment = _.findWhere(@form.deployments, { _id: @response.deployment })
    if not deployment
      throw new Error("No matching deployments for #{@form._id} user #{@username}")

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
      @_finalize()

    @_addEvent("approve", override: _.intersection(approvers, subjects).length == 0)

    @fixRoles()
    @updateEntities()

  # Reject a response with a specific rejection message
  reject: (message) ->
    if not @canReject()
      throw new Error("Cannot reject")

    deployment = _.findWhere(@form.deployments, { _id: @response.deployment })
    if not deployment
      throw new Error("No matching deployments for #{@form._id} user #{@username}")

    # Unfinalize if final
    if @response.status == "final" then @_unfinalize()

    @response.status = "rejected"
    @response.rejectionMessage = message
    @response.approvals = []

    @_addEvent("reject", message: message)

    @fixRoles()
    @updateEntities()

  # Record that an edit was done, if not by enumerator
  recordEdit: ->
    if @user != @response.user
      @_addEvent("edit")

  # Performs special operation when a response becomes final. Also sets status
  _finalize: ->
    # Set response status
    @response.status = "final"

  # Performs special operation when a response goes from final to other
  _unfinalize: ->
    return

  # Updates entities field. Stores a list of all entity references in the response
  updateEntities: ->
    @response.entities = formUtils.extractEntityReferences(@form.design, @response.data)

  # Fixes roles to reflect status and approved fields
  fixRoles: ->
    # Determine deployment
    deployment = _.findWhere(@form.deployments, { _id: @response.deployment })
    if not deployment
      throw new Error("No matching deployments for #{@form._id} user #{@username}")

    # If deleted, no viewers
    if @form.state == "deleted"
      return @response.roles = []

    # If pending and more or equal approvals than approval stages, response is final
    if @response.status == "pending" and @response.approvals? and @response.approvals.length >= deployment.approvalStages.length
      @_finalize()

    # User is always admin unless final and not enumeratorAdminFinal flag, then viewer
    # However, if deployment inactive, user can't see responses
    if deployment.active
      if @response.status == 'final' and not deployment.enumeratorAdminFinal
        admins = []
        if @response.user
          viewers = ["user:" + @response.user]
        else
          viewers = []
      else
        if @response.user
          admins = ["user:" + @response.user]
        else
          admins = []
        viewers = []
    else
      admins = []
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
      throw new Error("No matching deployments for #{@form._id} user #{@username}")

    if @response.status != "pending"
      return false

    # Get list of admins at both deployment and form level and add approvers
    admins = _.union(_.pluck(_.where(@form.roles, { role: "admin"}), "id"), deployment.admins, deployment.approvalStages[@response.approvals.length].approvers)
    subjects = ["user:" + @user, "all"]
    subjects = subjects.concat(_.map @groups, (g) -> "group:" + g)

    if _.intersection(admins, subjects).length > 0
      return true
    return false

  # Determine if can delete response
  canDelete: ->
    admins = _.pluck(_.where(@response.roles, { role: "admin"}), "id")

    subjects = ["user:" + @user, "all"]
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
      throw new Error("No matching deployments for #{@form._id} user #{@username}")

    if @response.status == "draft" or @response.status == "rejected"
      return false

    if @response.status == "pending"
      # Get list of admins at both deployment and form level and add approvers
      admins = _.union(_.pluck(_.where(@form.roles, { role: "admin"}), "id"), deployment.admins, deployment.approvalStages[@response.approvals.length].approvers)
      subjects = ["user:" + @user, "all"]
      subjects = subjects.concat(_.map @groups, (g) -> "group:" + g)

      if _.intersection(admins, subjects).length > 0
        return true
      return false
    else if @response.status == "final"
      # Admins can reject final
      admins = _.union(_.pluck(_.where(@form.roles, { role: "admin"}), "id"), deployment.admins)

      subjects = ["user:" + @user, "all"]
      subjects = subjects.concat(_.map @groups, (g) -> "group:" + g)

      return _.intersection(admins, subjects).length > 0

  # Add an event
  _addEvent: (type, attrs={}) ->
    event = _.extend({ type: type, by: @user, on: new Date().toISOString()}, attrs)
    @response.events = @response.events or []
    @response.events.push(event)