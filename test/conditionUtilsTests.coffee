_ = require 'lodash'
assert = require("chai").assert
conditionUtils = require '../src/conditionUtils'

describe "ConditionUtils", ->
  describe "applicableOps", ->
    it 'is correct for TextQuestion', ->
      ops = conditionUtils.applicableOps({ _type:"TextQuestion" })
      assert.deepEqual _.pluck(ops, "id"), ['present', '!present', 'contains', '!contains']

    it 'is correct for Question with N/A alternate', ->
      ops = conditionUtils.applicableOps({ _type:"TextQuestion", alternates: { na: true } })
      assert.deepEqual _.pluck(ops, "id"), ['present', '!present', 'contains', '!contains', 'is', 'isnt', 'isoneof', 'isntoneof']

    it 'is correct for Question with Dont Know alternate', ->
      ops = conditionUtils.applicableOps({ _type:"TextQuestion", alternates: { dontknow: true } })
      assert.deepEqual _.pluck(ops, "id"), ['present', '!present', 'contains', '!contains', 'is', 'isnt', 'isoneof', 'isntoneof']

    it 'is correct for NumberQuestion', ->
      ops = conditionUtils.applicableOps({ _type:"NumberQuestion" })
      assert.deepEqual _.pluck(ops, "id"), ['present', '!present', '=', '!=', '>', '<']
      
    it 'is correct for DropdownQuestion', ->
      ops = conditionUtils.applicableOps({ _type:"DropdownQuestion" })
      assert.deepEqual _.pluck(ops, "id"), ['present', '!present', 'is', 'isnt', 'isoneof', 'isntoneof']
      
    it 'is correct for RadioQuestion', ->
      ops = conditionUtils.applicableOps({ _type:"RadioQuestion" })
      assert.deepEqual _.pluck(ops, "id"), ['present', '!present', 'is', 'isnt', 'isoneof', 'isntoneof']

    it 'is correct for RadioQuestion with N/A alternate', ->
      ops = conditionUtils.applicableOps({ _type:"RadioQuestion", alternates: { na: true }})
      assert.deepEqual _.pluck(ops, "id"), ['present', '!present', 'is', 'isnt', 'isoneof', 'isntoneof']
      
    it 'is correct for MulticheckQuestion', ->
      ops = conditionUtils.applicableOps({ _type:"MulticheckQuestion" })
      assert.deepEqual _.pluck(ops, "id"), ['present', '!present', 'includes', '!includes', 'isoneof', 'isntoneof']

    it 'is correct for MulticheckQuestion with N/A alternate', ->
      ops = conditionUtils.applicableOps({ _type:"MulticheckQuestion", alternates: { na: true } })
      assert.deepEqual _.pluck(ops, "id"), ['present', '!present', 'includes', '!includes', 'isoneof', 'isntoneof'], "Same as does not use is/isn't"
      
    it 'is correct for DateQuestion', ->
      ops = conditionUtils.applicableOps({ _type:"DateQuestion" })
      assert.deepEqual _.pluck(ops, "id"), ['present', '!present', 'before', 'after']
      
    it 'is correct for UnitsQuestion', ->
      ops = conditionUtils.applicableOps({ _type:"UnitsQuestion" })
      assert.deepEqual _.pluck(ops, "id"), ['present', '!present']

    it 'is correct for LocationQuestion', ->
      ops = conditionUtils.applicableOps({ _type:"LocationQuestion" })
      assert.deepEqual _.pluck(ops, "id"), ['present', '!present']

    it 'is correct for ImageQuestion', ->
      ops = conditionUtils.applicableOps({ _type:"ImageQuestion" })
      assert.deepEqual _.pluck(ops, "id"), ['present', '!present']

    it 'is correct for ImagesQuestion', ->
      ops = conditionUtils.applicableOps({ _type:"ImagesQuestion" })
      assert.deepEqual _.pluck(ops, "id"), ['present', '!present']

    it 'is correct for TextListQuestion', ->
      ops = conditionUtils.applicableOps({ _type:"TextListQuestion" })
      assert.deepEqual _.pluck(ops, "id"), ['present', '!present']

    # it 'is correct for MultipleTextQuestion', ->
    #   ops = conditionUtils.applicableOps({ _type:"MultipleTextQuestion" })
    #   assert.deepEqual _.pluck(ops, "id"), ['present', '!present']

    # it 'is correct for MultipleNumberQuestion', ->
    #   ops = conditionUtils.applicableOps({ _type:"MultipleNumberQuestion" })
    #   assert.deepEqual _.pluck(ops, "id"), ['present', '!present']

    it 'is correct for CheckQuestion', ->
      ops = conditionUtils.applicableOps({ _type:"CheckQuestion" })
      assert.deepEqual _.pluck(ops, "id"), ['true', 'false']


  describe "rhsType", ->
    it 'is correct for TextQuestion', ->
      assert.equal conditionUtils.rhsType({ _type:"TextQuestion" }, "present"), null
      assert.equal conditionUtils.rhsType({ _type:"TextQuestion" }, "contains"), "text"

    it 'is correct for NumberQuestion', ->
      assert.equal conditionUtils.rhsType({ _type:"NumberQuestion" }, "present"), null
      assert.equal conditionUtils.rhsType({ _type:"NumberQuestion" }, ">"), "number"

    it 'is correct for DropdownQuestion', ->
      assert.equal conditionUtils.rhsType({ _type:"DropdownQuestion" }, "present"), null
      assert.equal conditionUtils.rhsType({ _type:"DropdownQuestion" }, "is"), "choice"
      assert.equal conditionUtils.rhsType({ _type:"DropdownQuestion" }, "isoneof"), "choices"
      assert.equal conditionUtils.rhsType({ _type:"DropdownQuestion" }, "isntoneof"), "choices"

    it 'is correct for CheckQuestion', ->
      assert.equal conditionUtils.rhsType({ _type:"CheckQuestion" }, "present"), null
      assert.equal conditionUtils.rhsType({ _type:"CheckQuestion" }, "isnt"), "choice"

    it 'is correct for MulticheckQuestion', ->
      assert.equal conditionUtils.rhsType({ _type:"MulticheckQuestion" }, "present"), null
      assert.equal conditionUtils.rhsType({ _type:"MulticheckQuestion" }, "includes"), "choice"

  describe "rhsChoices", ->
    it 'is correct for DropdownQuestion', ->
      q = { 
        _type:"DropdownQuestion"
        choices: [
          { id: "id1", label: { _base: "en", en: "First" }}
          { id: "id2", label: { _base: "es", en: "Second", es: "Segundo" }}
        ]
      }

      choices = conditionUtils.rhsChoices(q, "is")
      assert.deepEqual choices, [{ id: "id1", text: "First"}, { id: "id2", text: "Segundo"}]

    it 'is correct for DropdownQuestion with N/A', ->
      q = { 
        _type:"DropdownQuestion"
        alternates: { na: true }
        choices: [
          { id: "id1", label: { _base: "en", en: "First" }}
          { id: "id2", label: { _base: "es", en: "Second", es: "Segundo" }}
        ]
      }

      choices = conditionUtils.rhsChoices(q, "is")
      assert.deepEqual choices, [{ id: "id1", text: "First"}, { id: "id2", text: "Segundo"}, { id: "na", text: "Not Applicable"}]

    it 'is correct for TextQuestion with N/A and Dont Know' , ->
      q = { 
        _type:"TextQuestion"
        alternates: { na: true, dontknow: true }
      }

      choices = conditionUtils.rhsChoices(q, "is")
      assert.deepEqual choices, [{ id: "dontknow", text: "Don't Know"}, { id: "na", text: "Not Applicable"}]

  describe "validateCondition", ->
    before ->
      @form = {
        contents: [
          { _id: "001", _type: "TextQuestion" }
          { _id: "002", _type: "NumberQuestion" }
          { 
            _id: "003"
            _type: "RadioQuestion"
            choices: [
              { id: "dog", label: { _base:"en", en: "Dog"}}
              { id: "cat", label: { _base:"en", en: "Cat"}}
            ]
            alternates: { na: true }
          }
        ]
      }
    it "fails for no lhs", ->
      assert.isFalse conditionUtils.validateCondition({
      }, @form)

    it "fails for non-existant question", ->
      assert.isFalse conditionUtils.validateCondition({
        lhs: { question : "xxx" } 
      }, @form)

    it "fails for no op", ->
      assert.isFalse conditionUtils.validateCondition({
        lhs: { question : "001" } 
      }, @form)

    it "fails for inappropriate op", ->
      assert.isFalse conditionUtils.validateCondition({
        lhs: { question : "001" }
        op: ">" 
      }, @form)

    it "fails for no rhs on non-unary", ->
      assert.isFalse conditionUtils.validateCondition({
        lhs: { question : "002" }
        op: ">"
      }, @form)

    it "fails for wrong rhs type", ->
      assert.isFalse conditionUtils.validateCondition({
        lhs: { question : "002" }
        op: ">"
        rhs: { literal: "xyz" }
      }, @form)

    it "fails for non-existant id of choice", ->
      assert.isFalse conditionUtils.validateCondition({
        lhs: { question : "003" }
        op: "is"
        rhs: { literal: "xyz" }
        }, @form)

      assert.isTrue conditionUtils.validateCondition({
        lhs: { question : "003" }
        op: "is"
        rhs: { literal: "dog" }
        }, @form)

    it "fails for non-existant id of choices", ->
      assert.isFalse conditionUtils.validateCondition({
        lhs: { question : "003" }
        op: "isoneof"
        rhs: { literal: ["xyz"] }
        }, @form)

      assert.isTrue conditionUtils.validateCondition({
        lhs: { question : "003" }
        op: "isoneof"
        rhs: { literal: ["dog"] }
        }, @form)

    it "true for alternate id of choice", ->
      assert.isTrue conditionUtils.validateCondition({
        lhs: { question : "003" }
        op: "is"
        rhs: { literal: "na" }
        }, @form)

    it "true for alternate id of choices", ->
      assert.isTrue conditionUtils.validateCondition({
        lhs: { question : "003" }
        op: "isoneof"
        rhs: { literal: ["na"] }
        }, @form)

    it "succeeds if ok", ->
      assert.isTrue conditionUtils.validateCondition({
        lhs: { question : "002" }
        op: ">"
        rhs: { literal: 4 }
      }, @form)
