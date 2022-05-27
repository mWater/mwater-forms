// @ts-nocheck
import { assert } from "chai"
import sinon from "sinon"
import RandomAskedCalculator from "../src/RandomAskedCalculator"

describe("RandomAskedCalculator", function () {
  it("sets randomAsked for a visible question", function () {
    const design = {
      contents: [
        {
          _id: "testid",
          _type: "TextQuestion",
          randomAskProbability: 0.4
        }
      ]
    }

    const randomAskedCalculator = new RandomAskedCalculator(design)
    const generateRandomValue = sinon.stub(randomAskedCalculator, "generateRandomValue").returns(true)
    const visibilityStructure = { testid: true }

    const newData = randomAskedCalculator.calculateRandomAsked({}, visibilityStructure)
    assert.deepEqual(newData, { testid: { randomAsked: true } })

    return assert.isTrue(generateRandomValue.calledWith(0.4))
  })

  it("doesn't set randomAsked for an invisible question", function () {
    let visibilityStructure = { testid: false }

    const design = {
      contents: [
        {
          _id: "testid",
          _type: "TextQuestion",
          randomAskProbability: 0.4
        }
      ]
    }

    const randomAskedCalculator = new RandomAskedCalculator(design)
    const generateRandomValue = sinon.stub(randomAskedCalculator, "generateRandomValue").returns(true)
    visibilityStructure = { testid: false }

    const newData = randomAskedCalculator.calculateRandomAsked({}, visibilityStructure)
    return assert.deepEqual(newData, {})
  })

  return it("sets randomAsked independently for roster entries", function () {
    const design = {
      contents: [
        {
          _id: "rosterid",
          _type: "RosterGroup",
          contents: [
            {
              _id: "testid",
              _type: "TextQuestion",
              randomAskProbability: 0.4
            }
          ]
        }
      ]
    }

    const randomAskedCalculator = new RandomAskedCalculator(design)
    const generateRandomValue = sinon.stub(randomAskedCalculator, "generateRandomValue")

    // Only second one returned true
    generateRandomValue.onFirstCall().returns(false)
    generateRandomValue.onSecondCall().returns(true)

    const visibilityStructure = {
      "rosterid.0.testid": true,
      "rosterid.1.testid": true
    }

    // Data is present for roster
    const data = {
      rosterid: [
        { _id: "e0", data: {} },
        { _id: "e1", data: {} }
      ]
    }

    const newData = randomAskedCalculator.calculateRandomAsked(data, visibilityStructure)

    return assert.deepEqual(
      newData,
      {
        rosterid: [
          { _id: "e0", data: { testid: { randomAsked: false } } },
          { _id: "e1", data: { testid: { randomAsked: true } } }
        ]
      },
      JSON.stringify(newData, null, 2)
    )
  })
})
