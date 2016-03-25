assert = require('chai').assert

TestComponent = require('react-library/lib/TestComponent')
ReactTestUtils = require('react-addons-test-utils')

RadioAnswerComponent = require '../../src/answers/RadioAnswerComponent'

React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement
H = React.DOM

describe 'RadioAnswerComponent', ->
  beforeEach ->
    @toDestroy = []

    @render = (options = {}) =>
      elem = R(RadioAnswerComponent, options)
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

  it "allows unselecting choice by clicking twice", ->
    assert false

  it "displays specify box", ->
    assert false

  it "records specify value", ->
    assert false

  it "removes specify value on other selection", ->
    assert false

###
  it "displays choices", ->
    assert.match @qview.el.outerHTML, /AA/

  it "displays choice hints", ->
    assert.match @qview.el.outerHTML, /a-hint/

  it "records selected choice", ->
    @qview.$el.find(".touch-radio:contains('AA')").trigger("click")
    assert.equal @model.get('q1234').value, "a"

  it "allows unselecting choice by clicking twice", ->
    @qview.$el.find(".touch-radio:contains('AA')").trigger("click")
    @qview.$el.find(".touch-radio:contains('AA')").trigger("click")
    assert.equal @model.get('q1234').value, null

  it "displays specify box", ->
    @qview.$el.find(".touch-radio:contains('CC')").trigger("click")
    assert @qview.$el.find("input[type='text']").get(0)

  it "records specify value", ->
    @qview.$el.find(".touch-radio:contains('CC')").trigger("click")
    @qview.$el.find("input[type='text']").val("specified").trigger('input').change()

    assert.equal @model.get('q1234').value, "c"
    assert.equal @model.get('q1234').specify['c'], "specified"

  it "removes specify value on other selection", ->
    @qview.$el.find(".touch-radio:contains('CC')").trigger("click")
    @qview.$el.find("input[type='text']").val("specified").trigger('input').change()
    @qview.$el.find(".touch-radio:contains('AA')").trigger("click")
    assert not @model.get('q1234').specify['c'], "Should be removed"
###