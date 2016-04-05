_ = require 'lodash'
compare = require './compare'
assert = require('chai').assert

TestComponent = require('react-library/lib/TestComponent')
ReactTestUtils = require('react-addons-test-utils')
RosterMatrixComponent = require '../src/RosterMatrixComponent'

React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement
H = React.DOM

describe "RosterMatrixComponent", ->
  beforeEach ->
    @toDestroy = []

    @render = (options) =>
      elem = R(RosterMatrixComponent, _.defaults(options, { isVisible: (-> true) }))
      comp = new TestComponent(elem)
      @toDestroy.push(comp)
      return comp

    # Create sample rosterMatrix with each type of column
    @rosterMatrix = {
      _id: "a"
      name: { en: "Name" }
      columns: [
        { _id: "text", _type: "Text", name: { en: "Text" } }
        { _id: "number", _type: "Number", name: { en: "Number" }, decimal: false }
        { _id: "checkbox", _type: "Checkbox", name: { en: "Checkbox" } }
        { _id: "dropdown", _type: "Dropdown", name: { en: "Dropdown" }, choices: [{ id: "x", label: { en: "X" }}, { id: "x", label: { en: "Y" }}] }
      ]
    }

  afterEach ->
    for comp in @toDestroy
      comp.destroy()

  it "adds entry when add is clicked", (done) ->
    onDataChange = (val) =>
      compare(val, { a: [{}] })
      done()

    @rosterMatrix.allowAdd = true
    comp = @render(rosterMatrix: @rosterMatrix, data: {}, onDataChange: onDataChange)
    TestComponent.click(comp.findDOMNodeByText(/add/i))

  it "does not show add if add is disabled", ->
    comp = @render(rosterMatrix: @rosterMatrix, data: {})
    assert not comp.findDOMNodeByText(/add/i)

  it "removes entry when remove is clicked", (done) ->
    onDataChange = (val) =>
      # Removes first one
      compare(val, { a: [{ x: 2 }] })
      done()

    @rosterMatrix.allowRemove = true
    comp = @render(rosterMatrix: @rosterMatrix, data: { a: [{ x: 1 }, { x: 2 }] }, onDataChange: onDataChange)
    TestComponent.click(ReactTestUtils.scryRenderedDOMComponentsWithClass(comp.getComponent(), "glyphicon-remove")[0])

  it "does not show remove if remove is disabled", ->
    comp = @render(rosterMatrix: @rosterMatrix, data: {})
    assert.equal ReactTestUtils.scryRenderedDOMComponentsWithClass(comp.getComponent(), "glyphicon-remove").length, 0

  it "puts answers from column components in correct position in array", (done) ->
    onDataChange = (val) =>
      # Removes first one
      compare(val, { a: [{}, { text: "x" }] })
      done()

    comp = @render(rosterMatrix: @rosterMatrix, data: { a: [{}, {}] }, onDataChange: onDataChange)

    # Set 3rd input (second row text)
    inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(comp.getComponent(), "input")
    inputs[2].value = "x"
    ReactTestUtils.Simulate.change(inputs[2])

  it "uses alternate rosterId if specified", (done) ->
    onDataChange = (val) =>
      compare(val, { b: [{}] })
      done()

    @rosterMatrix.allowAdd = true
    @rosterMatrix.rosterId = "b"
    comp = @render(rosterMatrix: @rosterMatrix, data: {}, onDataChange: onDataChange)
    TestComponent.click(comp.findDOMNodeByText(/add/i))

  it "displays prompt", ->
    comp = @render(rosterMatrix: @rosterMatrix, data: {})
    assert comp.findDOMNodeByText(/Name/)

  it "hides if isVisible for <id> is false", ->
    # Hide first
    isVisible = (id) -> id not in ["a"]
    comp = @render(rosterMatrix: @rosterMatrix, data: { a: [{}, {}] }, isVisible: isVisible)
    assert.equal ReactTestUtils.scryRenderedDOMComponentsWithTag(comp.getComponent(), "input").length, 0


  it "records text", (done) ->
    onDataChange = (val) =>
      compare(val, { a: [{ text: "x" }] })
      done()

    comp = @render(rosterMatrix: @rosterMatrix, data: { a: [{}] }, onDataChange: onDataChange)

    inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(comp.getComponent(), "input")
    inputs[0].value = "x"
    ReactTestUtils.Simulate.change(inputs[0])

  it "records number", (done) ->
    onDataChange = (val) =>
      compare(val, { a: [{ number: 1 }] })
      done()

    comp = @render(rosterMatrix: @rosterMatrix, data: { a: [{}] }, onDataChange: onDataChange)

    inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(comp.getComponent(), "input")
    inputs[1].value = "1"
    ReactTestUtils.Simulate.change(inputs[1])
    ReactTestUtils.Simulate.blur(inputs[1]) # Have to leave to set it

  it "records checkbox", (done) ->
    onDataChange = (val) =>
      compare(val, { a: [{ checkbox: true }] })
      done()

    comp = @render(rosterMatrix: @rosterMatrix, data: { a: [{}] }, onDataChange: onDataChange)

    inputs = ReactTestUtils.scryRenderedDOMComponentsWithClass(comp.getComponent(), "touch-checkbox")
    ReactTestUtils.Simulate.click(inputs[0])

  it "records dropdown", (done) ->
    onDataChange = (val) =>
      compare(val, { a: [{ dropdown: "y" }] })
      done()

    comp = @render(rosterMatrix: @rosterMatrix, data: { a: [{}] }, onDataChange: onDataChange)

    inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(comp.getComponent(), "select")
    inputs[0].value = "y"
    ReactTestUtils.Simulate.change(inputs[0], { target: { value: "y" }})

  it "requires required columns"

  it "validates columns"