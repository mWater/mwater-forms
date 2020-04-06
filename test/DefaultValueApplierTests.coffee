assert = require('chai').assert
moment = require 'moment'
DefaultValueApplier = require '../src/DefaultValueApplier'

describe 'DefaultValueApplier', ->
  beforeEach ->
    @design = {contents: [
      {
        _type: 'TextQuestion'
        _id: 'testId'
        sticky: true
      }
    ]}

    @stickyStorage = {
      get: (questionId) ->
        assert.equal questionId, 'testId'
        return 'data'
    }

    @defaultValueApplier = new DefaultValueApplier(@design, @stickyStorage)

  it 'sets a sticky value for a question that was invisible and just became visible', ->

    data = {somethingElse: 'random data'}

    previousVisibilityStructure = {'testId': false}
    newVisibilityStructure = {'testId': true}

    newData = @defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    expectedData = {
      testId: {value: 'data'}
      somethingElse: 'random data'
    }

    assert data != newData
    assert.deepEqual expectedData, newData

  it 'sets a sticky value for a question that was invisible and just became visible (even if defaultValue is set)', ->
    @design.contents[0].defaultValue = 'default value'
    data = {somethingElse: 'random data'}

    previousVisibilityStructure = {'testId': false}
    newVisibilityStructure = {'testId': true}

    newData = @defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    expectedData = {
      testId: {value: 'data'}
      somethingElse: 'random data'
    }

    assert data != newData
    assert.deepEqual expectedData, newData

  it 'sets a default value for a question that was invisible and just became visible (not sticky)', ->
    @design.contents[0].defaultValue = 'default value'
    @design.contents[0].sticky = false
    data = {somethingElse: 'random data'}

    previousVisibilityStructure = {'testId': false}
    newVisibilityStructure = {'testId': true}

    newData = @defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    expectedData = {
      testId: {value: 'default value'}
      somethingElse: 'random data'
    }

    assert data != newData
    assert.deepEqual expectedData, newData

  it 'sets no value for a question that was invisible and just became visible (sticky with no entry)', ->
    @design.contents[0].defaultValue = 'default value'
    # No entry in sticky storage
    @defaultValueApplier.stickyStorage = {
      get: (questionId) ->
        assert.equal questionId, 'testId'
        return null
    }
    data = {somethingElse: 'random data'}

    previousVisibilityStructure = {'testId': false}
    newVisibilityStructure = {'testId': true}

    newData = @defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    expectedData = {
      somethingElse: 'random data'
    }

    assert data != newData
    assert.deepEqual expectedData, newData

  it "sets a sticky value for a question that just became visible because previousVisibilityStructure is empty", ->
    data = {somethingElse: 'random data'}

    previousVisibilityStructure = {}
    newVisibilityStructure = {'testId': true}

    newData = @defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    expectedData = {
      testId: {value: 'data'}
      somethingElse: 'random data'
    }

    assert data != newData
    assert.deepEqual expectedData, newData

  it "sets an entity value for an entity question that just became visible", ->
    @design = {contents: [
      {
        _type: 'EntityQuestion'
        _id: 'entityQuestionId'
        entityType: 'water_point'
      }
    ]}

    entity = {code: 'entityCode', _id: 'entityId'}
    entityType = 'water_point'

    @defaultValueApplier = new DefaultValueApplier(@design, @stickyStorage, entity, entityType)

    data = {somethingElse: 'random data'}

    previousVisibilityStructure = {}
    newVisibilityStructure = {'entityQuestionId': true}

    newData = @defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    expectedData = {
      entityQuestionId: {value: 'entityId'}
      somethingElse: 'random data'
    }

    assert data != newData
    assert.deepEqual expectedData, newData

  it "sets an entity value for a site question that just became visible", ->
    @design = {contents: [
      {
        _type: 'SiteQuestion'
        _id: 'entityQuestionId'
        entityTypes: ['Water point']
      }
    ]}

    entity = {code: 'entityCode', _id: 'entityId'}
    entityType = 'water_point'

    @defaultValueApplier = new DefaultValueApplier(@design, @stickyStorage, entity, entityType)

    data = {somethingElse: 'random data'}

    previousVisibilityStructure = {}
    newVisibilityStructure = {'entityQuestionId': true}

    newData = @defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    expectedData = {
      entityQuestionId: {value: {code: 'entityCode'}}
      somethingElse: 'random data'
    }

    assert data != newData
    assert.deepEqual expectedData, newData

  it "doesn't sets a sticky value for a question that was already set", ->
    data = {somethingElse: 'random data', testId: {value: 'a'}}
    previousVisibilityStructure = {}
    newVisibilityStructure = {'testId': true}

    newData = @defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    assert.deepEqual data, newData

  it "doesn't sets a sticky value for a question that has an alternate value", ->
    data = {somethingElse: 'random data', testId: {alternate: 'na'}}
    previousVisibilityStructure = {}
    newVisibilityStructure = {'testId': true}

    newData = @defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    assert.deepEqual data, newData

  it "doesn't sets a sticky value for a question that has an alternate value", ->
    data = {somethingElse: 'random data', testId: {alternate: 'na'}}
    previousVisibilityStructure = {}
    newVisibilityStructure = {'testId': true}

    newData = @defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    assert.deepEqual data, newData

  it "doesn't sets a sticky value for a question that was already visible", ->
    data = {somethingElse: 'random data'}
    previousVisibilityStructure = {'testId': true}
    newVisibilityStructure = {'testId': true}

    newData = @defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    assert.deepEqual data, newData

  it "doesn't sets a sticky value for a question that stays invisible", ->
    design = {contents: [
      {
        _type: 'TextQuestion'
        _id: 'testId'
        sticky: true
      }
    ]}
    data = {somethingElse: 'random data'}
    stickyStorage = {
      get: () ->
        'data'
    }
    previousVisibilityStructure = {'testId': false}
    newVisibilityStructure = {'testId': false}

    @defaultValueApplier = new DefaultValueApplier(@design, @stickyStorage)
    newData = @defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    assert.deepEqual data, newData

  it "sets now for a date question that just became visible", ->
    @design = {contents: [
      {
        _type: 'DateQuestion'
        _id: 'dateQuestionId'
        format: 'll'
        defaultNow: true
      }
    ]}

    @defaultValueApplier = new DefaultValueApplier(@design, @stickyStorage)

    data = {somethingElse: 'random data'}

    previousVisibilityStructure = {}
    newVisibilityStructure = {'dateQuestionId': true}

    newData = @defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

    expectedData = {
      dateQuestionId: {value: moment().format("YYYY-MM-DD")}
      somethingElse: 'random data'
    }

    assert data != newData
    assert.deepEqual expectedData, newData
