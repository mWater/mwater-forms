assert = require('chai').assert
VisibilityCalculator = require '../src/VisibilityCalculator'

describe 'VisibilityCalculator', ->
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
      @visibilityCalculator = new VisibilityCalculator(@form)

    it 'create a complete visibility structure', (done) ->
      data = {
        mainRosterGroupId: [
          { data: {firstRosterQuestionId: {value: 'some text'}, firstSubRosterQuestionId: {value: 'sub text'}} }
          # This will make the second question invisible
          { data: {firstRosterQuestionId: {value: null}} }
        ]
      }
      @visibilityCalculator.createVisibilityStructure data, (error, visibilityStructure) =>
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
        done()

  describe 'processQuestion', ->
    beforeEach ->
      @visibilityCalculator = new VisibilityCalculator(@form)

    describe "TextQuestion", ->
      it 'sets visibility to false if forceToInvisible is set to true', ->
        data = {}

        question = {_id: 'testId'}
        @visibilityCalculator.processQuestion(question, true, data, '')
        assert.deepEqual {testId: false}, @visibilityCalculator.visibilityStructure

      it 'sets visibility using the prefix', ->
        data = {}
        question = {_id: 'testId'}
        @visibilityCalculator.processQuestion(question, false, data, 'testprefix.')
        assert.deepEqual {'testprefix.testId': true}, @visibilityCalculator.visibilityStructure

      it 'sets visibility to true if conditions is null, undefined or empty', ->
        data = {}

        question = {_id: 'testId'}
        @visibilityCalculator.processQuestion(question, false, data, '')
        assert.deepEqual {testId: true}, @visibilityCalculator.visibilityStructure

        question = {_id: 'testId', conditions: null}
        @visibilityCalculator.processQuestion(question, false, data, '')
        assert.deepEqual {testId: true}, @visibilityCalculator.visibilityStructure

        question = {_id: 'testId', conditions: []}
        @visibilityCalculator.processQuestion(question, false, data, '')
        assert.deepEqual {testId: true}, @visibilityCalculator.visibilityStructure

      it 'sets visibility to true if conditions is true', ->
        data = {checkboxQuestionId: {value: true}}
        question = {
          _id: 'testId'
          conditions: [
            {op: "true", lhs: {question: "checkboxQuestionId"}}
          ]
        }
        @visibilityCalculator.processQuestion(question, false, data, '')
        assert.deepEqual {testId: true}, @visibilityCalculator.visibilityStructure

      it 'sets visibility to false if conditions is false', ->
        data = {checkboxQuestionId: {value: false}}
        question = {
          _id: 'testId'
          conditions: [
            {op: "true", lhs: {question: "checkboxQuestionId"}}
          ]
        }
        @visibilityCalculator.processQuestion(question, false, data, '')
        assert.deepEqual {testId: false}, @visibilityCalculator.visibilityStructure


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
      @visibilityCalculator = new VisibilityCalculator(@form)
      data = {}

      firstSection = @form.contents[0]
      @visibilityCalculator.processGroupOrSection(firstSection, false, data, '')
      assert.deepEqual {firstSectionId: true, checkboxQuestionId: true}, @visibilityCalculator.visibilityStructure

      secondSection = @form.contents[1]
      @visibilityCalculator.processGroupOrSection(secondSection, true, data, '')
      assert.deepEqual {firstSectionId: true, checkboxQuestionId: true, secondSectionId: false, anotherQuestionId: false}, @visibilityCalculator.visibilityStructure


