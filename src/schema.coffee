_  = require 'lodash'

# Because of extend limitations in JSON schema, this allows us to include
# all basic properties but still use additionalProperties: false
extendQuestionProperties = (properties) ->
  return _.defaults properties, {
    _id: {}, code: {}, text: {}, required: {}, conditions: {}, hint: {}, help: {}, sticky: {}
    alternates: {}, commentsField: {}, recordTimestamp: {}, recordLocation: {}, sensor: {}, _basedOn: {}
  } 

# This is the design of a form which is stored in the "design" field of forms in mWater
exports.design = {
  "$schema": "http://json-schema.org/draft-04/schema#"
  type: "object"
  properties: {
    # Specifies that this is the root Form element
    _type: { enum: ["Form"] }

    # Version of the schema of this form design
    _schema: { enum: [1] }

    # Name of the form
    name: { $ref: "#/definitions/localizedString" } 

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
  }

  # TODO Set all _schema to 1 and make required
  required: ["_type", "name", "contents", "locales"]
  additionalProperties: false

  definitions: {
    # A localized string has a base language code (_base) and then each localization as a property
    # with the language code (two character) as the key
    # If no _base, then unspecified and should be rendered as ""
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
        # TODO some integers are here due to import. Fix and tighten
        "^[a-z]{2}$": { type: ["string", "integer"] }
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
          # Language code
          code: { type: "string" }

          # Localized name of language
          name: { type: "string" }
        }
        required: ["code", "name"]
        additionalProperties: false
      }
    }

    # UUID for items
    uuid: {
      type: "string"
      pattern: "^[a-f0-9]+$"
    }

    # A section of a form has a name and a series of items (questions, etc.) that validate as a group
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

        # _id of the section that this section is a duplicate of
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
      ]
    }

    # Question of various types which records an answer in the response
    question: {
      type: "object"
      properties: {
        _id: { $ref: "#/definitions/uuid" }
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
        # such as "Don't know" or "Not Applicable"
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

    # TODO
    conditions: {
      type: "array"
    }

# "TextQuestion"
# "NumberQuestion"
# "DropdownQuestion"
# "RadioQuestion"
# "MulticheckQuestion"
# "DateQuestion"
# "UnitsQuestion"
# "CheckQuestion"
# "LocationQuestion"
# "ImageQuestion"
# "ImagesQuestion"
# "TextListQuestion"
# "SiteQuestion"
    
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
                  min: { type: "integer" }
                  # Maximum value
                  max: { type: "integer" }
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

        # Format of the displayed date (is always stored in YYYY-MM-DD)
        format: { enum: ["YYYY-MM-DD", "MM/DD/YYYY"]}

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
        units: { type: "array" } # TODO

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

        # Label to display next to checkbox
        label: { $ref: "#/definitions/localizedString" } 

        # No validation available
        validations: { type: "array", maxItems: 0 } 
      })
      required: ["label"]
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

        # No validation available
        validations: { type: "array", maxItems: 0 } 
      })
      additionalProperties: false
    }

    ImagesQuestion: {
      type: "object"
      properties: extendQuestionProperties({
        _type: { enum: ["ImagesQuestion"] }

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

        # No validation available
        validations: { type: "array", maxItems: 0 } 
      })
      additionalProperties: false
    }

    # TODO
    choices: {
      type: "array"
    }
  }
}