assert = require('chai').assert
conditionUtils = require '../src/conditionUtils'

describe "conditionUtils", ->
  describe 'compileCondition', ->
    beforeEach ->
      @compileCondition = (lhs, op, rhs) =>
        cond = {
          lhs: { question: "lhsid" }
          op: op
          rhs: if rhs? then { literal: rhs } else undefined
        }
        return conditionUtils.compileCondition(cond)

      # lhsExtras is stuff to add to answer of lhs question
      @testTrue = (lhs, op, rhs, lhsExtras={}) =>
        data = {lhsid: _.extend({ value: lhs }, lhsExtras)}
        condition = @compileCondition(lhs, op, rhs, lhsExtras)
        assert.isTrue condition(data)

      # lhsExtras is stuff to add to answer of lhs question
      @testFalse = (lhs, op, rhs, lhsExtras={}) =>
        data = {lhsid: _.extend({ value: lhs }, lhsExtras)}
        condition = @compileCondition(lhs, op, rhs, lhsExtras)
        assert.isFalse condition(data)

    describe "present", ->
      it "handles null", ->
        @testFalse(null, "present")

      it "handles zero", ->
        @testTrue(0, "present")

      it "handles empty string", ->
        @testTrue("abc", "present")
        @testFalse("", "present")

      it "handles empty list", ->
        @testTrue([""], "present")
        @testFalse([], "present")

      it "handles empty objects", ->
        @testTrue({something: 'value'}, "present")
        @testFalse({something: null}, "present")
        @testFalse({}, "present")

    describe "!present", ->
      it "handles zero", ->
        @testFalse(0, "!present")

      it "handles null", ->
        @testTrue(null, "!present")

      it "handles empty string", ->
        @testTrue("", "!present")
        @testFalse("abc", "!present")

      it "handles empty list", ->
        @testTrue([], "!present")
        @testFalse([""], "!present")

      it "handles empty objects", ->
        @testFalse({something: 'value'}, "!present")
        @testTrue({something: null}, "!present")
        @testTrue({}, "!present")

    it "compiles contains", ->
      @testTrue("abc", "contains", "ab")
      @testFalse("abc", "contains", "abcd")

    it "compiles !contains", ->
      @testFalse("abc", "!contains", "ab")
      @testTrue("abc", "!contains", "abcd")

    it "compiles =", ->
      @testTrue(3, "=", 3)
      @testFalse(3, "=", 4)

    it "compiles !=", ->
      @testTrue(3, "!=", 4)
      @testFalse(3, "!=", 3)

    it "compiles >", ->
      @testTrue(3, ">", 2)
      @testFalse(3, ">", 3)

    it "compiles <", ->
      @testTrue(2, "<", 3)
      @testFalse(3, "<", 3)

    it "compiles is", ->
      @testTrue("id1", "is", "id1")
      @testFalse("id1", "is", "id2")

    it "compiles isnt", ->
      @testTrue("id1", "isnt", "id2")
      @testFalse("id1", "isnt", "id1")

    it "compiles includes", ->
      @testTrue(["id1", "id2"], "includes", "id1")
      @testFalse(["id1", "id2"], "includes", "id3")

    it "compiles !includes", ->
      @testTrue(["id1", "id2"], "!includes", "id3")
      @testFalse(["id1", "id2"], "!includes", "id2")

    it "compiles before", ->
      @testTrue("2014-03-31", "before", "2014-04-01")
      @testFalse("2014-03-31", "before", "2014-03-31")

    it "compiles after", ->
      @testTrue("2014-03-31", "after", "2014-03-30")
      @testFalse("2014-03-31", "after", "2014-03-31")

    it "compiles true", ->
      @testTrue(true, "true")
      @testFalse(false, "true")

    it "compiles false", ->
      @testTrue(false, "false")
      @testFalse(true, "false")
      @testTrue(undefined, "false")
      @testTrue(null, "false")

    it "compiles isoneof", ->
      @testTrue("abc", "isoneof", ["abc", "def"])
      @testTrue("def", "isoneof", ["abc", "def"])
      @testFalse("xyz", "isoneof", ["abc", "def"])

    it "compiles isntoneof", ->
      @testFalse("abc", "isntoneof", ["abc", "def"])
      @testTrue("xyz", "isntoneof", ["abc", "def"])

    it "compiles isoneof array", ->
      @testTrue(["abc"], "isoneof", ["abc", "def"])
      @testTrue(["abc", "def"], "isoneof", ["abc", "def"])
      @testFalse(["xyz"], "isoneof", ["abc", "def"])

    it "compiles isntoneof array", ->
      @testFalse(["abc"], "isntoneof", ["abc", "def"])
      @testTrue(["xyz"], "isntoneof", ["abc", "def"])

    it "compiles is alternate", ->
      @testTrue(null, "is", "na", { alternate: "na" })
      @testTrue(null, "is", "dontknow", { alternate: "dontknow" })
      @testFalse(null, "is", "dontknow", { alternate: "na" })

    it "compiles isnt alternate", ->
      @testFalse(null, "isnt", "na", { alternate: "na" })
      @testFalse(null, "isnt", "dontknow", { alternate: "dontknow" })
      @testTrue(null, "isnt", "dontknow", { alternate: "na" })

    it "compiles isoneof alternate", ->
      @testTrue("abc", "isoneof", ["abc", "def"])
      @testTrue(null, "isoneof", ["abc", "na"], { alternate: "na" } )
      @testFalse(null, "isoneof", ["abc", "def"], { alternate: "na" } )

    it "compiles isntoneof alternate", ->
      @testFalse(null, "isntoneof", ["na", "def"], { alternate: "na"})
      @testTrue(null, "isntoneof", ["abc", "def"], { alternate: "na"})

    it "compiles includes alternate", ->
      @testTrue(["abc", "def"], "includes", "abc")
      @testTrue(null, "includes", "na", { alternate: "na" } )
      @testFalse(null, "includes", "abc", { alternate: "na" } )

    it "compiles !includes alternate", ->
      @testFalse(["abc", "def"], "!includes", "abc")
      @testFalse(null, "!includes", "na", { alternate: "na" } )
      @testTrue(null, "!includes", "abc", { alternate: "na" } )

  describe "compileConditions", ->
    it "combines conditions", ->
      data = {
        lhsid1: { value: 1 }
        lhsid2: { value: 2 }
      }

      cond1 = {
        lhs: { question: "lhsid1" }
        op: "="
        rhs: { literal: 1 }
      }

      cond2 = {
        lhs: { question: "lhsid2" }
        op: "="
        rhs: { literal: 2 }
      }

      cond = conditionUtils.compileConditions([cond1, cond2])
      assert.isTrue cond(data)

      data["lhsid2"] = { value: 3 }
      assert.isFalse cond(data)

  describe "applicableOps", ->
    it 'is correct for TextQuestion', ->
      ops = conditionUtils.applicableOps({ _type:"TextQuestion" })
      assert.deepEqual _.pluck(ops, "id"), ['present', '!present', 'contains', '!contains']

    it 'is correct for TextColumnQuestion', ->
      ops = conditionUtils.applicableOps({ _type:"TextColumnQuestion" })
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
      
    it 'is correct for NumberColumnQuestion', ->
      ops = conditionUtils.applicableOps({ _type:"NumberColumnQuestion" })
      assert.deepEqual _.pluck(ops, "id"), ['present', '!present', '=', '!=', '>', '<']
      
    it 'is correct for DropdownQuestion', ->
      ops = conditionUtils.applicableOps({ _type:"DropdownQuestion" })
      assert.deepEqual _.pluck(ops, "id"), ['present', '!present', 'is', 'isnt', 'isoneof', 'isntoneof']
      
    it 'is correct for DropdowColumnnQuestion', ->
      ops = conditionUtils.applicableOps({ _type:"DropdownColumnQuestion" })
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

    it 'is correct for CheckColumnQuestion', ->
      ops = conditionUtils.applicableOps({ _type:"CheckColumnQuestion" })
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

    it 'is correct for DropdownColumnQuestion', ->
      assert.equal conditionUtils.rhsType({ _type:"DropdownColumnQuestion" }, "present"), null
      assert.equal conditionUtils.rhsType({ _type:"DropdownColumnQuestion" }, "is"), "choice"
      assert.equal conditionUtils.rhsType({ _type:"DropdownColumnQuestion" }, "isoneof"), "choices"
      assert.equal conditionUtils.rhsType({ _type:"DropdownColumnQuestion" }, "isntoneof"), "choices"

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


  describe "summarizeConditions", ->
    before ->
      @form = {
        contents: [
          { _id: "001", _type: "TextQuestion", text: { en: "Q1" } }
          { _id: "002", _type: "NumberQuestion", text: { en: "Q2" } }
          { 
            _id: "003"
            _type: "RadioQuestion"
            text: { en: "Q3" }
            choices: [
              { id: "dog", label: { _base:"en", en: "Dog"}}
              { id: "cat", label: { _base:"en", en: "Cat"}}
            ]
            alternates: { na: true }
          }
        ]
      }

    it "none", ->
      assert.equal conditionUtils.summarizeConditions([], @form), ""

    it "unary condition", ->
      assert.equal conditionUtils.summarizeConditions([{
        lhs: { question : "002" }
        op: "present"
      }], @form), "Q2 was answered"

    it "value rhs", ->
      assert.equal conditionUtils.summarizeConditions([{
        lhs: { question : "002" }
        op: ">"
        rhs: { literal: 4 }
      }], @form), "Q2 is greater than 4"

    it "choice rhs", ->
      assert.equal conditionUtils.summarizeConditions([{
        lhs: { question : "003" }
        op: "is"
        rhs: { literal: "dog" }
      }], @form), "Q3 is Dog"

    it "choices rhs", ->
      assert.equal conditionUtils.summarizeConditions([{
        lhs: { question : "003" }
        op: "isoneof"
        rhs: { literal: ["dog", "cat"] }
      }], @form), "Q3 is one of Dog, Cat"
