assert = require('chai').assert
VisibilityEntity = require '../src/VisibilityEntity'

describe.only 'VisibilityEntity', ->
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
              _id: "groupId",
              _type: "Group",
              conditions: [{op: "true", lhs: {question: "checkboxQuestionId"}}],
              validations: [],
              contents: [
                {
                  _id: "groupQuestionId",
                  _type: "TextQuestion",
                  required: false,
                  conditions: [],
                  validations: []
                },
              ]
            },


            {
              _id: "mainRosterGroupId",
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
                    {op: "present", lhs: {question: "firstRosterQuestionId"}}
                  ],
                  validations: []
                },
              ]
            },
            {
              _id: "subRosterGroupId",
              _type: "RosterGroup",
              rosterId: "mainRosterGroupId",
              required: false,
              conditions: [],
              validations: []
              contents: [
                {
                  _id: "firstSubRosterQuestionId",
                  _type: "TextQuestion",
                  required: false,
                  alternates: {
                    na: false,
                    dontknow: false
                  },
                  conditions: [],
                  validations: []
                }
              ]
            }
          ]
        }
      ]
    }

  describe 'createVisibilityStructure', ->
    beforeEach ->
      @visibilityEntity = new VisibilityEntity(@form)

    it 'create a complete visibility structure', ->
      data = {
        mainRosterGroupId: [
          {firstRosterQuestionId: {value: 'some text'}, firstSubRosterQuestionId: {value: 'sub text'}}
          # This will make the second question invisible
          {firstRosterQuestionId: {value: null}}
        ]
      }
      visibilityStructure = @visibilityEntity.createVisibilityStructure(data)

      expectedVisibilityStructure = {
        'sectionId': true
        'checkboxQuestionId': true
        'mainRosterGroupId': true
        'mainRosterGroupId.0.firstRosterQuestionId': true
        'mainRosterGroupId.0.secondRosterQuestionId': true
        'mainRosterGroupId.1.firstRosterQuestionId': true
        'mainRosterGroupId.1.secondRosterQuestionId': false
        # Questions under subRosterGroup need to use the mainRosterGroup id.
        # This makes the data cleaning easier.
        'mainRosterGroupId.0.firstSubRosterQuestionId': true
        'mainRosterGroupId.1.firstSubRosterQuestionId': true
        'subRosterGroupId': true
        groupId: false
        groupQuestionId: false
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


  describe 'processGroupOrSection', ->
    it 'sub questions are invisible if the section is invisible', ->
      @form = {_type: 'Form', contents: [
          {
            _id: "firstSectionId"
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
              }
            ]
          },
          {
            _id: "secondSectionId"
            _type: "Section"
            conditions: [
              {op: "true", lhs: {question: "checkboxQuestionId"}}
            ]
            contents: [
              {
                _id: "anotherQuestionId",
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
      @visibilityEntity = new VisibilityEntity(@form)
      data = {}

      firstSection = @form.contents[0]
      @visibilityEntity.processGroupOrSection(firstSection, false, data, '')
      assert.deepEqual {firstSectionId: true, checkboxQuestionId: true}, @visibilityEntity.visibilityStructure

      secondSection = @form.contents[1]
      @visibilityEntity.processGroupOrSection(secondSection, true, data, '')
      assert.deepEqual {firstSectionId: true, checkboxQuestionId: true, secondSectionId: false, anotherQuestionId: false}, @visibilityEntity.visibilityStructure


