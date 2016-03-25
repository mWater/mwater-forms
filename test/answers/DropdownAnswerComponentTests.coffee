assert = require('chai').assert

TestComponent = require('react-library/lib/TestComponent')
ReactTestUtils = require('react-addons-test-utils')

DropdownAnswerComponent = require '../../src/answers/DropdownAnswerComponent'

React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement
H = React.DOM

describe 'DropdownAnswerComponent', ->
  beforeEach ->
    @toDestroy = []

    @render = (options = {}) =>
      elem = R(DropdownAnswerComponent, options)
      comp = new TestComponent(elem)
      @toDestroy.push(comp)
      return comp

  afterEach ->
    for comp in @toDestroy
      comp.destroy()

  it 'accepts known value', ->
    assert false

  it 'is not disabled with unknown value', ->
    assert false

  it 'is not disabled with empty value', ->
    assert false

  it "displays choices", ->
    assert false

  it "displays choice hints", ->
    assert false

  it "records selected choice", ->
    assert false

  it "allows unselecting choice", ->
    assert false

  it "displays specify box", ->
    assert false

  it "records specify value", ->
    assert false

  it "removes specify value on other selection", ->
    assert false


###
  it 'accepts known value', ->
    @model.set("q1234": { value: 'a' })
    assert.deepEqual @model.get("q1234"), { value: 'a'}
    assert.isFalse @qview.$("select").is(":disabled")

  it 'is not disabled with unknown value', ->
    @model.set("q1234": { value: 'x' })
    assert.deepEqual @model.get("q1234"), { value: 'x' }
    assert.isFalse @qview.$("select").is(":disabled")

  it 'is not disabled with empty value', ->
    @model.set("q1234": null)
    assert.equal @model.get("q1234"), null
    assert.isFalse @qview.$("select").is(":disabled")

  it "displays choices", ->
    assert.match @qview.el.outerHTML, /AA/

  it "displays choice hints", ->
    assert.match @qview.el.outerHTML, /a-hint/

  it "records selected choice", ->
    @qview.$el.find("select").val("0").change()
    assert.equal @model.get('q1234').value, "a"

  it "allows unselecting choice", ->
    @qview.$el.find("select").val("").change()
    assert.equal @model.get('q1234').value, null

  it "displays specify box", ->
    @qview.$el.find("select").val("2").change()
    assert @qview.$el.find("input[type='text']").get(0)

  it "records specify value", ->
    @qview.$el.find("select").val("2").change()
    @qview.$el.find("input[type='text']").val("specified").trigger('input').change()

    assert.equal @model.get('q1234').value, "c"
    assert.equal @model.get('q1234').specify['c'], "specified"

  it "removes specify value on other selection", ->
    @qview.$el.find("select").val("2").change()
    @qview.$el.find("input[type='text']").val("specified").trigger('input').change()
    @qview.$el.find("select").val("0").change()
    assert not @model.get('q1234').specify['c'], "Should be removed"
###