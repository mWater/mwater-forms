$ = require 'jquery'
Backbone = require 'backbone'
Backbone.$ = $
assert = require('chai').assert
FormCompiler = require '../src/FormCompiler'
commonQuestionTestList = require './commonQuestionTestList'

describe "CheckQuestion", ->
  beforeEach ->
    @model = new Backbone.Model()
    @compiler = new FormCompiler(model: @model, locale: "es")
    @q = {
      _id: "q1234"
      _type: "CheckQuestion"
      text: { _base: "en", en: "English", es: "Spanish" }
      required: true
    }
    @qview = @compiler.compileQuestion(@q).render()

  # Run common tests
  commonQuestionTestList.call(this)

  it "records check", ->
    @qview.$el.find(".prompt").trigger("click")
    assert.equal @model.get('q1234').value, true

  it "records uncheck", ->
    @qview.$el.find(".prompt").trigger("click")
    assert.equal @model.get('q1234').value, true

  it "checked is required ok", ->
    assert @qview.validate()
    @qview.$el.find(".prompt").trigger("click")
    assert not @qview.validate()
