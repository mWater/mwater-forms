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
      $oneOf: [
        # Organized by a list of sections (that contain items), or a list of items
        { type: "array", items: { $ref: "#/definitions/section" } }
        { type: "array", items: { $ref: "#/definitions/item" } }
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
      required: ["_base"]
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

    # A section of a form has a name and a series of items(questions) that validate as a group
    section: {
      type: "object"
      properties: {
        # Specifies that this is a section element
        _type: { enum: ["Section"] }

        # Name of the section
        name: { $ref: "#/definitions/localizedString" } 

        # Contains a list of items
        contents: {
          type: "array"
          items: { $ref: "#/definitions/item" }
        }
        required: ["_type", "name", "contents"]
        additionalProperties: false
      }
    }
    
    item: {}
  }
}