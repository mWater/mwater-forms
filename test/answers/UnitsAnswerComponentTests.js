_ = require 'lodash'
assert = require('chai').assert

TestComponent = require('react-library/lib/TestComponent')
ReactTestUtils = require('react-dom/test-utils')

UnitsAnswerComponent = require '../../src/answers/UnitsAnswerComponent'

React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement

describe 'UnitsAnswerComponent', ->
  beforeEach ->
    @toDestroy = []

    @render = (options = {}) =>
      options = _.extend {
        onValueChange: () ->
          null
        units: [
          { id: "a", label: { _base: "en", es: "AA" }, hint: { _base: "en", es: "a-hint" } }
          { id: "b", label: { _base: "en", es: "BB" } }
          { id: "c", label: { _base: "en", es: "CC" } }
        ]
        prefix: false
        decimal: true
      }, options
      elem = R(UnitsAnswerComponent, options)
      comp = new TestComponent(elem)
      @toDestroy.push(comp)
      return comp

  afterEach ->
    for comp in @toDestroy
      comp.destroy()

  it "allows changing of units", (done) ->
    testComponent = @render({
      answer: {
        quantity: null
        units: 'a'
      }
      onValueChange: (value) ->
        assert.equal value.units, 'b'
        done()
    })

    unitInput = ReactTestUtils.findAllInRenderedTree testComponent.getComponent(), (inst) ->
      return ReactTestUtils.isDOMComponent(inst) && inst.id == 'units'

    unitInput = unitInput[0]

    TestComponent.changeValue(unitInput, 'b')

  it "allows changing of decimal quantity", (done) ->
    testComponent = @render({
      answer: {
        quantity: 'a'
        unit: null
      }

      onValueChange: (value) ->
        assert.equal value.quantity, 13.33
        done()
    })

    quantityInput = ReactTestUtils.findRenderedDOMComponentWithTag testComponent.getComponent(), "INPUT"

    TestComponent.changeValue(quantityInput, '13.33')
    ReactTestUtils.Simulate.blur(quantityInput)

  it "allows changing of whole quantity", (done) ->
    testComponent = @render({
      answer: {
        quantity: 'a'
        unit: null
      }
      decimal: false
      onValueChange: (value) ->
        assert.equal value.quantity, 13
        done()
    })

    quantityInput = ReactTestUtils.findRenderedDOMComponentWithTag testComponent.getComponent(), "INPUT"

    TestComponent.changeValue(quantityInput, '13')
    ReactTestUtils.Simulate.blur(quantityInput)

  it "defaults unit", (done) ->
    testComponent = @render({
      answer: {
        quantity: null
        units: null
      }
      defaultUnits: 'b'
      onValueChange: (value) ->
        assert.equal value.quantity, 13.33
        assert.equal value.units, 'b'
        done()
    })

    quantityInput = ReactTestUtils.findRenderedDOMComponentWithTag testComponent.getComponent(), "INPUT"

    TestComponent.changeValue(quantityInput, '13.33')
    ReactTestUtils.Simulate.blur(quantityInput)
