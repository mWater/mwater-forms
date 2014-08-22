_  = require 'lodash'

# Because of extend limitations in JSON schema, this allows us to include
# all basic properties but still use additionalProperties: false
extendQuestionProperties = (properties) ->
  return _.defaults properties, {
    _id: {}, code: {}, text: {}, required: {}, conditions: {}, validations: {}, hint: {}, help: {}, sticky: {}
    alternates: {}, commentsField: {}, recordTimestamp: {}, recordLocation: {}, sensor: {}, _basedOn: {}
  } 

module.exports = {
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
    localizedString: {
      type: "object"
      properties: {
        # Base language code of localized string
        _base: "string"
        
        # True if no longer used
        _unused: "boolean"
      }
      patternProperties: {
        # Language code as the key and localized string as the value
        "^[a-z]{2}$": { type: "string" }
      }
      # TODO can no _base mean not specified?
      required: []
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
          code: "string"

          # Localized name of language
          name: "string"
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
          #items: { $ref: "#/definitions/item" }
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

    # TODO
    question: {
      type: "object"
      properties: {
        _id: { $ref: "#/definitions/uuid" }
        _type: { type: "string", pattern: "Question$" }

        # Question code which is displayed before the question in the survey
        # and is used for export column header
        code: "string"

        # Text (prompt of the question)
        # TODO sometimes missing
        # TODO sometimes empty "{}"
        #text: { $ref: "#/definitions/localizedString" } 

        # True if the question is required to be answered
        required: "boolean"

        # Conditions for visibility of the instructions
        conditions: { $ref: "#/definitions/conditions" }

        # Localized hint which is displayed with question text
        hint: { $ref: "#/definitions/localizedString" } 

        # Localized markdown help which can be opened
        help: { $ref: "#/definitions/localizedString" } 

        # True to copy answer from previous time form was filled
        sticky: "boolean"

        # True to record location where question was first answered
        recordLocation: "boolean"

        # True to record timestamp when question was first answered
        recordTimestamp: "boolean"

        # True to include a comment field with question
        commentsField: "boolean"

        # True if text field contains a sensor id TODO remove?
        sensor: "boolean"

        # TODO
        alternates: {}

        # validations: "array" # TODO

        # _id of the item that this item is a duplicate of
        _basedOn : { $ref: "#/definitions/uuid" }
      }
      # TODO make text required
      required: ["_id", "_type", "conditions"]

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
      })
      required: ["format"]
      additionalProperties: false
    }

    NumberQuestion: {
      properties: extendQuestionProperties({
        _type: { enum: ["NumberQuestion"] }

        # True to allow decimals
        decimal: "boolean"
      })
      required: ["decimal"]
      additionalProperties: false
    }

    DropdownQuestion: {
      type: "object"
      properties: extendQuestionProperties({
        _type: { enum: ["DropdownQuestion"] }

        # Choices of the dropdown
        choices: { $ref: "#/definitions/choices" }
      })
      additionalProperties: false
    }

    RadioQuestion: {
      type: "object"
      properties: extendQuestionProperties({
        _type: { enum: ["RadioQuestion"] }

        # Choices of the radio buttons
        choices: { $ref: "#/definitions/choices" }
      })
      additionalProperties: false
    }

    MulticheckQuestion: {
      type: "object"
      properties: extendQuestionProperties({
        _type: { enum: ["MulticheckQuestion"] }

        # Choices of the radio buttons
        choices: { $ref: "#/definitions/choices" }
      })
      additionalProperties: true
    }

    DateQuestion: {
      type: "object"
      properties: {
        _type: { enum: ["DateQuestion"] }
      }
      additionalProperties: true
    }

    UnitsQuestion: {
      type: "object"
      properties: {
        _type: { enum: ["UnitsQuestion"] }
        units: "array" # TODO
      }
      additionalProperties: true
    }

    CheckQuestion: {
      type: "object"
      properties: {
        _type: { enum: ["CheckQuestion"] }
      }
      additionalProperties: true
    }

    LocationQuestion: {
      type: "object"
      properties: {
        _type: { enum: ["LocationQuestion"] }
      }
      additionalProperties: true
    }

    ImageQuestion: {
      type: "object"
      properties: {
        _type: { enum: ["ImageQuestion"] }
      }
      additionalProperties: true
    }

    ImagesQuestion: {
      type: "object"
      properties: {
        _type: { enum: ["ImagesQuestion"] }
      }
      additionalProperties: true
    }

    TextListQuestion: {
      type: "object"
      properties: {
        _type: { enum: ["TextListQuestion"] }
      }
      additionalProperties: true
    }

    SiteQuestion: {
      type: "object"
      properties: {
        _id: {}, required: {}, conditions: {}, validations: {}
        _type: { enum: ["SiteQuestion"] }
      }
      additionalProperties: true
    }

    # TODO
    choices: {
      type: "array"
    }
  }
}