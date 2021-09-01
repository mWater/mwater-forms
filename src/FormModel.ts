import _ from "lodash"
import { Deployment, Form } from "./form"

// Model of a form object that allows manipulation and asking of questions
export default class FormModel {
  form: Form

  constructor(form: Form) {
    this.form = form
  }

  // Gets all subjects that must be able to see form because of deployments
  getDeploymentSubjects() {
    function getDeploymentSubs(deployment: Deployment) {
      const approvers = _.flatten(_.map(deployment.approvalStages, (stage) => stage.approvers))
      return _.union(approvers, deployment.enumerators, deployment.viewers, deployment.admins)
    }

    // Get all deployment subjects
    const deploySubs = _.uniq(_.flatten(_.map(this.form.deployments || [], getDeploymentSubs)))
    return deploySubs
  }

  // Corrects viewing roles to ensure that appropriate subjects can see form
  correctViewers() {
    // Compute viewers needed who don't have roles
    const needed = _.difference(
      this.getDeploymentSubjects(),
      _.map(this.form.roles, (r) => r.id)
    )
    
    this.form.roles = this.form.roles.concat(
      _.map(needed, (n) => ({
        id: n,
        role: "view"
      }))
    )
  }

  // Checks if the role must remain as a role due to being in a deployment or being only admin
  canDeleteRole(role: any) {
    if (role.role === "admin" && _.where(this.form.roles, { role: "admin" }).length <= 1) {
      return false
    }

    return !_.contains(this.getDeploymentSubjects(), role.id)
  }

  // Checks if the subject must remain as a role due to being only admin
  canChangeRole(role: any) {
    if (role.role === "admin" && _.where(this.form.roles, { role: "admin" }).length <= 1) {
      return false
    }
    return true
  }

  // Check if user is an admin
  amAdmin(user: any, groups: any) {
    let subjects = ["all", "user:" + user]
    subjects = subjects.concat(_.map(groups, (g) => "group:" + g))
    return _.any(this.form.roles, (r) => subjects.includes(r.id) && r.role === "admin")
  }

  // Check if user is admin or deploy
  amDeploy(user: any, groups: any) {
    let subjects = ["all", "user:" + user]
    subjects = subjects.concat(_.map(groups, (g) => "group:" + g))
    return _.any(this.form.roles, (r) => subjects.includes(r.id) && ["admin", "deploy"].includes(r.role))
  }

  // Check if user is admin of a deployment
  amDeploymentAdmin(user: any, groups: any) {
    let subjects = ["all", "user:" + user]
    subjects = subjects.concat(_.map(groups, (g) => "group:" + g))
    return _.any(this.form.deployments || [], (dep) => _.intersection(dep.admins, subjects).length > 0)
  }
}