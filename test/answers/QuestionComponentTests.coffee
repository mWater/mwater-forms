_ = require 'underscore'
assert = require('chai').assert

React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement
H = React.DOM

TestComponent = require('react-library/lib/TestComponent')
ReactTestUtils = require('react-addons-test-utils')

QuestionComponent = require '../../src/QuestionComponent'

describe.only "QuestionComponent", ->
  beforeEach ->
    @question = {
      _id: "q1234"
      _type: "TextQuestion"
      format: 'singleline'
      text: { _base: "en", en: "English" }
      hint: { _base: "en", en: "HINT" }
      help: { _base: "en", en: "has *formatting*" }
      required: true
    }

    @toDestroy = []

    @render = (options = {}) =>
      options = _.extend {
        question: @question
        data: {}
        onAnswerChange: () ->
          null
      }, options
      elem = R(QuestionComponent, options)
      comp = new TestComponent(elem)
      @toDestroy.push(comp)
      return comp

  afterEach ->
    for comp in @toDestroy
      comp.destroy()

  it "displays question text", ->
    testComponent = @render()

    prompt = testComponent.findDOMNodeByText(/English/)
    assert prompt?, 'Not showing question text'

  it "displays hint", ->
    testComponent = @render()

    hint = testComponent.findDOMNodeByText(/HINT/)
    assert hint?, 'Not showing hint text'

  it "displays required", ->
    testComponent = @render()

    star = testComponent.findDOMNodeByText(/\*/)
    assert star?, 'Not showing required star'

  it "displays help", ->
    testComponent = @render()

    help = testComponent.findDOMNodeByText(/formatting/)
    assert help?, 'Not showing help'

  it "hides only when conditions are false", ->
    @q.conditions = [
      { lhs: { question: "q1" }, op: "=", rhs: { literal: 1 }}
      { lhs: { question: "q2" }, op: "=", rhs: { literal: 2 }}
    ]
    @qview = @compiler.compileQuestion(@q).render()

    assert.isFalse @qview.shouldBeVisible()

    @model.set({ q1: { value: 1 }})
    assert.isFalse @qview.shouldBeVisible()

    @model.set({ q2: { value: 2 }})
    assert.isTrue @qview.shouldBeVisible()

  it "display comment box", ->
    @q.commentsField = true
    @qview = @compiler.compileQuestion(@q).render()
    @qview.$("#comments").val("some comment").change()
    assert.equal @model.get("q1234").comments, "some comment"

  it "loads comment box", ->
    @q.commentsField = true
    @model.set("q1234", { comments: "some comment" })
    @qview = @compiler.compileQuestion(@q).render()
    assert.equal @qview.$("#comments").val(), "some comment"

  it "records timestamp", ->
    @q.recordTimestamp = true
    @qview = @compiler.compileQuestion(@q).render()

    before = new Date().toISOString()
    @qview.setAnswerValue(null)
    after = new Date().toISOString()
    # Some imprecision in the date stamp was causing occassional failures
    assert @model.get("q1234").timestamp.substr(0,10) >= before.substr(0,10), @model.get("q1234").timestamp + " < " + before
    assert @model.get("q1234").timestamp.substr(0,10) <= after.substr(0,10), @model.get("q1234").timestamp + " > " + after

  # TODO: Fix test without FormCompiler
  #it "records location", ->
  #  @q.recordLocation = true
  #  ctx = {
  #    locationFinder: new MockLocationFinder()
  #  }
  #  ctx.locationFinder.getLocation = (success, error) =>
  #    success({ coords: { latitude: 2, longitude: 3, accuracy: 10}})
  #
  #  @compiler = new FormCompiler(model: @model, locale: "es", ctx: ctx)
  #  @qview = @compiler.compileQuestion(@q).render()
  #
  #  @qview.setAnswerValue(null)
  #  assert.deepEqual @model.get("q1234").location, { latitude: 2, longitude: 3, accuracy: 10}

  it "records alternate na", ->
    @q.alternates = {na: true}
    @qview = @compiler.compileQuestion(@q).render()
    @qview.$("#na").click()

    assert.equal @model.get("q1234").alternate, "na"

  it "loads alternate na", ->
    @q.alternates = {na: true}
    @model.set("q1234", { alternate: "na" })
    @qview = @compiler.compileQuestion(@q).render()
    assert @qview.$("#na").hasClass("checked")

  it "records alternate dontknow", ->
    @q.alternates = {dontknow: true, na: true}
    @qview = @compiler.compileQuestion(@q).render()
    @qview.$("#dontknow").click()

    assert.equal @model.get("q1234").alternate, "dontknow"

  it "allows alternate for required", ->
    @q.alternates = {na: true}
    @qview = @compiler.compileQuestion(@q).render()

    assert @qview.validate()

    @qview.$("#na").click()

    assert not @qview.validate()

  it "erases value on alternate selected", ->
    assert false
    @q.alternates = {dontknow: true, na: true}
    @qview = @compiler.compileQuestion(@q).render()

    @qview.$el.find("input").val("response").change()
    @qview.$("#dontknow").click()

    assert not @model.get("q1234").value


  it "caches value on alternate selected", ->
    assert false
    @q.alternates = {dontknow: true, na: true}
    @qview = @compiler.compileQuestion(@q).render()

    @qview.$el.find("input").val("response").change()
    @qview.$("#dontknow").click()
    @qview.$("#dontknow").click()

    assert.equal @model.get("q1234").value, "response"


  it "erases alternate on value entered", ->
    assert false
    @q.alternates = {dontknow: true, na: true}
    @qview = @compiler.compileQuestion(@q).render()

    @qview.$el.find("input").val("response").change()
    @qview.$("#dontknow").click()

    # Add input
    @qview.$el.find("input").val("response").change()
    assert not @model.get("q1234").alternate


class MockLocationFinder
  constructor:  ->
    _.extend @, Backbone.Events

  getLocation: (success, error) ->
  startWatch: ->
  stopWatch: ->
