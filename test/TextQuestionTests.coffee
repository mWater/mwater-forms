$ = require 'jquery'
Backbone = require 'backbone'
Backbone.$ = $
assert = require('chai').assert
FormCompiler = require '../src/FormCompiler'

describe "TextQuestion", ->
  context "compiled text question", ->
    beforeEach ->
      @model = new Backbone.Model()
      @compiler = new FormCompiler(model: @model, locale: "es")
      @q = {
        _id: "1234"
        _type: "TextQuestion"
        text: { _base: "en", en: "English", es: "Spanish" }
        hint: { _base: "en", en: "", es: "HINT" }
        required: true
        format: "singleline"
      }
      @qview = @compiler.compileQuestion(@q).render()

    it "displays question text", ->
      assert.match @qview.el.outerHTML, /Spanish/

    it "displays hint", ->
      assert.match @qview.el.outerHTML, /HINT/

    it "displays help"

    it "displays required", ->
      assert.match @qview.el.outerHTML, /\*/    

    it "records string in singleline answer", ->
      @qview.$el.find("input").val("response").change()
      assert.equal @model.get("1234").answer, "response"

    it "records string in multiline answer", ->
      @q.format = "multiline"
      @qview = @compiler.compileQuestion(@q).render()

      @qview.$el.find("textarea").val("response").change()
      assert.equal @model.get("1234").answer, "response"

    it "accepts valid emails", ->
      @q.format = "email"
      @qview = @compiler.compileQuestion(@q).render()

      @qview.$el.find("input").val("test@test.com").change()
      assert.equal @model.get("1234").answer, "test@test.com"
      assert not @qview.validate(), "should validate"

    it "rejects invalid emails", ->
      @q.format = "email"
      @qview = @compiler.compileQuestion(@q).render()

      @qview.$el.find("input").val("test").change()
      assert.equal @model.get("1234").answer, "test"
      assert @qview.validate()

    it "accepts valid urls"

    it "enforces required", ->
      assert @qview.validate()

      @q.required = false
      @qview = @compiler.compileQuestion(@q).render()
      assert not @qview.validate()

    it "validates length"
    it "validates regex"
