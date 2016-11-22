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
      data = {'rosterGroupId': [{ data: { firstQuestionId: 'sometext'} }]}
      visibilityStructure = {rosterGroupId: true, 'rosterGroupId.0.firstQuestionId': true}

      newData = responseCleaner.cleanData(data, visibilityStructure, design)

      assert data != newData, "It returned data instead of a copy"
      assert.deepEqual data, newData, "Data should have stayed the same"

    it 'removes part of the data if sub question is not visible', ->
      responseCleaner = new ResponseCleaner()

      design = {}
      data = {'rosterGroupId': [{ data: {firstQuestionId: 'sometext', secondQuestionId: 'moretext'} }]}
      visibilityStructure = {rosterGroupId: true, 'rosterGroupId.0.firstQuestionId': true, 'rosterGroupId.0.secondQuestionId': false}

      newData = responseCleaner.cleanData(data, visibilityStructure, design)

      expectedData = {'rosterGroupId': [{ data: {firstQuestionId: 'sometext'} }]}

      assert data != newData, "It returned data instead of a copy"
      assert.deepEqual expectedData, newData, "Only the secondQuestionId should have been deleted: " + JSON.stringify(newData)

    it 'removes all the data if the rosterGroupId is invisible', ->
      responseCleaner = new ResponseCleaner()

      design = {}
      data = {'rosterGroupId': [{data: { firstQuestionId: 'sometext', secondQuestionId: 'moretext'} }]}
      visibilityStructure = {rosterGroupId: false, 'rosterGroupId.0.firstQuestionId': false, 'rosterGroupId.0.secondQuestionId': false}

      newData = responseCleaner.cleanData(data, visibilityStructure, design)

      expectedData = {}

      assert data != newData, "It returned data instead of a copy"
      assert.deepEqual expectedData, newData, "The whole roster entry should have been deleted"

  describe 'Matrix', ->
    it 'keeps the data for all visible questions', ->
      responseCleaner = new ResponseCleaner()

      design = {}
      data = { matrixId: { item1Id: { firstQuestionId: 'sometext'} } }
      visibilityStructure = { matrixId: true, 'matrixId.item1Id.firstQuestionId': true}

      newData = responseCleaner.cleanData(data, visibilityStructure, design)

      assert data != newData, "It returned data instead of a copy"
      assert.deepEqual data, newData, "Data should have stayed the same"

    it 'removes part of the data if sub question is not visible', ->
      responseCleaner = new ResponseCleaner()

      design = {}
      data = { matrixId: { item1Id: { firstQuestionId: 'sometext', secondQuestionId: 'moretext' } } }
      visibilityStructure = { matrixId: true, 'matrixId.item1Id.firstQuestionId': true, 'matrixId.item1Id.secondQuestionId': false }

      newData = responseCleaner.cleanData(data, visibilityStructure, design)
      expectedData = { matrixId: { item1Id: { firstQuestionId: 'sometext' } } }

      assert data != newData, "It returned data instead of a copy"
      assert.deepEqual expectedData, newData, "Only the secondQuestionId should have been deleted: " + JSON.stringify(newData)

    it 'removes all the data if the whole thing is invisible', ->
      responseCleaner = new ResponseCleaner()

      design = {}
      data = { matrixId: { item1Id: { firstQuestionId: 'sometext'} } }
      visibilityStructure = { matrixId: false, 'matrixId.item1Id.firstQuestionId': true }

      newData = responseCleaner.cleanData(data, visibilityStructure, design)

      expectedData = {}

      assert data != newData, "It returned data instead of a copy"
      assert.deepEqual expectedData, newData, "The whole matrix should have been deleted"

