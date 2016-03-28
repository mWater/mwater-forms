assert = require('chai').assert

TestComponent = require('react-library/lib/TestComponent')
ReactTestUtils = require('react-addons-test-utils')

LocationAnswerComponent = require '../../src/answers/LocationAnswerComponent'

React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement
H = React.DOM

describe 'LocationAnswerComponent', ->
  beforeEach ->
    @toDestroy = []

    @render = (options = {}) =>
      elem = R(LocationAnswerComponent, options)
      comp = new TestComponent(elem)
      @toDestroy.push(comp)
      return comp

  afterEach ->
    for comp in @toDestroy
      comp.destroy()

  it "records location when set is clicked" #, ->
    # @ui.click("Set")
    # assert.deepEqual @model.get("q1234"), { value: { latitude: 1, longitude: 2, accuracy: 0 }}

  it "displays map" #, ->
    # assert not @mapDisplayed
    # @ui.click("Set")
    # @ui.click("Map")
    # assert.deepEqual @mapDisplayed, { latitude: 1, longitude: 2, accuracy: 0 }
