$ = require 'jquery'
Backbone = require 'backbone'
Backbone.$ = $
assert = require('chai').assert
FormCompiler = require '../src/FormCompiler'
commonQuestionTestList = require './commonQuestionTestList'

describe "SiteQuestion", ->
  beforeEach ->
    @ctx = {
      selectEntity: (options) ->
        assert.equal options.entityType, "water_point"
        options.callback("id10014")

      getEntityById: (entityType, entityId, success) ->
        if entityId == "id10007"
          success({
            _id: "id10007"
            code: "10007"
            name: "Somename"
          })
        if entityId == "id10014"
          success({
            _id: entityId
            code: "10014"
            name: "Somename2"
          })

      getEntityByCode: (entityType, entityCode, success) ->
        if entityCode == "10007"
          success({
            _id: "id10007"
            code: entityCode
            name: "Somename"
          })
        if entityCode == "10014"
          success({
            _id: "id10014"
            code: entityCode
            name: "Somename2"
          })

      renderEntitySummaryView: (entityType, entity) ->
        return JSON.stringify(entity)
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
    @qview.$el.find("input").val("10014").change()
    assert.include(@qview.$el.text(), 'Somename2')
