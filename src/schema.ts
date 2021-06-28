// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
DEPRECATED!! Use the typescript definition files!

*/

import designSchema from './designSchema'

// A deployment is a grouping of people who can answer a form and an optional approval chain and viewers.
const deployments = {
  type: "array",
  items: {
    type: "object",
    properties: {
      _id: { type: "string" },

      // Name of the deployment
      name: { type: "string" },

      // True if deployment is accepting new responses
      active: { type: "boolean" },

      // True if deployment is public (anonymous responses allowed)
      public: { type: "boolean" },

      // Contact name and email for person responsible for deployment. Used for public deployments
      contactName: { type: "string" },
      contactEmail: { type: "string" },

      // List of ids of users and groups who can complete form. i.e. user:<username> or group:<groupname>
      enumerators: { type: "array", items: { type: "string" } },

      // List of ids of users and groups who can view final responses. i.e. user:<username> or group:<groupname>
      viewers: { type: "array", items: { type: "string" } },

      // List of ids of users and groups who can edit/delete all responses. i.e. user:<username> or group:<groupname>
      admins: { type: "array", items: { type: "string" } },

      // List of ids of users and groups who can view all indicator calculation. i.e. user:<username> or group:<groupname>
      indicatorCalculationViewers: { type: "array", items: { type: "string" } },

      // True if enumerator retains admin role on final responses
      enumeratorAdminFinal: { type: "boolean" },

      // Optional approval stages that responses must pass through to become final. Each stage
      // has a list of approvers who can approve/reject the response and move it along
      approvalStages: {
        type: "array",
        items: {
          type: "object",
          properties: {
            // List of ids of users and groups who can approve/reject responses at this step. i.e. user:<username> or group:<groupname>
            approvers: { type: "array", items: { type: "string" } },

            // If true, prevents approvers from editing/deleting
            preventEditing: { type: "boolean" }
          },
          required: ["approvers"],
          additionalProperties: false
        }
      },

      // DEPRECATED: Settings for entity creation performed by this form. Deployment specific.
      entityCreationSettings: {
        type: "array",
        items: {
          type: "object",
          properties: {
            questionId: { type: "string" }, // _id of EntityQuestion that creates the entity

            conditions: { type: "array" }, // Optional conditions that determine if these settings will be applied. See design schema for forms for definition

            enumeratorRole: { enum: ["limited", "view", "edit", "admin"] }, // Role, if any, that enumerator gets

            createdFor: { type: "string" }, // Group that entity is created for

            otherRoles: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  to: { type: "string" },
                  role: { enum: ["limited", "view", "edit", "admin"] }
                },
                required: ["to", "role"],
                additionalProperties: false
              }
            }
          },
          required: ["questionId"],
          additionalProperties: false
        }
      }
    },

    required: ["_id", "name", "enumerators", "approvalStages", "viewers", "admins"],
    additionalProperties: false
  }
}

const createdModifiedSchema = {
  type: "object",
  properties: {
    by: { type: "string" },
    on: { type: "string", format: "date-time" }
  },
  required: ["by", "on"],
  additionalProperties: false
}

const rolesSchema = {
  type: "array",
  minItems: 0, // Can be zero in the case of deleted responses
  items: {
    type: "object",
    properties: {
      id: { type: "string" },
      role: { enum: ["view", "admin", "deploy"] }
    },
    required: ["id", "role"],
    additionalProperties: false
  }
}

// Form document which describes both the design of a form and who can edit it, etc
export let title = "form"

export let type = "object"

export let properties = {
  _id: { type: "string" },
  _rev: { type: "integer" },

  // _id of the form that this is a duplicate of
  _basedOn: { type: "string" },

  // List of deployments. See above
  deployments,

  // Current status of the form. Starts in active state
  state: { enum: ["active", "deleted"] },

  // See mwater-forms for the schema
  design: designSchema,

  // Current mwater-visualization dashboard
  dashboard: { type: "object" },

  // Indicator calculations that create indicator values from form responses
  indicatorCalculations: {
    type: "array",
    items: {
      type: "object",
      properties: {
        _id: { type: "string" }, // Unique id of calculation
        indicator: { type: "string" }, // Id of indicator

        roster: { type: "string" }, // Id of roster if from a roster

        expressions: { type: "object" }, // Map of indicator property id to mwater-expression expression to create value
        condition: { type: ["object", "null"] }, // Optional mwater-expression expression to restrict when to create indicator value
        datetimeExpr: { type: ["object", "null"] }, // Optional mwater-expression expression to select datetime of indicator value. Defaults to submittedOn

        // List of ids of users and groups who can view created indicator values i.e. user:<username> or group:<groupname>
        viewers: { type: "array", items: { type: "string" } }
      },
      required: ["_id", "indicator", "viewers"],
      additionalProperties: false
    }
  },

  // True if master form (DEPRECATED)
  isMaster: { type: "boolean" },

  // If clone form, then _id of master form (DEPRECATED)
  masterForm: { type: "string" },

  roles: rolesSchema,
  created: createdModifiedSchema,
  modified: createdModifiedSchema,
  removed: createdModifiedSchema
}

export let required = ["_id", "_rev", "state", "design", "roles", "created", "modified"]
export let additionalProperties = false
