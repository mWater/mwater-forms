assert = require('chai').assert
sinon = require 'sinon'
RandomAskedCalculator = require '../src/RandomAskedCalculator'

describe 'RandomAskedCalculator', ->
  it "sets randomAsked for a visible question", ->
    design = {
      contents: [
        {
          _id: 'testid'
          _type: 'TextQuestion'
          randomAskProbability: 0.4
        }
      ]
    }

    randomAskedCalculator = new RandomAskedCalculator(design)
    generateRandomValue = sinon.stub(randomAskedCalculator, "generateRandomValue").returns(true)
    visibilityStructure = { testid: true }

    newData = randomAskedCalculator.calculateRandomAsked({}, visibilityStructure)
    assert.deepEqual newData, { testid: { randomAsked: true }}

    assert.isTrue generateRandomValue.calledWith(0.4)

  it "doesn't set randomAsked for an invisible question", ->
    visibilityStructure = { 'testid': false }

    design = {
      contents: [
        {
          _id: 'testid'
          _type: 'TextQuestion'
          randomAskProbability: 0.4
        }
      ]
    }

    randomAskedCalculator = new RandomAskedCalculator(design)
    generateRandomValue = sinon.stub(randomAskedCalculator, "generateRandomValue").returns(true)
    visibilityStructure = { testid: false }

    newData = randomAskedCalculator.calculateRandomAsked({}, visibilityStructure)
    assert.deepEqual newData, {}

  it "sets randomAsked independently for roster entries", ->
    design = {
      contents: [
        {
          _id: 'rosterid'
          _type: 'RosterGroup'
          contents: [
            {
              _id: 'testid'
              _type: 'TextQuestion'
              randomAskProbability: 0.4
            }
          ]
        }
      ]
    }

    randomAskedCalculator = new RandomAskedCalculator(design)
    generateRandomValue = sinon.stub(randomAskedCalculator, "generateRandomValue")

    # Only second one returned true
    generateRandomValue.onFirstCall().returns(false)
    generateRandomValue.onSecondCall().returns(true)

    visibilityStructure = { 
      "rosterid.0.testid": true
      "rosterid.1.testid": true 
    }

    # Data is present for roster
    data = {
      rosterid: [
        { _id: "e0", data: {} }
        { _id: "e1", data: {} }
      ]
    }

    newData = randomAskedCalculator.calculateRandomAsked(data, visibilityStructure)

    assert.deepEqual newData, {
      rosterid: [
        { _id: "e0", data: { testid: { randomAsked: false }}}
        { _id: "e1", data: { testid: { randomAsked: true }}}
      ]
    }, JSON.stringify(newData, null, 2)
