// @ts-nocheck
// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
import _ from "lodash"
import { assert } from "chai"
import ResponseCleaner from "../src/ResponseCleaner"
import VisibilityCalculator from "../src/VisibilityCalculator"

describe("ResponseCleaner", function () {
  describe("cleanData", function () {
    it("handles cascading changes", function (done) {
      // Simulate q1 making q2 appear which has a default value. q3 has a condition on q2 not being present, so it should
      // have its value removed.
      const q1 = { _id: "q1", _type: "TextQuestion", conditions: [] }
      const q2 = { _id: "q2", _type: "TextQuestion", conditions: [{ lhs: { question: "q1" }, op: "present" }] }
      const q3 = { _id: "q3", _type: "TextQuestion", conditions: [{ lhs: { question: "q2" }, op: "!present" }] }

      const design = {
        _type: "Form",
        contents: [q1, q2, q3]
      }

      // Fake defaultValueApplier
      const defaultValueApplier = {
        setStickyData(newData: any, oldVisibilityStructure: any, newVisibilityStructure: any) {
          newData = _.cloneDeep(newData)
          // Default q2
          if (!oldVisibilityStructure["q2"] && newVisibilityStructure["q2"]) {
            newData.q2 = { value: "defaulttext" }
          }

          return newData
        }
      }

      // Fake random asked calculator
      const randomAskedCalculator = {
        calculateRandomAsked(data: any, visibilityStructure: any) {
          return data
        }
      }

      const visibilityCalculator = new VisibilityCalculator(design)
      const responseCleaner = new ResponseCleaner()

      const data = { q1: { value: "sometext" }, q3: { value: "moretext" } }
      const oldVisibilityStructure = { q1: true, q2: false, q3: true }

      return responseCleaner.cleanData(
        design,
        visibilityCalculator,
        defaultValueApplier,
        randomAskedCalculator,
        data,
        function () {},
        oldVisibilityStructure,
        (error: any, results: any) => {
          assert(!error)
          assert.deepEqual(results.data, { q1: { value: "sometext" }, q2: { value: "defaulttext" } })
          assert.deepEqual(results.visibilityStructure, { q1: true, q2: true, q3: false })
          return done()
        }
      );
    })

    return it("does not delete disabled questions data", function (done) {
      const q1 = { _id: "q1", _type: "TextQuestion", conditions: [], disabled: true }

      const design = {
        _type: "Form",
        contents: [q1]
      }

      // Fake defaultValueApplier
      const defaultValueApplier = {
        setStickyData(newData: any, oldVisibilityStructure: any, newVisibilityStructure: any) {
          return newData
        }
      }

      // Fake random asked calculator
      const randomAskedCalculator = {
        calculateRandomAsked(data: any, visibilityStructure: any) {
          return data
        }
      }

      const visibilityCalculator = new VisibilityCalculator(design)
      const responseCleaner = new ResponseCleaner()

      const data = { q1: { value: "sometext" } }
      const oldVisibilityStructure = { q1: false }

      return responseCleaner.cleanData(
        design,
        visibilityCalculator,
        defaultValueApplier,
        randomAskedCalculator,
        data,
        function () {},
        oldVisibilityStructure,
        (error: any, results: any) => {
          assert(!error)
          assert.deepEqual(results.data, { q1: { value: "sometext" } })
          return done()
        }
      );
    });
  })

  describe("cleanDataBasedOnVisibility", function () {
    describe("Simple cases", function () {
      it("keeps the data for all visible questions", function () {
        const responseCleaner = new ResponseCleaner()

        const design = {}
        const data = { questionA: true, questionB: "patate" }
        const visibilityStructure = { questionA: true, questionB: true }

        const newData = responseCleaner.cleanDataBasedOnVisibility(data, visibilityStructure)

        assert(data !== newData, "It returned data instead of a copy")
        return assert.deepEqual(data, newData, "Data should have stayed the same")
      })

      it("removes the data for all invisible questions", function () {
        const responseCleaner = new ResponseCleaner()

        const design = {}
        const data = { questionA: true, questionB: "patate" }
        const visibilityStructure = { questionA: false, questionB: false }

        const newData = responseCleaner.cleanDataBasedOnVisibility(data, visibilityStructure)

        assert(data !== newData, "It returned data instead of a copy")
        return assert.deepEqual({}, newData, "All the data should have been removed")
      })

      return it("keeps randomAsked for invisible questions so that the decision is not lost", function () {
        const responseCleaner = new ResponseCleaner()

        const design = {}
        const data = { questionA: { value: "apple", randomAsked: false } }
        const visibilityStructure = { questionA: false }

        const newData = responseCleaner.cleanDataBasedOnVisibility(data, visibilityStructure)

        return assert.deepEqual(newData, { questionA: { randomAsked: false } }, "Should keep randomAsked")
      })
    })

    describe("Roster groups", function () {
      it("keeps the data for all visible questions", function () {
        const responseCleaner = new ResponseCleaner()

        const design = {}
        const data = { rosterGroupId: [{ data: { firstQuestionId: "sometext" } }] }
        const visibilityStructure = { rosterGroupId: true, "rosterGroupId.0.firstQuestionId": true }

        const newData = responseCleaner.cleanDataBasedOnVisibility(data, visibilityStructure, design)

        assert(data !== newData, "It returned data instead of a copy")
        return assert.deepEqual(data, newData, "Data should have stayed the same")
      })

      it("removes part of the data if sub question is not visible", function () {
        const responseCleaner = new ResponseCleaner()

        const design = {}
        const data = { rosterGroupId: [{ data: { firstQuestionId: "sometext", secondQuestionId: "moretext" } }] }
        const visibilityStructure = {
          rosterGroupId: true,
          "rosterGroupId.0.firstQuestionId": true,
          "rosterGroupId.0.secondQuestionId": false
        }

        const newData = responseCleaner.cleanDataBasedOnVisibility(data, visibilityStructure, design)

        const expectedData = { rosterGroupId: [{ data: { firstQuestionId: "sometext" } }] }

        assert(data !== newData, "It returned data instead of a copy")
        return assert.deepEqual(
          expectedData,
          newData,
          "Only the secondQuestionId should have been deleted: " + JSON.stringify(newData)
        )
      })

      return it("removes all the data if the rosterGroupId is invisible", function () {
        const responseCleaner = new ResponseCleaner()

        const design = {}
        const data = { rosterGroupId: [{ data: { firstQuestionId: "sometext", secondQuestionId: "moretext" } }] }
        const visibilityStructure = {
          rosterGroupId: false,
          "rosterGroupId.0.firstQuestionId": false,
          "rosterGroupId.0.secondQuestionId": false
        }

        const newData = responseCleaner.cleanDataBasedOnVisibility(data, visibilityStructure, design)

        const expectedData = {}

        assert(data !== newData, "It returned data instead of a copy")
        return assert.deepEqual(expectedData, newData, "The whole roster entry should have been deleted")
      })
    })

    return describe("Matrix", function () {
      it("keeps the data for all visible questions", function () {
        const responseCleaner = new ResponseCleaner()

        const design = {}
        const data = { matrixId: { item1Id: { firstQuestionId: "sometext" } } }
        const visibilityStructure = { matrixId: true, "matrixId.item1Id.firstQuestionId": true }

        const newData = responseCleaner.cleanDataBasedOnVisibility(data, visibilityStructure, design)

        assert(data !== newData, "It returned data instead of a copy")
        return assert.deepEqual(data, newData, "Data should have stayed the same")
      })

      it("removes part of the data if sub question is not visible", function () {
        const responseCleaner = new ResponseCleaner()

        const design = {}
        const data = { matrixId: { item1Id: { firstQuestionId: "sometext", secondQuestionId: "moretext" } } }
        const visibilityStructure = {
          matrixId: true,
          "matrixId.item1Id.firstQuestionId": true,
          "matrixId.item1Id.secondQuestionId": false
        }

        const newData = responseCleaner.cleanDataBasedOnVisibility(data, visibilityStructure, design)
        const expectedData = { matrixId: { item1Id: { firstQuestionId: "sometext" } } }

        assert(data !== newData, "It returned data instead of a copy")
        return assert.deepEqual(
          expectedData,
          newData,
          "Only the secondQuestionId should have been deleted: " + JSON.stringify(newData)
        )
      })

      return it("removes all the data if the whole thing is invisible", function () {
        const responseCleaner = new ResponseCleaner()

        const design = {}
        const data = { matrixId: { item1Id: { firstQuestionId: "sometext" } } }
        const visibilityStructure = { matrixId: false, "matrixId.item1Id.firstQuestionId": true }

        const newData = responseCleaner.cleanDataBasedOnVisibility(data, visibilityStructure, design)

        const expectedData = {}

        assert(data !== newData, "It returned data instead of a copy")
        return assert.deepEqual(expectedData, newData, "The whole matrix should have been deleted")
      })
    })
  })

  return describe("cleanDataBasedOnChoiceConditions", function () {
    it("removes invalid dropdown options", function () {
      // Choice c1 conditional on q1 being present
      const design = {
        _type: "Form",
        contents: [
          { _id: "q1", _type: "TextQuestion" },
          {
            _id: "q2",
            _type: "DropdownQuestion",
            choices: [{ id: "c1", conditions: [{ lhs: { question: "q1" }, op: "present" }] }]
          }
        ]
      }

      const responseCleaner = new ResponseCleaner()
      const data = { q2: { value: "c1" } }
      const visibilityStructure = { q1: true, q2: true }

      const newData = responseCleaner.cleanDataBasedOnChoiceConditions(data, visibilityStructure, design)

      const expectedData = {}
      return assert.deepEqual(expectedData, newData, "Choice should be deleted")
    })

    it("leaves valid dropdown options", function () {
      // Choice c1 conditional on q1 being present
      const design = {
        _type: "Form",
        contents: [
          { _id: "q1", _type: "TextQuestion" },
          {
            _id: "q2",
            _type: "DropdownQuestion",
            choices: [{ id: "c1", conditions: [{ lhs: { question: "q1" }, op: "present" }] }]
          }
        ]
      }

      const responseCleaner = new ResponseCleaner()
      const data = { q1: { value: "sometext" }, q2: { value: "c1" } }
      const visibilityStructure = { q1: true, q2: true }

      const newData = responseCleaner.cleanDataBasedOnChoiceConditions(data, visibilityStructure, design)

      const expectedData = { q1: { value: "sometext" }, q2: { value: "c1" } }
      return assert.deepEqual(expectedData, newData, "Choice should be left")
    })

    describe("roster", function () {
      it("removes invalid dropdown options", function () {
        // Choice c1 conditional on q1 being present
        const design = {
          _type: "Form",
          contents: [
            {
              _id: "r1",
              _type: "RosterGroup",
              contents: [
                { _id: "q1", _type: "TextQuestion" },
                {
                  _id: "q2",
                  _type: "DropdownQuestion",
                  choices: [{ id: "c1", conditions: [{ lhs: { question: "q1" }, op: "present" }] }]
                }
              ]
            }
          ]
        }

        const responseCleaner = new ResponseCleaner()
        const data = { r1: [{ _id: "e1", data: { q2: { value: "c1" } } }] }
        const visibilityStructure = { r1: true, "r1.0.q1": true, "r1.0.q2": true }

        const newData = responseCleaner.cleanDataBasedOnChoiceConditions(data, visibilityStructure, design)

        const expectedData = { r1: [{ _id: "e1", data: {} }] }
        return assert.deepEqual(expectedData, newData, "Choice should be deleted")
      })

      return it("leaves valid dropdown options", function () {
        // Choice c1 conditional on q1 being present
        const design = {
          _type: "Form",
          contents: [
            {
              _id: "r1",
              _type: "RosterGroup",
              contents: [
                { _id: "q1", _type: "TextQuestion" },
                {
                  _id: "q2",
                  _type: "DropdownQuestion",
                  choices: [{ id: "c1", conditions: [{ lhs: { question: "q1" }, op: "present" }] }]
                }
              ]
            }
          ]
        }

        const responseCleaner = new ResponseCleaner()
        const data = { r1: [{ _id: "e1", data: { q1: { value: "sometext" }, q2: { value: "c1" } } }] }
        const visibilityStructure = { r1: true, "r1.0.q1": true, "r1.0.q2": true }

        const newData = responseCleaner.cleanDataBasedOnChoiceConditions(data, visibilityStructure, design)

        const expectedData = { r1: [{ _id: "e1", data: { q1: { value: "sometext" }, q2: { value: "c1" } } }] }
        return assert.deepEqual(expectedData, newData, "Choice should be left")
      })
    })

    return it("leaves valid dropdown options", function () {
      // Choice c1 conditional on q1 being present
      const design = {
        _type: "Form",
        contents: [
          { _id: "q1", _type: "TextQuestion" },
          {
            _id: "q2",
            _type: "DropdownQuestion",
            choices: [{ id: "c1", conditions: [{ lhs: { question: "q1" }, op: "present" }] }]
          }
        ]
      }

      const responseCleaner = new ResponseCleaner()
      const data = { q1: { value: "sometext" }, q2: { value: "c1" } }
      const visibilityStructure = { q1: true, q2: true }

      const newData = responseCleaner.cleanDataBasedOnChoiceConditions(data, visibilityStructure, design)

      const expectedData = { q1: { value: "sometext" }, q2: { value: "c1" } }
      return assert.deepEqual(expectedData, newData, "Choice should be left")
    })
  })
})
