assert = require('chai').assert
AquagenxCBTAnswerComponent = require '../../src/answers/AquagenxCBTAnswerComponent'

TestComponent = require('react-library/lib/TestComponent')
ReactTestUtils = require('react-addons-test-utils')

React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement
H = React.DOM

describe.only 'AquagenxCBTAnswerComponent', ->
  beforeEach ->
    @toDestroy = []

    @render = (options = {}) =>
      elem = R(AquagenxCBTAnswerComponent, options)
      comp = new TestComponent(elem)
      @toDestroy.push(comp)
      return comp

  afterEach ->
    for comp in @toDestroy
      comp.destroy()

  it "clicking updates the values", (callback) ->
    onValueChange = (value) ->
      assert.deepEqual value, {c1: true, c2: false, c3: false, c4: false, c5: false, mpn: 1.1, confidence: 5.16, healthRisk: 'probably_safe'}
      callback()

    @comp = @render({
      value: {c1: false, c2: false, c3: false, c4: false, c5: false, mpn: 0.0, confidence: 2.87, healthRisk: 'safe'}
      onValueChange: onValueChange
      label: {en: 'test label', _base: 'en'}
    })

    component = @comp.getComponent()
    compartment1 = $( component.refs.main ).find( "#compartment1" )
    assert compartment1, 'Could not find the compartment'
    compartment1.click()
