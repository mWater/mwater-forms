assert = require('chai').assert
ResponseDataValidator = require '../src/ResponseDataValidator'
VisibilityCalculator = require '../src/VisibilityCalculator'
Schema = require('mwater-expressions').Schema
canonical = require 'canonical-json'

compare = (actual, expected) ->
  assert.equal canonical(actual), canonical(expected), "\n" + canonical(actual) + "\n" + canonical(expected) + "\n"

describe "ResponseDataValidator", ->
  before ->
    # Fake row response that returns array for every field, to simulate getting roster rows
    @responseRow = {
      getField: (columnId) -> Promise.resolve([null, null, null, null, null])
      followJoin: (columnId) -> Promise.resolve([null, null, null, null, null])
    }

  describe "without sections", ->
    before ->
      # Make a form with a condition
      @design = {
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

    it "ok", (done) ->
      data = { q1: { value: "court" }}

      validator = new ResponseDataValidator()
      visibilityCalculator = new VisibilityCalculator(@design)
      visibilityCalculator.createVisibilityStructure(data, @responseRow, (error, visibilityStructure) =>
        result = await validator.validate(@design, visibilityStructure, data)
        assert.isNull result
        done()
      )

    it "not ok", (done) ->
      data = { q1: { value: "trop long" }}

      validator = new ResponseDataValidator()
      visibilityCalculator = new VisibilityCalculator(@design)
      visibilityCalculator.createVisibilityStructure(data, @responseRow, (error, visibilityStructure) =>
        result = await validator.validate(@design, visibilityStructure, data)
        assert.equal result.questionId, 'q1'
        assert.equal result.error, "String is too long"
        done()
      )

  describe "allows invisible required questions", ->
    before ->
      # Make a form with a condition
      @design = {
        _type: "Form"
        contents: [
          {
            _id: "q1"
            _type: "TextQuestion"
            text: { en: "Q1" }
            conditions: []
            validations: []
          }
          {
            _id: "q2"
            _type: "TextQuestion"
            text: { en: "Q2" }
            required: true
            # Conditional on q1
            conditions: [{ lhs: { question: "q1" }, op: "present" }]
            validations: []
          }
        ]
      }

    it "no data ok", (done) ->
      data = { }
      validator = new ResponseDataValidator()
      visibilityCalculator = new VisibilityCalculator(@design)
      visibilityCalculator.createVisibilityStructure(data, @responseRow, (error, visibilityStructure) =>
        result = await validator.validate(@design, visibilityStructure, data)
        assert.isNull result
        done()
      )

    it "requires q2 if q1", (done) ->
      # Requires q2 if q1
      data = { q1: { value: "court" }}
      validator = new ResponseDataValidator()
      visibilityCalculator = new VisibilityCalculator(@design)
      visibilityCalculator.createVisibilityStructure(data, @responseRow, (error, visibilityStructure) =>
        result = await validator.validate(@design, visibilityStructure, data)
        assert.equal result.questionId, 'q2'
        assert.equal result.error, true
        done()
      )

    it "both is ok", (done) ->
      data = { q1: { value: "trop long" }, q2: { value: "something" }}
      validator = new ResponseDataValidator()
      visibilityCalculator = new VisibilityCalculator(@design)
      visibilityCalculator.createVisibilityStructure(data, @responseRow, (error, visibilityStructure) =>
        result = await validator.validate(@design, visibilityStructure, data)
        assert.isNull result
        done()
      )
    
  describe "validates data with sections", ->
    before ->
      # Make a form with a condition
      @design = {
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

    it "valid", (done) ->
      data = { q1: { value: "court" }}
      validator = new ResponseDataValidator()
      visibilityCalculator = new VisibilityCalculator(@design)
      visibilityCalculator.createVisibilityStructure(data, @responseRow, (error, visibilityStructure) =>
        result = await validator.validate(@design, visibilityStructure, data)
        assert.isNull result
        done()
      )

    it "invalid", (done) ->
      data = { q1: { value: "trop long" }}
      validator = new ResponseDataValidator()
      visibilityCalculator = new VisibilityCalculator(@design)
      visibilityCalculator.createVisibilityStructure(data, @responseRow, (error, visibilityStructure) =>
        result = await validator.validate(@design, visibilityStructure, data)
        assert.equal result.questionId, "q1"
        assert.equal result.error, "String is too long"
        done()
      )

  describe "validates RosterMatrix", ->
    before ->
      @design = {
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

    it "required", (done) ->
      # Question a should be complaining (answer to a required)
      data = {matrix01: [data: {b: {value: 33}}]}
      validator = new ResponseDataValidator()
      visibilityCalculator = new VisibilityCalculator(@design)
      visibilityCalculator.createVisibilityStructure(data, @responseRow, (error, visibilityStructure) =>
        result = await validator.validate(@design, visibilityStructure, data)
        assert.equal result.questionId, 'matrix01.0.a'
        assert.equal result.error, true
        done()
      )

    it "too long", (done) ->
      # Question a2 should be complaining (answer to a is too long)
      data = {matrix01: [data: {a: {value: 'something'}, a2: {value: 'too long'}, b: {value: 33}}]}
      validator = new ResponseDataValidator()
      visibilityCalculator = new VisibilityCalculator(@design)
      visibilityCalculator.createVisibilityStructure(data, @responseRow, (error, visibilityStructure) =>
        result = await validator.validate(@design, visibilityStructure, data)
        assert.equal result.questionId, 'matrix02.0.a2'
        assert.equal result.error, 'String is too long'
        done()
      )

    it "ok", (done) ->
      # Everything should be fine
      data = {matrix01: [data: {a: {value: 'something'}, a2: {value: 'court'}, b: {value: 33}}]}
      validator = new ResponseDataValidator()
      visibilityCalculator = new VisibilityCalculator(@design)
      visibilityCalculator.createVisibilityStructure(data, @responseRow, (error, visibilityStructure) =>
        result = await validator.validate(@design, visibilityStructure, data)
        assert.isNull result
        done()
      )

  describe "validates MatrixQuestion", ->
    before ->
      @design = {
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

    it "too long", (done) ->
      # Item1 should be complaining (answoer to a is too long)
      data = { matrix01: {value: {item1: {a: {value: 'data too long'}}}}}
      validator = new ResponseDataValidator()
      visibilityCalculator = new VisibilityCalculator(@design)
      visibilityCalculator.createVisibilityStructure(data, @responseRow, (error, visibilityStructure) =>
        result = await validator.validate(@design, visibilityStructure, data)
        assert.equal result.questionId, 'matrix01.item1.a'
        assert.equal result.error, 'String is too long'
        done()
      )

    it "required 1", (done) ->
      # Item1 should be complaining (missing required field)
      data = { value: { }}
      validator = new ResponseDataValidator()
      visibilityCalculator = new VisibilityCalculator(@design)
      visibilityCalculator.createVisibilityStructure(data, @responseRow, (error, visibilityStructure) =>
        result = await validator.validate(@design, visibilityStructure, data)
        assert.equal result.questionId, 'matrix01.item1.a'
        assert.equal result.error, true
        done()
      )

    it "required 2", (done) ->
      # Now Item2 should be complaining (missing required field)
      data = { matrix01: { value: {item1: {a: {value: 'data'}}}}}
      validator = new ResponseDataValidator()
      visibilityCalculator = new VisibilityCalculator(@design)
      visibilityCalculator.createVisibilityStructure(data, @responseRow, (error, visibilityStructure) =>
        result = await validator.validate(@design, visibilityStructure, data)
        # debugger
        assert.equal result.questionId, 'matrix01.item2.a'
        assert.equal result.error, true
        done()
      )

    it "ok", (done) ->
      # Now there shouldn't be any error
      data = {
        matrix01: {
          value: {
            item1: {a: {value: 'data'}}
            item2: {a: {value: 'data'}}
            item3: {a: {value: 'data'}}
          }
        }
      }
      validator = new ResponseDataValidator()
      visibilityCalculator = new VisibilityCalculator(@design)
      visibilityCalculator.createVisibilityStructure(data, @responseRow, (error, visibilityStructure) =>
        result = await validator.validate(@design, visibilityStructure, data)
        assert.isNull result
        done()
      )

  describe "validates RosterGroup", ->
    before ->
      @design = {
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

    it "too long", (done) ->
      data = {
        firstRosterGroupId: [{
          data: {a: {value: 'trop long'}}
        }]
      }
      validator = new ResponseDataValidator()
      visibilityCalculator = new VisibilityCalculator(@design)
      visibilityCalculator.createVisibilityStructure(data, @responseRow, (error, visibilityStructure) =>
        result = await validator.validate(@design, visibilityStructure, data)
        assert.equal result.questionId, 'secondRosterGroupId.0.a'
        assert.equal result.error, 'String is too long'
        done()
      )

    it "required", (done) ->
      data = {
        firstRosterGroupId: [
          data: {}
        ]
      }
      validator = new ResponseDataValidator()
      visibilityCalculator = new VisibilityCalculator(@design)
      visibilityCalculator.createVisibilityStructure(data, @responseRow, (error, visibilityStructure) =>
        result = await validator.validate(@design, visibilityStructure, data)
        assert.equal result.questionId, 'secondRosterGroupId.0.a'
        # TODO, Should give a better error than that!
        assert.equal result.error, true
        done()
      )

    it "ok", (done) ->
      # Now there shouldn't be any error
      data = {
        firstRosterGroupId: [{
          data: {a: {value: 'court'}}
        }]
      }
      validator = new ResponseDataValidator()
      visibilityCalculator = new VisibilityCalculator(@design)
      visibilityCalculator.createVisibilityStructure(data, @responseRow, (error, visibilityStructure) =>
        result = await validator.validate(@design, visibilityStructure, data)
        assert.isNull result
        done()
      )