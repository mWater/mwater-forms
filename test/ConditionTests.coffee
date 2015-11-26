$ = require 'jquery'
Backbone = require 'backbone'
Backbone.$ = $
assert = require('chai').assert
FormCompiler = require '../src/FormCompiler'
_ = require 'lodash'

describe "Condition compiler", ->
  beforeEach ->
    @model = new Backbone.Model()
    @compiler = new FormCompiler(model: @model, locale: "es")
    # lhsExtras is stuff to add to answer of lhs question
    @testTrue = (lhs, op, rhs, lhsExtras={}) =>
      @model.set("lhsid", _.extend({ value: lhs }, lhsExtras))
      cond = { 
        lhs: { question: "lhsid" }
        op: op
        rhs: if rhs? then { literal: rhs } else undefined
      }
      cond = @compiler.compileCondition(cond)
      assert.isTrue cond()

    # lhsExtras is stuff to add to answer of lhs question
    @testFalse = (lhs, op, rhs, lhsExtras={}) =>
      @model.set("lhsid", _.extend({ value: lhs }, lhsExtras))
      cond = { 
        lhs: { question: "lhsid" }
        op: op
        rhs: if rhs? then { literal: rhs } else undefined
      }
      cond = @compiler.compileCondition(cond)
      assert.isFalse cond()

  describe "present", ->
    it "handles empty string", ->
      @testTrue("abc", "present")
      @testFalse("", "present")

    it "handles empty list", ->
      @testTrue([""], "present")
      @testFalse([], "present")

  describe "!present", ->
    it "handles empty string", ->
      @testTrue("", "!present")
      @testFalse("abc", "!present")

    it "handles empty list", ->
      @testTrue([], "!present")
      @testFalse([""], "!present")

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

describe "Conditions compiler", ->
  beforeEach ->
    @model = new Backbone.Model()
    @compiler = new FormCompiler(model: @model, locale: "es")

  it "combines conditions", ->
    @model.set("lhsid1", { value: 1 })
    @model.set("lhsid2", { value: 2 })
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
    cond = @compiler.compileConditions([cond1, cond2])
    assert.isTrue cond()

    @model.set("lhsid2", { value: 3 })
    assert.isFalse cond()
