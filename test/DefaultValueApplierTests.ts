import { assert } from "chai"
import moment from "moment"
import DefaultValueApplier from "../src/DefaultValueApplier"

describe("DefaultValueApplier", function () {
  beforeEach(function () {
    this.design = {
      contents: [
        {
          _type: "TextQuestion",
          _id: "testId",
          sticky: true
        }
      ]
    }

    this.stickyStorage = {
      get(questionId: any) {
        assert.equal(questionId, "testId")
        return "data"
      }
    }

    return (this.defaultValueApplier = new DefaultValueApplier(this.design, this.stickyStorage))
  })

  it("sets a sticky value for a question that was invisible and just became visible", function () {
    const data = { somethingElse: "random data" }

    const previousVisibilityStructure = { testId: false }
    const newVisibilityStructure = { testId: true }

    const newData = this.defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    const expectedData = {
      testId: { value: "data" },
      somethingElse: "random data"
    }

    assert(data !== newData)
    return assert.deepEqual(expectedData, newData)
  })

  it("sets a sticky value for a question that was invisible and just became visible (even if defaultValue is set)", function () {
    this.design.contents[0].defaultValue = "default value"
    const data = { somethingElse: "random data" }

    const previousVisibilityStructure = { testId: false }
    const newVisibilityStructure = { testId: true }

    const newData = this.defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    const expectedData = {
      testId: { value: "data" },
      somethingElse: "random data"
    }

    assert(data !== newData)
    return assert.deepEqual(expectedData, newData)
  })

  it("sets a default value for a question that was invisible and just became visible (not sticky)", function () {
    this.design.contents[0].defaultValue = "default value"
    this.design.contents[0].sticky = false
    const data = { somethingElse: "random data" }

    const previousVisibilityStructure = { testId: false }
    const newVisibilityStructure = { testId: true }

    const newData = this.defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    const expectedData = {
      testId: { value: "default value" },
      somethingElse: "random data"
    }

    assert(data !== newData)
    return assert.deepEqual(expectedData, newData)
  })

  it("sets no value for a question that was invisible and just became visible (sticky with no entry)", function () {
    this.design.contents[0].defaultValue = "default value"
    // No entry in sticky storage
    this.defaultValueApplier.stickyStorage = {
      get(questionId: any) {
        assert.equal(questionId, "testId")
        return null
      }
    }
    const data = { somethingElse: "random data" }

    const previousVisibilityStructure = { testId: false }
    const newVisibilityStructure = { testId: true }

    const newData = this.defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    const expectedData = {
      somethingElse: "random data"
    }

    assert(data !== newData)
    return assert.deepEqual(expectedData, newData)
  })

  it("sets a sticky value for a question that just became visible because previousVisibilityStructure is empty", function () {
    const data = { somethingElse: "random data" }

    const previousVisibilityStructure = {}
    const newVisibilityStructure = { testId: true }

    const newData = this.defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    const expectedData = {
      testId: { value: "data" },
      somethingElse: "random data"
    }

    assert(data !== newData)
    return assert.deepEqual(expectedData, newData)
  })

  it("sets an entity value for an entity question that just became visible", function () {
    this.design = {
      contents: [
        {
          _type: "EntityQuestion",
          _id: "entityQuestionId",
          entityType: "water_point"
        }
      ]
    }

    const entity = { code: "entityCode", _id: "entityId" }
    const entityType = "water_point"

    this.defaultValueApplier = new DefaultValueApplier(this.design, this.stickyStorage, entity, entityType)

    const data = { somethingElse: "random data" }

    const previousVisibilityStructure = {}
    const newVisibilityStructure = { entityQuestionId: true }

    const newData = this.defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    const expectedData = {
      entityQuestionId: { value: "entityId" },
      somethingElse: "random data"
    }

    assert(data !== newData)
    return assert.deepEqual(expectedData, newData)
  })

  it("sets an entity value for a site question that just became visible", function () {
    this.design = {
      contents: [
        {
          _type: "SiteQuestion",
          _id: "entityQuestionId",
          entityTypes: ["Water point"]
        }
      ]
    }

    const entity = { code: "entityCode", _id: "entityId" }
    const entityType = "water_point"

    this.defaultValueApplier = new DefaultValueApplier(this.design, this.stickyStorage, entity, entityType)

    const data = { somethingElse: "random data" }

    const previousVisibilityStructure = {}
    const newVisibilityStructure = { entityQuestionId: true }

    const newData = this.defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    const expectedData = {
      entityQuestionId: { value: { code: "entityCode" } },
      somethingElse: "random data"
    }

    assert(data !== newData)
    return assert.deepEqual(expectedData, newData)
  })

  it("doesn't sets a sticky value for a question that was already set", function () {
    const data = { somethingElse: "random data", testId: { value: "a" } }
    const previousVisibilityStructure = {}
    const newVisibilityStructure = { testId: true }

    const newData = this.defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    return assert.deepEqual(data, newData)
  })

  it("doesn't sets a sticky value for a question that has an alternate value", function () {
    const data = { somethingElse: "random data", testId: { alternate: "na" } }
    const previousVisibilityStructure = {}
    const newVisibilityStructure = { testId: true }

    const newData = this.defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    return assert.deepEqual(data, newData)
  })

  it("doesn't sets a sticky value for a question that has an alternate value", function () {
    const data = { somethingElse: "random data", testId: { alternate: "na" } }
    const previousVisibilityStructure = {}
    const newVisibilityStructure = { testId: true }

    const newData = this.defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    return assert.deepEqual(data, newData)
  })

  it("doesn't sets a sticky value for a question that was already visible", function () {
    const data = { somethingElse: "random data" }
    const previousVisibilityStructure = { testId: true }
    const newVisibilityStructure = { testId: true }

    const newData = this.defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    return assert.deepEqual(data, newData)
  })

  it("doesn't sets a sticky value for a question that stays invisible", function () {
    const design = {
      contents: [
        {
          _type: "TextQuestion",
          _id: "testId",
          sticky: true
        }
      ]
    }
    const data = { somethingElse: "random data" }
    const stickyStorage = {
      get() {
        return "data"
      }
    }
    const previousVisibilityStructure = { testId: false }
    const newVisibilityStructure = { testId: false }

    this.defaultValueApplier = new DefaultValueApplier(this.design, this.stickyStorage)
    const newData = this.defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    return assert.deepEqual(data, newData)
  })

  it("sets now for a date question that just became visible", function () {
    this.design = {
      contents: [
        {
          _type: "DateQuestion",
          _id: "dateQuestionId",
          format: "ll",
          defaultNow: true
        }
      ]
    }

    this.defaultValueApplier = new DefaultValueApplier(this.design, this.stickyStorage)

    const data = { somethingElse: "random data" }

    const previousVisibilityStructure = {}
    const newVisibilityStructure = { dateQuestionId: true }

    const newData = this.defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    const expectedData = {
      dateQuestionId: { value: moment().format("YYYY-MM-DD") },
      somethingElse: "random data"
    }

    assert(data !== newData)
    return assert.deepEqual(expectedData, newData)
  })

  it("sets a sticky value for a roster question that just became visible", function () {
    this.design = {
      contents: [
        {
          _type: "RosterMatrix",
          _id: "roster1",
          contents: [{ _id: "testId", _type: "TextColumnQuestion", text: { en: "Name" }, sticky: true }]
        }
      ]
    }

    const data = {
      somethingElse: "random data",
      roster1: [
        {
          _id: "abc",
          data: {}
        }
      ]
    }

    const previousVisibilityStructure = {}
    const newVisibilityStructure = { "roster1.0.testId": true }

    this.defaultValueApplier = new DefaultValueApplier(this.design, this.stickyStorage)
    const newData = this.defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    const expectedData = {
      roster1: [
        {
          _id: "abc",
          data: {
            testId: { value: "data" }
          }
        }
      ],
      somethingElse: "random data"
    }

    assert(data !== newData)
    return assert.deepEqual(expectedData, newData)
  })

  return it("sets a sticky value for a matrix question that just became visible", function () {
    this.design = {
      contents: [
        {
          _type: "MatrixQuestion",
          _id: "matrix1",
          items: [{ _id: "item1" }],
          columns: [{ _id: "testId", _type: "TextColumnQuestion", text: { en: "Name" }, sticky: true }]
        }
      ]
    }

    const data = {
      somethingElse: "random data"
    }

    const previousVisibilityStructure = {}
    const newVisibilityStructure = { "matrix1.item1.testId": true }

    this.defaultValueApplier = new DefaultValueApplier(this.design, this.stickyStorage)
    const newData = this.defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    const expectedData = {
      matrix1: {
        item1: {
          testId: { value: "data" }
        }
      },
      somethingElse: "random data"
    }

    assert(data !== newData)
    return assert.deepEqual(expectedData, newData)
  })
})
