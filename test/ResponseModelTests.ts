// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
import _ from "lodash"
import { assert } from "chai"
import ResponseModel from "../src/ResponseModel"

const sampleForm = {
  _id: "formid",
  _rev: 3,
  design: { contents: [] },
  deployments: [
    {
      _id: "dep1",
      active: true,
      enumerators: ["group:dep1en1"],
      approvalStages: [{ approvers: ["group:dep1ap1"] }],
      viewers: ["group:dep1view1"],
      admins: ["group:dep1admin1"]
    },
    {
      _id: "dep2",
      active: true,
      enumerators: ["group:dep2en1"],
      approvalStages: [{ approvers: ["group:dep2ap1", "user:user"] }],
      viewers: ["group:dep2view1", "user:user"],
      admins: ["group:dep2admin1", "user:user"]
    }
  ],
  roles: [{ id: "user:formadmin", role: "admin" }]
}

describe("ResponseModel", function () {
  describe("draft", function () {
    beforeEach(function () {
      this.response = {}
      this.form = _.cloneDeep(sampleForm)
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user",
        username: "user",
        groups: ["dep2en1"]
      })
      return this.model.draft()
    })

    it("includes basic fields", function () {
      assert(this.response._id, "missing id")
      assert.equal(this.response.form, this.form._id, "missing form")
      assert.equal(this.response.formRev, this.form._rev, "missing rev")
      assert.match(this.response.code, /^user-/, "bad code")
      assert.equal(this.response.user, "user", "wrong user")
      return assert.equal(this.response.status, "draft")
    })

    it("sets startedOn", function () {
      return assert(this.response.startedOn)
    })

    it("selects first matching deployment", function () {
      return assert.equal(this.response.deployment, "dep2")
    })

    it("includes self as admin", function () {
      return assert.equal(_.where(this.response.roles, { id: "user:user", role: "admin" }).length, 1)
    })

    it("includes admins of deployment as admins", function () {
      return assert.equal(_.where(this.response.roles, { id: "group:dep2admin1", role: "admin" }).length, 1)
    })

    it("includes admins of form as admins", function () {
      return assert.equal(_.where(this.response.roles, { id: "user:formadmin", role: "admin" }).length, 1)
    })

    it("include approvers", function () {
      return assert.equal(_.where(this.response.roles, { id: "group:dep2ap1", role: "view" }).length, 1)
    })

    it("does not include deployment viewers", function () {
      return assert.equal(_.where(this.response.roles, { id: "group:dep2view1" }).length, 0)
    })

    return it("creates draft event", function () {
      assert.equal(this.response.events.length, 1)
      assert.equal(this.response.events[0].type, "draft")
      assert.equal(this.response.events[0].by, "user")
      return assert(this.response.events[0].on)
    })
  })

  describe("draft when deployed to all", function () {
    beforeEach(function () {
      this.response = {}
      this.form = _.cloneDeep(sampleForm)
      this.form.deployments[0].enumerators.push("all")
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "unknownUser",
        username: "unknownUser",
        groups: []
      })
      return this.model.draft()
    })

    return it("selects first matching deployment", function () {
      return assert.equal(this.response.deployment, "dep1")
    })
  })

  describe("submit when no approval stages", function () {
    beforeEach(function () {
      this.response = {}
      this.form = _.cloneDeep(sampleForm)
      this.form.deployments[1].approvalStages = []
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep2en1"]
      })
      this.model.draft()
      return this.model.submit()
    })

    it("makes response final", function () {
      return assert.equal(this.response.status, "final")
    })

    it("sets submittedOn", function () {
      return assert(this.response.submittedOn)
    })

    it("leaves self as viewer", function () {
      return assert.equal(_.where(this.response.roles, { id: "user:user2", role: "view" }).length, 1)
    })

    it("includes admins of deployment as admins", function () {
      return assert.equal(_.where(this.response.roles, { id: "group:dep2admin1", role: "admin" }).length, 1)
    })

    it("includes admins of form as admins", function () {
      return assert.equal(_.where(this.response.roles, { id: "user:formadmin", role: "admin" }).length, 1)
    })

    it("includes viewers of deployment as viewers", function () {
      return assert.equal(_.where(this.response.roles, { id: "group:dep2view1" }).length, 1)
    })

    it("creates submit event", function () {
      assert.equal(this.response.events.length, 2)
      assert.equal(this.response.events[1].type, "submit")
      assert.equal(this.response.events[1].by, "user2")
      return assert(this.response.events[1].on)
    })

    it("removes enumerator as viewer if deployment inactive", function () {
      assert.isTrue(
        _.any(this.response.roles, (r) => r.id === "user:user2"),
        "Can see as enumerator"
      )

      this.form.deployments[1].active = false
      this.model.fixRoles()

      return assert.isFalse(
        _.any(this.response.roles, (r) => r.id === "user:user2"),
        "Enumerator removed"
      )
    })

    return it("removes everyone as viewer if form deleted", function () {
      assert.isTrue(
        _.any(this.response.roles, (r) => r.id === "user:user2"),
        "Can see as enumerator"
      )

      this.form.state = "deleted"
      this.model.fixRoles()

      return assert.deepEqual(this.response.roles, [], "No one can see deleted")
    })
  })

  describe("submit when no approval stages with enumeratorAdminFinal", function () {
    beforeEach(function () {
      this.response = {}
      this.form = _.cloneDeep(sampleForm)
      this.form.deployments[1].approvalStages = []
      this.form.deployments[1].enumeratorAdminFinal = true
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep2en1"]
      })
      this.model.draft()
      return this.model.submit()
    })

    return it("leaves self as admin", function () {
      return assert.equal(_.where(this.response.roles, { id: "user:user2", role: "admin" }).length, 1)
    })
  })

  describe("submit when approval stages", function () {
    beforeEach(function () {
      this.response = {}
      this.form = _.cloneDeep(sampleForm)
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep2en1"]
      })
      this.model.draft()
      return this.model.submit()
    })

    it("makes response pending", function () {
      return assert.equal(this.response.status, "pending")
    })

    it("sets submittedOn", function () {
      return assert(this.response.submittedOn)
    })

    it("sets approvals", function () {
      return assert.deepEqual(this.response.approvals, [])
    })

    it("leaves self as admin", function () {
      return assert.equal(_.where(this.response.roles, { id: "user:user2", role: "admin" }).length, 1)
    })

    it("includes approvers of first stage as admins", function () {
      return assert.equal(_.where(this.response.roles, { id: "group:dep2ap1", role: "admin" }).length, 1)
    })

    it("includes admins of deployment as admins", function () {
      return assert.equal(_.where(this.response.roles, { id: "group:dep2admin1", role: "admin" }).length, 1)
    })

    it("includes admins of form as admins", function () {
      return assert.equal(_.where(this.response.roles, { id: "user:formadmin", role: "admin" }).length, 1)
    })

    it("does not include deployment viewers", function () {
      return assert.equal(_.where(this.response.roles, { id: "group:dep2view1" }).length, 0)
    })

    it("makes response final if approval stage deleted", function () {
      this.form.deployments[1].approvalStages = []
      this.model.fixRoles()
      return assert.equal(this.response.status, "final")
    })

    it("makes does not make draft response final if approval stage deleted", function () {
      this.response.status = "draft"
      this.form.deployments[1].approvalStages = []
      this.model.fixRoles()
      return assert.equal(this.response.status, "draft")
    })

    return it("creates submit event", function () {
      assert.equal(this.response.events.length, 2)
      assert.equal(this.response.events[1].type, "submit")
      assert.equal(this.response.events[1].by, "user2")
      return assert(this.response.events[1].on)
    })
  })

  describe("approval when last stage", function () {
    beforeEach(function () {
      this.response = {}
      this.form = _.cloneDeep(sampleForm)
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep2en1"]
      })
      this.model.draft()
      this.model.submit()
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user",
        username: "user",
        groups: ["dep2en1"]
      })
      return this.model.approve()
    })

    it("sets approvals", function () {
      return assert.deepEqual(_.pluck(this.response.approvals, "by"), ["user"])
    })

    it("makes response final", function () {
      return assert.equal(this.response.status, "final")
    })

    it("leaves self as viewer", function () {
      return assert.equal(_.where(this.response.roles, { id: "user:user2", role: "view" }).length, 1)
    })

    it("includes admins of deployment as admins", function () {
      return assert.equal(_.where(this.response.roles, { id: "group:dep2admin1", role: "admin" }).length, 1)
    })

    it("includes admins of form as admins", function () {
      return assert.equal(_.where(this.response.roles, { id: "user:formadmin", role: "admin" }).length, 1)
    })

    it("includes viewers of deployment as viewers", function () {
      return assert.equal(_.where(this.response.roles, { id: "group:dep2view1" }).length, 1)
    })

    return it("creates approve event", function () {
      assert.equal(this.response.events.length, 3)
      assert.equal(this.response.events[2].type, "approve")
      assert.equal(this.response.events[2].by, "user")
      assert(this.response.events[2].on)
      return assert(!this.response.events[2].override)
    })
  })

  describe("approval overrides", function () {
    beforeEach(function () {
      this.response = {}
      this.form = _.cloneDeep(sampleForm)
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user",
        username: "user",
        groups: ["dep2en1"]
      })
      this.model.draft()
      return this.model.submit()
    })

    it("sets override to false if done by approver", function () {
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user",
        username: "user",
        groups: ["dep2ap1"]
      })
      this.model.approve()
      return assert(!this.response.approvals[0].override)
    })

    it("sets override to true if done by deployment admin", function () {
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep2admin1"]
      })
      this.model.approve()
      return assert.isTrue(this.response.approvals[0].override)
    })

    it("sets override to true if done by form admin", function () {
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "formadmin",
        username: "formadmin",
        groups: []
      })
      this.model.approve()
      return assert.isTrue(this.response.approvals[0].override)
    })

    return it("creates approve event with override", function () {
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "formadmin",
        username: "formadmin",
        groups: []
      })
      this.model.approve()

      assert.equal(this.response.events.length, 3)
      assert.equal(this.response.events[2].type, "approve")
      assert.equal(this.response.events[2].by, "formadmin")
      assert.isTrue(this.response.events[2].override)
      return assert(this.response.events[1].on)
    })
  })

  describe("approval when not last stage", function () {
    beforeEach(function () {
      this.response = {}
      this.form = _.cloneDeep(sampleForm)

      // Add extra stage
      this.form.deployments[1].approvalStages.push({ approvers: ["group:dep2ap2"] })

      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user",
        username: "user",
        groups: ["dep2en1"]
      })
      this.model.draft()
      this.model.submit()
      return this.model.approve()
    })

    it("leaves response pending", function () {
      return assert.equal(this.response.status, "pending")
    })

    it("sets approvals", function () {
      return assert.deepEqual(_.pluck(this.response.approvals, "by"), ["user"])
    })

    it("leaves self as admin", function () {
      return assert.equal(_.where(this.response.roles, { id: "user:user", role: "admin" }).length, 1)
    })

    it("includes approvers of second stage as admins", function () {
      return assert.equal(_.where(this.response.roles, { id: "group:dep2ap2", role: "admin" }).length, 1)
    })

    it("includes approvers of first stage as viewers", function () {
      return assert.equal(_.where(this.response.roles, { id: "group:dep2ap1", role: "view" }).length, 1)
    })

    it("includes admins of deployment as admins", function () {
      return assert.equal(_.where(this.response.roles, { id: "group:dep2admin1", role: "admin" }).length, 1)
    })

    it("includes admins of form as admins", function () {
      return assert.equal(_.where(this.response.roles, { id: "user:formadmin", role: "admin" }).length, 1)
    })

    it("does not include deployment viewers", function () {
      return assert.equal(_.where(this.response.roles, { id: "group:dep2view1" }).length, 0)
    })

    return it("creates approve event", function () {
      assert.equal(this.response.events.length, 3)
      assert.equal(this.response.events[2].type, "approve")
      assert.equal(this.response.events[2].by, "user")
      assert(this.response.events[2].on)
      return assert(!this.response.events[2].override)
    })
  })

  describe("redraft", function () {
    beforeEach(function () {
      this.response = {}
      this.form = _.cloneDeep(sampleForm)

      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user",
        username: "user",
        groups: ["dep2en1"]
      })

      this.model.draft()
      this.origId = this.response._id
      this.model.submit()
      return this.model.redraft()
    })

    it("does not overwrite id", function () {
      return assert.equal(this.response._id, this.origId)
    })

    it("creates draft event", function () {
      assert.equal(this.response.events.length, 3)
      assert.equal(this.response.events[2].type, "draft")
      assert.equal(this.response.events[2].by, "user")
      return assert(this.response.events[2].on)
    })

    return it("does not create repeated draft event if already in draft", function () {
      this.model.redraft()
      return assert.equal(this.response.events.length, 3)
    })
  })

  describe("reject", function () {
    beforeEach(function () {
      this.response = {}
      this.form = _.cloneDeep(sampleForm)

      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user",
        username: "user",
        groups: ["dep2en1"]
      })

      this.model.draft()
      this.model.submit()
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep2ap1"]
      })
      return this.model.reject("message")
    })

    it("sets status rejected", function () {
      return assert.equal(this.response.status, "rejected")
    })

    it("removes approvalStage", function () {
      return assert.isUndefined(this.response.approvalStage)
    })

    it("sets rejection message", function () {
      return assert.equal(this.response.rejectionMessage, "message")
    })

    it("includes self as admin", function () {
      return assert.equal(_.where(this.response.roles, { id: "user:user", role: "admin" }).length, 1)
    })

    it("includes admins of deployment as admins", function () {
      return assert.equal(_.where(this.response.roles, { id: "group:dep2admin1", role: "admin" }).length, 1)
    })

    it("includes admins of form as admins", function () {
      return assert.equal(_.where(this.response.roles, { id: "user:formadmin", role: "admin" }).length, 1)
    })

    it("includes approvers as viewers", function () {
      return assert.equal(_.where(this.response.roles, { id: "group:dep2ap1", role: "view" }).length, 1)
    })

    it("does not include deployment viewers", function () {
      return assert.equal(_.where(this.response.roles, { id: "group:dep2view1" }).length, 0)
    })

    return it("creates reject event", function () {
      assert.equal(this.response.events.length, 3)
      assert.equal(this.response.events[2].type, "reject")
      assert.equal(this.response.events[2].by, "user2")
      assert(this.response.events[2].on)
      assert(!this.response.events[2].override)
      return assert.equal(this.response.events[2].message, "message")
    })
  })

  describe("recordEdit", function () {
    it("does not record if done by enumerator", function () {
      const response = {}
      const form = _.cloneDeep(sampleForm)
      const model = new ResponseModel({ response, form, user: "user", username: "user", groups: ["dep2en1"] })
      model.draft()

      model.recordEdit()
      return assert.equal(response.events.length, 1)
    })

    return it("does record if done by other than enumerator", function () {
      const response = {}
      const form = _.cloneDeep(sampleForm)
      let model = new ResponseModel({ response, form, user: "user", username: "user", groups: ["dep2en1"] })
      model.draft()

      model = new ResponseModel({ response, form: this.form, user: "user2", username: "user2", groups: ["dep2admin1"] })
      model.recordEdit()
      assert.equal(response.events.length, 2)
      assert.equal(response.events[1].type, "edit")
      return assert.equal(response.events[1].by, "user2")
    })
  })

  describe("canSubmit", function () {
    beforeEach(function () {
      this.response = {}
      this.form = _.cloneDeep(sampleForm)

      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user",
        username: "user",
        groups: ["dep1en1"]
      })
      return this.model.draft()
    })

    it("enumerator can submit", function () {
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user",
        username: "user",
        groups: ["dep1en1"]
      })
      return assert(this.model.canSubmit())
    })

    it("admin can submit from draft", function () {
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep1admin1"]
      })
      return assert(this.model.canSubmit())
    })

    return it("admin cannot submit from pending", function () {
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep1admin1"]
      })
      this.model.submit()
      return assert(!this.model.canSubmit())
    })
  })

  describe("canRedraft", function () {
    beforeEach(function () {
      this.response = {}
      this.form = _.cloneDeep(sampleForm)

      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user",
        username: "user",
        groups: ["dep1en1"]
      })
      return this.model.draft()
    })

    it("enumerator can redraft final if enumeratorAdminFinal=true", function () {
      // Setup
      this.form.deployments[0].enumeratorAdminFinal = true
      this.model.submit()
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep1ap1"]
      })
      this.model.approve()

      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user",
        username: "user",
        groups: ["dep1en1"]
      })
      return assert(this.model.canRedraft())
    })

    it("enumerator cannot redraft final if enumeratorAdminFinal=false", function () {
      this.model.submit()
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep1ap1"]
      })
      this.model.approve()
      return assert(!this.model.canRedraft())
    })

    it("admin cannot redraft (only can edit)", function () {
      this.model.submit()
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep1admin1"]
      })
      this.model.approve()
      return assert.isFalse(this.model.canRedraft())
    })

    return it("approvers cannot redraft (only can edit)", function () {
      this.model.submit()
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep1ap1"]
      })
      return assert.isFalse(this.model.canRedraft())
    })
  })

  describe("canReject", function () {
    beforeEach(function () {
      this.response = {}
      this.form = _.cloneDeep(sampleForm)

      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user",
        username: "user",
        groups: ["dep1en1"]
      })
      return this.model.draft()
    })

    it("cannot reject drafts", function () {
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep1ap1"]
      })
      return assert(!this.model.canReject())
    })

    it("approver cannot reject final", function () {
      this.model.submit()
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep1ap1"]
      })
      this.model.approve()
      return assert(!this.model.canReject())
    })

    it("admin can reject final", function () {
      this.model.submit()
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep1ap1"]
      })
      this.model.approve()
      this.model = new ResponseModel({ response: this.response, form: this.form, user: "formadmin", groups: [] })
      return assert(this.model.canReject())
    })

    it("enumerator cannot reject final", function () {
      this.model.submit()
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep1ap1"]
      })
      this.model.approve()
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user",
        username: "user",
        groups: ["dep2en1"]
      })
      return assert(!this.model.canReject())
    })

    it("can reject if approver", function () {
      this.model.submit()
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep1ap1"]
      })
      return assert(this.model.canReject())
    })

    it("can reject if deployment admin", function () {
      this.model.submit()
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep1admin1"]
      })
      return assert(this.model.canReject())
    })

    return it("can reject if form admin", function () {
      this.model.submit()
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "formadmin",
        username: "formadmin",
        groups: []
      })
      return assert(this.model.canReject())
    })
  })

  describe("canDelete", function () {
    beforeEach(function () {
      this.response = {}
      this.form = _.cloneDeep(sampleForm)

      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user",
        username: "user",
        groups: ["dep1en1"]
      })
      return this.model.draft()
    })

    it("can delete if enumerator and in draft", function () {
      return assert(this.model.canDelete())
    })

    it("cannot delete pending if enumerator", function () {
      this.model.submit()
      return assert.isFalse(this.model.canDelete())
    })

    it("can delete rejected if enumerator", function () {
      this.model.submit()
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep1ap1"]
      })
      this.model.reject("bad")
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user",
        username: "user",
        groups: ["dep2en1"]
      })
      return assert(this.model.canDelete())
    })

    it("cannot delete final if enumerator", function () {
      this.model.submit()
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep1ap1"]
      })
      this.model.approve()
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user",
        username: "user",
        groups: ["dep2en1"]
      })
      return assert(!this.model.canDelete())
    })

    it("can delete final if enumerator and enumeratorAdminFinal", function () {
      this.model.submit()
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep1ap1"]
      })
      this.model.approve()
      this.form.deployments[0].enumeratorAdminFinal = true
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user",
        username: "user",
        groups: ["dep2en1"]
      })
      return assert(this.model.canDelete())
    })

    it("can delete pending if approver with preventEditing=false or null", function () {
      this.model.submit()
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep1ap1"]
      })
      return assert(this.model.canDelete())
    })

    it("cannot delete pending if approver with preventEditing=true", function () {
      this.model.submit()
      this.form.deployments[0].approvalStages[0].preventEditing = true
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep1ap1"]
      })
      return assert(!this.model.canDelete())
    })

    it("cannot delete final if approver", function () {
      this.model.submit()
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep1ap1"]
      })
      this.model.approve()
      return assert(!this.model.canDelete())
    })

    return it("can delete final if admin", function () {
      this.model.submit()
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep1ap1"]
      })
      this.model.approve()
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep1admin1"]
      })
      return assert(this.model.canDelete())
    })
  })

  describe("canEdit", function () {
    beforeEach(function () {
      this.response = {}
      this.form = _.cloneDeep(sampleForm)

      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user",
        username: "user",
        groups: ["dep1en1"]
      })
      return this.model.draft()
    })

    it("can edit if enumerator and in draft", function () {
      return assert(this.model.canEdit())
    })

    it("cannot edit pending if enumerator", function () {
      this.model.submit()
      return assert(!this.model.canEdit())
    })

    it("can edit rejected if enumerator", function () {
      this.model.submit()
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep1ap1"]
      })
      this.model.reject("bad")
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user",
        username: "user",
        groups: ["dep2en1"]
      })
      return assert(this.model.canEdit())
    })

    it("cannot edit final if enumerator", function () {
      this.model.submit()
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep1ap1"]
      })
      this.model.approve()
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user",
        username: "user",
        groups: ["dep2en1"]
      })
      return assert(!this.model.canEdit())
    })

    it("can edit final if enumerator and even if enumeratorAdminFinal", function () {
      this.model.submit()
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep1ap1"]
      })
      this.model.approve()
      this.form.deployments[0].enumeratorAdminFinal = true
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user",
        username: "user",
        groups: ["dep2en1"]
      })
      return assert(!this.model.canEdit())
    })

    it("can edit pending if approver with preventEditing=false or null", function () {
      this.model.submit()
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep1ap1"]
      })
      return assert(this.model.canEdit())
    })

    it("cannot edit pending if approver with preventEditing=true", function () {
      this.model.submit()
      this.form.deployments[0].approvalStages[0].preventEditing = true
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep1ap1"]
      })
      return assert(!this.model.canEdit())
    })

    it("cannot edit final if approver", function () {
      this.model.submit()
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep1ap1"]
      })
      this.model.approve()
      return assert(!this.model.canEdit())
    })

    return it("can edit final if admin", function () {
      this.model.submit()
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep1ap1"]
      })
      this.model.approve()
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep1admin1"]
      })
      return assert(this.model.canEdit())
    })
  })

  describe("canApprove", function () {
    beforeEach(function () {
      this.response = {}
      this.form = _.cloneDeep(sampleForm)

      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user",
        username: "user",
        groups: ["dep1en1"]
      })
      return this.model.draft()
    })

    it("cannot approve drafts", function () {
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep1ap1"]
      })
      return assert(!this.model.canApprove())
    })

    it("cannot approve final", function () {
      this.model.submit()
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep1ap1"]
      })
      this.model.approve()
      return assert(!this.model.canApprove())
    })

    it("cannot approve if enumerator", function () {
      return assert(!this.model.canApprove())
    })

    it("can approve if approver", function () {
      this.model.submit()
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep1ap1"]
      })
      return assert(this.model.canApprove())
    })

    it("can approve if deployment admin", function () {
      this.model.submit()
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep1admin1"]
      })
      return assert(this.model.canApprove())
    })

    return it("can approve if form admin", function () {
      this.model.submit()
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "formadmin",
        username: "formadmin",
        groups: []
      })
      return assert(this.model.canApprove())
    })
  })

  describe("amApprover", function () {
    beforeEach(function () {
      this.response = {}
      this.form = _.cloneDeep(sampleForm)

      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user",
        username: "user",
        groups: ["dep1en1"]
      })
      return this.model.draft()
    })

    it("am approver if approver", function () {
      this.model.submit()
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep1ap1"]
      })
      return assert(this.model.amApprover())
    })

    it("am not approver if deployment admin", function () {
      this.model.submit()
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep1admin1"]
      })
      return assert.isFalse(this.model.amApprover())
    })

    return it("am not approver if form admin", function () {
      this.model.submit()
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "formadmin",
        username: "formadmin",
        groups: []
      })
      return assert.isFalse(this.model.amApprover())
    })
  })

  describe("inactive deployments", function () {
    it("skips over inactive deployments", function () {
      this.response = {}
      // Add to both but set first inactive
      this.form = _.cloneDeep(sampleForm)

      this.form.deployments[1].enumerators.push("group:dep1en1")
      this.form.deployments[0].active = false

      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user",
        username: "user",
        groups: ["dep2en1"]
      })
      this.model.draft()
      return assert.equal(this.response.deployment, "dep2")
    })

    return it("requires active deployment", function () {
      this.response = {}
      this.form = _.cloneDeep(sampleForm)
      this.form.deployments[0].active = false
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user",
        username: "user",
        groups: ["dep2en1"]
      })
      return assert.throws(function (this: any) {
        return this.model.draft()
      })
    })
  })

  describe("entities field", function () {
    beforeEach(function () {
      // Create form with entity question
      this.response = {}
      this.form = _.cloneDeep(sampleForm)
      return (this.form.design = {
        contents: [
          {
            _id: "q1",
            _type: "EntityQuestion",
            text: { _base: "en", en: "English" },
            entityType: "type1"
          },
          {
            _id: "q2",
            _type: "SiteQuestion",
            text: { _base: "en", en: "English" },
            siteTypes: ["community"]
          }
        ]
      })
    })

    it("sets entities", function () {
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep2en1"]
      })
      this.model.draft()

      // Set entity question value
      this.response.data = { q1: { value: "entityid123" } }
      this.model.submit()

      // Check that entities was filled out
      return assert.deepEqual(
        this.response.entities,
        [{ question: "q1", entityType: "type1", property: "_id", value: "entityid123" }],
        JSON.stringify(this.response.entities)
      )
    })

    it("sets sites", function () {
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep2en1"]
      })
      this.model.draft()

      // Set entity question value
      this.response.data = { q2: { value: { code: "10007" } } }
      this.model.submit()

      // Check that entities was filled out
      return assert.deepEqual(
        this.response.entities,
        [{ question: "q2", entityType: "community", property: "code", value: "10007" }],
        JSON.stringify(this.response.entities)
      )
    })

    return it("resets entities", function () {
      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user2",
        username: "user2",
        groups: ["dep2en1"]
      })
      this.model.draft()

      // Set entity question value
      this.response.data = { q1: { value: "entityid123" } }
      this.model.submit()

      // Reset
      this.model.redraft()
      this.response.data = { q1: { value: "" } }
      this.model.submit()

      // Check that entities was not filled out
      return assert.deepEqual(this.response.entities, [])
    })
  })

  return describe("deleted deployments", () =>
    it("does not crash on non existing deployment", function () {
      this.response = {}
      this.form = _.cloneDeep(sampleForm)

      this.model = new ResponseModel({
        response: this.response,
        form: this.form,
        user: "user",
        username: "user",
        groups: ["dep1en1"]
      })
      this.model.draft()

      this.form.deployments = []
      this.model.fixRoles()

      return assert.deepEqual(this.response.roles, [
        { id: "user:formadmin", role: "admin" },
        { id: "user:user", role: "admin" }
      ])
    }))
})
