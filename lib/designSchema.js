var _, extendQuestionProperties;

_ = require('lodash');

extendQuestionProperties = function(properties) {
  return _.defaults(properties, {
    _id: {},
    code: {},
    text: {},
    textExprs: {},
    required: {},
    disabled: {},
    conditions: {},
    conditionExpr: {},
    hint: {},
    help: {},
    sticky: {},
    alternates: {},
    commentsField: {},
    recordTimestamp: {},
    recordLocation: {},
    sensor: {},
    _basedOn: {},
    exportId: {},
    contents: {},
    items: {}
  });
};

module.exports = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  type: "object",
  properties: {
    _type: {
      "enum": ["Form"]
    },
    _schema: {
      "enum": [1, 2, 3, 4, 5, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
    },
    name: {
      $ref: "#/definitions/localizedString"
    },
    draftNameRequired: {
      type: "boolean"
    },
    confidentialMode: {
      type: "boolean"
    },
    contents: {
      oneOf: [
        {
          type: "array",
          maxItems: 0
        }, {
          type: "array",
          minItems: 1,
          items: {
            $ref: "#/definitions/section"
          }
        }, {
          type: "array",
          minItems: 1,
          items: {
            $ref: "#/definitions/item"
          }
        }
      ]
    },
    locales: {
      $ref: "#/definitions/locales"
    },
    localizedStrings: {
      type: "array",
      items: {
        $ref: "#/definitions/localizedString"
      }
    },
    calculations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          _id: {
            type: "string"
          },
          name: {
            $ref: "#/definitions/localizedString"
          },
          desc: {
            $ref: "#/definitions/localizedString"
          },
          roster: {
            type: "string"
          },
          expr: {
            type: "object"
          }
        },
        required: ["_id", "name", "expr"],
        additionalProperties: false
      }
    },
    entitySettings: {
      type: "object",
      properties: {
        entityType: {
          type: "string"
        },
        propertyLinks: {
          type: "array",
          items: {
            $ref: "#/definitions/propertyLink"
          }
        }
      },
      required: ["entityType", "propertyLinks"],
      additionalProperties: false
    }
  },
  required: ["_type", "_schema", "name", "contents", "locales"],
  additionalProperties: false,
  definitions: {
    localizedString: {
      type: "object",
      properties: {
        _base: {
          type: "string"
        },
        _unused: {
          type: "boolean"
        }
      },
      patternProperties: {
        "^[a-z]{2,}$": {
          type: "string"
        }
      },
      additionalProperties: false
    },
    locales: {
      type: "array",
      items: {
        type: "object",
        properties: {
          code: {
            type: "string"
          },
          name: {
            type: "string"
          },
          custom: {
            type: "boolean"
          }
        },
        required: ["code", "name"],
        additionalProperties: false
      }
    },
    uuid: {
      type: "string",
      pattern: "^[a-f0-9]+$"
    },
    propertyLink: {
      type: "object",
      properties: {
        type: {
          type: "string"
        },
        propertyId: {
          type: "string"
        },
        direction: {
          "enum": ["load", "save", "both"]
        },
        questionId: {
          type: "string"
        },
        mappings: {},
        alternate: {
          type: "string"
        },
        choice: {
          type: "string"
        },
        randomRadius: {
          type: "number"
        },
        property: {},
        question: {}
      }
    },
    propertyId: {},
    section: {
      type: "object",
      properties: {
        _id: {
          $ref: "#/definitions/uuid"
        },
        _type: {
          "enum": ["Section"]
        },
        name: {
          $ref: "#/definitions/localizedString"
        },
        contents: {
          type: "array",
          items: {
            $ref: "#/definitions/item"
          }
        },
        conditions: {
          $ref: "#/definitions/conditions"
        },
        conditionExpr: {
          type: "object"
        },
        _basedOn: {
          $ref: "#/definitions/uuid"
        }
      },
      required: ["_id", "_type", "name", "contents"],
      additionalProperties: false
    },
    item: {
      type: "object",
      anyOf: [
        {
          $ref: "#/definitions/question"
        }, {
          $ref: "#/definitions/instructions"
        }, {
          $ref: "#/definitions/rosterGroup"
        }, {
          $ref: "#/definitions/rosterMatrix"
        }, {
          $ref: "#/definitions/group"
        }
      ]
    },
    question: {
      type: "object",
      properties: {
        _id: {
          $ref: "#/definitions/uuid"
        },
        _type: {
          type: "string",
          pattern: "Question$"
        },
        code: {
          type: "string"
        },
        text: {
          $ref: "#/definitions/localizedString"
        },
        textExprs: {
          type: "array",
          items: {
            type: "object"
          }
        },
        required: {
          type: "boolean"
        },
        disabled: {
          type: "boolean"
        },
        conditions: {
          $ref: "#/definitions/conditions"
        },
        conditionExpr: {
          type: "object"
        },
        hint: {
          $ref: "#/definitions/localizedString"
        },
        help: {
          $ref: "#/definitions/localizedString"
        },
        sticky: {
          type: "boolean"
        },
        recordLocation: {
          type: "boolean"
        },
        recordTimestamp: {
          type: "boolean"
        },
        commentsField: {
          type: "boolean"
        },
        sensor: {
          type: "boolean"
        },
        exportId: {
          type: "string"
        },
        confidential: {
          type: "boolean"
        },
        confidentialRadius: {
          type: "integer"
        },
        alternates: {
          type: "object",
          properties: {
            na: {
              type: "boolean"
            },
            dontknow: {
              type: "boolean"
            }
          },
          additionalProperties: false
        },
        validations: {
          type: "array",
          items: {
            $ref: "#/definitions/validations/common"
          }
        },
        _basedOn: {
          $ref: "#/definitions/uuid"
        },
        randomAskProbability: {
          type: "number"
        }
      },
      required: ["_id", "_type", "text", "conditions", "validations"],
      oneOf: [
        {
          $ref: "#/definitions/TextQuestion"
        }, {
          $ref: "#/definitions/NumberQuestion"
        }, {
          $ref: "#/definitions/DropdownQuestion"
        }, {
          $ref: "#/definitions/RadioQuestion"
        }, {
          $ref: "#/definitions/MulticheckQuestion"
        }, {
          $ref: "#/definitions/DateQuestion"
        }, {
          $ref: "#/definitions/UnitsQuestion"
        }, {
          $ref: "#/definitions/CheckQuestion"
        }, {
          $ref: "#/definitions/LocationQuestion"
        }, {
          $ref: "#/definitions/ImageQuestion"
        }, {
          $ref: "#/definitions/ImagesQuestion"
        }, {
          $ref: "#/definitions/TextListQuestion"
        }, {
          $ref: "#/definitions/SiteQuestion"
        }, {
          $ref: "#/definitions/BarcodeQuestion"
        }, {
          $ref: "#/definitions/EntityQuestion"
        }, {
          $ref: "#/definitions/AdminRegionQuestion"
        }, {
          $ref: "#/definitions/StopwatchQuestion"
        }, {
          $ref: "#/definitions/MatrixQuestion"
        }, {
          $ref: "#/definitions/LikertQuestion"
        }, {
          $ref: "#/definitions/AquagenxCBTQuestion"
        }
      ]
    },
    instructions: {
      type: "object",
      properties: {
        _id: {
          $ref: "#/definitions/uuid"
        },
        _type: {
          "enum": ["Instructions"]
        },
        text: {
          $ref: "#/definitions/localizedString"
        },
        textExprs: {
          type: "array",
          items: {
            type: "object"
          }
        },
        conditions: {
          $ref: "#/definitions/conditions"
        },
        conditionExpr: {
          type: "object"
        },
        disabled: {
          type: "boolean"
        }
      },
      required: ["_id", "_type", "text", "conditions"]
    },
    timer: {
      type: "object",
      properties: {
        _id: {
          $ref: "#/definitions/uuid"
        },
        _type: {
          "enum": ["timer"]
        },
        text: {
          $ref: "#/definitions/localizedString"
        },
        duration: {
          type: "number"
        },
        hint: {
          $ref: "#/definitions/localizedString"
        },
        conditions: {
          $ref: "#/definitions/conditions"
        },
        conditionExpr: {
          type: "object"
        }
      },
      required: ["_id", "_type", "duration", "text", "conditions"]
    },
    rosterGroup: {
      type: "object",
      properties: {
        _id: {
          $ref: "#/definitions/uuid"
        },
        _type: {
          "enum": ["RosterGroup"]
        },
        rosterId: {
          $ref: "#/definitions/uuid"
        },
        name: {
          $ref: "#/definitions/localizedString"
        },
        conditions: {
          $ref: "#/definitions/conditions"
        },
        conditionExpr: {
          type: "object"
        },
        allowAdd: {
          type: "boolean"
        },
        allowRemove: {
          type: "boolean"
        },
        entryTitle: {
          $ref: "#/definitions/localizedString"
        },
        entryTitleExprs: {
          type: "array",
          items: {
            type: "object"
          }
        },
        contents: {
          type: "array",
          items: {
            $ref: "#/definitions/item"
          }
        }
      },
      required: ["_id", "_type", "name", "conditions", "contents"]
    },
    rosterMatrix: {
      type: "object",
      properties: {
        _id: {
          $ref: "#/definitions/uuid"
        },
        _type: {
          "enum": ["RosterMatrix"]
        },
        rosterId: {
          $ref: "#/definitions/uuid"
        },
        name: {
          $ref: "#/definitions/localizedString"
        },
        conditions: {
          $ref: "#/definitions/conditions"
        },
        conditionExpr: {
          type: "object"
        },
        allowAdd: {
          type: "boolean"
        },
        allowRemove: {
          type: "boolean"
        },
        contents: {
          type: "array",
          items: {
            $ref: "#/definitions/matrixColumn"
          }
        }
      },
      required: ["_id", "_type", "name", "conditions", "contents"]
    },
    matrixColumn: {
      type: "object",
      properties: {
        _id: {
          $ref: "#/definitions/uuid"
        },
        _type: {
          "enum": ["TextColumnQuestion", "NumberColumnQuestion", "CheckColumnQuestion", "DropdownColumnQuestion", "UnitsColumnQuestion", "TextColumn", "SiteColumnQuestion", "DateColumnQuestion"]
        },
        text: {
          $ref: "#/definitions/localizedString"
        },
        code: {
          type: "string"
        },
        required: {
          type: "boolean"
        },
        decimal: {
          type: "boolean"
        },
        units: {
          $ref: "#/definitions/units"
        },
        unitsPosition: {
          "enum": ["prefix", "suffix"]
        },
        defaultUnits: {
          type: ["string", "null"]
        },
        choices: {
          $ref: "#/definitions/choices"
        },
        siteType: {
          type: "string"
        },
        format: {
          type: "string"
        },
        placeholder: {
          type: "string"
        },
        confidential: {
          type: "boolean"
        },
        validations: {
          type: "array",
          items: {
            oneOf: [
              {
                $ref: "#/definitions/validations/range"
              }, {
                $ref: "#/definitions/validations/lengthRange"
              }, {
                $ref: "#/definitions/validations/regex"
              }
            ]
          }
        }
      },
      required: ["_id", "_type", "text"]
    },
    group: {
      type: "object",
      properties: {
        _id: {
          $ref: "#/definitions/uuid"
        },
        _type: {
          "enum": ["Group"]
        },
        name: {
          $ref: "#/definitions/localizedString"
        },
        conditions: {
          $ref: "#/definitions/conditions"
        },
        conditionExpr: {
          type: "object"
        },
        contents: {
          type: "array",
          items: {
            $ref: "#/definitions/item"
          }
        }
      },
      required: ["_id", "_type", "conditions", "contents"]
    },
    conditions: {
      type: "array",
      items: {
        $ref: "#/definitions/condition"
      }
    },
    condition: {
      type: "object",
      properties: {
        lhs: {
          type: "object",
          properties: {
            question: {
              $ref: "#/definitions/uuid"
            }
          },
          required: ["question"],
          additionalProperties: false
        },
        op: {
          type: "string"
        },
        rhs: {
          type: "object",
          properties: {
            literal: {}
          },
          required: ["literal"],
          additionalProperties: false
        }
      },
      required: ["lhs", "op"],
      additionalProperties: false,
      oneOf: [
        {
          $ref: "#/definitions/conditionTypes/unary"
        }, {
          $ref: "#/definitions/conditionTypes/text"
        }, {
          $ref: "#/definitions/conditionTypes/number"
        }, {
          $ref: "#/definitions/conditionTypes/choice"
        }, {
          $ref: "#/definitions/conditionTypes/choices"
        }, {
          $ref: "#/definitions/conditionTypes/date"
        }
      ]
    },
    conditionTypes: {
      unary: {
        type: "object",
        properties: {
          op: {
            "enum": ["present", "!present", "true", "false"]
          },
          lhs: {}
        },
        additionalProperties: false
      },
      text: {
        type: "object",
        properties: {
          op: {
            "enum": ["contains", "!contains"]
          },
          rhs: {
            type: "object",
            properties: {
              literal: {
                type: "string"
              }
            }
          }
        },
        required: ["rhs"]
      },
      number: {
        type: "object",
        properties: {
          op: {
            "enum": ["=", "!=", ">", "<"]
          },
          rhs: {
            type: "object",
            properties: {
              literal: {
                type: "integer"
              }
            }
          }
        },
        required: ["rhs"]
      },
      choice: {
        type: "object",
        properties: {
          op: {
            "enum": ["is", "isnt", "includes", "!includes"]
          },
          rhs: {
            type: "object",
            properties: {
              literal: {
                type: "string"
              }
            }
          }
        },
        required: ["rhs"]
      },
      choices: {
        type: "object",
        properties: {
          op: {
            "enum": ["isoneof", "isntoneof"]
          },
          rhs: {
            type: "object",
            properties: {
              literal: {
                type: "array",
                items: {
                  type: "string"
                }
              }
            }
          }
        },
        required: ["rhs"]
      },
      date: {
        type: "object",
        properties: {
          op: {
            "enum": ["before", "after"]
          },
          rhs: {
            type: "object",
            properties: {
              literal: {
                type: "date"
              }
            }
          }
        },
        required: ["rhs"]
      }
    },
    validations: {
      common: {
        type: "object",
        properties: {
          op: {
            type: "string"
          },
          rhs: {
            type: "object",
            properties: {
              literal: {}
            },
            additionalProperties: false,
            required: ["literal"]
          },
          message: {
            $ref: "#/definitions/localizedString"
          }
        },
        additionalProperties: false,
        required: ["op", "message"]
      },
      lengthRange: {
        type: "object",
        properties: {
          op: {
            "enum": ["lengthRange"]
          },
          rhs: {
            type: "object",
            properties: {
              literal: {
                type: "object",
                properties: {
                  min: {
                    type: "integer"
                  },
                  max: {
                    type: "integer"
                  }
                },
                additionalProperties: false
              }
            }
          }
        }
      },
      range: {
        type: "object",
        properties: {
          op: {
            "enum": ["range"]
          },
          rhs: {
            type: "object",
            properties: {
              literal: {
                type: "object",
                properties: {
                  min: {
                    type: "number"
                  },
                  max: {
                    type: "number"
                  }
                },
                additionalProperties: false
              }
            }
          }
        }
      },
      regex: {
        type: "object",
        properties: {
          op: {
            "enum": ["regex"]
          },
          rhs: {
            type: "object",
            properties: {
              literal: {
                type: "string"
              }
            },
            required: ["literal"]
          }
        }
      }
    },
    TextQuestion: {
      properties: extendQuestionProperties({
        _type: {
          "enum": ["TextQuestion"]
        },
        format: {
          "enum": ["singleline", "multiline", "email", "url"]
        },
        validations: {
          type: "array",
          items: {
            oneOf: [
              {
                $ref: "#/definitions/validations/lengthRange"
              }, {
                $ref: "#/definitions/validations/regex"
              }
            ]
          }
        }
      }),
      required: ["format"],
      additionalProperties: false
    },
    NumberQuestion: {
      properties: extendQuestionProperties({
        _type: {
          "enum": ["NumberQuestion"]
        },
        decimal: {
          type: "boolean"
        },
        validations: {
          type: "array",
          items: {
            $ref: "#/definitions/validations/range"
          }
        }
      }),
      required: ["decimal"],
      additionalProperties: false
    },
    StopwatchQuestion: {
      properties: extendQuestionProperties({
        _type: {
          "enum": ["StopwatchQuestion"]
        },
        validations: {
          type: "array",
          maxItems: 0
        }
      }),
      additionalProperties: false
    },
    DropdownQuestion: {
      type: "object",
      properties: extendQuestionProperties({
        _type: {
          "enum": ["DropdownQuestion"]
        },
        choices: {
          $ref: "#/definitions/choices"
        },
        validations: {
          type: "array",
          maxItems: 0
        }
      }),
      required: ['choices'],
      additionalProperties: false
    },
    RadioQuestion: {
      type: "object",
      properties: extendQuestionProperties({
        _type: {
          "enum": ["RadioQuestion"]
        },
        choices: {
          $ref: "#/definitions/choices"
        },
        validations: {
          type: "array",
          maxItems: 0
        }
      }),
      required: ['choices'],
      additionalProperties: false
    },
    LikertQuestion: {
      type: "object",
      properties: extendQuestionProperties({
        _type: {
          "enum": ["RadioQuestion"]
        },
        choices: {
          $ref: "#/definitions/choices"
        },
        items: {
          $ref: "#/definitions/choices"
        },
        validations: {
          type: "array",
          maxItems: 0
        }
      }),
      required: ['choices'],
      additionalProperties: false
    },
    MulticheckQuestion: {
      type: "object",
      properties: extendQuestionProperties({
        _type: {
          "enum": ["MulticheckQuestion"]
        },
        choices: {
          $ref: "#/definitions/choices"
        },
        validations: {
          type: "array",
          maxItems: 0
        }
      }),
      required: ['choices'],
      additionalProperties: false
    },
    DateQuestion: {
      type: "object",
      properties: extendQuestionProperties({
        _type: {
          "enum": ["DateQuestion"]
        },
        format: {
          type: "string"
        },
        validations: {
          type: "array",
          maxItems: 0
        }
      }),
      required: ['format'],
      additionalProperties: false
    },
    UnitsQuestion: {
      type: "object",
      properties: extendQuestionProperties({
        _type: {
          "enum": ["UnitsQuestion"]
        },
        decimal: {
          type: "boolean"
        },
        units: {
          $ref: "#/definitions/units"
        },
        unitsPosition: {
          "enum": ["prefix", "suffix"]
        },
        defaultUnits: {
          type: ["string", "null"]
        },
        validations: {
          type: "array",
          items: {
            $ref: "#/definitions/validations/range"
          }
        }
      }),
      required: ['decimal', 'units', 'unitsPosition'],
      additionalProperties: false
    },
    CheckQuestion: {
      type: "object",
      properties: extendQuestionProperties({
        _type: {
          "enum": ["CheckQuestion"]
        },
        label: {
          $ref: "#/definitions/localizedString"
        },
        validations: {
          type: "array",
          maxItems: 0
        }
      }),
      additionalProperties: false
    },
    LocationQuestion: {
      type: "object",
      properties: extendQuestionProperties({
        _type: {
          "enum": ["LocationQuestion"]
        },
        calculateAdminRegion: {
          type: "boolean"
        },
        validations: {
          type: "array",
          maxItems: 0
        }
      }),
      additionalProperties: false
    },
    ImageQuestion: {
      type: "object",
      properties: extendQuestionProperties({
        _type: {
          "enum": ["ImageQuestion"]
        },
        consentPrompt: {
          $ref: "#/definitions/localizedString"
        },
        validations: {
          type: "array",
          maxItems: 0
        }
      }),
      additionalProperties: false
    },
    ImagesQuestion: {
      type: "object",
      properties: extendQuestionProperties({
        _type: {
          "enum": ["ImagesQuestion"]
        },
        consentPrompt: {
          $ref: "#/definitions/localizedString"
        },
        validations: {
          type: "array",
          maxItems: 0
        }
      }),
      additionalProperties: false
    },
    TextListQuestion: {
      type: "object",
      properties: extendQuestionProperties({
        _type: {
          "enum": ["TextListQuestion"]
        },
        validations: {
          type: "array",
          maxItems: 0
        }
      }),
      additionalProperties: false
    },
    SiteQuestion: {
      type: "object",
      properties: extendQuestionProperties({
        _type: {
          "enum": ["SiteQuestion"]
        },
        siteTypes: {
          type: "array",
          items: {
            type: "string"
          }
        },
        validations: {
          type: "array",
          maxItems: 0
        }
      }),
      additionalProperties: false
    },
    BarcodeQuestion: {
      type: "object",
      properties: extendQuestionProperties({
        _type: {
          "enum": ["BarcodeQuestion"]
        },
        validations: {
          type: "array",
          maxItems: 0
        }
      }),
      additionalProperties: false
    },
    EntityQuestion: {
      type: "object",
      properties: extendQuestionProperties({
        _type: {
          "enum": ["EntityQuestion"]
        },
        entityType: {
          type: "string"
        },
        entityFilter: {
          type: "object"
        },
        displayProperties: {
          type: "array",
          items: {
            $ref: "#/definitions/propertyId"
          }
        },
        selectProperties: {
          type: "array",
          items: {
            $ref: "#/definitions/propertyId"
          }
        },
        mapProperty: {
          $ref: "#/definitions/propertyId"
        },
        selectText: {
          $ref: "#/definitions/localizedString"
        },
        propertyLinks: {
          type: "array",
          items: {
            $ref: "#/definitions/propertyLink"
          }
        },
        selectionMode: {
          $enum: ['external']
        },
        hidden: {
          type: "boolean"
        },
        createEntity: {
          type: "boolean"
        },
        validations: {
          type: "array",
          maxItems: 0
        }
      }),
      required: ["entityType"],
      additionalProperties: false
    },
    AdminRegionQuestion: {
      type: "object",
      properties: extendQuestionProperties({
        _type: {
          "enum": ["AdminRegionQuestion"]
        },
        defaultValue: {
          type: "string"
        },
        validations: {
          type: "array",
          maxItems: 0
        }
      }),
      additionalProperties: false
    },
    MatrixQuestion: {
      type: "object",
      properties: extendQuestionProperties({
        _type: {
          "enum": ["MatrixQuestion"]
        },
        items: {
          $ref: "#/definitions/choices"
        },
        columns: {
          type: "array",
          items: {
            $ref: "#/definitions/matrixColumn"
          }
        },
        validations: {
          type: "array",
          maxItems: 0
        }
      }),
      required: ["items", "columns"],
      additionalProperties: false
    },
    AquagenxCBTQuestion: {
      type: "object",
      properties: extendQuestionProperties({
        _type: {
          "enum": ["AquagenxCBTQuestion"]
        },
        validations: {
          type: "array",
          maxItems: 0
        }
      }),
      additionalProperties: false
    },
    choices: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          code: {
            type: "string"
          },
          label: {
            $ref: "#/definitions/localizedString"
          },
          hint: {
            $ref: "#/definitions/localizedString"
          },
          specify: {
            type: "boolean"
          },
          conditions: {
            $ref: "#/definitions/conditions"
          }
        },
        required: ["id", "label"],
        additionalProperties: false
      }
    },
    units: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: "object",
          properties: {
            id: {
              type: "string"
            },
            code: {
              type: "string"
            },
            label: {
              $ref: "#/definitions/localizedString"
            },
            hint: {
              $ref: "#/definitions/localizedString"
            }
          },
          required: ["id", "label"],
          additionalProperties: false
        }
      }
    }
  }
};
