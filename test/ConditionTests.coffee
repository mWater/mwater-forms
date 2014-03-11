$ = require 'jquery'
Backbone = require 'backbone'
Backbone.$ = $
assert = require('chai').assert
FormCompiler = require '../src/FormCompiler'

describe "Condition compiler", ->
  beforeEach ->
    @model = new Backbone.Model()
    @compiler = new FormCompiler(model: @model, locale: "es")
    @testTrue = (lhs, op, rhs) =>
      @model.set("lhsid", { value: lhs })
      cond = { 
        lhs: { question: "lhsid" }
        op: op
        rhs: if rhs? then { literal: rhs } else undefined
      }
      cond = @compiler.compileCondition(cond)
      assert.isTrue cond()

    @testFalse = (lhs, op, rhs) =>
      @model.set("lhsid", { value: lhs })
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
    @testFalse(undefined, "false")
    @testFalse(null, "false")

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
