assert = require('chai').assert

TestComponent = require('react-library/lib/TestComponent')
ReactTestUtils = require('react-addons-test-utils')
sinon = require('sinon')

StopwatchAnswerComponent = require '../../src/answers/StopwatchAnswerComponent'

React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement
H = React.DOM

describe 'StopwatchAnswerComponent', ->
  clock = null
  
  before ->
    clock = sinon.useFakeTimers()
    
    @toDestroy = []

    @render = (options = {}) =>
      elem = R(StopwatchAnswerComponent, options)
      comp = new TestComponent(elem)
      @toDestroy.push(comp)
      return comp

  afterEach ->
    for comp in @toDestroy
      comp.destroy()
    @toDestroy = []
    
  after -> clock.restore()

  it "records after [start, ticks, stop]", (done) ->
    ready = false
    comp = @render({
      onValueChange: (value) ->
        if ready
          assert.equal value, 1.23
          done()
    })
    btnStart = comp.findDOMNodeByText("Start")
    btnStop = comp.findDOMNodeByText("Stop")
    ReactTestUtils.Simulate.click(btnStart)
    ready = true
    clock.tick(1234);
    ReactTestUtils.Simulate.click(btnStop)

  it "resets after [start, ticks, stop, reset]", (done) ->
    ready = false
    comp = @render({
      onValueChange: (value) ->
        if ready
          assert.equal value, null
          done()
    })
    btnStart = comp.findDOMNodeByText("Start")
    btnStop = comp.findDOMNodeByText("Stop")
    btnReset = comp.findDOMNodeByText("Reset")
    ReactTestUtils.Simulate.click(btnStart)
    clock.tick(1234);
    ReactTestUtils.Simulate.click(btnStop)
    ready = true
    ReactTestUtils.Simulate.click(btnReset)
