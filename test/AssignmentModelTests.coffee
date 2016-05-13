_ = require 'lodash'
assert = require('chai').assert

AssignmentModel = require('../src/AssignmentModel')

describe 'AssignmentModel', ->
  it "sets roles", () ->
    options = {}
    deployment = {_id: 'deploymentId', admins: ['deploymentAdminId']}
    assignment = {deployment: deployment._id, assignedTo: ['viewer1Id', 'deploymentAdminId']}
    options.assignment = assignment
    options.form = {id: 'formId', roles: [{role: 'admin', id:'formAdminId'}, {role: 'view', id:'formViewId'}], deployments: [deployment]}
    options.user = 'testUserId'
    options.groups = []
    assignmentModel = new AssignmentModel(options)

    expectedRoles = [{role: 'admin', id:'formAdminId'}, {role: 'admin', id:'deploymentAdminId'}, {role: 'view', id: 'viewer1Id'}]

    assert.deepEqual assignment.roles, expectedRoles

