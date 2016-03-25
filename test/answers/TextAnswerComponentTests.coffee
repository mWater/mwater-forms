assert = require('chai').assert

TestComponent = require('react-library/lib/TestComponent')
ReactTestUtils = require('react-addons-test-utils')

React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement
H = React.DOM

TextAnswerComponent = require '../../src/answers/TextAnswerComponent'

describe 'TextAnswerComponent', ->
  beforeEach ->
    @toDestroy = []

    @render = (options = {}) =>
      elem = R(TextAnswerComponent, options)
      comp = new TestComponent(elem)
      @toDestroy.push(comp)
      return comp

  afterEach ->
    for comp in @toDestroy
      comp.destroy()

  it "records string in singleline answer", (callback) ->
    onValueChange = (value) ->
      assert.equal value, "response"
      callback()

    @comp = @render({value: null, onValueChange: onValueChange, format: 'singleline'})
    TestComponent.changeValue(@comp.findInput(), "response")

  it "records string in singleline answer", (callback) ->
    onValueChange = (value) ->
      assert.equal value, "response"
      callback()

    @comp = @render({value: null, onValueChange: onValueChange, format: 'multiline'})
    textArea = ReactTestUtils.findRenderedDOMComponentWithTag(@comp.getComponent(), "textarea")
    TestComponent.changeValue(textArea, "response")

  it "accepts valid emails", ->
    @comp = @render({value: "test@test.com", format: 'email'})
    # Test email validation
    assert false

  it "rejects invalid emails", ->
    @comp = @render({value: "test", format: 'email'})
    # Test email validation
    assert false

  it "accepts valid urls", ->
    @comp = @render({value: "www.apple.com", format: 'url'})
    # Test url validation
    assert false

  it "rejects invalid urls", ->
    @comp = @render({value: "sometext", format: 'url'})
    # Test url validation
    assert false

  it "enforces required", ->
    assert false

  it "enforces required on blank answer", ->
    assert false

  it "validates", ->
    assert false

  it "allows non-valid blank answer if not required", ->
    assert false

  it "erases value on alternate selected", ->
    assert false

  it "caches value on alternate selected", ->
    assert false

  it "erases alternate on value entered", ->
    assert false

  it "is sticky", ->
    assert false

  it "sticky doesn't override value", ->
    assert false

  it "sticky doesn't fill until visible", ->
    assert false

  it "erases value when made invisible", ->
    assert false

###
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

  it "sticky doesn't fill until visible", ->
    @q.sticky = true
    @q.conditions = [
      { lhs: { question: "qother"}, op: "present" }
    ]
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

    # Compile question
    @compiler = new FormCompiler(model: @model, locale: "es", ctx: ctx)
    qview = @compiler.compileQuestion(@q).render()

    # Should not be filled as is invisible
    assert not @model.get(@q._id) or not @model.get(@q._id).value
    assert.equal qview.$el.find("input").val(), ""

    # Make visible by setting other response
    @model.set("qother", { value: "abc" })

    # Make sure stored in model
    assert.equal @model.get(@q._id).value, "stored"
    assert.equal qview.$el.find("input").val(), "stored"


  it "erases value when made invisible", ->
    @q.conditions = [
      { lhs: { question: "q1" }, op: "=", rhs: { literal: 1 }}
    ]
    @qview = @compiler.compileQuestion(@q).render()

    # Make visible
    @model.set("q1", { value: 1 })

    # Set value
    @qview.$el.find("input").val("response").change()
    assert.equal @model.get(@q._id).value, "response"

    # Make invisible
    @model.set("q1", { value: 2 })

    # Should have no value
    assert not @model.get(@q._id)

###