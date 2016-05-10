# A deployment is a grouping of people who can answer a form and an optional approval chain and viewers.
deployments = { 
  type: "array" 
  items: { 
    type: "object"
    properties: {
      _id: { type: "string" }

      # Name of the deployment
      name: { type: "string" }

      # True if deployment is accepting new responses
      active: { type: "boolean" }

      # List of ids of users and groups who can complete form. i.e. user:<username> or group:<groupname>
      enumerators: { type: "array", items: { type: "string" } }

      # List of ids of users and groups who can view final responses. i.e. user:<username> or group:<groupname>
      viewers: { type: "array", items: { type: "string" } } 

      # List of ids of users and groups who can edit/delete all responses. i.e. user:<username> or group:<groupname>
      admins: { type: "array", items: { type: "string" } }

      # True if enumerator retains admin role on final responses
      enumeratorAdminFinal: { type: "boolean" }

      # Optional approval stages that responses must pass through to become final. Each stage
      # has a list of approvers who can approve/reject the response and move it along
      approvalStages: {
        type: "array"
        items: {
          type: "object"
          properties: {
            # List of ids of users and groups who can approve/reject responses at this step. i.e. user:<username> or group:<groupname>
            "approvers": { type: "array", items: { type: "string" } }
          }
          required: ['approvers']
          additionalProperties: false
        }
      }

      # Settings for entity creation performed by this form. Deployment specific.
      entityCreationSettings: {
        type: "array"
        items: {
          type: "object"
          properties: {
            questionId: { type: "string" } # _id of EntityQuestion that creates the entity
            
            conditions: { type: "array" } # Optional conditions that determine if these settings will be applied. See design schema for forms for definition

            enumeratorRole: { enum: ["limited", "view", "edit", "admin"] } # Role, if any, that enumerator gets

            createdFor: { type: "string" } # Group that entity is created for

            otherRoles: {
              type: "array"
              items: { 
                type: "object"
                properties: {
                  to: { type: "string" }
                  role: { enum: ["limited", "view", "edit", "admin"] }
                }
                required: ["to", "role"]
                additionalProperties: false
              }
            }
          }
          required: ['questionId']
          additionalProperties: false
        }
      }
    }

    required: ["_id", "name", "enumerators", "approvalStages", "viewers", "admins"]
    additionalProperties: false
  }
} 

createdModifiedSchema = {
  type: "object" 
  properties: {
    by: { type: "string" }
    on: { type: "string", format: "date-time" }
  }
  required: ["by", "on"]
  additionalProperties: false
}

rolesSchema = {
  type: "array"
  minItems: 0  # Can be zero in the case of deleted responses
  items: { 
    type: "object"
    properties: {
      id: { type: "string" }
      role: { enum: ["view", "admin", "deploy"] }
    }
    required: ["id", "role"]
    additionalProperties: false
  }
}

# Form document which describes both the design of a form and who can edit it, etc
module.exports = {
  title: "form"
  type: "object"
  properties: {
    _id: { type: "string" }
    _rev: { type: "integer" }

    # _id of the form that this is a duplicate of
    _basedOn: { type: "string" }

    # List of deployments. See above
    deployments: deployments

    # Current status of the form. Starts in active state
    state: { enum: ["active", "deleted"] }

    # See mwater-forms for the schema
    design: require('./designSchema')

    # Current mwater-visualization dashboard
    dashboard: { type: "object" }

    # Indicator calculations that create indicator values from form responses
    indicatorCalculations: {
      type: "array"
      items: {
        type: "object"
        properties: { 
          _id: { type: "string" } # Unique id of calculation
          indicator: { type: "string" } # Id of indicator

          expressions: { type: "object" } # Map of indicator property id to mwater-expression expression to create value
          condition: { type: ["object", "null"] } # Optional mwater-expression expression to restrict when to create indicator value

          # List of ids of users and groups who can view created indicator values i.e. user:<username> or group:<groupname>
          viewers: { type: "array", items: { type: "string" } }
        }
        required: ['_id', 'indicator', "viewers"]
        additionalProperties: false
      }
    }

    # True if master form
    isMaster: { type: "boolean" } 

    # If clone form, then _id of master form
    masterForm: { type: "string" }
    
    roles: rolesSchema
    created: createdModifiedSchema
    modified: createdModifiedSchema
    removed: createdModifiedSchema
  }

  required: ["_id", "_rev", "state", "design", "roles", "created", "modified"]
  additionalProperties: false
}


