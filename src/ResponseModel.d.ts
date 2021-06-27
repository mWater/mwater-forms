import { Form, Deployment } from "./form"
import { Response } from "./response"

/** Model of a response object that allows manipulation and asking of questions */
export default class ResponseModel {
  constructor(options: {
    /** response object. Required */
    response: Response

    /** form object. Required */
    form: Form

    /** current user. Required */
    user: string

    /** current username. Required */
    username: string

    /** group names of user */
    groups?: string[]
  })

  /** Setup draft. deploymentId is optional _id of deployment to use for cases where ambiguous */
  draft(deploymentId?: string): void

  /** Switch back to draft mode */
  redraft(): void

  /** Return all active deployments that the user can enumerate */
  listEnumeratorDeployments(): Deployment[]

  /** Save for later. Does no state transitions, but updates any entity references
   * and other housekeeping before saving it */
  saveForLater(): void

  /** Submit (either to final or pending as appropriate) */
  submit(): void

  /** Can submit if in draft/rejected and am enumerator or admin */
  canSubmit(): boolean

  /** Approve response */
  approve(): void

  /** Reject a response with a specific rejection message */
  reject(message: string): void

  /** Record that an edit was done, if not by enumerator */
  recordEdit(): void

  /** Updates entities field. Stores a list of all entity references in the response */
  updateEntities(): void

  /** Fixes roles to reflect status and approved fields */
  fixRoles(): void

  /** Determine if can approve response */
  canApprove(): boolean

  /** Determine if am an approver for the response, as opposed to admin who could still approve */
  amApprover(): boolean

  /** Determine if can delete response */
  canDelete(): boolean

  /** Determine if can edit response */
  canEdit(): boolean

  /** Determine if can switch back to draft phase. Only enumerators can do this and only if pending, rejected, draft or enumerators can edit final */
  canRedraft(): boolean

  /** Determine if can reject response */
  canReject(): boolean
}
