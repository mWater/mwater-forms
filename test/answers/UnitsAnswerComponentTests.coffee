assert = require('chai').assert

TestComponent = require('react-library/lib/TestComponent')
ReactTestUtils = require('react-addons-test-utils')

UnitsAnswerComponent = require '../../src/answers/UnitsAnswerComponent'

React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement
H = React.DOM

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
        unit: 'a'
      }
      onValueChange: (value) ->
        assert.equal value.unit, 'b'
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

    quantityInput = ReactTestUtils.findAllInRenderedTree testComponent.getComponent(), (inst) ->
      return ReactTestUtils.isDOMComponent(inst) && inst.id == 'quantity'

    quantityInput = quantityInput[0]

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

    quantityInput = ReactTestUtils.findAllInRenderedTree testComponent.getComponent(), (inst) ->
      return ReactTestUtils.isDOMComponent(inst) && inst.id == 'quantity'

    quantityInput = quantityInput[0]

    TestComponent.changeValue(quantityInput, '13.33')
    ReactTestUtils.Simulate.blur(quantityInput)

  it "defaults unit", (done) ->
    testComponent = @render({
      answer: {
        quantity: null
        unit: null
      }
      defaultUnits: 'b'
      onValueChange: (value) ->
        assert.equal value.quantity, 13.33
        assert.equal value.unit, 'b'
        done()
    })

    quantityInput = ReactTestUtils.findAllInRenderedTree testComponent.getComponent(), (inst) ->
      return ReactTestUtils.isDOMComponent(inst) && inst.id == 'quantity'

    quantityInput = quantityInput[0]

    TestComponent.changeValue(quantityInput, '13.33')
    ReactTestUtils.Simulate.blur(quantityInput)

  it "validates range", ->
    #@q.validations = [
    #  {
    #    op: "range"
    #    rhs: { literal: { max: 6 } }
    #    message: { _base: "es", es: "message" }
    #  }
    #]
    #@qview = @compiler.compileQuestion(@q).render()

    #@qview.$el.find("#quantity").val("7").change()
    #@qview.$el.find("#units").val("a").change()
    #assert.equal @qview.validate(), "message"
    assert false
