$ = require 'jquery'

assert = require('chai').assert
CheckAnswerComponent = require '../../src/answers/CheckAnswerComponent'

TestComponent = require('react-library/lib/TestComponent')
ReactTestUtils = require('react-addons-test-utils')

React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement
H = React.DOM

describe.only 'CheckAnswerComponent', ->
  beforeEach ->
    @toDestroy = []

    @render = (options = {}) =>
      elem = R(CheckAnswerComponent, options)
      comp = new TestComponent(elem)
      @toDestroy.push(comp)
      return comp

  afterEach ->
    for comp in @toDestroy
      comp.destroy()

  it "can check", (callback) ->
    onValueChange = (value) ->
      assert.equal value, true
      callback()

    @comp = @render({value: false, onValueChange: onValueChange, label: {en: 'test label', _base: 'en'}})
    checkbox = ReactTestUtils.findRenderedDOMComponentWithClass(@comp.getComponent(), 'touch-checkbox')

    TestComponent.click(checkbox)

  it "can uncheck", (callback) ->
    onValueChange = (value) ->
      assert.equal value, false
      callback()

    @comp = @render({value: true, onValueChange: onValueChange, label: {en: 'test label', _base: 'en'}})
    checkbox = ReactTestUtils.findRenderedDOMComponentWithClass(@comp.getComponent(), 'touch-checkbox')

    TestComponent.click(checkbox)
