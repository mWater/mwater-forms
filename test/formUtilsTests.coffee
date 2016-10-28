_ = require 'lodash'
assert = require("chai").assert
formUtils = require '../src/formUtils'
simpleForm = require './simpleForm'
sectionedForm = require './sectionedForm'
propertyLinksFormDesign = require './propertyLinksFormDesign'

canonical = require 'canonical-json'

compare = (actual, expected) ->
  assert.equal canonical(actual), canonical(expected), "\n" + canonical(actual) + "\n" + canonical(expected) + "\n"

describe "FormUtils", ->
  describe "priorQuestions", ->
    context 'two prior questions, one following', ->
      it 'returns prior questions', ->
        priors = formUtils.priorQuestions(simpleForm, simpleForm.contents[2])
        assert.deepEqual _.pluck(priors, "_id"), ['0001', '0002']

      it "correctly handles sections", ->
        priors = formUtils.priorQuestions(sectionedForm, sectionedForm.contents[0].contents[2])
        assert.deepEqual _.pluck(priors, "_id"), ['0001', '0002']

      it "correctly handles sections as item", ->
        priors = formUtils.priorQuestions(sectionedForm, sectionedForm.contents[1])
        assert.deepEqual _.pluck(priors, "_id"), ['0001', '0002', '0003', '0004']

      it 'includes group contents', ->
        form = {
          _type: "Form"
          contents: [
            { _id: "groupid", _type: "Group", contents: simpleForm.contents }
          ]
        }
        priors = formUtils.priorQuestions(form)
        assert.deepEqual _.pluck(priors, "_id"), ['0001', '0002', '0003', '0004']

      it "doesn't include roster contents by default", ->
        form = {
          _type: "Form"
          contents: [
            { _id: "groupid", _type: "RosterGroup", contents: simpleForm.contents }
          ]
        }
        priors = formUtils.priorQuestions(form)
        assert.deepEqual _.pluck(priors, "_id"), []

      it "includes roster contents only if rosterId specified", ->
        form = {
          _type: "Form"
          contents: [
            { _id: "groupid", _type: "RosterGroup", contents: simpleForm.contents }
          ]
        }
        priors = formUtils.priorQuestions(form, null, "groupid")
        assert.deepEqual _.pluck(priors, "_id"), ['0001', '0002', '0003', '0004']

  describe "getRosterIds", ->
    it 'gets unique roster ids', ->
      form = _.cloneDeep(sectionedForm)
      form.contents[0].contents.push(
        { _id: "groupid", _type: "RosterGroup", contents: [] }
      )

      assert.deepEqual formUtils.getRosterIds(form), ["groupid"]

  describe "findItem", ->
    it 'finds question', ->
      assert.equal formUtils.findItem(simpleForm, "0002")._id, "0002"

    it "finds section", ->
      assert.equal formUtils.findItem(sectionedForm, "2")._id, "2"
 
    it "correctly handles sections", ->
      assert.equal formUtils.findItem(sectionedForm, "0002")._id, "0002"

  describe "prepareQuestion", ->
    context "blank TextQuestion that is prepared", ->
      beforeEach -> 
        @question = { _type: "TextQuestion" }
        formUtils.prepareQuestion(@question)

      it "adds _id", ->
        assert.equal @question._id.length, 32

      it "adds text", ->
        assert.deepEqual @question.text, {}

      it "adds required:false", ->
        assert.equal @question.required, false

      it "adds empty conditions", ->
        assert.deepEqual @question.conditions, []
        
      it "adds empty validations", ->
        assert.deepEqual @question.validations, []

    it "adds decimal:true to NumberQuestion and NumberColumnQuestion", ->
      question = formUtils.prepareQuestion({ _type: "NumberQuestion" })
      assert.equal question.decimal, true

      question = formUtils.prepareQuestion({ _type: "NumberColumnQuestion" })
      assert.equal question.decimal, true
        
    it "removes choices for NumberQuestion", ->
      question = formUtils.prepareQuestion({ _type: "NumberQuestion", choices: [] })
      assert.isUndefined question.choices

    it "removes decimal for TextQuestion", ->
      question = formUtils.prepareQuestion({ _type: "TextQuestion", decimal: true })
      assert.isUndefined question.decimal

    it "adds choices to RadioQuestion and DropdownColumnQuestion", ->
      question = formUtils.prepareQuestion({ _type: "RadioQuestion" })
      assert.deepEqual question.choices, []

      question = formUtils.prepareQuestion({ _type: "DropdownColumnQuestion" })
      assert.deepEqual question.choices, []
        
    # it "adds items? to MultipleTextQuestion"
    # it "adds items? to MultipleNumberQuestion"
    it "adds format to DateQuestion", ->
      question = formUtils.prepareQuestion({ _type: "DateQuestion" })
      assert.equal question.format, "YYYY-MM-DD"

    it "adds format to TextQuestion", ->
      question = formUtils.prepareQuestion({ _type: "TextQuestion" })
      assert.equal question.format, "singleline"

    #it "adds format to DateTimeQuestion"

  describe "changeQuestionType", ->
    beforeEach -> 
      @question = { 
        _type: "TextQuestion"
        validations: [
          {
            op: "lengthRange"
            rhs: { literal: { min: 6, max: 8 } }
            message: { _base: "es", es: "message" }
          }
        ]
      } 
      formUtils.prepareQuestion(@question)

    it "removed validations", ->
      formUtils.changeQuestionType(@question, "DateQuestion")
      assert.equal @question.validations.length, 0

    it "removes format", ->
      formUtils.changeQuestionType(@question, "DateQuestion")
      assert.equal @question.format, "YYYY-MM-DD" 
      
  describe "duplicateItem", ->
    describe "duplicate question", ->
      before ->
        @duplicate = formUtils.duplicateItem(simpleForm.contents[0])

      it "sets new id", ->
        assert.notEqual @duplicate._id, simpleForm.contents[0]._id

      it "sets _basedOn", ->
        assert.equal @duplicate._basedOn, simpleForm.contents[0]._id

    describe "duplicate section", ->
      before ->
        @duplicate = formUtils.duplicateItem(sectionedForm.contents[0])

      it "sets new id", ->
        assert.notEqual @duplicate._id, sectionedForm.contents[0]._id

      it "sets _basedOn", ->
        assert.equal @duplicate._basedOn, sectionedForm.contents[0]._id

      it "duplicates questions", ->
        assert.equal @duplicate.contents[0]._basedOn, sectionedForm.contents[0].contents[0]._id

      it "maps references in conditions", ->
        assert.equal @duplicate.contents[2].conditions[0].lhs.question, @duplicate.contents[1]._id

      it "handles OR conditions"  
      it "handles AND conditions"  

    it "removes conditions which reference non-present questions", ->
      @duplicate = formUtils.duplicateItem(sectionedForm.contents[1])
      assert.equal @duplicate.contents[0].conditions.length, 0

    describe "duplicate form", ->
      before ->
        @duplicate = formUtils.duplicateItem(sectionedForm)

      it "sets _basedOn", ->
        assert.equal @duplicate.contents[0]._basedOn, sectionedForm.contents[0]._id

      it "duplicates questions", ->
        assert.equal @duplicate.contents[0].contents[0]._basedOn, sectionedForm.contents[0].contents[0]._id

      it "maps references across sections", ->
        assert.equal @duplicate.contents[1].contents[0].conditions[0].lhs.question, @duplicate.contents[0].contents[2]._id

      it "duplicates locales", ->
        assert.equal @duplicate.locales[0].code, "en"

  describe "update localizations", ->
    it "adds form-level localizations", ->
      form = _.cloneDeep(simpleForm)

      formUtils.updateLocalizations(form)
      assert form.localizedStrings.length > 5

  describe "hasLocalizations", ->
    it "true if has one translation", ->
      obj = [
        { _base: "en", en: "x", fr: "y" }
      ]
      assert.isTrue formUtils.hasLocalizations(obj, "fr")
      assert.isFalse formUtils.hasLocalizations(obj, "de")

    it "false if blank/non-existent", ->
      obj = [
        { _base: "en", en: "x", fr: "" }
      ]
      assert.isFalse formUtils.hasLocalizations(obj, "fr")

  describe "extractLocalizedStrings", ->
    it "gets all strings", ->
      obj = {
        a: [
          { 
            b: { _base: "en", en: "hello" }
          },
          { 
            c: { _base: "es", en: "hello2" }
          }
        ]
        d: "test"
        e: null
      }
      strs = formUtils.extractLocalizedStrings(obj)

      assert.deepEqual strs, [{ _base: "en", en: "hello" }, { _base: "es", en: "hello2" }]

    it "gets localizedStrings strings", ->
      obj = {
        localizedStrings: [
          { 
            b: { _base: "en", en: "hello" }
          },
          { 
            c: { _base: "es", en: "hello2" }
          }
        ]
        d: "test"
        e: null
      }
      strs = formUtils.extractLocalizedStrings(obj)

      assert.deepEqual strs, [{ _base: "en", en: "hello" }, { _base: "es", en: "hello2" }]

  describe "extractEntityReferences", ->
    it "extracts entity questions", ->
      formDesign = {
        _type: "Form"
        contents: [
          {
            _id: "0001"
            _type: "EntityQuestion"
            entityType: "community"
          }
        ]
      }

      responseData = {
        "0001": {
          value: "123456"
        }
      }

      compare formUtils.extractEntityReferences(formDesign, responseData), [
        {
          question: "0001"
          roster: null
          entityType: "community"
          property: "_id"
          value: "123456"
        }
      ]

    it "extracts site questions", ->
      formDesign = {
        _type: "Form"
        contents: [
          {
            _id: "0001"
            _type: "SiteQuestion"
            siteTypes: ["Health facility"]
          }
        ]
      }

      responseData = {
        "0001": {
          value: { code: "10007" }
        }
      }

      compare formUtils.extractEntityReferences(formDesign, responseData), [
        {
          question: "0001"
          roster: null
          entityType: "health_facility"
          property: "code"
          value: "10007"
        }
      ]

    it "extracts site questions in roster", ->
      formDesign = {
        _type: "Form"
        contents: [
          { 
            _id: "rosterid"
            _type: "RosterGroup"
            contents: [
              {
                _id: "0001"
                _type: "SiteQuestion"
                siteTypes: ["Health facility"]
              }
            ]
          }
        ]
      }

      responseData = {
        "rosterid": [
          {
            _id: "firstrid"
            data: {
              "0001": {
                value: { code: "10007" }
              }
            }
          }
          {
            _id: "secondrid"
            data: {
              "0001": {
                value: { code: "10014" }
              }
            }
          }
        ]
      }

      compare formUtils.extractEntityReferences(formDesign, responseData), [
        {
          question: "0001"
          roster: "firstrid"
          entityType: "health_facility"
          property: "code"
          value: "10007"
        }
        {
          question: "0001"
          roster: "secondrid"
          entityType: "health_facility"
          property: "code"
          value: "10014"
        }
      ]
