_  = require 'lodash'

# Because of extend limitations in JSON schema, this allows us to include
# all basic properties but still use additionalProperties: false
extendQuestionProperties = (properties) ->
  return _.defaults properties, {
    _id: {}, code: {}, text: {}, required: {}, conditions: {}, hint: {}, help: {}, sticky: {}
    alternates: {}, commentsField: {}, recordTimestamp: {}, recordLocation: {}, sensor: {}, _basedOn: {}, exportId: {}
  } 

# This is the design of a form which is stored in the "design" field of forms in mWater
exports.design = {
  "$schema": "http://json-schema.org/draft-04/schema#"
  type: "object"
  properties: {
    # Specifies that this is the root Form element
    _type: { enum: ["Form"] }

    # Version of the schema of this form design 
    # Schema 2 just added siteTypes to SiteQuestion and exportId to questions and consentPrompt to image questions
    # Schema 3 added moment formats for date questions. Label for checkbox is deprecated and no longer used.
    # Schema 4 added isoneof and isntoneof conditions
    # Schema 10 adds entity questions and linking
    # Schema 11 deprecates form-level entity settings and adds hidden entity questions
    # Schema 12 adds admin regions
    # Schema 13 adds rosters
    _schema: { enum: [1, 2, 3, 4, 5, 10, 11, 12, 13] }

    # Name of the form
    name: { $ref: "#/definitions/localizedString" }

    # When set to true, the response will be assigned a name at creation (instead of only when being saved as a draft)
    draftNameRequired: { type: "boolean" }

    # Contents of the form
    contents: { 
      oneOf: [
        # Can be empty
        { type: "array", maxItems: 0 }

        # Organized by a list of sections (that contain items)
        { type: "array", minItems: 1, items: { $ref: "#/definitions/section" } }

        # Or a list of items with no sections
        { type: "array", minItems: 1, items: { $ref: "#/definitions/item" } }
      ]
    }

    # List of locales
    locales: { $ref: "#/definitions/locales" }

    # Form-level localized strings, such as "Discard", "Clear", etc.
    localizedStrings: { 
      type: "array" 
      items: { $ref: "#/definitions/localizedString" } 
    }

    # Deprecated!!
    entitySettings: {
      type: "object"
      properties: {
        # Entity type that this form can create/update. colon delimited (e.g. site:surface_water)
        entityType: { type: "string" }

        # Property links that connect questions to properties
        propertyLinks: { 
          type: "array",
          items: { $ref: "#/definitions/propertyLink" }
        }
      }
      required: ["entityType", "propertyLinks"]
      additionalProperties: false
    }
  }

  required: ["_type", "_schema", "name", "contents", "locales"]
  additionalProperties: false

  definitions: {
    # A localized string has a base language code (_base) and then each localization as a property
    # with the language code (two character) as the key
    # If no _base, then unspecified and should be rendered as empty string
    localizedString: {
      type: "object"
      properties: {
        # Base language code of localized string
        _base: { type: "string" }
        
        # True if no longer used
        _unused: { type: "boolean" }
      }
      patternProperties: {
        # Language code as the key and localized string as the value
        "^[a-z]{2,}$": { type: "string" }
      }
      additionalProperties: false
    }

    # List of locales of the form, languages for which form is available
    locales: {
      type: "array"
      # TODO fill in empty locales
      # minItems: 1
      items: { 
        type: "object"
        properties: {
          # Language code (2 character)
          code: { type: "string" }

          # Localized name of language (e.g. Kiswahili)
          name: { type: "string" }

          # True if code and name are not from the official locales list
          custom: { type: "boolean" }
        }
        required: ["code", "name"]
        additionalProperties: false
      }
    }

    # UUID for items. UUID 4 without dashes usually
    uuid: {
      type: "string"
      pattern: "^[a-f0-9]+$"
    }

    # Links between a property and either a question or a calculation
    # TODO document
    propertyLink: {
      type: "object"
      properties: {
        type: { type: "string" }
        propertyId: { type: "string" }
        direction: { enum: ["load", "save", "both"] }
        questionId: { type: "string" }
        mappings: { } 
        alternate: { type: "string" }
        choice: { type: "string" }
        randomRadius: { type: "number" }
        property: {} # Deprecated!
        question: {} # Deprecated!
      }
    }

    # Property of an entity
    propertyId: {
      # TODO document. Used to be object, now string
    }

    # A section of a form has a name and a series of items (questions, etc.) that validate as a group. Forms are 
    # either made only of sections or not at all.
    section: {
      type: "object"
      properties: {
        _id: { $ref: "#/definitions/uuid" }

        # Specifies that this is a section element
        _type: { enum: ["Section"] }

        # Name of the section
        name: { $ref: "#/definitions/localizedString" } 

        # Contains a list of items
        contents: {
          type: "array"
          items: { $ref: "#/definitions/item" }
        }

        # Conditions for visibility of the section
        conditions: { $ref: "#/definitions/conditions" }

        # _id of the section that this section is a duplicate of.
        _basedOn : { $ref: "#/definitions/uuid" }
      }
      required: ["_id", "_type", "name", "contents"]
      additionalProperties: false
    }
    
    # Item such as a question or instruction that make up the basic building block of a form
    item: {
      type: "object"
      anyOf: [
        { $ref: "#/definitions/question" } 
        { $ref: "#/definitions/instructions" } 
        { $ref: "#/definitions/rosterGroup" } 
        { $ref: "#/definitions/rosterMatrix" } 
        { $ref: "#/definitions/group" } 
      ]
    }

    # Question of various types which records an answer in the response
    question: {
      type: "object"
      properties: {
        _id: { $ref: "#/definitions/uuid" }

        # All question types end in "Question"
        _type: { type: "string", pattern: "Question$" }

        # Question code which is displayed before the question in the survey
        # and is used for export column header
        code: { type: "string" }

        # Text (prompt of the question)
        text: { $ref: "#/definitions/localizedString" } 

        # True if the question is required to be answered
        required: { type: "boolean" }

        # Conditions for visibility of the instructions
        conditions: { $ref: "#/definitions/conditions" }

        # Localized hint which is displayed with question text
        hint: { $ref: "#/definitions/localizedString" } 

        # Localized markdown help which can be opened
        help: { $ref: "#/definitions/localizedString" } 

        # True to copy answer from previous time form was filled
        sticky: { type: "boolean" }

        # True to record location where question was first answered
        recordLocation: { type: "boolean" }

        # True to record timestamp when question was first answered
        recordTimestamp: { type: "boolean" }

        # True to include a comment field with question
        commentsField: { type: "boolean" }

        # True if text field contains a sensor id TODO remove?
        sensor: { type: "boolean" }

        # Id used for exporting responses
        exportId: { type: "string" }

        # Alternative answers that are non-answers to the specific question
        # such as "Don't Know" or "Not Applicable"
        alternates: {
          type: "object"
          properties: {
            na: { type: "boolean" }  # True to display Not Applicable option
            dontknow: { type: "boolean" } # True to display Don't Know option
          }
          additionalProperties: false
        }

        # Validations that are question-specific
        validations: {
          type: "array"
          items: { $ref: "#/definitions/validations/common" }
        }

        # _id of the item that this item is a duplicate of
        _basedOn : { $ref: "#/definitions/uuid" }
      }
      required: ["_id", "_type", "text", "conditions", "validations"]

      oneOf: [
        { $ref: "#/definitions/TextQuestion" }
        { $ref: "#/definitions/NumberQuestion" }
        { $ref: "#/definitions/DropdownQuestion" }
        { $ref: "#/definitions/RadioQuestion" }
        { $ref: "#/definitions/MulticheckQuestion" }
        { $ref: "#/definitions/DateQuestion" }
        { $ref: "#/definitions/UnitsQuestion" }
        { $ref: "#/definitions/CheckQuestion" }
        { $ref: "#/definitions/LocationQuestion" }
        { $ref: "#/definitions/ImageQuestion" }
        { $ref: "#/definitions/ImagesQuestion" }
        { $ref: "#/definitions/TextListQuestion" }
        { $ref: "#/definitions/SiteQuestion" }
        { $ref: "#/definitions/BarcodeQuestion" }
        { $ref: "#/definitions/EntityQuestion" }
        { $ref: "#/definitions/AdminRegionQuestion" }
      ]
    }

    # Instructional text item
    instructions: {
      type: "object"
      properties: {
        _id: { $ref: "#/definitions/uuid" }
        _type: { enum: ["Instructions"] }

        # Markdown text on a per-language basis
        text: { $ref: "#/definitions/localizedString" } 

        # Conditions for visibility of the instructions
        conditions: { $ref: "#/definitions/conditions" }
      }
      required: ["_id", "_type", "text", "conditions"]
    }

    # Group of questions which are repeated
    rosterGroup: {
      type: "object"
      properties: {
        _id: { $ref: "#/definitions/uuid" }
        _type: { enum: ["RosterGroup"] }

        # _id under which roster is stored. Can reference another roster or self (in which case is null)
        rosterId: { $ref: "#/definitions/uuid" }

        # Name of roster group (displayed above list)
        name: { $ref: "#/definitions/localizedString" } 

        # Conditions for visibility of the group
        conditions: { $ref: "#/definitions/conditions" }

        # Allow user to add items
        allowAdd: { type: "boolean" }

        # Allow user to remove items
        allowRemove: { type: "boolean" }

        # Contains a list of items
        contents: {
          type: "array"
          items: { $ref: "#/definitions/item" }
        }
      }
      required: ["_id", "_type", "rosterId", "name", "conditions", "contents"]
    }

    # Matrix of columns and rows. Each column is of a specific type.
    rosterMatrix: {
      type: "object"
      properties: {
        _id: { $ref: "#/definitions/uuid" }
        _type: { enum: ["RosterMatrix"] }

        # _id under which roster is stored. Can reference another roster or self (in which case is null)
        rosterId: { $ref: "#/definitions/uuid" }

        # Name of roster group (displayed above matrix)
        name: { $ref: "#/definitions/localizedString" } 

        # Conditions for visibility of the matrix
        conditions: { $ref: "#/definitions/conditions" }

        # Allow user to add items
        allowAdd: { type: "boolean" }

        # Allow user to remove items
        allowRemove: { type: "boolean" }

        # Contains a list of items
        contents: {
          type: "array"
          items: { $ref: "#/definitions/rosterMatrixColumn" }
        }
      }
      required: ["_id", "_type", "rosterId", "name", "conditions", "contents"]
    }

    rosterMatrixColumn: {
      type: "object"
      properties: {
        _id: { $ref: "#/definitions/uuid" }
        _type: { enum: ["TextColumnQuestion", "NumberColumnQuestion", "CheckColumnQuestion", "DropdownColumnQuestion"] }

        # Header of roster column
        text: { $ref: "#/definitions/localizedString" } 

        # True if the column is required to be answered
        required: { type: "boolean" }

        # For number columns 
        decimal: { type: "boolean" }

        # For dropdown columns. Do not allow specify.
        choices: { $ref: "#/definitions/choices" }

        # Validations for various types
        validations: {
          type: "array"
          items: {
            oneOf: [
              { $ref: "#/definitions/validations/range" }
              { $ref: "#/definitions/validations/lengthRange" }
              { $ref: "#/definitions/validations/regex" }
            ]
          }
        }
       }
      required: ["_id", "_type", "name"]
    }

    # Group of questions which can have conditions as a whole
    group: {
      type: "object"
      properties: {
        _id: { $ref: "#/definitions/uuid" }
        _type: { enum: ["Group"] }

        # Name of group (displayed above list). Can be blank
        name: { $ref: "#/definitions/localizedString" } 

        # Conditions for visibility of the group
        conditions: { $ref: "#/definitions/conditions" }

        # Contains a list of items
        contents: {
          type: "array"
          items: { $ref: "#/definitions/item" }
        }
      }
      required: ["_id", "_type", "conditions", "contents"]
    }

    # Conditions on an item or section that determine if it is visible.
    # All must be true to be visible
    conditions: {
      type: "array"
      items: { $ref: "#/definitions/condition" }
    }

    # Condition that depends on the answer to another question
    condition: {
      type: "object"
      properties: {
        # Left-hand side of the condition inequality
        lhs: {
          type: "object"
          properties: {
            # Question whose answer to use as left-hand side of the condition inequality
            question: { $ref: "#/definitions/uuid" }
          }
          required: ["question"]
          additionalProperties: false
        }

        # Operation
        op: { type: "string" }

        # Optional right-hand side of the inequality. Unary operators will not have one
        rhs: { 
          type: "object"
          properties: {
            # Literal value of the right hand side. See individual conditions
            literal: {}
          }
          required: ["literal"]
          additionalProperties: false
        }
      }
      required: ["lhs", "op"]
      additionalProperties: false

      oneOf: [
        { $ref: "#/definitions/conditionTypes/unary" }
        { $ref: "#/definitions/conditionTypes/text" }
        { $ref: "#/definitions/conditionTypes/number" }
        { $ref: "#/definitions/conditionTypes/choice" }
        { $ref: "#/definitions/conditionTypes/choices" }
        { $ref: "#/definitions/conditionTypes/date" }
      ]
    }

    conditionTypes: {
      # Unary type conditions
      unary: {
        type: "object"
        properties: {
          op: { enum: [
            "present"   # If question was answered
            "!present"  # If question was not answered
            "true"      # If answer is true
            "false"     # If answer is false
          ]}
          lhs: {}
        }
        additionalProperties: false
      }

      # Conditions with text as right-hand side
      text: {
        type: "object"
        properties: {
          op: { enum: [
            "contains"    # If answer contains text in RHS
            "!contains"   # If answer does not contain text in RHS
          ]}
          rhs: {
            type: "object"
            properties: {
              literal: { type: "string" }
            }
          } 
        }
        required: ["rhs"]
      }

      # Conditions with number as right-hand side
      number: {
        type: "object"
        properties: {
          op: { enum: [
            "="    # If answer equals a value
            "!="   # If answer does not equal a value
            ">"    # If answer is greater than
            "<"    # If answer is less than
          ]}

          rhs: {
            type: "object"
            properties: {
              literal: { type: "integer" }
            }
          } 
        }
        required: ["rhs"]
      }

      # Conditions with choice as right-hand side
      choice: {
        type: "object"
        properties: {
          op: { enum: [
            "is"        # If answer is a certain choice
            "isnt"      # If answer is not a choice
            "includes"  # If answer is includes a choice (multi-check)
            "!includes" # If answer doesn't include a choice (multi-check)  
          ]}

          rhs: {
            type: "object"
            properties: {
              # Id of the choice
              literal: { type: "string" }
            }
          } 
        }
        required: ["rhs"]
      }

      # Conditions with choices as right-hand side
      choices: {
        type: "object"
        properties: {
          op: { enum: [
            "isoneof"   # If answer is in a list of choices
            "isntoneof" # If answer is not in a list of choice
          ]}

          rhs: {
            type: "object"
            properties: {
              # Ids of the choices
              literal: { type: "array", items: { type: "string" } }
            }
          } 
        }
        required: ["rhs"]
      }
      
      # Conditions with date as right-hand side
      date: {
        type: "object"
        properties: {
          op: { enum: [
            "before"     # If answer is before a date
            "after"      # If answer is after a date
          ]}

          rhs: {
            type: "object"
            properties: {
              # Date in YYYY-MM-DD
              literal: { type: "date" }
            }
          } 
        }
        required: ["rhs"]
      }
    }

    validations: {
      # Validations are a condition that the answer must pass
      # The type is specific to the question type, but have a 
      # common structure
      common: {
        type: "object"
        properties: {
          # Operation of the validation
          op: { type: "string" }

          # Right hand side of the validation operation
          # The left hand side is the question's answer
          # For some ops there may be no rhs
          rhs: {
            type: "object"
            properties: {
              # Only literal values are supported for now
              literal: {}
            }
            additionalProperties: false
            required: ["literal"]
          }

          # Message to be displayed when the validation fails
          message: { $ref: "#/definitions/localizedString" } 
        }
        additionalProperties: false
        required: ["op", "message"]
      }

      # Validation which constrains length of text field in characters
      lengthRange: {
        type: "object"
        properties: {
          op: { enum: ["lengthRange"] }
          rhs: {
            type: "object"
            properties: {
              # Literal contains min and max length
              literal: {
                type: "object"
                properties: {
                  # Minimum length of the string
                  min: { type: "integer" }
                  # Maximum length of the string
                  max: { type: "integer" }
                }
                additionalProperties: false
              }
            }
          }
        }
      }

      # Validation which constrains range of a number answer. Range is inclusive
      range: {
        type: "object"
        properties: {
          op: { enum: ["range"] }
          rhs: {
            type: "object"
            properties: {
              # Literal contains min and max value
              literal: {
                type: "object"
                properties: {
                  # Minimum value
                  min: { type: "number" }
                  # Maximum value
                  max: { type: "number" }
                }
                additionalProperties: false
              }
            }
          }
        }
      }

      regex: {
        type: "object"
        properties: {
          op: { enum: ["regex"] }
          rhs: {
            type: "object"
            properties: {
              # Literal contains regex string to match
              literal: { type: "string" }
            }
            required: ["literal"]
          }
        }
      }        
    }

    # Simple text question, single or multi-line
    TextQuestion: {
      properties: extendQuestionProperties({
        _type: { enum: ["TextQuestion"] }

        # Format of the text field
        format: { enum: [
          "singleline" # single line of text
          "multiline" # paragraph of text
          "email" # valid email address
          "url" # valid URL
        ] }

        validations: {
          type: "array"
          items: {
            oneOf: [
              { $ref: "#/definitions/validations/lengthRange" }
              { $ref: "#/definitions/validations/regex" }
            ]
          }
        }
      })
      required: ["format"]
      additionalProperties: false
    }

    # Number question, integer or decimal
    NumberQuestion: {
      properties: extendQuestionProperties({
        _type: { enum: ["NumberQuestion"] }

        # True to allow decimals
        decimal: { type: "boolean" }

        validations: {
          type: "array"
          items: { $ref: "#/definitions/validations/range" }
        }
      })
      required: ["decimal"]
      additionalProperties: false
    }

    # Displays choices in a dropdown
    DropdownQuestion: {
      type: "object"
      properties: extendQuestionProperties({
        _type: { enum: ["DropdownQuestion"] }

        # Choices of the dropdown
        choices: { $ref: "#/definitions/choices" }

        # No validation available
        validations: { type: "array", maxItems: 0 } 
      })
      required: ['choices']
      additionalProperties: false
    }

    # Displays choices as radio buttons
    RadioQuestion: {
      type: "object"
      properties: extendQuestionProperties({
        _type: { enum: ["RadioQuestion"] }

        # Choices of the radio buttons
        choices: { $ref: "#/definitions/choices" }

        # No validation available
        validations: { type: "array", maxItems: 0 } 
      })
      required: ['choices']
      additionalProperties: false
    }

    MulticheckQuestion: {
      type: "object"
      properties: extendQuestionProperties({
        _type: { enum: ["MulticheckQuestion"] }

        # Choices of the radio buttons
        choices: { $ref: "#/definitions/choices" }

        # No validation available
        validations: { type: "array", maxItems: 0 } 
      })
      required: ['choices']
      additionalProperties: false
    }

    DateQuestion: {
      type: "object"
      properties: extendQuestionProperties({
        _type: { enum: ["DateQuestion"] }

        # moment.js format of the displayed date (is always stored in ISO 8601)
        format: { type: "string" }

        # No validation available
        validations: { type: "array", maxItems: 0 } 
      })
      required: ['format']
      additionalProperties: false
    }

    UnitsQuestion: {
      type: "object"
      properties: extendQuestionProperties({
        _type: { enum: ["UnitsQuestion"] }
        decimal: { type: "boolean" }

        # List of units displayed
        units: { 
          type: "array" 
          items: { 
            type: "object"
            properties: {
              # Unique (within the question) id of the unit
              id: { type: "string" }

              # Code, unique within the question that should be used for exporting
              code: { type: "string" }

              # Label of the unit, localized
              label: { $ref: "#/definitions/localizedString" } 

              # Hint associated with a unit
              hint: { $ref: "#/definitions/localizedString" } 
            }
            required: ["id", "label"]
            additionalProperties: false
          } 
        }

        # Whether units are before or after quantity
        unitsPosition: { enum: ["prefix", "suffix"] }

        # Default units (id) or null
        defaultUnits: { type: ["string", "null"] }

        validations: {
          type: "array"
          items: { $ref: "#/definitions/validations/range" }
        }
      })
      required: ['decimal', 'units', 'unitsPosition']
      additionalProperties: false
    }

    CheckQuestion: {
      type: "object"
      properties: extendQuestionProperties({
        _type: { enum: ["CheckQuestion"] }

        # Label to display next to checkbox. DEPRECATED AND NOT DISPLAYED
        # TODO: remove
        label: { $ref: "#/definitions/localizedString" } 

        # No validation available
        validations: { type: "array", maxItems: 0 } 
      })
      additionalProperties: false
    }

    LocationQuestion: {
      type: "object"
      properties: extendQuestionProperties({
        _type: { enum: ["LocationQuestion"] }

        # No validation available
        validations: { type: "array", maxItems: 0 } 
      })
      additionalProperties: false
    }

    ImageQuestion: {
      type: "object"
      properties: extendQuestionProperties({
        _type: { enum: ["ImageQuestion"] }

        # Optional yes/no question asked before an image is registered
        # As in "Does the subject consent to the photo?"
        consentPrompt: { $ref: "#/definitions/localizedString" }

        # No validation available
        validations: { type: "array", maxItems: 0 } 
      })
      additionalProperties: false
    }

    ImagesQuestion: {
      type: "object"
      properties: extendQuestionProperties({
        _type: { enum: ["ImagesQuestion"] }

        # Optional yes/no question asked before an image is registered
        # As in "Does the subject consent to the photo?"
        consentPrompt: { $ref: "#/definitions/localizedString" }

        # No validation available
        validations: { type: "array", maxItems: 0 } 
      })
      additionalProperties: false
    }

    TextListQuestion: {
      type: "object"
      properties: extendQuestionProperties({
        _type: { enum: ["TextListQuestion"] }

        # No validation available
        validations: { type: "array", maxItems: 0 } 
      })
      additionalProperties: false
    }

    SiteQuestion: {
      type: "object"
      properties: extendQuestionProperties({
        _type: { enum: ["SiteQuestion"] }

        # Optional list of site types to include
        siteTypes : {
          type: "array"
          items: { 
            enum: [
              "Water point"
              "Sanitation facility"
              "Household"
              "Community"
              "School"
              "Health facility"
            ]
          }
        }                        

        # No validation available
        validations: { type: "array", maxItems: 0 } 
      })
      additionalProperties: false
    }

    BarcodeQuestion: {
      type: "object"
      properties: extendQuestionProperties({
        _type: { enum: ["BarcodeQuestion"] }

        # No validation available
        validations: { type: "array", maxItems: 0 } 
      })
      additionalProperties: false
    }

    EntityQuestion: {
      type: "object"
      properties: extendQuestionProperties({
        _type: { enum: ["EntityQuestion"] }

        # Entity type that can be selected
        entityType:  { type: "string" }

        # Filter for the entities that can be chosen. MongoDb-style
        entityFilter: { type: "object" }

        # Properties that should be displayed when an entity is chosen
        displayProperties: { 
          type: "array"
          items: { $ref: "#/definitions/propertyId" }
        }

        # Properties that should be used to select the entity
        selectProperties: {
          type: "array"
          items: { $ref: "#/definitions/propertyId" }
        }

        # Geometry property (optional) that should be displayed on a map for choosing an entity. Deprecated
        mapProperty: { $ref: "#/definitions/propertyId" } 
        
        # Text of select button
        selectText: { $ref: "#/definitions/localizedString" } 
        
        # Property links that connect questions to properties
        propertyLinks: { 
          type: "array",
          items: { $ref: "#/definitions/propertyLink" }
        }

        # How selection is made
        selectionMode: { $enum: ['external'] }

        # True if hidden always
        hidden: { type: "boolean" }

        # True to create an entity if one is not selected
        createEntity: { type: "boolean" }

        # No validation available
        validations: { type: "array", maxItems: 0 } 
      })
      required: ["entityType"]
      additionalProperties: false
    }

    AdminRegionQuestion: {
      type: "object"
      properties: extendQuestionProperties({
        _type: { enum: ["AdminRegionQuestion"] }

        # Default value (id of admin region)
        defaultValue:  { type: "string" }

        # No validation available
        validations: { type: "array", maxItems: 0 } 
      })
      additionalProperties: false
    }

    # List of choices for a dropdown, radio or multicheck
    choices: {
      type: "array"
      items: {
        type: "object"

        properties: {
          # Unique (within the question) id of the choice. Cannot be "na" or "dontknow" as they are reserved for alternates
          id: { type: "string" }

          # Code, unique within the question that should be used for exporting
          code: { type: "string" }

          # Label of the choice, localized
          label: { $ref: "#/definitions/localizedString" } 

          # Hint associated with a choice
          hint: { $ref: "#/definitions/localizedString" } 

          # True to require a text field to specify the value when selected
          # Usually used for "Other" options.
          # Value is stored in specify[id]
          specify: { type: "boolean" }
        }
        required: ["id", "label"]
        additionalProperties: false
      }
    }
  }
}