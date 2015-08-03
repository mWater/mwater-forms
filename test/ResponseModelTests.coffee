_ = require 'lodash'
assert = require("chai").assert

ResponseModel = require '../src/ResponseModel'

sampleForm = {
  _id: "formid"
  _rev: 3
  design: { contents: [] }
  deployments: [
    {
      _id: "dep1"
      active: true
      enumerators: [ "group:dep1en1" ]
      approvalStages: [
        { approvers: [ "group:dep1ap1" ] }
      ]
      viewers: [ "group:dep1view1" ]
      admins: [ "group:dep1admin1" ]
    }
    {
      _id: "dep2"
      active: true
      enumerators: [ "group:dep2en1" ]
      approvalStages: [
        { approvers: [ "group:dep2ap1", "user:user" ] }
      ]
      viewers: [ "group:dep2view1", "user:user" ]
      admins: [ "group:dep2admin1", "user:user" ]
    }
  ]
  roles: [
    { id: "user:formadmin", role: "admin" }
  ]
}

describe "ResponseModel", ->
  describe "draft", ->
    beforeEach ->
      @response = { }
      @form = _.cloneDeep(sampleForm)
      @model = new ResponseModel(response: @response, form: @form, user: "user", groups: ["dep2en1"])
      @model.draft()

    it "includes basic fields", ->
      assert @response._id, "missing id"
      assert.equal @response.form, @form._id, "missing form"
      assert.equal @response.formRev, @form._rev, "missing rev"
      assert.match @response.code, /^user-/, "bad code"
      assert.equal @response.user, "user", "wrong user"
      assert.equal @response.status, "draft"

    it "sets startedOn", ->
      assert @response.startedOn
            
    it "selects first matching deployment", ->
      assert.equal @response.deployment, "dep2"

    it "includes self as admin", ->
      assert.equal _.where(@response.roles, { id: "user:user", role: "admin"}).length, 1

    it "includes admins of deployment as admins", ->
      assert.equal _.where(@response.roles, { id: "group:dep2admin1", role: "admin"}).length, 1

    it "includes admins of form as admins", ->
      assert.equal _.where(@response.roles, { id: "user:formadmin", role: "admin"}).length, 1

    it "include approvers", ->
      assert.equal _.where(@response.roles, { id: "group:dep2ap1", role: "view"}).length, 1

    it "does not include deployment viewers", ->
      assert.equal _.where(@response.roles, { id: "group:dep2view1"}).length, 0

    it "creates draft event", ->
      assert.equal @response.events.length, 1
      assert.equal @response.events[0].type, "draft"
      assert.equal @response.events[0].by, "user"
      assert @response.events[0].on

    it "does not create draft event if already in draft", ->
      @model.draft()
      assert.equal @response.events.length, 1

  describe "draft when deployed to all", ->
    beforeEach ->
      @response = { }
      @form = _.cloneDeep(sampleForm)
      @form.deployments[0].enumerators.push "all"
      @model = new ResponseModel(response: @response, form: @form, user: "unknownUser", groups: [])
      @model.draft()

    it "selects first matching deployment", ->
      assert.equal @response.deployment, "dep1"

  describe "submit when no approval stages", ->
    beforeEach ->
      @response = { }
      @form = _.cloneDeep(sampleForm)
      @form.deployments[1].approvalStages = []
      @model = new ResponseModel(response: @response, form: @form, user: "user2", groups: ["dep2en1"])
      @model.draft()
      @model.submit()

    it "makes response final", ->
      assert.equal @response.status, "final"

    it "sets submittedOn", ->
      assert @response.submittedOn

    it "leaves self as viewer", ->
      assert.equal _.where(@response.roles, { id: "user:user2", role: "view"}).length, 1

    it "includes admins of deployment as admins", ->
      assert.equal _.where(@response.roles, { id: "group:dep2admin1", role: "admin"}).length, 1

    it "includes admins of form as admins", ->
      assert.equal _.where(@response.roles, { id: "user:formadmin", role: "admin"}).length, 1

    it "includes viewers of deployment as viewers", ->
      assert.equal _.where(@response.roles, { id: "group:dep2view1"}).length, 1

    it "creates submit event", ->
      assert.equal @response.events.length, 2
      assert.equal @response.events[1].type, "submit"
      assert.equal @response.events[1].by, "user2"
      assert @response.events[1].on

  describe "submit when no approval stages with enumeratorAdminFinal", ->
    beforeEach ->
      @response = { }
      @form = _.cloneDeep(sampleForm)
      @form.deployments[1].approvalStages = []
      @form.deployments[1].enumeratorAdminFinal = true
      @model = new ResponseModel(response: @response, form: @form, user: "user2", groups: ["dep2en1"])
      @model.draft()
      @model.submit()

    it "leaves self as admin", ->
      assert.equal _.where(@response.roles, { id: "user:user2", role: "admin"}).length, 1

  describe "submit when approval stages", ->
    beforeEach ->
      @response = { }
      @form = _.cloneDeep(sampleForm)
      @model = new ResponseModel(response: @response, form: @form, user: "user2", groups: ["dep2en1"])
      @model.draft()
      @model.submit()

    it "makes response pending", ->
      assert.equal @response.status, "pending"

    it "sets submittedOn", ->
      assert @response.submittedOn

    it "sets approvals", ->
      assert.deepEqual @response.approvals, []

    it "leaves self as admin", ->
      assert.equal _.where(@response.roles, { id: "user:user2", role: "admin"}).length, 1

    it "includes approvers of first stage as admins", ->
      assert.equal _.where(@response.roles, { id: "group:dep2ap1", role: "admin"}).length, 1

    it "includes admins of deployment as admins", ->
      assert.equal _.where(@response.roles, { id: "group:dep2admin1", role: "admin"}).length, 1

    it "includes admins of form as admins", ->
      assert.equal _.where(@response.roles, { id: "user:formadmin", role: "admin"}).length, 1

    it "does not include deployment viewers", ->
     assert.equal _.where(@response.roles, { id: "group:dep2view1"}).length, 0

    it "makes response final if approval stage deleted", ->
      @form.deployments[1].approvalStages = []
      @model.fixRoles()
      assert.equal @response.status, "final"

    it "makes does not make draft response final if approval stage deleted", ->
      @response.status = "draft"
      @form.deployments[1].approvalStages = []
      @model.fixRoles()
      assert.equal @response.status, "draft"

    it "creates submit event", ->
      assert.equal @response.events.length, 2
      assert.equal @response.events[1].type, "submit"
      assert.equal @response.events[1].by, "user2"
      assert @response.events[1].on

  describe "approval when last stage", ->
    beforeEach ->
      @response = { }
      @form = _.cloneDeep(sampleForm)
      @model = new ResponseModel(response: @response, form: @form, user: "user2", groups: ["dep2en1"])
      @model.draft()
      @model.submit()
      @model = new ResponseModel(response: @response, form: @form, user: "user", groups: ["dep2en1"])
      @model.approve()

    it "sets approvals", ->
      assert.deepEqual _.pluck(@response.approvals, "by"), ["user"]

    it "makes response final", ->
      assert.equal @response.status, "final"

    it "leaves self as viewer", ->
      assert.equal _.where(@response.roles, { id: "user:user2", role: "view"}).length, 1

    it "includes admins of deployment as admins", ->
      assert.equal _.where(@response.roles, { id: "group:dep2admin1", role: "admin"}).length, 1

    it "includes admins of form as admins", ->
      assert.equal _.where(@response.roles, { id: "user:formadmin", role: "admin"}).length, 1

    it "includes viewers of deployment as viewers", ->
      assert.equal _.where(@response.roles, { id: "group:dep2view1"}).length, 1

    it "creates approve event", ->
      assert.equal @response.events.length, 3
      assert.equal @response.events[2].type, "approve"
      assert.equal @response.events[2].by, "user"
      assert @response.events[2].on
      assert not @response.events[2].override

  describe "approval overrides", ->
    beforeEach ->
      @response = { }
      @form = _.cloneDeep(sampleForm)
      @model = new ResponseModel(response: @response, form: @form, user: "user", groups: ["dep2en1"])
      @model.draft()
      @model.submit()

    it "sets override to false if done by approver", ->
      @model = new ResponseModel(response: @response, form: @form, user: "user", groups: ["dep2ap1"])
      @model.approve()
      assert not @response.approvals[0].override

    it "sets override to true if done by deployment admin", ->
      @model = new ResponseModel(response: @response, form: @form, user: "user2", groups: ["dep2admin1"])
      @model.approve()
      assert.isTrue @response.approvals[0].override

    it "sets override to true if done by form admin", ->
      @model = new ResponseModel(response: @response, form: @form, user: "formadmin", groups: [])
      @model.approve()
      assert.isTrue @response.approvals[0].override

    it "creates approve event with override", ->
      @model = new ResponseModel(response: @response, form: @form, user: "formadmin", groups: [])
      @model.approve()

      assert.equal @response.events.length, 3
      assert.equal @response.events[2].type, "approve"
      assert.equal @response.events[2].by, "formadmin"
      assert.isTrue @response.events[2].override
      assert @response.events[1].on

  describe "approval when not last stage", ->
    beforeEach ->
      @response = { }
      @form = _.cloneDeep(sampleForm)

      # Add extra stage
      @form.deployments[1].approvalStages.push { approvers: ["group:dep2ap2"] }

      @model = new ResponseModel(response: @response, form: @form, user: "user", groups: ["dep2en1"])
      @model.draft()
      @model.submit()
      @model.approve()

    it "leaves response pending", ->
      assert.equal @response.status, "pending"

    it "sets approvals", ->
      assert.deepEqual _.pluck(@response.approvals, "by"), ["user"]

    it "leaves self as admin", ->
      assert.equal _.where(@response.roles, { id: "user:user", role: "admin"}).length, 1

    it "includes approvers of second stage as admins", ->
      assert.equal _.where(@response.roles, { id: "group:dep2ap2", role: "admin"}).length, 1

    it "includes approvers of first stage as viewers", ->
      assert.equal _.where(@response.roles, { id: "group:dep2ap1", role: "view"}).length, 1

    it "includes admins of deployment as admins", ->
      assert.equal _.where(@response.roles, { id: "group:dep2admin1", role: "admin"}).length, 1

    it "includes admins of form as admins", ->
      assert.equal _.where(@response.roles, { id: "user:formadmin", role: "admin"}).length, 1

    it "does not include deployment viewers", ->
     assert.equal _.where(@response.roles, { id: "group:dep2view1"}).length, 0

    it "creates approve event", ->
      assert.equal @response.events.length, 3
      assert.equal @response.events[2].type, "approve"
      assert.equal @response.events[2].by, "user"
      assert @response.events[2].on
      assert not @response.events[2].override

  describe "redraft", ->
    beforeEach ->
      @response = { }
      @form = _.cloneDeep(sampleForm)

      @model = new ResponseModel(response: @response, form: @form, user: "user", groups: ["dep2en1"])

      @model.draft()
      @origId = @response._id
      @model.submit()
      @model.draft()

    it "does not overwrite id", ->
      assert.equal @response._id, @origId

    it "creates draft event", ->
      assert.equal @response.events.length, 3
      assert.equal @response.events[2].type, "draft"
      assert.equal @response.events[2].by, "user"
      assert @response.events[2].on

  describe "reject", ->
    beforeEach ->
      @response = { }
      @form = _.cloneDeep(sampleForm)

      @model = new ResponseModel(response: @response, form: @form, user: "user", groups: ["dep2en1"])

      @model.draft()
      @model.submit()
      @model = new ResponseModel(response: @response, form: @form, user: "user2", groups: ["dep2ap1"])
      @model.reject("message")

    it "sets status rejected", ->
      assert.equal @response.status, "rejected"

    it "removes approvalStage", ->
      assert.isUndefined @response.approvalStage

    it "sets rejection message", ->
      assert.equal @response.rejectionMessage, "message"

    it "includes self as admin", ->
      assert.equal _.where(@response.roles, { id: "user:user", role: "admin"}).length, 1

    it "includes admins of deployment as admins", ->
      assert.equal _.where(@response.roles, { id: "group:dep2admin1", role: "admin"}).length, 1

    it "includes admins of form as admins", ->
      assert.equal _.where(@response.roles, { id: "user:formadmin", role: "admin"}).length, 1

    it "includes approvers as viewers", ->
      assert.equal _.where(@response.roles, { id: "group:dep2ap1", role: "view"}).length, 1

    it "does not include deployment viewers", ->
      assert.equal _.where(@response.roles, { id: "group:dep2view1"}).length, 0

    it "creates reject event", ->
      assert.equal @response.events.length, 3
      assert.equal @response.events[2].type, "reject"
      assert.equal @response.events[2].by, "user2"
      assert @response.events[2].on
      assert not @response.events[2].override
      assert.equal @response.events[2].message, "message"

  describe "recordEdit", ->
    it "does not record if done by enumerator", ->
      response = { }
      form = _.cloneDeep(sampleForm)
      model = new ResponseModel(response: response, form: form, user: "user", groups: ["dep2en1"])
      model.draft()

      model.recordEdit()
      assert.equal response.events.length, 1

    it "does record if done by other than enumerator", ->
      response = { }
      form = _.cloneDeep(sampleForm)
      model = new ResponseModel(response: response, form: form, user: "user", groups: ["dep2en1"])
      model.draft()

      model = new ResponseModel(response: response, form: @form, user: "user2", groups: ["dep2admin1"])
      model.recordEdit()
      assert.equal response.events.length, 2
      assert.equal response.events[1].type, "edit"
      assert.equal response.events[1].by, "user2"

  describe "canReject", ->
    beforeEach ->
      @response = { }
      @form = _.cloneDeep(sampleForm)

      @model = new ResponseModel(response: @response, form: @form, user: "user", groups: ["dep1en1"])
      @model.draft()

    it "cannot reject drafts", ->
      @model = new ResponseModel(response: @response, form: @form, user: "user2", groups: ["dep1ap1"])
      assert not @model.canReject()

    it "approver cannot reject final", ->
      @model.submit()
      @model = new ResponseModel(response: @response, form: @form, user: "user2", groups: ["dep1ap1"])
      @model.approve()
      assert not @model.canReject()

    it "admin can reject final", ->
      @model.submit()
      @model = new ResponseModel(response: @response, form: @form, user: "user2", groups: ["dep1ap1"])
      @model.approve()
      @model = new ResponseModel(response: @response, form: @form, user: "formadmin", groups: [])
      assert @model.canReject()

    it "enumerator cannot reject final", ->
      @model.submit()
      @model = new ResponseModel(response: @response, form: @form, user: "user2", groups: ["dep1ap1"])
      @model.approve()
      @model = new ResponseModel(response: @response, form: @form, user: "user", groups: ["dep2en1"])
      assert not @model.canReject()

    it "can reject if approver", ->
      @model.submit()
      @model = new ResponseModel(response: @response, form: @form, user: "user2", groups: ["dep1ap1"])
      assert @model.canReject()

    it "can reject if deployment admin", ->
      @model.submit()
      @model = new ResponseModel(response: @response, form: @form, user: "user2", groups: ["dep1admin1"])
      assert @model.canReject()

    it "can reject if form admin", ->
      @model.submit()
      @model = new ResponseModel(response: @response, form: @form, user: "formadmin", groups: [])
      assert @model.canReject()

  describe "canDelete", ->
    beforeEach ->
      @response = { }
      @form = _.cloneDeep(sampleForm)

      @model = new ResponseModel(response: @response, form: @form, user: "user", groups: ["dep1en1"])
      @model.draft()

    it "can delete if enumerator", ->
      assert @model.canDelete()

    it "can delete pending if enumerator", ->
      @model.submit()
      assert @model.canDelete()

    it "can delete rejected if enumerator", ->
      @model.submit()
      @model = new ResponseModel(response: @response, form: @form, user: "user2", groups: ["dep1ap1"])
      @model.reject("bad")
      @model = new ResponseModel(response: @response, form: @form, user: "user", groups: ["dep2en1"])
      assert @model.canDelete()

    it "cannot delete final if enumerator", ->
      @model.submit()
      @model = new ResponseModel(response: @response, form: @form, user: "user2", groups: ["dep1ap1"])
      @model.approve()
      @model = new ResponseModel(response: @response, form: @form, user: "user", groups: ["dep2en1"])
      assert not @model.canDelete()

    it "cannot delete final if approver", ->
      @model.submit()
      @model = new ResponseModel(response: @response, form: @form, user: "user2", groups: ["dep1ap1"])
      @model.approve()
      assert not @model.canDelete()

    it "can delete final if admin", ->
      @model.submit()
      @model = new ResponseModel(response: @response, form: @form, user: "user2", groups: ["dep1ap1"])
      @model.approve()
      @model = new ResponseModel(response: @response, form: @form, user: "user2", groups: ["dep1admin1"])
      assert @model.canDelete()

  describe "canEdit", ->
    beforeEach ->
      @response = { }
      @form = _.cloneDeep(sampleForm)

      @model = new ResponseModel(response: @response, form: @form, user: "user", groups: ["dep1en1"])
      @model.draft()

    it "can edit if enumerator", ->
      assert @model.canEdit()

    it "cannot edit pending if enumerator", ->
      @model.submit()
      assert not @model.canEdit()

    it "can edit rejected if enumerator", ->
      @model.submit()
      @model = new ResponseModel(response: @response, form: @form, user: "user2", groups: ["dep1ap1"])
      @model.reject("bad")
      @model = new ResponseModel(response: @response, form: @form, user: "user", groups: ["dep2en1"])
      assert @model.canEdit()

    it "cannot edit final if enumerator", ->
      @model.submit()
      @model = new ResponseModel(response: @response, form: @form, user: "user2", groups: ["dep1ap1"])
      @model.approve()
      @model = new ResponseModel(response: @response, form: @form, user: "user", groups: ["dep2en1"])
      assert not @model.canEdit()

    it "cannot edit final if approver", ->
      @model.submit()
      @model = new ResponseModel(response: @response, form: @form, user: "user2", groups: ["dep1ap1"])
      @model.approve()
      assert not @model.canEdit()

    it "can edit final if admin", ->
      @model.submit()
      @model = new ResponseModel(response: @response, form: @form, user: "user2", groups: ["dep1ap1"])
      @model.approve()
      @model = new ResponseModel(response: @response, form: @form, user: "user2", groups: ["dep1admin1"])
      assert @model.canEdit()

  describe "canApprove", ->
    beforeEach ->
      @response = { }
      @form = _.cloneDeep(sampleForm)

      @model = new ResponseModel(response: @response, form: @form, user: "user", groups: ["dep1en1"])
      @model.draft()

    it "cannot approve drafts", ->
      @model = new ResponseModel(response: @response, form: @form, user: "user2", groups: ["dep1ap1"])
      assert not @model.canApprove()

    it "cannot approve final", ->
      @model.submit()
      @model = new ResponseModel(response: @response, form: @form, user: "user2", groups: ["dep1ap1"])
      @model.approve()
      assert not @model.canApprove()

    it "cannot approve if enumerator", ->
      assert not @model.canApprove()

    it "can approve if approver", ->
      @model.submit()
      @model = new ResponseModel(response: @response, form: @form, user: "user2", groups: ["dep1ap1"])
      assert @model.canApprove()

    it "can approve if deployment admin", ->
      @model.submit()
      @model = new ResponseModel(response: @response, form: @form, user: "user2", groups: ["dep1admin1"])
      assert @model.canApprove()

    it "can approve if form admin", ->
      @model.submit()
      @model = new ResponseModel(response: @response, form: @form, user: "formadmin", groups: [])
      assert @model.canApprove()

  describe "inactive deployments", ->
    it "skips over inactive deployments", ->
      # Add to both but set first inactive
      @form = _.cloneDeep(sampleForm)

      @form.deployments[1].enumerators.push "group:dep1en1"
      @form.deployments[0].active = false

      @model = new ResponseModel(response: @response, form: @form, user: "user", groups: ["dep2en1"])
      @model.draft()
      assert.equal @response.deployment, "dep2"

    it "requires active deployment", ->
      @response = { }
      @form = _.cloneDeep(sampleForm)
      @form.deployments[0].active = false
      @model = new ResponseModel(response: @response, form: @form, user: "user", groups: ["dep2en1"])
      assert.throws ->
        @model.draft()

  describe "entities field", ->
    beforeEach ->
      # Create form with entity question
      @response = { }
      @form = _.cloneDeep(sampleForm)
      @form.design = {
        contents: [
          {
            _id: "q1"
            _type: "EntityQuestion"
            text: { _base: "en", en: "English" }
            entityType: "type1"
          }
        ]
      }

    it "sets entities", ->
      @model = new ResponseModel(response: @response, form: @form, user: "user2", groups: ["dep2en1"])
      @model.draft()

      # Set entity question value
      @response.data = { q1: { value: "entityid123" } }
      @model.submit()

      # Check that entities was filled out
      assert.deepEqual @response.entities, [
        { questionId: "q1", entityType: "type1", entityId: "entityid123", created: false }
      ], JSON.stringify(@response.entities)

    it "sets entities created flag", ->
      @model = new ResponseModel(response: @response, form: @form, user: "user2", groups: ["dep2en1"])
      @model.draft()

      # Set entity question value
      @response.data = { q1: { value: "entityid123", created: true } }
      @model.submit()

      # Check that entities was filled out
      assert.deepEqual @response.entities, [
        { questionId: "q1", entityType: "type1", entityId: "entityid123", created: true }
      ]

    it "resets entities", ->
      @model = new ResponseModel(response: @response, form: @form, user: "user2", groups: ["dep2en1"])
      @model.draft()

      # Set entity question value
      @response.data = { q1: { value: "entityid123" } }
      @model.submit()

      # Reset 
      @model.draft()
      @response.data = { q1: { value: "" } }
      @model.submit()

      # Check that entities was not filled out
      assert.deepEqual @response.entities, []

  describe "(deprecated) form-level entity creation", ->
    beforeEach ->
      # Create sample property
      @propText = { _id: "1", code: "text", type: "text", name: { en: "Text" } }

      formDesign = {
        contents: [
          {
            _id: "q1"
            _type: "TextQuestion"
            text: { _base: "en", en: "English", es: "Spanish" }
            format: "singleline"
          }
        ]
        entitySettings: {
          entityType: "type1"
          propertyLinks: [
            { propertyId: @propText._id, type: "direct", direction: "both", questionId: "q1" }
          ]
        }
      }

      @finalizeForm = =>
        @model.submit()
        @model = new ResponseModel(response: @response, form: @form, user: "user", groups: ["dep2en1"], formCtx: @ctx)
        @model.approve()

      # Create a form with the above designs
      @form = _.cloneDeep(sampleForm)
      @form.design = formDesign
      
      @ctx = {
        getProperty: (id) => if id == "1" then return @propText
      }

      @response = {}
      @model = new ResponseModel(response: @response, form: @form, user: "user", groups: ["dep2en1"], formCtx: @ctx)
      @model.draft()

    it "adds pendingEntityCreates on finalize", ->
      # Set entity and text
      @response.data = { q1: { value: "abc" } }
      @finalizeForm()

      assert.equal @response.pendingEntityCreates.length, 1
      assert.equal @response.pendingEntityUpdates.length, 0, "Should have no updates"
      create = @response.pendingEntityCreates[0]
      assert not create.questionId
      assert.equal create.entityType, "type1"
      assert.equal create.entity.text, "abc"
      assert create.entity._id.length > 10 # uuid

    it "adds pendingEntityUpdates on finalize", ->
      # Set entity and text
      @response.data = { q1: { value: "abc" } }
      @ctx.formEntity = { _id: "1234", text: "abc" }
      @finalizeForm()

      assert.deepEqual @response.pendingEntityUpdates, [
        { questionId: null, entityType: "type1", entityId: "1234", updates: { text: "abc" } }
      ]
      assert.equal @response.pendingEntityCreates.length, 0

  describe "pendingEntity operations", ->
    beforeEach ->
      # Create sample property
      @propText = { _id: "1", code: "text", type: "text", name: { en: "Text" } }

      formDesign = {
        contents: [
          {
            _id: "q1"
            _type: "TextQuestion"
            text: { _base: "en", en: "English", es: "Spanish" }
            format: "singleline"
          }
          {
            _id: "q2"
            _type: "EntityQuestion"
            entityType: "type1"
            propertyLinks: [
              { propertyId: @propText._id, direction: "both", questionId: "q1", type: "direct" }
            ]
          }              ]
      }

      @finalizeForm = =>
        @model.submit()
        @model = new ResponseModel(response: @response, form: @form, user: "user", groups: ["dep2en1"], formCtx: @ctx)
        @model.approve()

      # Create a form with the above designs
      @form = _.cloneDeep(sampleForm)
      @form.design = formDesign
      
      @ctx = {
        getProperty: (id) => if id == "1" then return @propText
      }

      @response = {}
      @model = new ResponseModel(response: @response, form: @form, user: "user", groups: ["dep2en1"], formCtx: @ctx)
      @model.draft()

    it "does not add pendingEntityUpdates on submit if pending", ->
      # Set entity and text
      @response.data = { q1: { value: "1234" }, q2: { value: "abc" } }

      @model.submit()
      assert not @response.pendingEntityUpdates

    it "adds pendingEntityUpdates on finalize", ->
      # Set entity and text
      @response.data = { q1: { value: "abc" }, q2: { value: "1234" } }
      @finalizeForm()

      assert.deepEqual @response.pendingEntityUpdates, [
        { questionId: "q2", entityType: "type1", entityId: "1234", updates: { text: "abc" } }
      ]

    it "removes any pending operations on un-finalize", ->
      @response.data = { q1: { value: "abc" }, q2: { value: "1234" } }
      @finalizeForm()
      @model.draft()
      assert.equal @response.pendingEntityUpdates.length, 0

    it "does not include empty entity updates", ->
      @response.data = { q1: { value: "abc" }, q2: { value: "1234" } }
      # Set property link to load only, so no updates
      @form.design.contents[1].propertyLinks[0].direction = "load"

      @finalizeForm()

      assert.equal @response.pendingEntityCreates.length, 0
      assert.equal @response.pendingEntityUpdates.length, 0

    describe "with entity creating question", ->
      beforeEach ->
        @form.design.contents[1].createEntity = true
  
      it "adds pendingEntityCreates on finalize", ->
        @response.data = { q1: { value: "abc" }, q2: {} }

        @finalizeForm()

        assert.equal @response.pendingEntityCreates.length, 1
        assert.equal @response.pendingEntityUpdates.length, 0, "Should have no updates"
        create = @response.pendingEntityCreates[0]
        assert.equal create.questionId, "q2"
        assert.equal create.entityType, "type1"
        assert.equal create.entity.text, "abc"
        assert create.entity._id.length > 10 # uuid
        assert.equal create.entity._id, @response.data.q2.value, "Should set entity question value"
        assert.isTrue @response.data.q2.created, "Should set created flag in question"

        # Sets default roles (admin to enumerator, view to all)
        assert.deepEqual create.entity._roles, [{ to: "user:user", role: "admin" }, { to: "all", role: "view" }]

      it "unsets create entity questions on un-finalize if creation pending", ->
        @response.data = { q1: { value: "abc" } }
        @finalizeForm()

        @model.draft()
        assert not @response.data.q2.value, "Should unset value"
        assert not @response.data.q2.created, "Should unset created flag in question"

      it "leaves create entity questions alone on un-finalize if creation already completed", ->
        @response.data = { q1: { value: "abc" } }
        @finalizeForm()
        @response.pendingEntityCreates = []

        @model.draft()
        assert @response.data.q2.value
        assert.isTrue @response.data.q2.created, "Should leave created flag in question"

      describe "with roles set in deployment", ->
        beforeEach ->
          @form.deployments[1].entityCreationSettings = [
            {
              questionId: "q2"
              enumeratorRole: "edit"
              createdFor: "somegroup"
              otherRoles: [
                { to: "user:bob", role: "admin" }
                { to: "user:user", role: "view" }
              ]
            }
          ]

          @response.data = { q1: { value: "abc" } }
          @finalizeForm()
          @create = @response.pendingEntityCreates[0].entity

        it "sets _roles", ->
          # Should have no duplicates
          assert.deepEqual @create._roles, [
            { to: "user:user", role: "edit" }
            { to: "user:bob", role: "admin" }
          ]

        it "sets _created_for", ->
          assert.equal @create._created_for, "somegroup"


      describe "with conditional roles set in deployment", ->
        beforeEach ->
          @form.deployments[1].entityCreationSettings = [
            {
              questionId: "q2"
              enumeratorRole: "edit"
              conditions: [
                { lhs: { question: "q1" }, op: "contains", rhs: { literal: "abc" }} # Conditional on abc in question 1
              ]
              createdFor: "somegroup"
              otherRoles: [
                { to: "user:bob", role: "admin" }
                { to: "user:user", role: "view" }
              ]
            }
          ]

        it "sets if conditions match", ->
          @response.data = { q1: { value: "abc" } }
          @finalizeForm()
          create = @response.pendingEntityCreates[0].entity

          assert.deepEqual create._roles, [
            { to: "user:user", role: "edit" }
            { to: "user:bob", role: "admin" }
          ]

        it "defaults if doesn't match", ->
          @response.data = { q1: { value: "xyz" } }
          @finalizeForm()
          create = @response.pendingEntityCreates[0].entity
          assert.deepEqual create._roles, [{ to: "user:user", role: "admin" }, { to: "all", role: "view" }]

  describe "processEntityOperations", ->
    beforeEach ->
      @form = _.cloneDeep(sampleForm)
      @response = {}
      @model = new ResponseModel(response: @response, form: @form, user: "user", groups: ["dep2en1"], formCtx: {})

    it "is ok with nulls", (done) ->
      db = {}
      @model.processEntityOperations(db, () =>
        done())

    it "processes creates", (done) ->
      upsert = null
      db = {
        test_type: {
          upsert: (doc, success, error) =>
            upsert = doc
            success(doc)
        }
      }

      entity = { _id: "1234", a: "text" }
      @response.pendingEntityCreates = [{ entity: entity, entityType: "test_type" }]

      @model.processEntityOperations(db, (results) =>
        assert.equal @response.pendingEntityCreates.length, 0
        assert.equal upsert, entity
        assert.deepEqual results, { updates: [], creates: [{ entity: upsert, entityType: "test_type" }], error: null }
        done())

    it "processes updates", (done) ->
      upsertDoc = null
      upsertBase = null

      base = { _id: "1234", a: "base", b: "other" }
      db = {
        test_type: {
          upsert: (doc, base, success, error) =>
            upsertDoc = doc
            upsertBase = base
            success(doc)
          findOne: (selector, options, success, error) =>
            assert.deepEqual selector, { _id: "1234" }, "Should look up existing"
            success(base)
        }
      }

      @response.pendingEntityUpdates = [{ entityId: "1234", updates: { a: "text"}, entityType: "test_type" }]

      @model.processEntityOperations(db, (results) =>
        assert.equal @response.pendingEntityUpdates.length, 0
        assert.deepEqual upsertDoc, { _id: "1234", a: "text", b: "other" }
        assert.deepEqual upsertBase, base
        expectedResults = { creates: [], updates: [{ entity: upsertDoc, entityType: "test_type" }], error: null }
        assert _.isEqual(results, expectedResults), JSON.stringify(results) + " vs " + JSON.stringify(expectedResults)
        done())

    it "leaves in place if failed to process", (done) ->
      upsert = null
      db = {
        test_type: {
          upsert: (doc, success, error) =>
            error("some error")
        }
      }

      entity = { _id: "1234", a: "text" }
      @response.pendingEntityCreates = [{ entity: entity, entityType: "test_type" }]

      @model.processEntityOperations(db, (results) => 
        assert.equal @response.pendingEntityCreates.length, 1
        assert.deepEqual results, { updates: [], creates: [], error: "some error" }
        done())
