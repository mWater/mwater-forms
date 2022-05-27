// @ts-nocheck
import { assert } from "chai"
import FormModel from "../src/FormModel"

describe("FormModel", function () {
  it("gets deployment subjects", function () {
    const form = {
      roles: [],

      deployments: [
        {
          enumerators: ["a"],
          approvalStages: [{ approvers: ["b", "c", "d"] }],
          viewers: ["d"],
          admins: ["e"]
        },
        {
          enumerators: ["f"],
          approvalStages: [],
          viewers: ["g"],
          admins: ["h"]
        }
      ]
    }
    const model = new FormModel(form)
    return assert.sameMembers(["a", "b", "c", "d", "e", "f", "g", "h"], model.getDeploymentSubjects())
  })

  it("gets corrects viewers", function () {
    const form = {
      roles: [
        { id: "a", role: "admin" },
        { id: "b", role: "view" }
      ],

      deployments: [
        {
          enumerators: ["a"],
          approvalStages: [{ approvers: ["b", "c"] }],
          viewers: ["c"],
          admins: []
        }
      ]
    }
    const model = new FormModel(form)
    model.correctViewers()
    return assert.deepEqual(form.roles, [
      { id: "a", role: "admin" },
      { id: "b", role: "view" },
      { id: "c", role: "view" }
    ])
  })

  it("canDeleteRole prevents deleting admin", function () {
    const form = {
      roles: [
        { id: "a", role: "admin" },
        { id: "b", role: "view" }
      ],

      deployments: []
    }
    const model = new FormModel(form)
    assert(!model.canDeleteRole({ id: "a", role: "admin" }))
    return assert(model.canDeleteRole({ id: "b", role: "view" }))
  })

  it("canDeleteRole allows deleting 2nd admin", function () {
    const form = {
      roles: [
        { id: "a", role: "admin" },
        { id: "b", role: "view" },
        { id: "c", role: "admin" }
      ],

      deployments: []
    }
    const model = new FormModel(form)
    assert(model.canDeleteRole({ id: "a", role: "admin" }))
    return assert(model.canDeleteRole({ id: "b", role: "view" }))
  })

  it("canChangeRole prevents changing only admin", function () {
    const form = {
      roles: [
        { id: "a", role: "admin" },
        { id: "b", role: "view" }
      ],

      deployments: []
    }
    const model = new FormModel(form)
    assert(!model.canChangeRole({ id: "a", role: "admin" }))
    return assert(model.canChangeRole({ id: "b", role: "view" }))
  })

  it("checks admin for user", function () {
    const form = {
      roles: [
        { id: "user:a", role: "admin" },
        { id: "group:b", role: "admin" },
        { id: "group:c", role: "view" }
      ],

      deployments: []
    }
    const model = new FormModel(form)
    assert(model.amAdmin("a", []))
    assert(model.amAdmin("x", "b"))
    return assert(!model.amAdmin("x", "c"))
  })

  return it("determines if deployment admin", function () {
    const form = {
      roles: [],

      deployments: [
        {
          enumerators: ["user:a"],
          approvalStages: [{ approvers: ["user:b"] }],
          viewers: ["user:d"],
          admins: ["user:e"]
        }
      ]
    }
    const model = new FormModel(form)
    assert.isTrue(model.amDeploymentAdmin("e", []))
    return assert.isFalse(model.amDeploymentAdmin("b", []))
  })
})
