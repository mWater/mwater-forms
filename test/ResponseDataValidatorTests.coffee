assert = require('chai').assert
ResponseDataValidator = require '../src/ResponseDataValidator'
Schema = require('mwater-expressions').Schema
canonical = require 'canonical-json'

compare = (actual, expected) ->
  assert.equal canonical(actual), canonical(expected), "\n" + canonical(actual) + "\n" + canonical(expected) + "\n"

describe "ResponseDataValidator", ->
  it "validates data without sections", () ->
    # Make a form with a condition
    design = {
      _type: "Form"
      contents: [
        {
          _id: "q1"
          _type: "TextQuestion"
          text: { en: "Q1" }
          conditions: []
          validations: [{
            "op": "lengthRange",
            "rhs": {
              "literal": {
                "max": 5
              }
            },
            "message": {
              "en": "String is too long",
              "_base": "en"
            }
          }]
        }
        {
          _id: "q2"
          _type: "TextQuestion"
          text: { en: "Q2" }
          # Conditional on q1
          conditions: [{ lhs: { question: "q1" }, op: "present" }]
          validations: []
        }
      ]
    }

    validator = new ResponseDataValidator()

    data = { q1: { value: "court" }}
    result = validator.validate(design, data)
    assert.isNull result

    data = { q1: { value: "trop long" }}
    result = validator.validate(design, data)
    assert.equal result.questionId, 'q1'
    assert.equal result.error, "String is too long"

  it "validates data with sections", () ->
    # Make a form with a condition
    design = {
      _type: "Form"
      contents: [
        {
          "_id": "fc6f23bd07cb4f05b8508b9a5d9e6107",
          "name": {
            "en": "Main Section",
            "_base": "en"
          },
          "_type": "Section",
          "contents": [
            {
              _id: "q1"
              _type: "TextQuestion"
              text: {en: "Q1"}
              conditions: []
              validations: [{
                "op": "lengthRange",
                "rhs": {
                  "literal": {
                    "max": 5
                  }
                },
                "message": {
                  "en": "String is too long",
                  "_base": "en"
                }
              }]
            }
            {
              _id: "q2"
              _type: "TextQuestion"
              text: {en: "Q2"}
              # Conditional on q1
              conditions: [{lhs: {question: "q1"}, op: "present"}]
              validations: []
            }
          ]
        }
      ]
    }

    validator = new ResponseDataValidator()

    data = { q1: { value: "court" }}
    result = validator.validate(design, data)
    assert.isNull result

    data = { q1: { value: "trop long" }}
    result = validator.validate(design, data)
    assert.equal result.questionId, "q1"
    assert.equal result.error, "String is too long"


  it "validates RosterMatrix", () ->
    design = {
      "_type": "Form",
      _id: "form123"
      "_schema": 11,
      "name": {
        "_base": "en",
        "en": "Sample Form"
      },
      "contents": [
        {
          _id: "matrix01"
          _type: "RosterMatrix"
          "name": {
            "_base": "en",
            "en": "Roster Matrix"
          },
          allowAdd: true,
          allowRemove: true,
          contents: [
            { _id: "a", _type: "TextColumnQuestion", text: { en: "Name" }, required: true}
            { _id: "b", _type: "NumberColumnQuestion", text: { en: "Age" }, decimal: false }
            { _id: "c", _type: "CheckColumnQuestion", text: { en: "Present" } }
            { _id: "d", _type: "DropdownColumnQuestion", text: { en: "Gender" }, choices: [{ label: { en: "Male"}, id: "male" }, { label: { en: "Female"}, id: "female" }] }
          ]
        },
        {
          _id: "matrix02"
          _type: "RosterMatrix"
          "name": {
            "_base": "en",
            "en": "Roster Matrix 2"
          },
          rosterId: "matrix01",
          contents: [
            { _id: "a2", _type: "TextColumnQuestion", text: { en: "Name" }, validations: [{
              "op": "lengthRange",
              "rhs": {
                "literal": {
                  "max": 5
                }
              },
              "message": {
                "en": "String is too long",
                "_base": "en"
              }
            }]}
          ]
        }
      ]
    }

    validator = new ResponseDataValidator()

    # Question a should be complaining (answer to a required)
    data = {matrix01: [data: {b: {value: 33}}]}
    result = validator.validate(design, data)
    assert.equal result.questionId, 'matrix01.0.a'
    assert.equal result.error, true

    # Question a2 should be complaining (answer to a is too long)
    data = {matrix01: [data: {a: {value: 'something'}, a2: {value: 'too long'}, b: {value: 33}}]}
    result = validator.validate(design, data)
    assert.equal result.questionId, 'matrix02.0.a2'
    assert.equal result.error, 'String is too long'

    # Everything should be fine
    data = {matrix01: [data: {a: {value: 'something'}, a2: {value: 'court'}, b: {value: 33}}]}
    result = validator.validate(design, data)
    assert.isNull result

  it "validates MatrixQuestion", () ->
    design = {
      _type: "Form"
      _id: "form123"
      "_schema": 11,
      "name": {
        "_base": "en",
        "en": "Sample Form"
      },
      "contents": [
        {
          _id: "matrix01"
          _type: "MatrixQuestion"
          "name": {
            "_base": "en",
            "en": "Matrix"
          },
          items: [
            { "id": "item1", "label": { "en": "First", "_base": "en" } }
            { "id": "item2", "label": { "en": "Second", "_base": "en" } }
            { "id": "item3", "label": { "en": "Third", "_base": "en" }, hint: { en: "Some hint"} }
          ]
          columns: [
            { _id: "a", _type: "TextColumnQuestion", text: { en: "Name" }, required: true, validations: [{
              "op": "lengthRange",
              "rhs": {
                "literal": {
                  "max": 10
                }
              },
              "message": {
                "en": "String is too long",
                "_base": "en"
              }
            }] }
            { _id: "b", _type: "NumberColumnQuestion", text: { en: "Age" }, decimal: false }
            { _id: "c", _type: "CheckColumnQuestion", text: { en: "Present" } }
            { _id: "d", _type: "DropdownColumnQuestion", text: { en: "Gender" }, choices: [{ label: { en: "Male"}, id: "male" }, { label: { en: "Female"}, id: "female" }] }
            { _id: "e", _type: "UnitsColumnQuestion", text: { en: "Unit" }, units: [{ label: { en: "CM"}, id: "cm" }, { label: { en: "INCH"}, id: "inch" }] }
          ]
        }
      ]
    }

    validator = new ResponseDataValidator()

    # Item1 should be complaining (answoer to a is too long)
    data = {matrix01: {item1: {a: {value: 'data too long'}}}}
    result = validator.validate(design, data)
    assert.equal result.questionId, 'matrix01.item1.a'
    assert.equal result.error, 'String is too long'

    # Item1 should be complaining (missing required field)
    data = { }
    result = validator.validate(design, data)
    assert.equal result.questionId, 'matrix01.item1.a'
    assert.equal result.error, true

    # Now Item2 should be complaining (missing required field)
    data = { matrix01: {item1: {a: {value: 'data'}}}}
    result = validator.validate(design, data)
    assert.equal result.questionId, 'matrix01.item2.a'
    assert.equal result.error, true

    # Now there shouldn't be any error
    data = {
      matrix01: {
        item1: {a: {value: 'data'}}
        item2: {a: {value: 'data'}}
        item3: {a: {value: 'data'}}
      }
    }
    result = validator.validate(design, data)
    assert.isNull result

  it "validates RosterGroup", () ->
    design = {
      _type: "Form"
      _id: "form123"
      "_schema": 11,
      "name": {
        "_base": "en",
        "en": "Sample Form"
      },
      "contents": [
        {
          _id: "firstRosterGroupId",
          name: {"en":"First Roster Group","_base":"en"},
          _type: "RosterGroup",
          required: false,
          contents: []
        },
        {
          _id: "secondRosterGroupId",
          rosterId: "firstRosterGroupId",
          name: {"en":"Second Roster Group","_base":"en"},
          _type: "RosterGroup",
          required: false,
          contents: [
            { _id: "a", _type: "TextColumnQuestion", text: { en: "Name" }, required: true, validations: [{
              "op": "lengthRange",
              "rhs": {
                "literal": {
                  "max": 5
                }
              },
              "message": {
                "en": "String is too long",
                "_base": "en"
              }
            }] }
          ]
        }
      ]
    }

    validator = new ResponseDataValidator()

    data = {
      firstRosterGroupId: [{
        data: {a: {value: 'trop long'}}
      }]
    }
    result = validator.validate(design, data)
    assert.equal result.questionId, 'secondRosterGroupId.0.a'
    assert.equal result.error, 'String is too long'

    data = {
      firstRosterGroupId: [
        data: {}
      ]
    }
    result = validator.validate(design, data)
    assert.equal result.questionId, 'secondRosterGroupId.0.a'
    # TODO, Should give a better error than that!
    assert.equal result.error, true

    # Now there shouldn't be any error
    data = {
      firstRosterGroupId: [{
        data: {a: {value: 'court'}}
      }]
    }
    result = validator.validate(design, data)
    assert.isNull result


