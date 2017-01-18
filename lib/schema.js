var createdModifiedSchema, deployments, rolesSchema;

deployments = {
  type: "array",
  items: {
    type: "object",
    properties: {
      _id: {
        type: "string"
      },
      name: {
        type: "string"
      },
      active: {
        type: "boolean"
      },
      "public": {
        type: "boolean"
      },
      enumerators: {
        type: "array",
        items: {
          type: "string"
        }
      },
      viewers: {
        type: "array",
        items: {
          type: "string"
        }
      },
      admins: {
        type: "array",
        items: {
          type: "string"
        }
      },
      indicatorCalculationViewers: {
        type: "array",
        items: {
          type: "string"
        }
      },
      enumeratorAdminFinal: {
        type: "boolean"
      },
      approvalStages: {
        type: "array",
        items: {
          type: "object",
          properties: {
            "approvers": {
              type: "array",
              items: {
                type: "string"
              }
            }
          },
          required: ['approvers'],
          additionalProperties: false
        }
      },
      entityCreationSettings: {
        type: "array",
        items: {
          type: "object",
          properties: {
            questionId: {
              type: "string"
            },
            conditions: {
              type: "array"
            },
            enumeratorRole: {
              "enum": ["limited", "view", "edit", "admin"]
            },
            createdFor: {
              type: "string"
            },
            otherRoles: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  to: {
                    type: "string"
                  },
                  role: {
                    "enum": ["limited", "view", "edit", "admin"]
                  }
                },
                required: ["to", "role"],
                additionalProperties: false
              }
            }
          },
          required: ['questionId'],
          additionalProperties: false
        }
      }
    },
    required: ["_id", "name", "enumerators", "approvalStages", "viewers", "admins"],
    additionalProperties: false
  }
};

createdModifiedSchema = {
  type: "object",
  properties: {
    by: {
      type: "string"
    },
    on: {
      type: "string",
      format: "date-time"
    }
  },
  required: ["by", "on"],
  additionalProperties: false
};

rolesSchema = {
  type: "array",
  minItems: 0,
  items: {
    type: "object",
    properties: {
      id: {
        type: "string"
      },
      role: {
        "enum": ["view", "admin", "deploy"]
      }
    },
    required: ["id", "role"],
    additionalProperties: false
  }
};

module.exports = {
  title: "form",
  type: "object",
  properties: {
    _id: {
      type: "string"
    },
    _rev: {
      type: "integer"
    },
    _basedOn: {
      type: "string"
    },
    deployments: deployments,
    state: {
      "enum": ["active", "deleted"]
    },
    design: require('./designSchema'),
    dashboard: {
      type: "object"
    },
    indicatorCalculations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          _id: {
            type: "string"
          },
          indicator: {
            type: "string"
          },
          roster: {
            type: "string"
          },
          expressions: {
            type: "object"
          },
          condition: {
            type: ["object", "null"]
          },
          viewers: {
            type: "array",
            items: {
              type: "string"
            }
          }
        },
        required: ['_id', 'indicator', "viewers"],
        additionalProperties: false
      }
    },
    isMaster: {
      type: "boolean"
    },
    masterForm: {
      type: "string"
    },
    roles: rolesSchema,
    created: createdModifiedSchema,
    modified: createdModifiedSchema,
    removed: createdModifiedSchema
  },
  required: ["_id", "_rev", "state", "design", "roles", "created", "modified"],
  additionalProperties: false
};
