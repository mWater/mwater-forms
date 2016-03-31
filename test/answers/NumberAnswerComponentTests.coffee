assert = require('chai').assert

TestComponent = require('react-library/lib/TestComponent')
ReactTestUtils = require('react-addons-test-utils')

NumberAnswerComponent = require '../../src/answers/NumberAnswerComponent'

React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement
H = React.DOM

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
        assert.equal value, null
        done()
    })
    input = comp.findInput()
    TestComponent.changeValue(input, "123.4")
    ReactTestUtils.Simulate.blur(input)

  it "enforces required", ->
    #assert @qview.validate()

    #@q.required = false
    #@qview = @compiler.compileQuestion(@q).render()
    #assert not @qview.validate()
    assert false

  it "enforces required on blank answer", ->
    #@qview.$el.find("input").val("response").change()
    #@qview.$el.find("input").val("").change()
    #assert @qview.validate()
    assert false

  it "allows 0 on required", ->
    #@qview.$el.find("input").val("0").change()
    #assert not @qview.validate()
    assert false

  it "validates range", ->
    #@q.validations = [
    #  {
    #    op: "range"
    #    rhs: { literal: { max: 6 } }
    #    message: { _base: "es", es: "message" }
    #  }
    #]
    #@qview = @compiler.compileQuestion(@q).render()
    #
    #@qview.$el.find("input").val("7").change()
    #assert.equal @qview.validate(), "message"
    assert false
