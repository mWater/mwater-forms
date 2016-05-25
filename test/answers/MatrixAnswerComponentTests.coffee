assert = require('chai').assert

TestComponent = require('react-library/lib/TestComponent')
ReactTestUtils = require('react-addons-test-utils')

MatrixAnswerComponent = require '../../src/answers/MatrixAnswerComponent'
FormExprEvaluator = require '../../src/FormExprEvaluator'

React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement
H = React.DOM

describe 'MatrixAnswerComponent', ->
  before ->
    @toDestroy = []

    @render = (options = {}) =>
      options = _.extend {
        items: [
          { id: "a", label: { _base: "en", en: "AA" }, hint: { _base: "en", en: "a-hint" } }
          { id: "b", label: { _base: "en", en: "BB" } }
          { id: "c", label: { _base: "en", en: "CC" } }
        ]
        value: null
        onValueChange: () ->
          null
        columns: [
          { _id: "c1", _type: "TextColumnQuestion", name: { en: "C1" } }
        ]
        data: {}
        parentData: null
        formExprEvaluator: new FormExprEvaluator()
      }, options
      elem = R(MatrixAnswerComponent, options)
      comp = new TestComponent(elem)
      @toDestroy.push(comp)
      return comp

  afterEach ->
    for comp in @toDestroy
      comp.destroy()
    @toDestroy = []

  it "displays items", ->
    testComponent = @render()

    itemA = testComponent.findDOMNodeByText(/AA/)
    assert itemA?, 'Not showing choice AA'

  it "displays item hints", ->
    testComponent = @render()

    hintA = testComponent.findDOMNodeByText(/a-hint/)
    assert hintA?, 'Not showing hint'

  it "records text change", (done) ->
    testComponent = @render({
      onValueChange: (value) ->
        assert.deepEqual value, { a: { c1: { value: "x" } } }
        done()
    })

    inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(testComponent.getComponent(), "input")
    inputs[0].value = "x"
    ReactTestUtils.Simulate.change(inputs[0])

