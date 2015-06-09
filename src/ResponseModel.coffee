_ = require 'lodash'
formUtils = require './formUtils'
FormCompiler = require './FormCompiler'
uuid = require 'node-uuid'
Backbone = require 'backbone'
async = require 'async'

# Model of a response object that allows manipulation and asking of questions
# Options are:
# response: response object. Required
# form: form object. Required
# user: current username. Required
# groups: group names of user
# formCtx: form context. getProperty is required for submitting forms with entity questions
module.exports = class ResponseModel
  constructor: (options) ->
    @response = options.response
    @form = options.form
    @user = options.user
    @groups = options.groups or []
    @formCtx = options.formCtx or {}

  # Setup draft
  draft: ->
    # Unfinalize if final
    if @response.status == "final" then @_unfinalize()

    if not @response._id
      @response._id = formUtils.createUid()
      @response.form = @form._id
      @response.user = @user
      @response.startedOn = new Date().toISOString()
      @response.data = {}
      @response.approvals = []
  
      # Create code. Not unique, but unique per user if logged in once.
      @response.code = @user + "-" + formUtils.createBase32TimeCode(new Date())
    
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
    @_updateEntities()

  # Submit (either to final or pending as appropriate)
  submit: ->
    @response.submittedOn = new Date().toISOString()

    deployment = _.findWhere(@form.deployments, { _id: @response.deployment })
    if not deployment
      throw new Error("No matching deployments")

    # If no approval stages
    if deployment.approvalStages.length == 0
      @_finalize()
    else
      @response.status = "pending"
      @response.approvals = []

    @fixRoles()
    @_updateEntities()

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
      @_finalize()

    @fixRoles()
    @_updateEntities()

  # Reject a response with a specific rejection message
  reject: (message) ->
    if not @canReject()
      throw new Error("Cannot reject")

    deployment = _.findWhere(@form.deployments, { _id: @response.deployment })
    if not deployment
      throw new Error("No matching deployments")

    # Unfinalize if final
    if @response.status == "final" then @_unfinalize()

    @response.status = "rejected"
    @response.rejectionMessage = message
    @response.approvals = []

    @fixRoles()
    @_updateEntities()

  # Performs special operation when a response becomes final. Also sets status
  _finalize: ->
    # Set response status
    @response.status = "final"

    # Get any entity creates/updates. Updates first, since generating creates adds answers to entity questions
    # that would make them look like updates
    @response.pendingEntityUpdates = @_generateEntityUpdates()
    @response.pendingEntityCreates = @_generateEntityCreates()

  # Performs special operation when a response goes from final to other
  _unfinalize: ->
    # Unset any entity questions that were set because a create happened
    if @response.pendingEntityCreates
      for create in @response.pendingEntityCreates
        @response.data[create.questionId].value = null

    # Remove any pending entity operations
    @response.pendingEntityUpdates = []
    @response.pendingEntityCreates = []

  _generateEntityCreates: ->
    creates = []

    # Create form compiler
    model = new Backbone.Model(@response.data)
    compiler = new FormCompiler(model: model, ctx: @formCtx)

    # DEPRECATED!!!
    # If no entity was set (then it would be update, not create) and is set to create entity
    if @form.design.entitySettings and @form.design.entitySettings.entityType and not @formCtx.formEntity?
      creates.push { 
        entityType: _.last(@form.design.entitySettings.entityType.split(":")), 
        entity: _.extend(compiler.compileSaveLinkedAnswers(@form.design.entitySettings.propertyLinks)(), { 
          _id: uuid.v4(),
          _roles: [{ to: "user:#{@user}", role: "admin" }, { to: "all", role: "view" }] # Default roles to protected
        })
      }
    # END DEPRECATED

    # TODO Null response handling. Include? Currently yes
    # Go through all entity questions
    for question in formUtils.priorQuestions(@form.design)
      # If entity question with property links and createEntity is true
      if question._type == "EntityQuestion" and question.propertyLinks and question.createEntity
        # If value is *not* set
        if not model.get(question._id) or not model.get(question._id).value
          # Get data from that entity question
          entity = compiler.compileSaveLinkedAnswers(question.propertyLinks)()

          # Add _id
          entity._id = uuid.v4()
          entity._roles = [{ to: "user:#{@user}", role: "admin" }, { to: "all", role: "view" }]

          # Set question value
          @response.data[question._id] = { value: entity._id }

          create = {
            entityType: question.entityType,
            entity: entity
            questionId: question._id
          }

          # Get deployment to override _roles and _created_for
          deployment = _.findWhere(@form.deployments, { _id: @response.deployment })
          if deployment.entityCreationSettings
            # Find first matching setting (right question and conditions true)
            settings = _.find(deployment.entityCreationSettings, (ecs) =>
              # Question must match
              if ecs.questionId != question._id 
                return false

              # Conditions must be true or non-existant
              if ecs.conditions
                if not compiler.compileConditions(ecs.conditions)()
                  return false

              return true
            )

            # Apply settings if match found
            if settings
              if settings.createdFor
                create.entity._created_for = settings.createdFor

              roles = []

              # Set enumerator role
              if settings.enumeratorRole
                roles.push({ to: "user:#{@response.user}", role: settings.enumeratorRole })

              # Add other roles
              if settings.otherRoles
                for role in settings.otherRoles
                  if not _.findWhere(roles, to: role.to)
                    roles.push({ to: role.to, role: role.role })

              create.entity._roles = roles

          creates.push(create)

    return creates

  _generateEntityUpdates: ->
    updates = []

    # Create form compiler
    model = new Backbone.Model(@response.data)
    compiler = new FormCompiler(model: model, ctx: @formCtx)

    # DEPRECATED!!!
    # If entity was set 
    if @form.design.entitySettings and @form.design.entitySettings.entityType and @formCtx.formEntity?
      updates.push({ 
        questionId: null
        entityId: @formCtx.formEntity._id, 
        entityType: _.last(@form.design.entitySettings.entityType.split(":")), 
        updates: compiler.compileSaveLinkedAnswers(@form.design.entitySettings.propertyLinks)()
      })
    # END DEPRECATED

    # TODO Null response handling. Include? Currently yes
    # Go through all entity questions
    for question in formUtils.priorQuestions(@form.design)
      # If entity question with property links
      if question._type == "EntityQuestion" and question.propertyLinks
        # If value is set
        if model.get(question._id) and model.get(question._id).value 
          # Get updates from that entity question
          propertyUpdates = compiler.compileSaveLinkedAnswers(question.propertyLinks)()
          if _.keys(propertyUpdates).length > 0
            updates.push({
              entityId: model.get(question._id).value,
              entityType: question.entityType,
              updates: propertyUpdates
              questionId: question._id
            })

    return updates

  # Updates entities field
  _updateEntities: ->
    entities = []
    for question in formUtils.priorQuestions(@form.design)    
      if question._type == "EntityQuestion"
        if @response.data and @response.data[question._id] and @response.data[question._id].value
          entities.push({ questionId: question._id, entityType: question.entityType, entityId: @response.data[question._id].value })

    @response.entities = entities

  # Fixes roles to reflect status and approved fields
  fixRoles: ->
    # Determine deployment
    deployment = _.findWhere(@form.deployments, { _id: @response.deployment })
    if not deployment
      throw new Error("No matching deployments")

    # If pending and more or equal approvals than approval stages, response is final
    if @response.status == "pending" and @response.approvals? and @response.approvals.length >= deployment.approvalStages.length
      @_finalize()

    # User is always admin, unless final and not enumeratorAdminFinal flag, then viewer
    if @response.status == 'final' and not deployment.enumeratorAdminFinal
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

  # Process any pending entity operations using the specified mongo-style 
  # database. See minimongo for a spec.
  # Calls callback with results with:
  # { 
  #  creates: [array of { entity, entityType }]
  #  updates: [array of { entity, entityType }]
  #  error: error if present or null
  # }
  processEntityOperations: (db, cb) ->
    tasks = []
    if @response.pendingEntityUpdates
      for update in @response.pendingEntityUpdates
        # Create an async task 
        tasks.push (cb) =>
          db[update.entityType].findOne({ _id: update.entityId }, { interim: false }, (entity) =>
            # If not found, continue
            if not entity
              return cb()

            # Update entity
            updated = _.extend({}, entity, update.updates)

            db[update.entityType].upsert(updated, entity, (successEntity) =>
              # Remove from pending list
              @response.pendingEntityUpdates = _.without(@response.pendingEntityUpdates, update)
  
              # Call callback with update
              cb(null, { update: { entity: successEntity, entityType: update.entityType } })
            , cb)
          , cb)

    if @response.pendingEntityCreates
      for create in @response.pendingEntityCreates
        # Create an async task 
        tasks.push (cb) =>
          db[create.entityType].upsert(create.entity, (successEntity) =>
            # Remove from pending list
            @response.pendingEntityCreates = _.without(@response.pendingEntityCreates, create)

            # Call callback with create
            cb(null, { create: { entity: successEntity, entityType: create.entityType } })
          , cb)

    # Execute all tasks, then upsert
    async.series tasks, (err, res) =>
      # Create results object
      results = {
        error: err
        creates: []
        updates: []
      }

      # Add creates and updates
      for r in res
        if r and r.create
          results.creates.push(r.create)
        if r and r.update
          results.updates.push(r.update)

      cb(results)
