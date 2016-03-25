assert = require('chai').assert

TestComponent = require('react-library/lib/TestComponent')
ReactTestUtils = require('react-addons-test-utils')

MulticheckAnswerComponent = require '../../src/answers/MulticheckAnswerComponent'

React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement
H = React.DOM

describe 'MulticheckAnswerComponent', ->
  beforeEach ->
    @toDestroy = []

    @render = (options = {}) =>
      elem = R(MulticheckAnswerComponent, options)
      comp = new TestComponent(elem)
      @toDestroy.push(comp)
      return comp

  afterEach ->
    for comp in @toDestroy
      comp.destroy()

  it "displays choices", ->
    assert false

  it "displays choice hints", ->
    assert false

  it "records selected choice", ->
    assert false

  it "records multiple selected choice", ->
    assert false

  it "displays specify box", ->
    assert false

  it "records specify value", ->
    assert false

  it "does remove specify value on unselection", ->
    assert false

  it "does not remove specify value on other selection", ->
    assert false

###
  it "displays choices", ->
    assert.match @qview.el.outerHTML, /AA/

  it "displays choice hints", ->
    assert.match @qview.el.outerHTML, /a-hint/

  it "records selected choice", ->
    @qview.$el.find(".touch-checkbox:contains('AA')").trigger("click")
    assert.deepEqual @model.get('q1234').value, ["a"]

  it "records multiple selected choice", ->
    @qview.$el.find(".touch-checkbox:contains('AA')").trigger("click")
    @qview.$el.find(".touch-checkbox:contains('BB')").trigger("click")
    assert.deepEqual @model.get('q1234').value, ["a", "b"]

  it "displays specify box", ->
    @qview.$el.find(".touch-checkbox:contains('CC')").trigger("click")
    assert @qview.$el.find("input[type='text']").get(0)

  it "records specify value", ->
    @qview.$el.find(".touch-checkbox:contains('CC')").trigger("click")
    @qview.$el.find("input[type='text']").val("specified").change()

    assert.equal @model.get('q1234').value, "c"
    assert.equal @model.get('q1234').specify['c'], "specified"

  it "does remove specify value on unselection", ->
    @qview.$el.find(".touch-checkbox:contains('CC')").trigger("click")
    @qview.$el.find("input[type='text']").val("specified").change()
    @qview.$el.find(".touch-checkbox:contains('CC')").trigger("click")
    assert not @model.get('q1234').specify['c'], "Should be removed"

  it "does not remove specify value on other selection", ->
    @qview.$el.find(".touch-checkbox:contains('CC')").trigger("click")
    @qview.$el.find("input[type='text']").val("specified").change()
    @qview.$el.find(".touch-checkbox:contains('AA')").trigger("click")
    assert @model.get('q1234').specify['c'], "Should not be removed"
###