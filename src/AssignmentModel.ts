import _ from "lodash"
import { Form } from "./form"

// Model of an assignment object that allows manipulation
// Options are:
// assignment: assignment object. Required
// form: form object. Required
// user: current user id. Required
// groups: group ids of user
export default class AssignmentModel {
  assignment: any
  form: Form
  user: string
  groups: string[]
  
  constructor(options: {
    assignment: any
    form: Form
    user: string
    groups: string[]
  }) {
    this.assignment = options.assignment
    this.form = options.form
    this.user = options.user
    this.groups = options.groups || []
  }

  // Fixes roles to reflect status and approved fields
  fixRoles() {
    // Determine deployment
    const deployment = _.findWhere(this.form.deployments, { _id: this.assignment.deployment })
    if (!deployment) {
      throw new Error(`No matching deployments for ${this.form._id} user ${this.user}`)
    }

    let admins: any = []
    let viewers = this.assignment.assignedTo

    // Add form admins always
    admins = _.union(admins, _.pluck(_.where(this.form.roles, { role: "admin" }), "id"))

    // Add deployment admins
    admins = _.union(admins, deployment.admins)

    // If already admin, don't include in viewers
    viewers = _.difference(viewers, admins)

    this.assignment.roles = _.map(admins, (s) => ({
      id: s,
      role: "admin"
    }))
    this.assignment.roles = this.assignment.roles.concat(
      _.map(viewers, (s) => ({
        id: s,
        role: "view"
      }))
    )
  }

  canManage() {
    const admins = _.pluck(_.where(this.assignment.roles as any[], { role: "admin" }), "id")

    let subjects = ["user:" + this.user, "all"]
    subjects = subjects.concat(_.map(this.groups, (g) => "group:" + g))

    return _.intersection(admins, subjects).length > 0
  }

  canView() {
    if (this.canManage()) {
      return true
    }

    const admins = _.pluck(_.where(this.assignment.roles as any[], { role: "view" }), "id")

    let subjects = ["user:" + this.user, "all"]
    subjects = subjects.concat(_.map(this.groups, (g) => "group:" + g))

    return _.intersection(admins, subjects).length > 0
  }
}
