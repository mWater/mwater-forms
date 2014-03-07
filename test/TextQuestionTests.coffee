$ = require 'jquery'
Backbone = require 'backbone'
Backbone.$ = $
assert = require('chai').assert
FormCompiler = require '../src/FormCompiler'
commonQuestionTests = require './commonQuestionTests'

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
        format: "singleline"
      }
      @qview = @compiler.compileQuestion(@q).render()

    # Run common tests
    commonQuestionTests.call(this)

    it "records string in singleline answer", ->
      @qview.$el.find("input").val("response").change()
      assert.equal @model.get("1234").value, "response"

    it "records string in multiline answer", ->
      @q.format = "multiline"
      @qview = @compiler.compileQuestion(@q).render()

      @qview.$el.find("textarea").val("response").change()
      assert.equal @model.get("1234").value, "response"

    it "accepts valid emails", ->
      @q.format = "email"
      @qview = @compiler.compileQuestion(@q).render()

      @qview.$el.find("input").val("test@test.com").change()
      assert.equal @model.get("1234").value, "test@test.com"
      assert not @qview.validate(), "should validate"

    it "rejects invalid emails", ->
      @q.format = "email"
      @qview = @compiler.compileQuestion(@q).render()

      @qview.$el.find("input").val("test").change()
      assert.equal @model.get("1234").value, "test"
      assert @qview.validate()

    it "accepts valid urls"
    it "rejects invalid urls"

    it "enforces required", ->
      @q.required = true
      @qview = @compiler.compileQuestion(@q).render()
      assert @qview.validate()

      @q.required = false
      @qview = @compiler.compileQuestion(@q).render()
      assert not @qview.validate()

    it "enforces required on blank answer", ->
      @q.required = true
      @qview = @compiler.compileQuestion(@q).render()

      @qview.$el.find("input").val("response").change()
      @qview.$el.find("input").val("").change()
      assert @qview.validate()

    it "validates", ->
      @q.validations = [
        {
          op: "lengthRange"
          rhs: { literal: { max: 6 } }
          message: { _base: "es", es: "message" }
        }
      ]
      @qview = @compiler.compileQuestion(@q).render()

      @qview.$el.find("input").val("1234567").change()
      assert.equal @qview.validate(), "message"
