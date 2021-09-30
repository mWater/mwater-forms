import { Expr } from "mwater-expressions";
import { FormDesign } from "./formDesign";
/** Survey form */
export interface Form {
    _id: string;
    _rev?: number;
    /** _id of the form that this is a duplicate of */
    _basedOn?: string;
    /** List of deployments. */
    deployments: Deployment[];
    /** Current status of the form. Starts in active state */
    state: "active" | "deleted";
    /** Design of the form */
    design: FormDesign;
    /** Current mwater-visualization dashboard */
    dashboard?: any;
    /** Indicator calculations that create indicator values from form responses */
    indicatorCalculations?: IndicatorCalculation[];
    /** Status of query optimization. null (default), "setup" (if table created but not fully populated) or `"ready"` (if fully ready) */
    qopt_status?: null | "setup" | "ready";
    /** True if master form (DEPRECATED) */
    isMaster?: boolean;
    /** If clone form, then _id of master form (DEPRECATED) */
    masterForm?: boolean;
    /** Permissions on the form */
    roles: FormRole[];
    /** Group _id who owns the form */
    ownedBy?: string;
    created: {
        /** ISO8601 datetime */
        on: string;
        /** User _id */
        by: string;
    };
    modified?: {
        /** ISO8601 datetime */
        on: string;
        /** User _id */
        by: string;
    };
    removed?: {
        /** ISO8601 datetime */
        on: string;
        /** User _id */
        by: string;
    };
}
/** Calculates an indicator value for a response of a form */
export interface IndicatorCalculation {
    /** Unique id of calculation */
    _id: string;
    /** Id of indicator */
    indicator: string;
    /** Id of roster if from a roster */
    roster?: string;
    /** Map of indicator property id to mwater-expression expression to create value */
    expressions: {
        [propertyId: string]: Expr;
    }[];
    /** Optional mwater-expression expression to restrict when to create indicator value */
    condition?: Expr;
    /** Optional mwater-expression expression to select datetime of indicator value. Defaults to submittedOn */
    datetimeExpr?: Expr;
    /** List of ids of users and groups who can view created indicator values i.e. user:<username> or group:<groupname> */
    viewers: string[];
}
/** A deployment is a grouping of people who can answer a form and an optional approval chain and viewers. */
export interface Deployment {
    _id: string;
    /** Name of the deployment */
    name: string;
    /** True if deployment is accepting new responses */
    active: boolean;
    /** True if deployment is public (anonymous responses allowed) */
    public?: boolean;
    /** Contact name and email for person responsible for deployment. Used for public deployments */
    contactName?: string;
    /** Contact name and email for person responsible for deployment. Used for public deployments */
    contactEmail?: string;
    /** List of ids of users and groups who can complete form. i.e. user:<username> or group:<groupname> */
    enumerators: string[];
    /** List of ids of users and groups who can view final responses. i.e. user:<username> or group:<groupname> */
    viewers: string[];
    /** List of ids of users and groups who can edit/delete all responses. i.e. user:<username> or group:<groupname> */
    admins: string[];
    /** List of ids of users and groups who can view all indicator calculation. i.e. user:<username> or group:<groupname> */
    indicatorCalculationViewers?: string[];
    /** True if enumerator retains admin role on final responses */
    enumeratorAdminFinal?: boolean;
    /** Optional approval stages that responses must pass through to become final. Each stage
     * has a list of approvers who can approve/reject the response and move it along */
    approvalStages: ApprovalStage[];
}
interface FormRole {
    /** Subject (user:xyz or group:abc or "all") */
    id: string;
    /** view can view only, admin can do anything, deploy cannot edit but can deploy form */
    role: "view" | "admin" | "deploy";
}
/** One stage of approval for a deployment needed */
interface ApprovalStage {
    /** List of ids of users and groups who can approve/reject responses at this step. i.e. user:<username> or group:<groupname> */
    approvers: string[];
    /** If true, prevents approvers from editing/deleting */
    preventEditing?: boolean;
}
export {};
