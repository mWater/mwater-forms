$ = require 'jquery'
Backbone = require 'backbone'
Backbone.$ = $
assert = require('chai').assert
FormCompiler = require '../src/FormCompiler'
commonQuestionTestList = require './commonQuestionTestList'

describe "TextQuestion", ->
  beforeEach ->
    @model = new Backbone.Model()
    @compiler = new FormCompiler(model: @model, locale: "es")
    @q = {
      _id: "q1234"
      _type: "TextQuestion"
      text: { _base: "en", en: "English", es: "Spanish" }
      format: "singleline"
    }
    @qview = @compiler.compileQuestion(@q).render()

  # Run common tests
  commonQuestionTestList.call(this)

  it "records string in singleline answer", ->
    @qview.$el.find("input").val("response").change()
    assert.equal @model.get("q1234").value, "response"

  it "records string in multiline answer", ->
    @q.format = "multiline"
    @qview = @compiler.compileQuestion(@q).render()

    @qview.$el.find("textarea").val("response").change()
    assert.equal @model.get("q1234").value, "response"

  it "accepts valid emails", ->
    @q.format = "email"
    @qview = @compiler.compileQuestion(@q).render()

    @qview.$el.find("input").val("test@test.com").change()
    assert.equal @model.get("q1234").value, "test@test.com"
    assert not @qview.validate(), "should validate"

  it "rejects invalid emails", ->
    @q.format = "email"
    @qview = @compiler.compileQuestion(@q).render()

    @qview.$el.find("input").val("test").change()
    assert.equal @model.get("q1234").value, "test"
    assert @qview.validate()

  it "accepts valid urls", ->
    @q.format = "url"
    @qview = @compiler.compileQuestion(@q).render()

    @qview.$el.find("input").val("www.apple.com").change()
    assert.equal @model.get("q1234").value, "www.apple.com"
    assert not @qview.validate(), "should validate"

  it "rejects invalid urls", ->
    @q.format = "url"
    @qview = @compiler.compileQuestion(@q).render()

    @qview.$el.find("input").val("sometext").change()
    assert.equal @model.get("q1234").value, "sometext"
    assert @qview.validate()

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

  it "allows non-valid blank answer if not required", ->
    @q.validations = [
      {
        op: "lengthRange"
        rhs: { literal: { min: 4, max: 6 } }
        message: { _base: "es", es: "message" }
      }
    ]
    @qview = @compiler.compileQuestion(@q).render()

    @qview.$el.find("input").val("").change()
    assert not @qview.validate()


  it "erases value on alternate selected", ->
    @q.alternates = {dontknow: true, na: true}
    @qview = @compiler.compileQuestion(@q).render()

    @qview.$el.find("input").val("response").change()
    @qview.$("#dontknow").click()

    assert not @model.get("q1234").value

  it "caches value on alternate selected", ->
    @q.alternates = {dontknow: true, na: true}
    @qview = @compiler.compileQuestion(@q).render()

    @qview.$el.find("input").val("response").change()
    @qview.$("#dontknow").click()
    @qview.$("#dontknow").click()

    assert.equal @model.get("q1234").value, "response"

  it "erases alternate on value entered", ->
    @q.alternates = {dontknow: true, na: true}
    @qview = @compiler.compileQuestion(@q).render()

    @qview.$el.find("input").val("response").change()
    @qview.$("#dontknow").click()

    # Add input
    @qview.$el.find("input").val("response").change()
    assert not @model.get("q1234").alternate

  it "is sticky", ->
    @q.sticky = true
    data = {}
    ctx = {
      stickyStorage: {
        get: (key) ->
          return data[key]
        set: (key, value) ->
          data[key] = value
      }
    }

    # Compile question and set value
    @compiler = new FormCompiler(model: @model, locale: "es", ctx: ctx)
    qview = @compiler.compileQuestion(@q).render()
    qview.$el.find("input").val("response").change()

    # Check that stored
    assert.equal data[@q._id], "response"

    # Create new model
    model = new Backbone.Model()
    compiler = new FormCompiler(model: model, locale: "es", ctx: ctx)

    # Compile fresh question and make sure that answer is pre-loaded
    qview = compiler.compileQuestion(@q).render()
    assert.equal qview.$el.find("input").val(), "response"

    # Make sure stored in model
    assert.equal model.get(@q._id).value, "response"

  it "sticky doesn't override value", ->
    @q.sticky = true
    data = {}
    ctx = {
      stickyStorage: {
        get: (key) ->
          return data[key]
        set: (key, value) ->
          data[key] = value
      }
    }
    data[@q._id] = "stored"
    @model.set(@q._id, { value: "model" })

    # Compile question and set value
    @compiler = new FormCompiler(model: @model, locale: "es", ctx: ctx)
    qview = @compiler.compileQuestion(@q).render()
    assert.equal qview.$el.find("input").val(), "model"

    # Make sure stored in model
    assert.equal @model.get(@q._id).value, "model"

  describe "barcode input", ->
    it "shows scan button"

    it "does not show clear button if no text"

    it "scans when scan pressed showing text"

    it "shows clear when text present"

    it "clears when clear pressed"