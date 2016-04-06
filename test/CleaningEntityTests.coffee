assert = require('chai').assert
CleaningEntity = require '../src/CleaningEntity'

describe.only 'CleaningEntity', ->
  describe 'Simple cases', ->
    it 'keeps the data for all visible questions', ->
      cleaningEntity = new CleaningEntity()

      design = {}
      data = {questionA: true, questionB: 'patate'}
      visibilityStructure = {questionA: true, questionB: true}

      newData = cleaningEntity.cleanData(data, visibilityStructure)

      assert data != newData, "It returned data instead of a copy"
      assert.deepEqual data, newData, "Data should have stayed the same"

    it 'removes the data for all invisible questions', ->
      cleaningEntity = new CleaningEntity()

      design = {}
      data = {questionA: true, questionB: 'patate'}
      visibilityStructure = {questionA: false, questionB: false}

      newData = cleaningEntity.cleanData(data, visibilityStructure)

      assert data != newData, "It returned data instead of a copy"
      assert.deepEqual {}, newData, "All the data should have been removed"

  describe 'Roster groups', ->
    it 'keeps the data for all visible questions', ->
      cleaningEntity = new CleaningEntity()

      design = {}
      data = {'rosterGroupId': [{firstQuestionId: 'sometext'}]}
      visibilityStructure = {rosterGroupId: true, 'rosterGroupId.0.firstQuestionId': true}

      newData = cleaningEntity.cleanData(data, visibilityStructure)

      assert data != newData, "It returned data instead of a copy"
      assert.deepEqual data, newData, "Data should have stayed the same"

    it 'removes part of the data if sub question is not visible', ->
      cleaningEntity = new CleaningEntity()

      design = {}
      data = {'rosterGroupId': [{firstQuestionId: 'sometext', secondQuestionId: 'moretext'}]}
      visibilityStructure = {rosterGroupId: true, 'rosterGroupId.0.firstQuestionId': true, 'rosterGroupId.0.secondQuestionId': false}

      newData = cleaningEntity.cleanData(data, visibilityStructure)

      expectedData = {'rosterGroupId': [{firstQuestionId: 'sometext'}]}

      assert data != newData, "It returned data instead of a copy"
      assert.deepEqual expectedData, newData, "Only the secondQuestionId should have been deleted"

    it 'removes all the data if the rosterGroupId is invisible', ->
      cleaningEntity = new CleaningEntity()

      data = {'rosterGroupId': [{firstQuestionId: 'sometext', secondQuestionId: 'moretext'}]}
      visibilityStructure = {rosterGroupId: false, 'rosterGroupId.0.firstQuestionId': false, 'rosterGroupId.0.secondQuestionId': false}

      newData = cleaningEntity.cleanData(data, visibilityStructure)

      expectedData = {}

      assert data != newData, "It returned data instead of a copy"
      assert.deepEqual expectedData, newData, "The whole roster entry should have been deleted"

