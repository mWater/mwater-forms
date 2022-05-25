// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
import _ from "lodash"
import { assert } from "chai"
import AssignmentModel from "../src/AssignmentModel"

describe("AssignmentModel", () =>
  it("sets roles", function () {
    const options = {}
    const deployment = { _id: "deploymentId", admins: ["deploymentAdminId"] }
    const assignment = { deployment: deployment._id, assignedTo: ["viewer1Id", "deploymentAdminId"] }
    options.assignment = assignment
    options.form = {
      id: "formId",
      roles: [
        { role: "admin", id: "formAdminId" },
        { role: "view", id: "formViewId" }
      ],
      deployments: [deployment]
    }
    options.user = "testUserId"
    options.groups = []
    const assignmentModel = new AssignmentModel(options)
    assignmentModel.fixRoles()

    const expectedRoles = [
      { role: "admin", id: "formAdminId" },
      { role: "admin", id: "deploymentAdminId" },
      { role: "view", id: "viewer1Id" }
    ]

    return assert.deepEqual(assignment.roles, expectedRoles)
  }))
