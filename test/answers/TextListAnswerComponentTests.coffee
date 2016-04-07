assert = require('chai').assert

TestComponent = require('react-library/lib/TestComponent')
ReactTestUtils = require('react-addons-test-utils')

TextListAnswerComponent = require '../../src/answers/TextListAnswerComponent'

React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement
H = React.DOM

describe 'TextListAnswerComponent', ->
  before ->
    @toDestroy = []

    @render = (options = {}) =>
      elem = R(TextListAnswerComponent, options)
      comp = new TestComponent(elem)
      @toDestroy.push(comp)
      return comp

  afterEach ->
    for comp in @toDestroy
      comp.destroy()
    @toDestroy = []

  it "records add", (done) ->
    testComponent = @render({
      onValueChange: (value) ->
        assert.deepEqual value, ['some text']
        done()
    })
    newLine = testComponent.findComponentById('newLine')

    TestComponent.changeValue(newLine, 'some text')

  it "records remove", (done) ->
    testComponent = @render({
      value: ['some text']
      onValueChange: (value) ->
        assert.deepEqual value, []
        done()
    })
    removeBtn = ReactTestUtils.findRenderedDOMComponentWithClass(testComponent.getComponent(), 'remove')
    TestComponent.click(removeBtn)

  it "loads existing values", (done) ->
    testComponent = @render({
      value: ['some text']
      onValueChange: (value) ->
        assert.deepEqual value, ['some text', 'more text']
        done()
    })
    newLine = testComponent.findComponentById('newLine')

    TestComponent.changeValue(newLine, 'more text')
