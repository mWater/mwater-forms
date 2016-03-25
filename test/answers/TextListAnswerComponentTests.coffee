assert = require('chai').assert

TestComponent = require('react-library/lib/TestComponent')
ReactTestUtils = require('react-addons-test-utils')

TextListAnswerComponent = require '../../src/answers/TextListAnswerComponent'

React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement
H = React.DOM

describe 'TextListAnswerComponent', ->
  beforeEach ->
    @toDestroy = []

    @render = (options = {}) =>
      elem = R(TextListAnswerComponent, options)
      comp = new TestComponent(elem)
      @toDestroy.push(comp)
      return comp

  afterEach ->
    for comp in @toDestroy
      comp.destroy()

  it "records add", ->
    assert false

  it "records remove", ->
    assert false

  it "empty and required is not ok", ->
    assert false

  it "loads existing values", ->
    assert false

###
  it "records add", ->
    $(@qview.$el.find("input")[0]).val("entry1").trigger('input')
    assert.deepEqual @model.get('q1234').value, ["entry1"]

  it "records remove", ->
    @model.set('q1234', { value: ['entry1', 'entry2']})
    $(@qview.$("button.remove")[1]).trigger('click')
    assert.deepEqual @model.get('q1234').value, ["entry1"]

  it "empty and required is not ok", ->
    assert @qview.validate()

  it "loads existing values", ->
    # Set first value
    @model.set(@q._id, { value: ["entry1"]})

    # Add second value
    $(@qview.$el.find("input")[1]).val("entry2").trigger('input')
    assert.deepEqual @model.get('q1234').value, ["entry1", "entry2"]
###