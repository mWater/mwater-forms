assert = require('chai').assert
VisibilityEntity = require '../src/VisibilityEntity'

# If mno is invisible and xyz is visible (and mno has rosterId

describe 'VisibilityEntity', ->
  before ->
    @form = {_type: 'Form', contents: [
        {
          _id: "sectionId"
          _type: "Section"
          contents: [
            {
              _id: "checkboxQuestionId",
              _type: "CheckQuestion",
              required: false,
              alternates: {
                na: true,
                dontknow: true
              },
              conditions: [],
              validations: []
            },
            {
              _id: "firstRosterGroupId",
              _type: "RosterGroup",
              required: false,
              conditions: [],
              validations: []
              contents: [
                {
                  _id: "firstRosterQuestionId",
                  _type: "TextQuestion",
                  required: false,
                  alternates: {
                    na: false,
                    dontknow: false
                  },
                  conditions: [],
                  validations: []
                },
                {
                  _id: "secondRosterQuestionId",
                  _type: "TextQuestion",
                  required: false,
                  alternates: {
                    na: false,
                    dontknow: false
                  },
                  conditions: [
                    {op: "true", lhs: {question: "firstRosterQuestionId"}}
                  ],
                  validations: []
                },
              ]
            }
          ]
        }
      ]
    }

  describe 'createVisibilityStructure', ->
    beforeEach ->
      @visibilityEntity = new VisibilityEntity(@form)

    it.only 'create a complete visibility structure', ->
      data = {
        firstRosterGroupId: [
          {firstRosterQuestionId: {value: 'some text'}}
          {firstRosterQuestionId: {value: null}}
        ]
      }
      visibilityStructure = @visibilityEntity.createVisibilityStructure(data)
      console.log visibilityStructure
      expectedVisibilityStructure = {
        'sectionId': true
        'checkboxQuestionId': true
        'firstRosterGroupId': true
        'firstRosterGroupId.0.firstRosterQuestionId': true
        'firstRosterGroupId.0.secondRosterQuestionId': true
        'firstRosterGroupId.1.firstRosterQuestionId': true
        'firstRosterGroupId.1.secondRosterQuestionId': false
      }
      assert.deepEqual visibilityStructure, expectedVisibilityStructure

  describe 'processQuestion', ->
    beforeEach ->
      @visibilityEntity = new VisibilityEntity(@form)

    describe "TextQuestion", ->
      it 'sets visibility to false if forceToInvisible is set to true', ->
        data = {}

        question = {_id: 'testId'}
        @visibilityEntity.processQuestion(question, true, data, '')
        assert.deepEqual {testId: false}, @visibilityEntity.visibilityStructure

      it 'sets visibility using the prefix', ->
        data = {}
        question = {_id: 'testId'}
        @visibilityEntity.processQuestion(question, false, data, 'testprefix.')
        assert.deepEqual {'testprefix.testId': true}, @visibilityEntity.visibilityStructure

      it 'sets visibility to true if conditions is null, undefined or empty', ->
        data = {}

        question = {_id: 'testId'}
        @visibilityEntity.processQuestion(question, false, data, '')
        assert.deepEqual {testId: true}, @visibilityEntity.visibilityStructure

        question = {_id: 'testId', conditions: null}
        @visibilityEntity.processQuestion(question, false, data, '')
        assert.deepEqual {testId: true}, @visibilityEntity.visibilityStructure

        question = {_id: 'testId', conditions: []}
        @visibilityEntity.processQuestion(question, false, data, '')
        assert.deepEqual {testId: true}, @visibilityEntity.visibilityStructure

      it 'sets visibility to true if conditions is true', ->
        data = {checkboxQuestionId: {value: true}}
        question = {
          _id: 'testId'
          conditions: [
            {op: "true", lhs: {question: "checkboxQuestionId"}}
          ]
        }
        @visibilityEntity.processQuestion(question, false, data, '')
        assert.deepEqual {testId: true}, @visibilityEntity.visibilityStructure

      it 'sets visibility to false if conditions is false', ->
        data = {checkboxQuestionId: {value: false}}
        question = {
          _id: 'testId'
          conditions: [
            {op: "true", lhs: {question: "checkboxQuestionId"}}
          ]
        }
        @visibilityEntity.processQuestion(question, false, data, '')
        assert.deepEqual {testId: false}, @visibilityEntity.visibilityStructure
