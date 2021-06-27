assert = require('chai').assert

TestComponent = require('react-library/lib/TestComponent')
ReactTestUtils = require('react-dom/test-utils')

NumberAnswerComponent = require '../../src/answers/NumberAnswerComponent'

React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement

describe 'NumberAnswerComponent', ->
  before ->
    @toDestroy = []

    @render = (options = {}) =>
      elem = R(NumberAnswerComponent, options)
      comp = new TestComponent(elem)
      @toDestroy.push(comp)
      return comp

  afterEach ->
    for comp in @toDestroy
      comp.destroy()
    @toDestroy = []

  it "records decimal number", (done) ->
    comp = @render({
      decimal: true
      onChange: (value) ->
        assert.equal value, 123.4
        done()
    })
    input = comp.findInput()
    TestComponent.changeValue(input, "123.4")
    ReactTestUtils.Simulate.blur(input)

  it "records whole number", (done) ->
    comp = @render({
      decimal: false
      onChange: (value) ->
        assert.equal value, 123
        done()
    })
    input = comp.findInput()
    TestComponent.changeValue(input, "123")
    ReactTestUtils.Simulate.blur(input)

  it "enforces decimal number", (done) ->
    comp = @render({
      decimal: true
      onChange: (value) ->
        assert.equal value, null
        done()
    })
    input = comp.findInput()
    TestComponent.changeValue(input, "123.4abc")
    ReactTestUtils.Simulate.blur(input)

  it "enforces whole number", (done) ->
    comp = @render({
      decimal: false
      onChange: (value) ->
        assert.fail()
    })
    input = comp.findInput()
    TestComponent.changeValue(input, "123.4")
    ReactTestUtils.Simulate.blur(input)
    done()

  it "validates decimal number", ->
    comp = @render({
      decimal: true
      onChange: ->
    })
    input = comp.findInput()
    TestComponent.changeValue(input, "123.4")
    ReactTestUtils.Simulate.blur(input)
    assert not comp.getComponent().validate()

  it "fails validation if invalid whole number", ->
    comp = @render({
      decimal: false
      onChange: ->
    })
    input = comp.findInput()
    TestComponent.changeValue(input, "123abc")
    ReactTestUtils.Simulate.blur(input)
    assert comp.getComponent().validate()
