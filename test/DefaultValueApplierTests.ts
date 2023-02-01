import { assert } from "chai"
import moment from "moment"
import { AssetQuestion } from "../src"
import DefaultValueApplier from "../src/DefaultValueApplier"

let defaultValueApplier: DefaultValueApplier

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

    defaultValueApplier = new DefaultValueApplier(this.design, this.stickyStorage)
  })

  it("sets a sticky value for a question that was invisible and just became visible", function () {
    const data = { somethingElse: "random data" } as any

    const previousVisibilityStructure = { testId: false }
    const newVisibilityStructure = { testId: true }

    const newData = defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    const expectedData = {
      testId: { value: "data" },
      somethingElse: "random data"
    } as any

    assert(data !== newData)
    assert.deepEqual(newData, expectedData)
  })

  it("sets no value for a question that was invisible and just became visible (sticky with no entry)", function () {
    // No entry in sticky storage
    ;(defaultValueApplier as any).stickyStorage = {
      get(questionId: any) {
        assert.equal(questionId, "testId")
        return null
      }
    }
    const data = { somethingElse: "random data" } as any

    const previousVisibilityStructure = { testId: false }
    const newVisibilityStructure = { testId: true }

    const newData = defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    const expectedData = {
      somethingElse: "random data"
    } as any

    assert(data !== newData)
    assert.deepEqual(newData, expectedData)
  })

  it("sets a sticky value for a question that just became visible because previousVisibilityStructure is empty", function () {
    const data = { somethingElse: "random data" } as any

    const previousVisibilityStructure = {}
    const newVisibilityStructure = { testId: true }

    const newData = defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    const expectedData = {
      testId: { value: "data" },
      somethingElse: "random data"
    } as any

    assert(data !== newData)
    assert.deepEqual(newData, expectedData)
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

    defaultValueApplier = new DefaultValueApplier(this.design, this.stickyStorage, { entity, entityType })

    const data = { somethingElse: "random data" } as any

    const previousVisibilityStructure = {}
    const newVisibilityStructure = { entityQuestionId: true }

    const newData = defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    const expectedData = {
      entityQuestionId: { value: "entityId" },
      somethingElse: "random data"
    } as any

    assert(data !== newData)
    assert.deepEqual(newData, expectedData)
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

    defaultValueApplier = new DefaultValueApplier(this.design, this.stickyStorage, { entity, entityType })

    const data = { somethingElse: "random data" } as any

    const previousVisibilityStructure = {}
    const newVisibilityStructure = { entityQuestionId: true }

    const newData = defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    const expectedData = {
      entityQuestionId: { value: { code: "entityCode" } },
      somethingElse: "random data"
    } as any

    assert(data !== newData)
    assert.deepEqual(newData, expectedData)
  })

  it("sets an asset value for an asset question that just became visible", function () {
    const assetSystemId = 1
    const assetId = "assetid"
    const assetType = "water_point"

    this.design = {
      contents: [
        {
          _type: "AssetQuestion",
          _id: "assetQuestionId",
          assetSystemId: 1,
        } as AssetQuestion
      ]
    }

    defaultValueApplier = new DefaultValueApplier(this.design, this.stickyStorage, { assetId, assetSystemId, assetType })

    const data = { somethingElse: "random data" } as any

    const previousVisibilityStructure = {}
    const newVisibilityStructure = { assetQuestionId: true }

    const newData = defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    const expectedData = {
      assetQuestionId: { value: assetId },
      somethingElse: "random data"
    } as any

    assert(data !== newData)
    assert.deepEqual(newData, expectedData)
  })

  it("doesn't set an asset value for an asset question that just became visible that is wrong type", function () {
    const assetSystemId = 1
    const assetId = "assetid"
    const assetType = "water_point"

    this.design = {
      contents: [
        {
          _type: "AssetQuestion",
          _id: "assetQuestionId",
          assetSystemId: 1,
          assetTypes: ["tank"]
        } as AssetQuestion
      ]
    }

    defaultValueApplier = new DefaultValueApplier(this.design, this.stickyStorage, { assetId, assetSystemId, assetType })

    const data = { somethingElse: "random data" } as any

    const previousVisibilityStructure = {}
    const newVisibilityStructure = { assetQuestionId: true }

    const newData = defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    const expectedData = {
      somethingElse: "random data"
    } as any

    assert(data !== newData)
    assert.deepEqual(newData, expectedData)
  })


  it("doesn't sets a sticky value for a question that was already set", function () {
    const data = { somethingElse: "random data", testId: { value: "a" } } as any
    const previousVisibilityStructure = {}
    const newVisibilityStructure = { testId: true }

    const newData = defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    assert.deepEqual(data, newData)
  })

  it("doesn't sets a sticky value for a question that has an alternate value", function () {
    const data = { somethingElse: "random data", testId: { alternate: "na" } } as any
    const previousVisibilityStructure = {}
    const newVisibilityStructure = { testId: true }

    const newData = defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    assert.deepEqual(data, newData)
  })

  it("doesn't sets a sticky value for a question that has an alternate value", function () {
    const data = { somethingElse: "random data", testId: { alternate: "na" } } as any
    const previousVisibilityStructure = {}
    const newVisibilityStructure = { testId: true }

    const newData = defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    assert.deepEqual(data, newData)
  })

  it("doesn't sets a sticky value for a question that was already visible", function () {
    const data = { somethingElse: "random data" } as any
    const previousVisibilityStructure = { testId: true }
    const newVisibilityStructure = { testId: true }

    const newData = defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    assert.deepEqual(data, newData)
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
    const data = { somethingElse: "random data" } as any
    const stickyStorage = {
      get() {
        return "data"
      }
    }
    const previousVisibilityStructure = { testId: false }
    const newVisibilityStructure = { testId: false }

    defaultValueApplier = new DefaultValueApplier(this.design, this.stickyStorage)
    const newData = defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    assert.deepEqual(data, newData)
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

    defaultValueApplier = new DefaultValueApplier(this.design, this.stickyStorage)

    const data = { somethingElse: "random data" } as any

    const previousVisibilityStructure = {}
    const newVisibilityStructure = { dateQuestionId: true }

    const newData = defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    const expectedData = {
      dateQuestionId: { value: moment().format("YYYY-MM-DD") },
      somethingElse: "random data"
    } as any

    assert(data !== newData)
    assert.deepEqual(newData, expectedData)
  })

  it("sets a sticky value for a roster question that just became visible", function () {
    this.design = {
      contents: [
        {
          _type: "RosterGroup",
          _id: "roster1",
          contents: [{ _id: "testId", _type: "TextQuestion", text: { en: "Name" }, sticky: true }]
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
    } as any

    const previousVisibilityStructure = {}
    const newVisibilityStructure = { "roster1.0.testId": true }

    defaultValueApplier = new DefaultValueApplier(this.design, this.stickyStorage)
    const newData = defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

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
    } as any

    assert(data !== newData)
    assert.deepEqual(newData, expectedData)
  })
})
