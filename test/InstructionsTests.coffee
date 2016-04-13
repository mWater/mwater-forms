# TODO: SurveyorPro: Fix test without FormCompiler
###
$ = require 'jquery'
Backbone = require 'backbone'
Backbone.$ = $
assert = require('chai').assert
FormCompiler = require '../src/FormCompiler'

describe "Instructions", ->
  beforeEach ->
    @model = new Backbone.Model()
    @compiler = new FormCompiler(model: @model, locale: "es")
    @q = {
      _id: "q1234"
      _type: "Instructions"
      text: { _base: "en", en: "English", es: "Spanish *emphasis*" }
    }
    @qview = @compiler.compileItem(@q).render()

  it "renders markdown", ->
    assert.match @qview.el.outerHTML, /<em>emphasis<\/em>/    

###