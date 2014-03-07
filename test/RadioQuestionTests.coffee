$ = require 'jquery'
Backbone = require 'backbone'
Backbone.$ = $
assert = require('chai').assert
FormCompiler = require '../src/FormCompiler'
commonQuestionTests = require './commonQuestionTests'

# Require forms to setup special click handling
require '../src'

describe "RadioQuestion", ->
  beforeEach ->
    @model = new Backbone.Model()
    @compiler = new FormCompiler(model: @model, locale: "es")
    @q = {
      _id: "1234"
      _type: "RadioQuestion"
      text: { _base: "en", en: "English", es: "Spanish" }
      choices: [
        { id: "a", label: { _base: "en", es: "AA" }, hint: { _base: "en", es: "a-hint" } }
        { id: "b", label: { _base: "en", es: "BB" } }
      ]
    }
    @qview = @compiler.compileQuestion(@q).render()

    # Run common tests
  commonQuestionTests.call(this)

  it "displays choices", ->
    assert.match @qview.el.outerHTML, /AA/

  it "displays choice hints", ->
    assert.match @qview.el.outerHTML, /a-hint/

  it "records selected choice", ->
    @qview.$el.find(".touch-radio:contains('AA')").trigger("click")
    assert.equal @model.get('1234').value, "a"

  it "allows unselecting choice"
  it "displays specify box"
  it "records specify value"
