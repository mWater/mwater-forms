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
    if @response._id
      throw new Error("Response already has _id")

    @response._id = formUtils.createUid()
    @response.form = @form._id
    @response.user = @user
    @response.username = @username
    @response.startedOn = new Date().toISOString()
    @response.data = {}
    @response.approvals = []
    @response.events = []

    # Create code. Not unique, but unique per user if logged in once.
    @response.code = @username + "-" + formUtils.createBase32TimeCode(new Date())
  
    @response.formRev = @form._rev
    @response.status = "draft"

    @_addEvent("draft")

    if deploymentId
      @response.deployment = deploymentId
    else if not @response.deployment # Select first deployment if not specified and not already present
      deployments = @listEnumeratorDeployments()

      if deployments.length == 0
        throw new Error("No matching deployments for #{@form._id} user #{@username}")

      @response.deployment = deployments[0]._id

    @fixRoles()
    @updateEntities()

  # Switch back to draft mode
  redraft: ->
    # Add event if not in draft
    if @response.status != "draft"
      @_addEvent("draft")

    # Unfinalize if final
    if @response.status == "final" then @_unfinalize()

    @response.status = "draft"
    @response.approvals = []

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

  # Can submit if in draft/rejected and am enumerator or admin
  canSubmit: ->
    if @response.status not in ['draft', 'rejected']
      return false

    # Anonymous can submit
    if not @response.user
      return true

    deployment = _.findWhere(@form.deployments, { _id: @response.deployment })
    if not deployment
      return false

    # Get list of admins at both deployment and form level 
    admins = _.union(_.pluck(_.where(@form.roles, { role: "admin"}), "id"), deployment.admins)

    # Add enumerator 
    admins = _.union(admins, ["user:#{@response.user}"])

    subjects = ["user:" + @user, "all"]
    subjects = subjects.concat(_.map @groups, (g) -> "group:" + g)

    return _.intersection(admins, subjects).length > 0

  # Approve response
  approve: ->
    if not @canApprove()
      throw new Error("Cannot approve")

    deployment = _.findWhere(@form.deployments, { _id: @response.deployment })
    if not deployment
      throw new Error("No matching deployments for #{@form._id} user #{@username}")

    approval = { by: @user, on: new Date().toISOString() }

    # Determine if approver (vs admin)
    approvers = deployment.approvalStages[@response.approvals.length]?.approvers or []
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
      admins = _.pluck(_.where(@form.roles, { role: "admin"}), "id")
      if @response.user
        admins.push("user:" + @response.user)

      @response.roles = _.map admins, (s) -> { id: s, role: "admin" }
      return

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
          admins = _.union admins, deployment.approvalStages[i]?.approvers or []
        else
          viewers = _.union viewers, deployment.approvalStages[i]?.approvers or []
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
      return false

    if @response.status != "pending"
      return false

    # Get list of admins at both deployment and form level and add approvers
    admins = _.union(_.pluck(_.where(@form.roles, { role: "admin"}), "id"), deployment.admins, deployment.approvalStages[@response.approvals.length]?.approvers or [])
    subjects = ["user:" + @user, "all"]
    subjects = subjects.concat(_.map @groups, (g) -> "group:" + g)

    if _.intersection(admins, subjects).length > 0
      return true
    return false

  # Determine if am an approver for the response, as opposed to admin who could still approve
  amApprover: ->
    deployment = _.findWhere(@form.deployments, { _id: @response.deployment })
    if not deployment
      return false

    if @response.status != "pending"
      return false

    # Get list of approvers
    approvers = deployment.approvalStages[@response.approvals.length]?.approvers or []
    subjects = ["user:" + @user, "all"]
    subjects = subjects.concat(_.map @groups, (g) -> "group:" + g)

    if _.intersection(approvers, subjects).length > 0
      return true
    return false

  # Determine if can delete response
  canDelete: ->
    subjects = ["user:" + @user, "all"]
    subjects = subjects.concat(_.map @groups, (g) -> "group:" + g)

    deployment = _.findWhere(@form.deployments, { _id: @response.deployment })
    if not deployment
      # Only delete if admin
      return _.intersection(_.pluck(_.where(@form.roles, { role: "admin"}), "id"), subjects).length > 0

    # Get list of admins at both deployment and form level 
    admins = _.union(_.pluck(_.where(@form.roles, { role: "admin"}), "id"), deployment.admins)

    # Add approvers if level allows editing
    if @response.status == "pending"
      approvalStage = deployment.approvalStages[@response.approvals.length]
      if approvalStage? and not approvalStage.preventEditing
        admins = _.union(admins, approvalStage.approvers)

    # Add enumerator if in draft or rejected
    if @response.status in ['draft', 'rejected'] and @response.user
      admins = _.union(admins, ["user:#{@response.user}"])

    # Add enumerator if final and enumeratorAdminFinal
    if @response.status == "final" and @response.user and deployment.enumeratorAdminFinal
      admins = _.union(admins, ["user:#{@response.user}"])      

    return _.intersection(admins, subjects).length > 0

  # Determine if can edit response
  canEdit: ->
    deployment = _.findWhere(@form.deployments, { _id: @response.deployment })
    if not deployment
      return false

    # Get list of admins at both deployment and form level 
    admins = _.union(_.pluck(_.where(@form.roles, { role: "admin"}), "id"), deployment.admins)

    # Add approvers if level allows editing
    if @response.status == "pending"
      approvalStage = deployment.approvalStages[@response.approvals.length]
      if approvalStage? and not approvalStage.preventEditing
        admins = _.union(admins, approvalStage.approvers)

    # Add enumerator if in draft or rejected (can delete but not edit)
    if @response.status in ['draft', 'rejected'] and @response.user
      admins = _.union(admins, ["user:#{@response.user}"])

    subjects = ["user:" + @user, "all"]
    subjects = subjects.concat(_.map @groups, (g) -> "group:" + g)

    return _.intersection(admins, subjects).length > 0

  # Determine if can switch back to draft phase. Only enumerators can do this and only if pending, rejected, draft or enumerators can edit final
  canRedraft: ->
    # Cannot redraft anonymous responses
    if not @response.user 
      return false

    deployment = _.findWhere(@form.deployments, { _id: @response.deployment })
    if not deployment
      return false

    subjects = ["user:" + @user, "all"]
    subjects = subjects.concat(_.map @groups, (g) -> "group:" + g)

    if @response.status in ['pending', 'rejected', 'draft']
      return "user:#{@response.user}" in subjects
    else # Final
      return "user:#{@response.user}" in subjects and deployment.enumeratorAdminFinal

  # Determine if can reject response
  canReject: ->
    # Cannot reject anonymous responses
    if not @response.user 
      return false

    deployment = _.findWhere(@form.deployments, { _id: @response.deployment })
    if not deployment
      return false

    if @response.status == "draft" or @response.status == "rejected"
      return false

    if @response.status == "pending"
      # Get list of admins at both deployment and form level and add approvers
      admins = _.union(_.pluck(_.where(@form.roles, { role: "admin"}), "id"), deployment.admins, deployment.approvalStages[@response.approvals.length]?.approvers or [])
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