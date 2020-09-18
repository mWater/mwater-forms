_ = require 'lodash'
assert = require('chai').assert
ResponseCleaner = require '../src/ResponseCleaner'
VisibilityCalculator = require '../src/VisibilityCalculator'

describe 'ResponseCleaner', ->
  describe "cleanData", ->
    it "handles cascading changes", (done) ->
      # Simulate q1 making q2 appear which has a default value. q3 has a condition on q2 not being present, so it should
      # have its value removed.
      q1 = { _id: "q1", _type: "TextQuestion", conditions: [] }
      q2 = { _id: "q2", _type: "TextQuestion", conditions: [{ lhs: { question: "q1" }, op: "present" }] }
      q3 = { _id: "q3", _type: "TextQuestion", conditions: [{ lhs: { question: "q2" }, op: "!present" }] }

      design = {
        _type: "Form"
        contents: [q1, q2, q3]
      }

      # Fake defaultValueApplier
      defaultValueApplier = {
        setStickyData: (newData, oldVisibilityStructure, newVisibilityStructure) ->
          newData = _.cloneDeep(newData)
          # Default q2
          if not oldVisibilityStructure['q2'] and newVisibilityStructure['q2']
            newData.q2 = { value: "defaulttext" }

          return newData
      }

      # Fake random asked calculator
      randomAskedCalculator = {
        calculateRandomAsked: (data, visibilityStructure) -> return data
      }

      visibilityCalculator = new VisibilityCalculator(design)
      responseCleaner = new ResponseCleaner()

      data = { q1: { value: "sometext" }, q3: { value: "moretext" } }
      oldVisibilityStructure = { q1: true, q2: false, q3: true }

      responseCleaner.cleanData design, visibilityCalculator, defaultValueApplier, randomAskedCalculator, data, (->), oldVisibilityStructure, (error, results) =>
        assert not error
        assert.deepEqual results.data, { q1: { value: "sometext" }, q2: { value: "defaulttext" } }
        assert.deepEqual results.visibilityStructure, { q1: true, q2: true, q3: false }
        done()
      
    it "does not delete disabled questions data", (done) ->
      q1 = { _id: "q1", _type: "TextQuestion", conditions: [], disabled: true }

      design = {
        _type: "Form"
        contents: [q1]
      }

      # Fake defaultValueApplier
      defaultValueApplier = {
        setStickyData: (newData, oldVisibilityStructure, newVisibilityStructure) ->
          return newData
      }

      # Fake random asked calculator
      randomAskedCalculator = {
        calculateRandomAsked: (data, visibilityStructure) -> return data
      }

      visibilityCalculator = new VisibilityCalculator(design)
      responseCleaner = new ResponseCleaner()

      data = { q1: { value: "sometext" } }
      oldVisibilityStructure = { q1: false }

      responseCleaner.cleanData design, visibilityCalculator, defaultValueApplier, randomAskedCalculator, data, (->), oldVisibilityStructure, (error, results) =>
        assert not error
        assert.deepEqual results.data, { q1: { value: "sometext" } }
        done()


  describe "cleanDataBasedOnVisibility", ->
    describe 'Simple cases', ->
      it 'keeps the data for all visible questions', ->
        responseCleaner = new ResponseCleaner()

        design = {}
        data = {questionA: true, questionB: 'patate'}
        visibilityStructure = {questionA: true, questionB: true}

        newData = responseCleaner.cleanDataBasedOnVisibility(data, visibilityStructure)

        assert data != newData, "It returned data instead of a copy"
        assert.deepEqual data, newData, "Data should have stayed the same"

      it 'removes the data for all invisible questions', ->
        responseCleaner = new ResponseCleaner()

        design = {}
        data = {questionA: true, questionB: 'patate'}
        visibilityStructure = {questionA: false, questionB: false}

        newData = responseCleaner.cleanDataBasedOnVisibility(data, visibilityStructure)

        assert data != newData, "It returned data instead of a copy"
        assert.deepEqual {}, newData, "All the data should have been removed"

      it 'keeps randomAsked for invisible questions so that the decision is not lost', ->
        responseCleaner = new ResponseCleaner()

        design = {}
        data = { questionA: { value: "apple", randomAsked: false } }
        visibilityStructure = { questionA: false }

        newData = responseCleaner.cleanDataBasedOnVisibility(data, visibilityStructure)

        assert.deepEqual newData, { questionA: { randomAsked: false } }, "Should keep randomAsked"

    describe 'Roster groups', ->
      it 'keeps the data for all visible questions', ->
        responseCleaner = new ResponseCleaner()

        design = {}
        data = {'rosterGroupId': [{ data: { firstQuestionId: 'sometext'} }]}
        visibilityStructure = {rosterGroupId: true, 'rosterGroupId.0.firstQuestionId': true}

        newData = responseCleaner.cleanDataBasedOnVisibility(data, visibilityStructure, design)

        assert data != newData, "It returned data instead of a copy"
        assert.deepEqual data, newData, "Data should have stayed the same"

      it 'removes part of the data if sub question is not visible', ->
        responseCleaner = new ResponseCleaner()

        design = {}
        data = {'rosterGroupId': [{ data: {firstQuestionId: 'sometext', secondQuestionId: 'moretext'} }]}
        visibilityStructure = {rosterGroupId: true, 'rosterGroupId.0.firstQuestionId': true, 'rosterGroupId.0.secondQuestionId': false}

        newData = responseCleaner.cleanDataBasedOnVisibility(data, visibilityStructure, design)

        expectedData = {'rosterGroupId': [{ data: {firstQuestionId: 'sometext'} }]}

        assert data != newData, "It returned data instead of a copy"
        assert.deepEqual expectedData, newData, "Only the secondQuestionId should have been deleted: " + JSON.stringify(newData)

      it 'removes all the data if the rosterGroupId is invisible', ->
        responseCleaner = new ResponseCleaner()

        design = {}
        data = {'rosterGroupId': [{data: { firstQuestionId: 'sometext', secondQuestionId: 'moretext'} }]}
        visibilityStructure = {rosterGroupId: false, 'rosterGroupId.0.firstQuestionId': false, 'rosterGroupId.0.secondQuestionId': false}

        newData = responseCleaner.cleanDataBasedOnVisibility(data, visibilityStructure, design)

        expectedData = {}

        assert data != newData, "It returned data instead of a copy"
        assert.deepEqual expectedData, newData, "The whole roster entry should have been deleted"

    describe 'Matrix', ->
      it 'keeps the data for all visible questions', ->
        responseCleaner = new ResponseCleaner()

        design = {}
        data = { matrixId: { item1Id: { firstQuestionId: 'sometext'} } }
        visibilityStructure = { matrixId: true, 'matrixId.item1Id.firstQuestionId': true}

        newData = responseCleaner.cleanDataBasedOnVisibility(data, visibilityStructure, design)

        assert data != newData, "It returned data instead of a copy"
        assert.deepEqual data, newData, "Data should have stayed the same"

      it 'removes part of the data if sub question is not visible', ->
        responseCleaner = new ResponseCleaner()

        design = {}
        data = { matrixId: { item1Id: { firstQuestionId: 'sometext', secondQuestionId: 'moretext' } } }
        visibilityStructure = { matrixId: true, 'matrixId.item1Id.firstQuestionId': true, 'matrixId.item1Id.secondQuestionId': false }

        newData = responseCleaner.cleanDataBasedOnVisibility(data, visibilityStructure, design)
        expectedData = { matrixId: { item1Id: { firstQuestionId: 'sometext' } } }

        assert data != newData, "It returned data instead of a copy"
        assert.deepEqual expectedData, newData, "Only the secondQuestionId should have been deleted: " + JSON.stringify(newData)

      it 'removes all the data if the whole thing is invisible', ->
        responseCleaner = new ResponseCleaner()

        design = {}
        data = { matrixId: { item1Id: { firstQuestionId: 'sometext'} } }
        visibilityStructure = { matrixId: false, 'matrixId.item1Id.firstQuestionId': true }

        newData = responseCleaner.cleanDataBasedOnVisibility(data, visibilityStructure, design)

        expectedData = {}

        assert data != newData, "It returned data instead of a copy"
        assert.deepEqual expectedData, newData, "The whole matrix should have been deleted"

  describe "cleanDataBasedOnChoiceConditions", ->
    it "removes invalid dropdown options", ->
      # Choice c1 conditional on q1 being present
      design = { _type: "Form", contents: [
        { _id: "q1", _type: "TextQuestion" }
        { _id: "q2", _type: "DropdownQuestion", choices: [{ id: "c1", conditions: [{ lhs: { question: "q1" }, op: "present" }] }] }
      ]}

      responseCleaner = new ResponseCleaner()
      data = { q2: { value: "c1" } }
      visibilityStructure = { q1: true, q2: true }

      newData = responseCleaner.cleanDataBasedOnChoiceConditions(data, visibilityStructure, design)

      expectedData = {}
      assert.deepEqual expectedData, newData, "Choice should be deleted"

    it "leaves valid dropdown options", ->
      # Choice c1 conditional on q1 being present
      design = { _type: "Form", contents: [
        { _id: "q1", _type: "TextQuestion" }
        { _id: "q2", _type: "DropdownQuestion", choices: [{ id: "c1", conditions: [{ lhs: { question: "q1" }, op: "present" }] }] }
      ]}

      responseCleaner = new ResponseCleaner()
      data = { q1: { value: "sometext" }, q2: { value: "c1" } }
      visibilityStructure = { q1: true, q2: true }

      newData = responseCleaner.cleanDataBasedOnChoiceConditions(data, visibilityStructure, design)

      expectedData = { q1: { value: "sometext" }, q2: { value: "c1" } }
      assert.deepEqual expectedData, newData, "Choice should be left"

    describe "roster", ->
      it "removes invalid dropdown options", ->
        # Choice c1 conditional on q1 being present
        design = { _type: "Form", contents: [
          { _id: "r1", _type: "RosterGroup", contents: [
            { _id: "q1", _type: "TextQuestion" }
            { _id: "q2", _type: "DropdownQuestion", choices: [{ id: "c1", conditions: [{ lhs: { question: "q1" }, op: "present" }] }] }
          ]}
        ]}

        responseCleaner = new ResponseCleaner()
        data = { r1: [{ _id: "e1", data: { q2: { value: "c1" } } }] }
        visibilityStructure = { r1: true, "r1.0.q1": true, "r1.0.q2": true }

        newData = responseCleaner.cleanDataBasedOnChoiceConditions(data, visibilityStructure, design)

        expectedData = { r1: [{ _id: "e1", data: {}}] }
        assert.deepEqual expectedData, newData, "Choice should be deleted"

      it "leaves valid dropdown options", ->
        # Choice c1 conditional on q1 being present
        design = { _type: "Form", contents: [
          { _id: "r1", _type: "RosterGroup", contents: [
            { _id: "q1", _type: "TextQuestion" }
            { _id: "q2", _type: "DropdownQuestion", choices: [{ id: "c1", conditions: [{ lhs: { question: "q1" }, op: "present" }] }] }
          ]}
        ]}

        responseCleaner = new ResponseCleaner()
        data = { r1: [{ _id: "e1", data: { q1: { value: "sometext" }, q2: { value: "c1" } } }] }
        visibilityStructure = { r1: true, "r1.0.q1": true, "r1.0.q2": true }

        newData = responseCleaner.cleanDataBasedOnChoiceConditions(data, visibilityStructure, design)

        expectedData = { r1: [{ _id: "e1", data: { q1: { value: "sometext" }, q2: { value: "c1" } } }] }
        assert.deepEqual expectedData, newData, "Choice should be left"

    it "leaves valid dropdown options", ->
      # Choice c1 conditional on q1 being present
      design = { _type: "Form", contents: [
        { _id: "q1", _type: "TextQuestion" }
        { _id: "q2", _type: "DropdownQuestion", choices: [{ id: "c1", conditions: [{ lhs: { question: "q1" }, op: "present" }] }] }
      ]}

      responseCleaner = new ResponseCleaner()
      data = { q1: { value: "sometext" }, q2: { value: "c1" } }
      visibilityStructure = { q1: true, q2: true }

      newData = responseCleaner.cleanDataBasedOnChoiceConditions(data, visibilityStructure, design)

      expectedData = { q1: { value: "sometext" }, q2: { value: "c1" } }
      assert.deepEqual expectedData, newData, "Choice should be left"
      


