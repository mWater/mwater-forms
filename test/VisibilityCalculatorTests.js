import { assert } from 'chai';
import VisibilityCalculator from '../src/VisibilityCalculator';
import { default as ResponseRow } from '../src/ResponseRow';

describe('VisibilityCalculator', function() {
  beforeEach(function() {
    return this.formDesign = {_type: 'Form', contents: [
        {
          _id: "sectionId",
          _type: "Section",
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
              validations: [],
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
              validations: [],
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
    };});

  describe('createVisibilityStructure', function() {
    beforeEach(function() {
      return this.visibilityCalculator = new VisibilityCalculator(this.formDesign);
    });

    return it('create a complete visibility structure', function(done) {
      const data = {
        mainRosterGroupId: [
          { data: {firstRosterQuestionId: {value: 'some text'}, firstSubRosterQuestionId: {value: 'sub text'}} },
          // This will make the second question invisible
          { data: {firstRosterQuestionId: {value: null}} }
        ]
      };
      const responseRow = new ResponseRow({
        formDesign: this.formDesign,
        responseData: data
        });

      return this.visibilityCalculator.createVisibilityStructure(data, responseRow, (error, visibilityStructure) => {
        const expectedVisibilityStructure = {
          'sectionId': true,
          'checkboxQuestionId': true,
          'mainRosterGroupId': true,
          'mainRosterGroupId.0.firstRosterQuestionId': true,
          'mainRosterGroupId.0.secondRosterQuestionId': true,
          'mainRosterGroupId.1.firstRosterQuestionId': true,
          'mainRosterGroupId.1.secondRosterQuestionId': false,
          // Questions under subRosterGroup need to use the mainRosterGroup id.
          // This makes the data cleaning easier.
          'mainRosterGroupId.0.firstSubRosterQuestionId': true,
          'mainRosterGroupId.1.firstSubRosterQuestionId': true,
          'subRosterGroupId': true,
          groupId: false,
          groupQuestionId: false
        };
        assert.deepEqual(visibilityStructure, expectedVisibilityStructure);
        return done();
      });
    });
  });

  describe('processQuestion', function() {
    beforeEach(function() {
      return this.visibilityCalculator = new VisibilityCalculator(this.formDesign);
    });

    return describe("TextQuestion", function() {
      it('sets visibility to false if forceToInvisible is set to true', function(done) {
        const data = {};

        const question = {_id: 'testId'};
        const visibilityStructure = {};
        return this.visibilityCalculator.processQuestion(question, true, data, null, visibilityStructure, '', error => {
          assert.deepEqual({testId: false}, visibilityStructure);
          return done();
        });
      });

      it('sets visibility using the prefix', function(done) {
        const data = {};
        const question = {_id: 'testId'};
        const visibilityStructure = {};
        return this.visibilityCalculator.processQuestion(question, false, data, null, visibilityStructure, 'testprefix.', error => {
          assert.deepEqual({'testprefix.testId': true}, visibilityStructure);
          return done();
        });
      });

      it('sets visibility to true if conditions is null, undefined or empty', function(done) {
        const data = {};

        let question = {_id: 'testId'};
        let visibilityStructure = {};
        return this.visibilityCalculator.processQuestion(question, false, data, null, visibilityStructure, '', error => {
          assert.deepEqual({testId: true}, visibilityStructure);

          question = {_id: 'testId', conditions: null};
          visibilityStructure = {};
          return this.visibilityCalculator.processQuestion(question, false, data, null, visibilityStructure, '', error => {
            assert.deepEqual({testId: true}, visibilityStructure);

            question = {_id: 'testId', conditions: []};
            visibilityStructure = {};
            return this.visibilityCalculator.processQuestion(question, false, data, null, visibilityStructure, '', error => {
              assert.deepEqual({testId: true}, visibilityStructure);
              return done();
            });
          });
        });
      });

      it('evaluates conditionExpr true', function(done) {
        const data = {};
        const question = { _id: 'testId', conditionExpr: { type: "literal", valueType: "boolean", value: true } };
        const visibilityStructure = {};
        this.visibilityCalculator.processQuestion(question, false, data, null, visibilityStructure, '', error => {
          assert.deepEqual({testId: true}, visibilityStructure);
          return done();
        });
      });

      it('evaluates conditionExpr false', function(done) {
        const data = {};
        const question = { _id: 'testId', conditionExpr: { type: "literal", valueType: "boolean", value: false } };
        const visibilityStructure = {};
        this.visibilityCalculator.processQuestion(question, false, data, null, visibilityStructure, '', error => {
          assert.deepEqual({testId: false}, visibilityStructure);
          return done();
        });
      });

      it('evaluates conditionExpr null as false', function(done) {
        const data = {};
        const question = { _id: 'testId', conditionExpr: { type: "literal", valueType: "boolean", value: null } };
        const visibilityStructure = {};
        this.visibilityCalculator.processQuestion(question, false, data, null, visibilityStructure, '', error => {
          assert.deepEqual({testId: false}, visibilityStructure);
          return done();
        });
      });

      it('sets visibility to true if conditions is true', function(done) {
        const data = {checkboxQuestionId: {value: true}};
        const question = {
          _id: 'testId',
          conditions: [
            {op: "true", lhs: {question: "checkboxQuestionId"}}
          ]
        };
        const visibilityStructure = {};
        return this.visibilityCalculator.processQuestion(question, false, data, null, visibilityStructure, '', error => {
          assert.deepEqual({testId: true}, visibilityStructure);
          return done();
        });
      });

      it('sets visibility to false if conditions is false', function(done) {
        const data = {checkboxQuestionId: {value: false}};
        const question = {
          _id: 'testId',
          conditions: [
            {op: "true", lhs: {question: "checkboxQuestionId"}}
          ]
        };
        const visibilityStructure = {};
        return this.visibilityCalculator.processQuestion(question, false, data, null, visibilityStructure, '', error => {
          assert.deepEqual(visibilityStructure, {testId: false});
          return done();
        });
      });

      it("sets visibility to true if randomAsked is null", function(done) {
        const data = {testId: {value: ""}};
        const question = {
          _id: 'testId',
          _type: "TextQuestion",
          conditions: [],
          randomAskProbability: 0.4
        };

        const visibilityStructure = {};
        return this.visibilityCalculator.processQuestion(question, false, data, null, visibilityStructure, '', error => {
          assert.deepEqual(visibilityStructure, {testId: true});
          return done();
        });
      });

      return it("sets visibility to false if randomAsked is false", function(done) {
        const data = { testId: { value: "", randomAsked: false } };

        const question = {
          _id: 'testId',
          _type: "TextQuestion",
          conditions: [],
          randomAskProbability: 0.4
        };

        const visibilityStructure = {};
        return this.visibilityCalculator.processQuestion(question, false, data, null, visibilityStructure, '', error => {
          assert.deepEqual(visibilityStructure, {testId: false});
          return done();
        });
      });
    });
  });



  return describe('processGroup', () => it('sub questions are invisible if the section is invisible', function(done) {
    const form = {_type: 'Form', contents: [
        {
          _id: "firstSectionId",
          _type: "Section",
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
          _id: "secondSectionId",
          _type: "Section",
          conditions: [
            {op: "true", lhs: {question: "checkboxQuestionId"}}
          ],
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
    };
    
    const visibilityCalculator = new VisibilityCalculator(form);
    const visibilityStructure = {};
    const data = {};

    const firstSection = form.contents[0];
    return visibilityCalculator.processGroup(firstSection, false, data, null, visibilityStructure, '', error => {
      assert.deepEqual({firstSectionId: true, checkboxQuestionId: true}, visibilityStructure);

      const secondSection = form.contents[1];
      return visibilityCalculator.processGroup(secondSection, true, data, null, visibilityStructure, '', error => {
        assert.deepEqual({firstSectionId: true, checkboxQuestionId: true, secondSectionId: false, anotherQuestionId: false}, visibilityStructure);
        return done();
      });
    });
  }));
});

