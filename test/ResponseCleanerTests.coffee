assert = require('chai').assert
ResponseCleaner = require '../src/ResponseCleaner'

describe 'ResponseCleaner', ->
  describe 'Simple cases', ->
    it 'keeps the data for all visible questions', ->
      responseCleaner = new ResponseCleaner()

      design = {}
      data = {questionA: true, questionB: 'patate'}
      visibilityStructure = {questionA: true, questionB: true}

      newData = responseCleaner.cleanData(data, visibilityStructure)

      assert data != newData, "It returned data instead of a copy"
      assert.deepEqual data, newData, "Data should have stayed the same"

    it 'removes the data for all invisible questions', ->
      responseCleaner = new ResponseCleaner()

      design = {}
      data = {questionA: true, questionB: 'patate'}
      visibilityStructure = {questionA: false, questionB: false}

      newData = responseCleaner.cleanData(data, visibilityStructure)

      assert data != newData, "It returned data instead of a copy"
      assert.deepEqual {}, newData, "All the data should have been removed"

  describe 'Roster groups', ->
    it 'keeps the data for all visible questions', ->
      responseCleaner = new ResponseCleaner()

      design = {}
      data = {'rosterGroupId': [{firstQuestionId: 'sometext'}]}
      visibilityStructure = {rosterGroupId: true, 'rosterGroupId.0.firstQuestionId': true}

      newData = responseCleaner.cleanData(data, visibilityStructure)

      assert data != newData, "It returned data instead of a copy"
      assert.deepEqual data, newData, "Data should have stayed the same"

    it 'removes part of the data if sub question is not visible', ->
      responseCleaner = new ResponseCleaner()

      design = {}
      data = {'rosterGroupId': [{firstQuestionId: 'sometext', secondQuestionId: 'moretext'}]}
      visibilityStructure = {rosterGroupId: true, 'rosterGroupId.0.firstQuestionId': true, 'rosterGroupId.0.secondQuestionId': false}

      newData = responseCleaner.cleanData(data, visibilityStructure)

      expectedData = {'rosterGroupId': [{firstQuestionId: 'sometext'}]}

      assert data != newData, "It returned data instead of a copy"
      assert.deepEqual expectedData, newData, "Only the secondQuestionId should have been deleted"

    it 'removes all the data if the rosterGroupId is invisible', ->
      responseCleaner = new ResponseCleaner()

      data = {'rosterGroupId': [{firstQuestionId: 'sometext', secondQuestionId: 'moretext'}]}
      visibilityStructure = {rosterGroupId: false, 'rosterGroupId.0.firstQuestionId': false, 'rosterGroupId.0.secondQuestionId': false}

      newData = responseCleaner.cleanData(data, visibilityStructure)

      expectedData = {}

      assert data != newData, "It returned data instead of a copy"
      assert.deepEqual expectedData, newData, "The whole roster entry should have been deleted"

