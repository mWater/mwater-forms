###
$ = require 'jquery'
Backbone = require 'backbone'
Backbone.$ = $
assert = require('chai').assert
FormCompiler = require '../src/FormCompiler'
commonQuestionTestList = require './commonQuestionTestList'

describe "BarcodeQuestion", ->
  beforeEach ->
    @model = new Backbone.Model()
    @ctx = { scanBarcode: (options) -> options.success("0123456789") }
    @compiler = new FormCompiler(model: @model, locale: "es", ctx: @ctx)
    @q = {
      _id: "q1234"
      _type: "BarcodeQuestion"
      text: { _base: "en", en: "English", es: "Spanish" }
    }
    @qview = @compiler.compileQuestion(@q).render()

  # Run common tests
  commonQuestionTestList.call(this)

  it "shows text if not supported", ->
    @compiler = new FormCompiler(model: @model, locale: "es", ctx: {})
    @qview = @compiler.compileQuestion(@q).render()

    assert.match(@qview.$el.html(), /not supported/i)

  it "shows scan button", ->
    assert.match(@qview.$el.html(), /Scan/)

  it "does not show clear button if no text", ->
    assert.notMatch(@qview.$el.html(), /Clear/)

  it "scans when scan pressed showing text", ->
    @qview.$el.find("#scan").click()
    assert.match(@qview.$el.html(), /0123456789/)
    assert.equal @model.get("q1234").value, "0123456789"

  it "shows clear when text present", ->
    @qview.$el.find("#scan").click()
    assert.match(@qview.$el.html(), /Clear/)

  it "clears when clear pressed", ->
    @qview.$el.find("#scan").click()
    @qview.$el.find("#clear").click()
    assert.equal @model.get("q1234").value, null

  it "enforces required", ->
    @q.required = true
    @qview = @compiler.compileQuestion(@q).render()
    assert @qview.validate()

    @q.required = false
    @qview = @compiler.compileQuestion(@q).render()
    assert not @qview.validate()

###