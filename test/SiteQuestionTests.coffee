$ = require 'jquery'
Backbone = require 'backbone'
Backbone.$ = $
assert = require('chai').assert
FormCompiler = require '../src/FormCompiler'
commonQuestionTestList = require './commonQuestionTestList'

describe "SiteQuestion", ->
  beforeEach ->
    @ctx = {
      selectSite: (siteTypes, success) ->
        assert.deepEqual siteTypes, ["Water point"]
        success("10014")

      getSite: (siteCode, success) ->
        if siteCode == "10007"
          success({
            code: siteCode
            name: "Somename"
            type: ["Water point", "Protected dug well"]
          })
    }

    @model = new Backbone.Model()
    @compiler = new FormCompiler(model: @model, locale: "es", ctx: @ctx)
    @q = {
      _id: "q1234"
      _type: "SiteQuestion"
      text: { _base: "en", en: "English", es: "Spanish" }
      siteTypes: ["Water point"]
    }
    @qview = @compiler.compileQuestion(@q).render()

  # Run common tests
  commonQuestionTestList.call(this)

  it "allows valid site codes", ->
    @qview.$el.find("input").val("10007").change()
    assert.deepEqual @model.get("q1234").value, { code: "10007" }
    assert not @qview.validate()

  it "rejects invalid site codes", ->
    @qview.$el.find("input").val("10008").change()
    assert.deepEqual @model.get("q1234").value, { code: "10008" }
    assert @qview.validate()

  it "calls selectSite with site types", ->
    @qview.$el.find("#select").click()
    assert.deepEqual @model.get("q1234").value, { code: "10014" }

  it "displays site information", ->
    @qview.$el.find("input").val("10007").change()
    assert.include(@qview.$el.text(), 'Somename')
    assert.include(@qview.$el.text(), 'Water point')
    assert.include(@qview.$el.text(), 'Protected dug well')
