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
