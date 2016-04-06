assert = require('chai').assert
StickyEntity = require '../src/StickyEntity'

describe 'StickyEntity', ->
  it 'sets a sticky value for a question that was invisible and just became visible', ->
    stickyEntity = new StickyEntity()

    design = {contents: [
      {
        _type: 'TextQuestion'
        _id: 'testId'
        sticky: true
      }
    ]}
    data = {}
    stickyStorage = {
      get: () ->
        'data'
    }
    previousVisibilityStructure = {'testId': false}
    newVisibilityStructure = {'testId': true}

    newData = stickyEntity.setStickyData(design, data, stickyStorage, previousVisibilityStructure, newVisibilityStructure)

    expectedData = {
      testId: {value: 'data'}
    }
    assert.deepEqual expectedData, newData
