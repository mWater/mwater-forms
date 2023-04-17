import _ from "lodash"
import { Deployment, Form } from "./form"

/** Model of a form object that allows manipulation and asking of questions */
export default class FormModel {
  form: Form

  constructor(form: Form) {
    this.form = form
  }

  // Gets all subjects that must be able to see form because of deployments
  getDeploymentSubjects() {
    function getDeploymentSubs(deployment: Deployment) {
      const approvers = _.flatten(_.map(deployment.approvalStages, (stage) => stage.approvers))
      return _.union(approvers, deployment.enumerators, deployment.viewers, deployment.admins, deployment.superadmins || [])
    }

    // Get all deployment subjects
    const deploySubs = _.uniq(_.flatten(_.map(this.form.deployments, getDeploymentSubs)))
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

  /** Check if user is admin of entire form */
  amAdmin(user: string, groups: string[]) {
    let subjects = ["all", "user:" + user]
    subjects = subjects.concat(_.map(groups, (g) => "group:" + g))
    return user == "admin" || _.any(this.form.roles, (r) => subjects.includes(r.id) && r.role === "admin")
  }

  /** Check if user is admin or deploy of entire form */
  amDeploy(user: string, groups: string[]) {
    let subjects = ["all", "user:" + user]
    subjects = subjects.concat(_.map(groups, (g) => "group:" + g))
    return user == "admin" || _.any(this.form.roles, (r) => subjects.includes(r.id) && ["admin", "deploy"].includes(r.role))
  }

  /** Check if user is admin or superadmin of at least one deployment */
  amDeploymentAdmin(user: string, groups: string[]) {
    let subjects = ["all", "user:" + user]
    subjects = subjects.concat(_.map(groups, (g) => "group:" + g))
    return user == "admin" || _.any(this.form.deployments, (dep) => _.intersection(_.union(dep.admins, dep.superadmins || []), subjects).length > 0)
  }

  /** Check if user is superadmin of at least one deployment */
  amDeploymentSuperadmin(user: string, groups: string[]) {
    let subjects = ["all", "user:" + user]
    subjects = subjects.concat(_.map(groups, (g) => "group:" + g))
    return user == "admin" || _.any(this.form.deployments, (dep) => _.intersection(_.union(dep.superadmins || []), subjects).length > 0)
  }

  /** Check if user can edit deployment */
  canEditDeployment(deployment: Deployment, user: string, groups: string[]) {
    if (this.amDeploy(user, groups)) {
      return true
    }
    
    let subjects = ["all", "user:" + user]
    subjects = subjects.concat(_.map(groups, (g) => "group:" + g))
    return _.intersection(deployment.superadmins || [], subjects).length > 0
  }
}
