$ = require 'jquery'
Backbone = require 'backbone'
Backbone.$ = $
assert = require('chai').assert
FormCompiler = require '../src/FormCompiler'
commonQuestionTests = require './commonQuestionTests'

describe "SiteQuestion", ->
  beforeEach ->
    @ctx = {
      selectSite: (success) ->
        success(10014)
    }

    @model = new Backbone.Model()
    @compiler = new FormCompiler(model: @model, locale: "es")
    @q = {
      _id: "q1234"
      _type: "SiteQuestion"
      text: { _base: "en", en: "English", es: "Spanish" }
    }
    @qview = @compiler.compileQuestion(@q, @ctx).render()

  # Run common tests
  commonQuestionTests.call(this)

  it "allows valid site codes", ->
    @qview.$el.find("input").val("10007").change()
    assert.equal @model.get("q1234").value, "10007"
    assert not @qview.validate()

  it "rejects invalid site codes", ->
    @qview.$el.find("input").val("10008").change()
    assert.equal @model.get("q1234").value, "10008"
    assert @qview.validate()

  it "calls selectSite", ->
    @qview.$el.find("#select").click()
    assert.equal @model.get("q1234").value, "10014"
