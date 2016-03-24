###
$ = require 'jquery'
Backbone = require 'backbone'
Backbone.$ = $
assert = require('chai').assert
FormCompiler = require '../src/FormCompiler'
commonQuestionTestList = require './commonQuestionTestList'

describe "UnitsQuestion", ->
  beforeEach ->
    @model = new Backbone.Model()
    @compiler = new FormCompiler(model: @model, locale: "es")
    @q = {
      _id: "q1234"
      _type: "UnitsQuestion"
      text: { _base: "en", en: "English", es: "Spanish" }
      decimal: true
      required: true
      units: [
        { id: "a", label: { _base: "en", es: "AA" }, hint: { _base: "en", es: "a-hint" } }
        { id: "b", label: { _base: "en", es: "BB" } }
        { id: "c", label: { _base: "en", es: "CC" } }
      ]

    }
    @qview = @compiler.compileQuestion(@q).render()

  # Run common tests
  commonQuestionTestList.call(this)

  it "allows changing of units", ->
    @qview.$el.find("#quantity").val("123.4").change()
    @qview.$el.find("#units").val("a").change()
    assert.equal @model.get("q1234").value.units, "a"

    @qview.$el.find("#units").val("b").change()
    assert.equal @model.get("q1234").value.units, "b"

  it "defaults unit", ->
    @q.defaultUnits = "b"
    @qview = @compiler.compileQuestion(@q).render()

    @qview.$el.find("#quantity").val("123.4").change()
    assert.equal @model.get("q1234").value.units, "b"

  it "records decimal number", ->
    @qview.$el.find("#quantity").val("123.4").change()
    @qview.$el.find("#units").val("a").change()
    assert.equal @model.get("q1234").value.quantity, 123.4

  it "records whole number", ->
    @q.decimal = false
    @qview = @compiler.compileQuestion(@q).render()

    @qview.$el.find("#quantity").val("123.4").change()
    assert.equal @model.get("q1234").value.quantity, 123

  it "enforces required", ->
    assert @qview.validate()

    @q.required = false
    @qview = @compiler.compileQuestion(@q).render()
    assert not @qview.validate()

  it "enforces required on blank answer", ->
    @qview.$el.find("#quantity").val("response").change()
    @qview.$el.find("#quantity").val("").change()
    @qview.$el.find("#units").val("a").change()
    assert @qview.validate()

  it "allows 0 on required", ->
    @qview.$el.find("#quantity").val("0").change()
    @qview.$el.find("#units").val("a").change()
    assert not @qview.validate()

  it "requires unit to be specified", ->
    @qview.$el.find("#quantity").val("0").change()
    assert @qview.validate()

    @qview.$el.find("#units").val("a").change()
    assert not @qview.validate()
      

  it "validates range", ->
    @q.validations = [
      {
        op: "range"
        rhs: { literal: { max: 6 } }
        message: { _base: "es", es: "message" }
      }
    ]
    @qview = @compiler.compileQuestion(@q).render()

    @qview.$el.find("#quantity").val("7").change()
    @qview.$el.find("#units").val("a").change()
    assert.equal @qview.validate(), "message"
###