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
              code: "testcode",
              _type: "CheckQuestion",
              required: false,
              alternates: {
                na: true,
                dontknow: true
              },
              conditions: [],
              validations: []
            }
          ]
        }
      ]
    }

  describe 'createVisibilityStructure', ->
    beforeEach ->
      @visibilityEntity = new VisibilityEntity(@form)

    it.only 'create a complete visibility structure', ->
      data = {}
      visibilityStructure = @visibilityEntity.createVisibilityStructure(data)
      expectedVisibilityStructure = {
        'sectionId': true
        'checkboxQuestionId': true
      }
      assert.deepEqual expectedVisibilityStructure, visibilityStructure

  describe 'processQuestion', ->
    beforeEach ->
      @visibilityEntity = new VisibilityEntity(@form)
      @visibilityEntity.data = {}

    describe "TextQuestion", ->
      it 'sets visibility to true if conditions is null, undefined or empty', ->
        question = {_id: 'testId'}
        @visibilityEntity.processQuestion(question)
        assert.deepEqual {testId: true}, @visibilityEntity.visibilityStructure

        question = {_id: 'testId', conditions: null}
        @visibilityEntity.processQuestion(question)
        assert.deepEqual {testId: true}, @visibilityEntity.visibilityStructure

        question = {_id: 'testId', conditions: []}
        @visibilityEntity.processQuestion(question)
        assert.deepEqual {testId: true}, @visibilityEntity.visibilityStructure

      it 'sets visibility to true if conditions is true', ->
        question = {
          _id: 'testId'
          conditions: [
            {op: "true", lhs: {question: "checkboxQuestionId"}}
          ]
        }
        @visibilityEntity.data = {checkboxQuestionId: {value: true}}
        @visibilityEntity.processQuestion(question)
        assert.deepEqual {testId: true}, @visibilityEntity.visibilityStructure

      it 'sets visibility to false if conditions is false', ->
        question = {
          _id: 'testId'
          conditions: [
            {op: "true", lhs: {question: "checkboxQuestionId"}}
          ]
        }
        @visibilityEntity.processQuestion(question)
        assert.deepEqual {testId: false}, @visibilityEntity.visibilityStructure
