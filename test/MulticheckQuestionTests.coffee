$ = require 'jquery'
Backbone = require 'backbone'
Backbone.$ = $
assert = require('chai').assert
FormCompiler = require '../src/FormCompiler'
commonQuestionTestList = require './commonQuestionTestList'

describe "MulticheckQuestion", ->
  beforeEach ->
    @model = new Backbone.Model()
    @compiler = new FormCompiler(model: @model, locale: "es")
    @q = {
      _id: "q1234"
      _type: "MulticheckQuestion"
      text: { _base: "en", en: "English", es: "Spanish" }
      choices: [
        { id: "a", label: { _base: "en", es: "AA" }, hint: { _base: "en", es: "a-hint" } }
        { id: "b", label: { _base: "en", es: "BB" } }
        { id: "c", label: { _base: "en", es: "CC" }, specify: true }
      ]
    }
    @qview = @compiler.compileQuestion(@q).render()

  # Run common tests
  commonQuestionTestList.call(this)

  it "displays choices", ->
    assert.match @qview.el.outerHTML, /AA/

  it "displays choice hints", ->
    assert.match @qview.el.outerHTML, /a-hint/

  it "records selected choice", ->
    @qview.$el.find(".touch-checkbox:contains('AA')").trigger("click")
    assert.deepEqual @model.get('q1234').value, ["a"]

  it "records multiple selected choice", ->
    @qview.$el.find(".touch-checkbox:contains('AA')").trigger("click")
    @qview.$el.find(".touch-checkbox:contains('BB')").trigger("click")
    assert.deepEqual @model.get('q1234').value, ["a", "b"]

  it "displays specify box", ->
    @qview.$el.find(".touch-checkbox:contains('CC')").trigger("click")
    assert @qview.$el.find("input[type='text']").get(0)

  it "records specify value", ->
    @qview.$el.find(".touch-checkbox:contains('CC')").trigger("click")
    @qview.$el.find("input[type='text']").val("specified").change()
    
    assert.equal @model.get('q1234').value, "c"    
    assert.equal @model.get('q1234').specify['c'], "specified"    

  it "does remove specify value on unselection", ->
    @qview.$el.find(".touch-checkbox:contains('CC')").trigger("click")
    @qview.$el.find("input[type='text']").val("specified").change()
    @qview.$el.find(".touch-checkbox:contains('CC')").trigger("click")
    assert not @model.get('q1234').specify['c'], "Should be removed"

  it "does not remove specify value on other selection", ->
    @qview.$el.find(".touch-checkbox:contains('CC')").trigger("click")
    @qview.$el.find("input[type='text']").val("specified").change()
    @qview.$el.find(".touch-checkbox:contains('AA')").trigger("click")
    assert @model.get('q1234').specify['c'], "Should not be removed"
