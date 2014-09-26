$ = require 'jquery'
Backbone = require 'backbone'
Backbone.$ = $
assert = require('chai').assert
FormCompiler = require '../src/FormCompiler'
commonQuestionTests = require './commonQuestionTests'

describe "DateQuestion", ->
  beforeEach ->
    @model = new Backbone.Model()
    @compiler = new FormCompiler(model: @model, locale: "es")
    @q = {
      _id: "q1234"
      _type: "DateQuestion"
      text: { _base: "en", en: "English", es: "Spanish" }
      format: "YYYY-MM-DD"
    }
    @qview = @compiler.compileQuestion(@q).render()

  # Run common tests
  commonQuestionTests.call(this)

  it "displays format YYYY-MM-DD", ->
    @model.set("q1234", { value: "2013-12-31"})
    assert.equal @qview.$el.find("input").val(), "2013-12-31"

  it "displays format MM/DD/YYYY", ->
    @q.format = "MM/DD/YYYY"
    @qview = @compiler.compileQuestion(@q).render()

    @model.set("q1234", { value: "2013-12-31"})
    assert.equal @qview.$el.find("input").val(), "12/31/2013"

  it "handles arbitrary date formats in Moment.js format", ->
    @q.format = "MMDDYYYY"
    @qview = @compiler.compileQuestion(@q).render()

    @model.set("q1234", { value: "2013-12-31"})
    assert.equal @qview.$el.find("input").val(), "12312013"

  it "pops up calendar control with current date"
  it "records calendar control selection"