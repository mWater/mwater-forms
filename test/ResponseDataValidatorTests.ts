// @ts-nocheck
import { assert } from "chai"
import ResponseDataValidator from "../src/ResponseDataValidator"
import VisibilityCalculator from "../src/VisibilityCalculator"
import { Schema } from "mwater-expressions"
import canonical from "canonical-json"

function compare(actual: any, expected: any) {
  return assert.equal(
    canonical(actual),
    canonical(expected),
    "\n" + canonical(actual) + "\n" + canonical(expected) + "\n"
  )
}

describe("ResponseDataValidator", function () {
  before(function () {
    // Fake row response that returns array for every field, to simulate getting roster rows
    return (this.responseRow = {
      getField(columnId: any) {
        return Promise.resolve([null, null, null, null, null])
      },
      followJoin(columnId: any) {
        return Promise.resolve([null, null, null, null, null])
      }
    })
  })

  describe("without sections", function () {
    before(function () {
      // Make a form with a condition
      return (this.design = {
        _type: "Form",
        contents: [
          {
            _id: "q1",
            _type: "TextQuestion",
            text: { en: "Q1" },
            conditions: [],
            validations: [
              {
                op: "lengthRange",
                rhs: {
                  literal: {
                    max: 5
                  }
                },
                message: {
                  en: "String is too long",
                  _base: "en"
                }
              }
            ]
          },
          {
            _id: "q2",
            _type: "TextQuestion",
            text: { en: "Q2" },
            // Conditional on q1
            conditions: [{ lhs: { question: "q1" }, op: "present" }],
            validations: []
          }
        ]
      })
    })

    it("ok", function (done) {
      const data = { q1: { value: "court" } }

      const validator = new ResponseDataValidator()
      const visibilityCalculator = new VisibilityCalculator(this.design)
      return visibilityCalculator.createVisibilityStructure(
        data,
        this.responseRow,
        async (error, visibilityStructure) => {
          const result = await validator.validate(this.design, visibilityStructure, data)
          assert.isNull(result)
          return done()
        }
      )
    })

    return it("not ok", function (done) {
      const data = { q1: { value: "trop long" } }

      const validator = new ResponseDataValidator()
      const visibilityCalculator = new VisibilityCalculator(this.design)
      return visibilityCalculator.createVisibilityStructure(
        data,
        this.responseRow,
        async (error, visibilityStructure) => {
          const result = await validator.validate(this.design, visibilityStructure, data)
          assert.equal(result.questionId, "q1")
          assert.equal(result.error, "String is too long")
          return done()
        }
      )
    })
  })

  describe("allows invisible required questions", function () {
    before(function () {
      // Make a form with a condition
      return (this.design = {
        _type: "Form",
        contents: [
          {
            _id: "q1",
            _type: "TextQuestion",
            text: { en: "Q1" },
            conditions: [],
            validations: []
          },
          {
            _id: "q2",
            _type: "TextQuestion",
            text: { en: "Q2" },
            required: true,
            // Conditional on q1
            conditions: [{ lhs: { question: "q1" }, op: "present" }],
            validations: []
          }
        ]
      })
    })

    it("no data ok", function (done) {
      const data = {}
      const validator = new ResponseDataValidator()
      const visibilityCalculator = new VisibilityCalculator(this.design)
      return visibilityCalculator.createVisibilityStructure(
        data,
        this.responseRow,
        async (error, visibilityStructure) => {
          const result = await validator.validate(this.design, visibilityStructure, data)
          assert.isNull(result)
          return done()
        }
      )
    })

    it("requires q2 if q1", function (done) {
      // Requires q2 if q1
      const data = { q1: { value: "court" } }
      const validator = new ResponseDataValidator()
      const visibilityCalculator = new VisibilityCalculator(this.design)
      return visibilityCalculator.createVisibilityStructure(
        data,
        this.responseRow,
        async (error, visibilityStructure) => {
          const result = await validator.validate(this.design, visibilityStructure, data)
          assert.equal(result.questionId, "q2")
          assert.equal(result.error, true)
          return done()
        }
      )
    })

    return it("both is ok", function (done) {
      const data = { q1: { value: "trop long" }, q2: { value: "something" } }
      const validator = new ResponseDataValidator()
      const visibilityCalculator = new VisibilityCalculator(this.design)
      return visibilityCalculator.createVisibilityStructure(
        data,
        this.responseRow,
        async (error, visibilityStructure) => {
          const result = await validator.validate(this.design, visibilityStructure, data)
          assert.isNull(result)
          return done()
        }
      )
    })
  })

  describe("validates data with sections", function () {
    before(function () {
      // Make a form with a condition
      return (this.design = {
        _type: "Form",
        contents: [
          {
            _id: "fc6f23bd07cb4f05b8508b9a5d9e6107",
            name: {
              en: "Main Section",
              _base: "en"
            },
            _type: "Section",
            contents: [
              {
                _id: "q1",
                _type: "TextQuestion",
                text: { en: "Q1" },
                conditions: [],
                validations: [
                  {
                    op: "lengthRange",
                    rhs: {
                      literal: {
                        max: 5
                      }
                    },
                    message: {
                      en: "String is too long",
                      _base: "en"
                    }
                  }
                ]
              },
              {
                _id: "q2",
                _type: "TextQuestion",
                text: { en: "Q2" },
                // Conditional on q1
                conditions: [{ lhs: { question: "q1" }, op: "present" }],
                validations: []
              }
            ]
          }
        ]
      })
    })

    it("valid", function (done) {
      const data = { q1: { value: "court" } }
      const validator = new ResponseDataValidator()
      const visibilityCalculator = new VisibilityCalculator(this.design)
      return visibilityCalculator.createVisibilityStructure(
        data,
        this.responseRow,
        async (error, visibilityStructure) => {
          const result = await validator.validate(this.design, visibilityStructure, data)
          assert.isNull(result)
          return done()
        }
      )
    })

    return it("invalid", function (done) {
      const data = { q1: { value: "trop long" } }
      const validator = new ResponseDataValidator()
      const visibilityCalculator = new VisibilityCalculator(this.design)
      return visibilityCalculator.createVisibilityStructure(
        data,
        this.responseRow,
        async (error, visibilityStructure) => {
          const result = await validator.validate(this.design, visibilityStructure, data)
          assert.equal(result.questionId, "q1")
          assert.equal(result.error, "String is too long")
          return done()
        }
      )
    })
  })

  describe("validates RosterMatrix", function () {
    before(function () {
      return (this.design = {
        _type: "Form",
        _id: "form123",
        _schema: 11,
        name: {
          _base: "en",
          en: "Sample Form"
        },
        contents: [
          {
            _id: "matrix01",
            _type: "RosterMatrix",
            name: {
              _base: "en",
              en: "Roster Matrix"
            },
            allowAdd: true,
            allowRemove: true,
            contents: [
              { _id: "a", _type: "TextColumnQuestion", text: { en: "Name" }, required: true },
              {
                _id: "b",
                _type: "NumberColumnQuestion",
                text: { en: "Age" },
                decimal: false,
                validations: [
                  { message: { en: "Wrong", _base: "en" }, op: "range", rhs: { literal: { max: 100, min: 10 } } }
                ]
              },
              { _id: "c", _type: "CheckColumnQuestion", text: { en: "Present" } },
              {
                _id: "d",
                _type: "DropdownColumnQuestion",
                text: { en: "Gender" },
                choices: [
                  { label: { en: "Male" }, id: "male" },
                  { label: { en: "Female" }, id: "female" }
                ]
              }
            ]
          },
          {
            _id: "matrix02",
            _type: "RosterMatrix",
            name: {
              _base: "en",
              en: "Roster Matrix 2"
            },
            rosterId: "matrix01",
            contents: [
              {
                _id: "a2",
                _type: "TextColumnQuestion",
                text: { en: "Name" },
                validations: [
                  {
                    op: "lengthRange",
                    rhs: {
                      literal: {
                        max: 5
                      }
                    },
                    message: {
                      en: "String is too long",
                      _base: "en"
                    }
                  }
                ]
              }
            ]
          }
        ]
      })
    })

    it("required", function (done) {
      // Question a should be complaining (answer to a required)
      const data = { matrix01: [{ data: { b: { value: 33 } } }] }
      const validator = new ResponseDataValidator()
      const visibilityCalculator = new VisibilityCalculator(this.design)
      return visibilityCalculator.createVisibilityStructure(
        data,
        this.responseRow,
        async (error, visibilityStructure) => {
          const result = await validator.validate(this.design, visibilityStructure, data, null, this.responseRow)
          assert.equal(result.questionId, "matrix01.0.a")
          assert.equal(result.error, true)
          return done()
        }
      )
    })

    it("too long", function (done) {
      // Question a2 should be complaining (answer to a is too long)
      const data = { matrix01: [{ data: { a: { value: "something" }, a2: { value: "too long" }, b: { value: 33 } } }] }
      const validator = new ResponseDataValidator()
      const visibilityCalculator = new VisibilityCalculator(this.design)
      return visibilityCalculator.createVisibilityStructure(
        data,
        this.responseRow,
        async (error, visibilityStructure) => {
          const result = await validator.validate(this.design, visibilityStructure, data, null, this.responseRow)
          assert.equal(result.questionId, "matrix02.0.a2")
          assert.equal(result.error, "String is too long")
          return done()
        }
      )
    })

    return it("ok", function (done) {
      // Everything should be fine
      const data = { matrix01: [{ data: { a: { value: "something" }, a2: { value: "court" }, b: { value: 33 } } }] }
      const validator = new ResponseDataValidator()
      const visibilityCalculator = new VisibilityCalculator(this.design)
      return visibilityCalculator.createVisibilityStructure(
        data,
        this.responseRow,
        async (error, visibilityStructure) => {
          const result = await validator.validate(this.design, visibilityStructure, data, null, this.responseRow)
          assert.isNull(result)
          return done()
        }
      )
    })
  })

  describe("validates MatrixQuestion", function () {
    before(function () {
      return (this.design = {
        _type: "Form",
        _id: "form123",
        _schema: 11,
        name: {
          _base: "en",
          en: "Sample Form"
        },
        contents: [
          {
            _id: "matrix01",
            _type: "MatrixQuestion",
            name: {
              _base: "en",
              en: "Matrix"
            },
            items: [
              { id: "item1", label: { en: "First", _base: "en" } },
              { id: "item2", label: { en: "Second", _base: "en" } },
              { id: "item3", label: { en: "Third", _base: "en" }, hint: { en: "Some hint" } }
            ],
            columns: [
              {
                _id: "a",
                _type: "TextColumnQuestion",
                text: { en: "Name" },
                required: true,
                validations: [
                  {
                    op: "lengthRange",
                    rhs: {
                      literal: {
                        max: 10
                      }
                    },
                    message: {
                      en: "String is too long",
                      _base: "en"
                    }
                  }
                ]
              },
              { _id: "b", _type: "NumberColumnQuestion", text: { en: "Age" }, decimal: false },
              { _id: "c", _type: "CheckColumnQuestion", text: { en: "Present" } },
              {
                _id: "d",
                _type: "DropdownColumnQuestion",
                text: { en: "Gender" },
                choices: [
                  { label: { en: "Male" }, id: "male" },
                  { label: { en: "Female" }, id: "female" }
                ]
              },
              {
                _id: "e",
                _type: "UnitsColumnQuestion",
                text: { en: "Unit" },
                units: [
                  { label: { en: "CM" }, id: "cm" },
                  { label: { en: "INCH" }, id: "inch" }
                ]
              }
            ]
          }
        ]
      })
    })

    it("too long", function (done) {
      // Item1 should be complaining (answoer to a is too long)
      const data = { matrix01: { value: { item1: { a: { value: "data too long" } } } } }
      const validator = new ResponseDataValidator()
      const visibilityCalculator = new VisibilityCalculator(this.design)
      return visibilityCalculator.createVisibilityStructure(
        data,
        this.responseRow,
        async (error, visibilityStructure) => {
          const result = await validator.validate(this.design, visibilityStructure, data, null, this.responseRow)
          assert.equal(result.questionId, "matrix01.item1.a")
          assert.equal(result.error, "String is too long")
          return done()
        }
      )
    })

    it("required 1", function (done) {
      // Item1 should be complaining (missing required field)
      const data = { value: {} }
      const validator = new ResponseDataValidator()
      const visibilityCalculator = new VisibilityCalculator(this.design)
      return visibilityCalculator.createVisibilityStructure(
        data,
        this.responseRow,
        async (error, visibilityStructure) => {
          const result = await validator.validate(this.design, visibilityStructure, data, null, this.responseRow)
          assert.equal(result.questionId, "matrix01.item1.a")
          assert.equal(result.error, true)
          return done()
        }
      )
    })

    it("required 2", function (done) {
      // Now Item2 should be complaining (missing required field)
      const data = { matrix01: { value: { item1: { a: { value: "data" } } } } }
      const validator = new ResponseDataValidator()
      const visibilityCalculator = new VisibilityCalculator(this.design)
      return visibilityCalculator.createVisibilityStructure(
        data,
        this.responseRow,
        async (error, visibilityStructure) => {
          const result = await validator.validate(this.design, visibilityStructure, data, null, this.responseRow)
          // debugger
          assert.equal(result.questionId, "matrix01.item2.a")
          assert.equal(result.error, true)
          return done()
        }
      )
    })

    return it("ok", function (done) {
      // Now there shouldn't be any error
      const data = {
        matrix01: {
          value: {
            item1: { a: { value: "data" } },
            item2: { a: { value: "data" } },
            item3: { a: { value: "data" } }
          }
        }
      }
      const validator = new ResponseDataValidator()
      const visibilityCalculator = new VisibilityCalculator(this.design)
      return visibilityCalculator.createVisibilityStructure(
        data,
        this.responseRow,
        async (error, visibilityStructure) => {
          const result = await validator.validate(this.design, visibilityStructure, data, null, this.responseRow)
          assert.isNull(result)
          return done()
        }
      )
    })
  })

  return describe("validates RosterGroup", function () {
    before(function () {
      return (this.design = {
        _type: "Form",
        _id: "form123",
        _schema: 11,
        name: {
          _base: "en",
          en: "Sample Form"
        },
        contents: [
          {
            _id: "firstRosterGroupId",
            name: { en: "First Roster Group", _base: "en" },
            _type: "RosterGroup",
            required: false,
            contents: []
          },
          {
            _id: "secondRosterGroupId",
            rosterId: "firstRosterGroupId",
            name: { en: "Second Roster Group", _base: "en" },
            _type: "RosterGroup",
            required: false,
            contents: [
              {
                _id: "a",
                _type: "TextColumnQuestion",
                text: { en: "Name" },
                required: true,
                validations: [
                  {
                    op: "lengthRange",
                    rhs: {
                      literal: {
                        max: 5
                      }
                    },
                    message: {
                      en: "String is too long",
                      _base: "en"
                    }
                  }
                ]
              }
            ]
          }
        ]
      })
    })

    it("too long", function (done) {
      const data = {
        firstRosterGroupId: [
          {
            data: { a: { value: "trop long" } }
          }
        ]
      }
      const validator = new ResponseDataValidator()
      const visibilityCalculator = new VisibilityCalculator(this.design)
      return visibilityCalculator.createVisibilityStructure(
        data,
        this.responseRow,
        async (error, visibilityStructure) => {
          const result = await validator.validate(this.design, visibilityStructure, data, null, this.responseRow)
          assert.equal(result.questionId, "secondRosterGroupId.0.a")
          assert.equal(result.error, "String is too long")
          return done()
        }
      )
    })

    it("required", function (done) {
      const data = {
        firstRosterGroupId: [{ data: {} }]
      }
      const validator = new ResponseDataValidator()
      const visibilityCalculator = new VisibilityCalculator(this.design)
      return visibilityCalculator.createVisibilityStructure(
        data,
        this.responseRow,
        async (error, visibilityStructure) => {
          const result = await validator.validate(this.design, visibilityStructure, data, null, this.responseRow)
          assert.equal(result.questionId, "secondRosterGroupId.0.a")
          // TODO, Should give a better error than that!
          assert.equal(result.error, true)
          return done()
        }
      )
    })

    return it("ok", function (done) {
      // Now there shouldn't be any error
      const data = {
        firstRosterGroupId: [
          {
            data: { a: { value: "court" } }
          }
        ]
      }
      const validator = new ResponseDataValidator()
      const visibilityCalculator = new VisibilityCalculator(this.design)
      return visibilityCalculator.createVisibilityStructure(
        data,
        this.responseRow,
        async (error, visibilityStructure) => {
          const result = await validator.validate(this.design, visibilityStructure, data, null, this.responseRow)
          assert.isNull(result)
          return done()
        }
      )
    })
  })
})
