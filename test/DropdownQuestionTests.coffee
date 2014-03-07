$ = require 'jquery'
Backbone = require 'backbone'
Backbone.$ = $
assert = require('chai').assert
FormCompiler = require '../src/FormCompiler'
commonQuestionTests = require './commonQuestionTests'

describe 'DropdownQuestion', ->
  beforeEach ->
    @model = new Backbone.Model()
    @compiler = new FormCompiler(model: @model, locale: "es")
    @q = {
      _id: "q1234"
      _type: "DropdownQuestion"
      text: { _base: "en", en: "English", es: "Spanish" }
      choices: [
        { id: "a", label: { _base: "en", es: "AA" }, hint: { _base: "en", es: "a-hint" } }
        { id: "b", label: { _base: "en", es: "BB" } }
        { id: "c", label: { _base: "en", es: "CC" }, specify: true }
      ]
    }
    @qview = @compiler.compileQuestion(@q).render()

  # Run common tests
  commonQuestionTests.call(this)

  it 'accepts known value', ->
    @model.set("q1234": { value: 'a' })
    assert.deepEqual @model.get("q1234"), { value: 'a'}
    assert.isFalse @qview.$("select").is(":disabled")

  it 'is disabled with unknown value', ->
    @model.set("q1234": { value: 'x' })
    assert.deepEqual @model.get("q1234"), { value: 'x' }
    assert.isTrue @qview.$("select").is(":disabled")

  it 'is not disabled with empty value', ->
    @model.set("q1234": null)
    assert.equal @model.get("q1234"), null
    assert.isFalse @qview.$("select").is(":disabled")

  it "displays choices", ->
    assert.match @qview.el.outerHTML, /AA/

  it "displays choice hints", ->
    assert.match @qview.el.outerHTML, /a-hint/

  it "records selected choice", ->
    @qview.$el.find("select").val("0").change()
    assert.equal @model.get('1234').value, "a"

  it "allows unselecting choice", ->
    @qview.$el.find("select").val("").change()
    assert.equal @model.get('1234').value, null

  it "displays specify box", ->
    @qview.$el.find("select").val("2").change()
    assert @qview.$el.find("input[type='text']").get(0)

  it "records specify value", ->
    @qview.$el.find("select").val("2").change()
    @qview.$el.find("input[type='text']").val("specified").change()
    
    assert.equal @model.get('1234').value, "c"    
    assert.equal @model.get('1234').specify['c'], "specified"    

  it "removes specify value on other selection", ->
    @qview.$el.find("select").val("2").change()
    @qview.$el.find("input[type='text']").val("specified").change()
    @qview.$el.find("select").val("0").change()
    assert not @model.get('1234').specify['c'], "Should be removed"
