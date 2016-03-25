assert = require('chai').assert

TestComponent = require('react-library/lib/TestComponent')
ReactTestUtils = require('react-addons-test-utils')

BarcodeAnswerComponent = require '../../src/answers/BarcodeAnswerComponent'

React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement
H = React.DOM

describe 'BarcodeAnswerComponent', ->
  beforeEach ->
    @toDestroy = []

    @render = (options = {}) =>
      elem = R(BarcodeAnswerComponent, options)
      comp = new TestComponent(elem)
      @toDestroy.push(comp)
      return comp

  afterEach ->
    for comp in @toDestroy
      comp.destroy()

  it "shows text if not supported", ->
    assert false

  it "shows scan button", ->
    assert false

  it "does not show clear button if no text", ->
    assert false

  it "scans when scan pressed showing text", ->
    assert false

  it "shows clear when text present", ->
    assert false

  it "clears when clear pressed", ->
    assert false

  it "enforces required", ->
    assert false


###
  it "shows text if not supported", ->
    @compiler = new FormCompiler(model: @model, locale: "es", ctx: {})
    @qview = @compiler.compileQuestion(@q).render()

    assert.match(@qview.$el.html(), /not supported/i)

  it "shows scan button", ->
    assert.match(@qview.$el.html(), /Scan/)

  it "does not show clear button if no text", ->
    assert.notMatch(@qview.$el.html(), /Clear/)

  it "scans when scan pressed showing text", ->
    @qview.$el.find("#scan").click()
    assert.match(@qview.$el.html(), /0123456789/)
    assert.equal @model.get("q1234").value, "0123456789"

  it "shows clear when text present", ->
    @qview.$el.find("#scan").click()
    assert.match(@qview.$el.html(), /Clear/)

  it "clears when clear pressed", ->
    @qview.$el.find("#scan").click()
    @qview.$el.find("#clear").click()
    assert.equal @model.get("q1234").value, null

  it "enforces required", ->
    @q.required = true
    @qview = @compiler.compileQuestion(@q).render()
    assert @qview.validate()

    @q.required = false
    @qview = @compiler.compileQuestion(@q).render()
    assert not @qview.validate()
###