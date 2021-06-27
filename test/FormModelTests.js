assert = require("chai").assert
FormModel = require '../src/FormModel'

describe "FormModel", ->
  it "gets deployment subjects", ->
    form = {
      roles: [
      ]

      deployments: [
        {
          enumerators: [ "a" ]
          approvalStages: [
            { approvers: [ "b", "c", "d" ] }
          ]
          viewers: [ "d" ]
          admins: [ "e" ]
        }
        {
          enumerators: [ "f" ]
          approvalStages: []
          viewers: [ "g" ]
          admins: [ "h" ]
        }      ]
    }
    model = new FormModel(form)
    assert.sameMembers(["a", "b", "c", "d", "e", "f", "g", "h"], model.getDeploymentSubjects())

  it "gets corrects viewers", ->
    form = {
      roles: [
        { id: "a", role: "admin" }
        { id: "b", role: "view" }
      ]

      deployments: [
        {
          enumerators: [ "a" ]
          approvalStages: [
            { approvers: [ "b", "c" ] }
          ]
          viewers: [ "c" ]
          admins: [ ]
        }
      ]
    }
    model = new FormModel(form)
    model.correctViewers()
    assert.deepEqual(form.roles, [
        { id: "a", role: "admin" }
        { id: "b", role: "view" }
        { id: "c", role: "view" }
    ])

  it "canDeleteRole prevents deleting admin", ->
    form = {
      roles: [
        { id: "a", role: "admin" }
        { id: "b", role: "view" }
      ]

      deployments: []
    }
    model = new FormModel(form)
    assert !model.canDeleteRole({ id: "a", role: "admin" })
    assert model.canDeleteRole({ id: "b", role: "view" })

  it "canDeleteRole allows deleting 2nd admin", ->
    form = {
      roles: [
        { id: "a", role: "admin" }
        { id: "b", role: "view" }
        { id: "c", role: "admin" }
      ]

      deployments: []
    }
    model = new FormModel(form)
    assert model.canDeleteRole({ id: "a", role: "admin" })
    assert model.canDeleteRole({ id: "b", role: "view" })

  it "canChangeRole prevents changing only admin", ->
    form = {
      roles: [
        { id: "a", role: "admin" }
        { id: "b", role: "view" }
      ]

      deployments: []
    }
    model = new FormModel(form)
    assert !model.canChangeRole({ id: "a", role: "admin" })
    assert model.canChangeRole({ id: "b", role: "view" })

  it "checks admin for user", ->
    form = {
      roles: [
        { id: "user:a", role: "admin" }
        { id: "group:b", role: "admin" }
        { id: "group:c", role: "view" }
      ]

      deployments: []
    }
    model = new FormModel(form)
    assert model.amAdmin("a", [])
    assert model.amAdmin("x", "b")
    assert not model.amAdmin("x", "c")

  it "determines if deployment admin", ->
    form = {
      roles: [
      ]

      deployments: [
        {
          enumerators: ["user:a"]
          approvalStages: [
            { approvers: [ "user:b" ] }
          ]
          viewers: [ "user:d" ]
          admins: [ "user:e" ]
        }
      ]
    }
    model = new FormModel(form)
    assert.isTrue model.amDeploymentAdmin("e", [])
    assert.isFalse model.amDeploymentAdmin("b", [])

