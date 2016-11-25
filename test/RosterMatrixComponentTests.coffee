_ = require 'lodash'
compare = require './compare'
assert = require('chai').assert

React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement
H = React.DOM

TestComponent = require('react-library/lib/TestComponent')
ReactTestUtils = require('react-addons-test-utils')
RosterMatrixComponent = require '../src/RosterMatrixComponent'
MockTContextWrapper = require './MockTContextWrapper'
ResponseRow = require '../src/ResponseRow'

describe "RosterMatrixComponent", ->
  beforeEach ->
    @toDestroy = []

    @render = (options) =>
      elem = R(RosterMatrixComponent, _.defaults(options, { 
        isVisible: (-> true)
        onDataChange: ->
        responseRow: new ResponseRow({
          responseData: options.data
          formDesign: { contents: [@rosterGroup] }
          })
      }))
      comp = new TestComponent(R(MockTContextWrapper, null, elem))
      @toDestroy.push(comp)
      return comp

    # Create sample rosterMatrix with each type of column
    @rosterMatrix = {
      _id: "a"
      name: { en: "Name" }
      contents: [
        { _id: "text", _type: "TextColumnQuestion", text: { en: "Text" } }
        { _id: "number", _type: "NumberColumnQuestion", text: { en: "Number" }, decimal: false }
        { _id: "check", _type: "CheckColumnQuestion", text: { en: "Check" } }
        { _id: "dropdown", _type: "DropdownColumnQuestion", text: { en: "Dropdown" }, choices: [{ id: "x", label: { en: "X" }}, { id: "y", label: { en: "Y" }}] }
        { _id: "units", _type: "UnitsColumnQuestion", text: { en: "Units" }, units: [{ id: "cm", label: { en: "CM" }}, { id: "inch", label: { en: "INCH" }}] }
        { _id: "textColumn", _type: "TextColumn", text: { en: "TextColumn" } }
      ]
    }

  afterEach ->
    for comp in @toDestroy
      comp.destroy()

  it "adds entry when add is clicked", (done) ->
    onDataChange = (val) =>
      assert.equal val.a.length, 1
      assert val.a[0]._id
      assert.deepEqual val.a[0].data, {}
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
      compare(val, { a: [{ _id: "2", data: { x: { value: 2 } } }] })
      done()

    @rosterMatrix.allowRemove = true
    comp = @render(rosterMatrix: @rosterMatrix, data: { a: [{ _id: "1", data: { x: { value: 1 } } }, { _id: "2", data: { x: { value: 2 } } }] }, onDataChange: onDataChange)
    TestComponent.click(ReactTestUtils.scryRenderedDOMComponentsWithClass(comp.getComponent(), "glyphicon-remove")[0])

  it "does not show remove if remove is disabled", ->
    comp = @render(rosterMatrix: @rosterMatrix, data: {})
    assert.equal ReactTestUtils.scryRenderedDOMComponentsWithClass(comp.getComponent(), "glyphicon-remove").length, 0

  it "puts answers from column components in correct position in array", (done) ->
    onDataChange = (val) =>
      compare(val, { a: [{ _id: "1", data: {}}, { _id: "2", data: { text: { value: "x"}}}] })
      done()

    comp = @render(rosterMatrix: @rosterMatrix, data: { a: [{ _id: "1", data: {}}, { _id: "2", data: {}}] }, onDataChange: onDataChange)

    # Set 3rd input (second row text)
    inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(comp.getComponent(), "input")
    inputs[3].value = "x"
    ReactTestUtils.Simulate.change(inputs[3])

  it "uses alternate rosterId if specified", (done) ->
    onDataChange = (val) =>
      assert.equal val.b.length, 1
      assert val.b[0]._id
      assert.deepEqual val.b[0].data, {}
      done()

    @rosterMatrix.allowAdd = true
    @rosterMatrix.rosterId = "b"
    comp = @render(rosterMatrix: @rosterMatrix, data: {}, onDataChange: onDataChange)
    TestComponent.click(comp.findDOMNodeByText(/add/i))

  it "displays prompt", ->
    comp = @render(rosterMatrix: @rosterMatrix, data: {})
    assert comp.findDOMNodeByText(/Name/)

  it "records text", (done) ->
    onDataChange = (val) =>
      compare(val.a[0].data, { text: { value: "x"}})
      done()

    comp = @render(rosterMatrix: @rosterMatrix, data: { a: [{}] }, onDataChange: onDataChange)

    inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(comp.getComponent(), "input")
    inputs[0].value = "x"
    ReactTestUtils.Simulate.change(inputs[0])

  it "records number", (done) ->
    onDataChange = (val) =>
      compare(val.a[0].data, { number: { value: 1 }})
      done()

    comp = @render(rosterMatrix: @rosterMatrix, data: { a: [{}] }, onDataChange: onDataChange)

    inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(comp.getComponent(), "input")
    inputs[1].value = "1"
    ReactTestUtils.Simulate.change(inputs[1])
    ReactTestUtils.Simulate.blur(inputs[1]) # Have to leave to set it

  it "records check", (done) ->
    onDataChange = (val) =>
      compare(val.a[0].data, { check: { value: true }})
      done()

    comp = @render(rosterMatrix: @rosterMatrix, data: { a: [{}] }, onDataChange: onDataChange)

    inputs = ReactTestUtils.scryRenderedDOMComponentsWithClass(comp.getComponent(), "touch-checkbox")
    ReactTestUtils.Simulate.click(inputs[0])

  it "records dropdown", (done) ->
    onDataChange = (val) =>
      compare(val.a[0].data, { dropdown: { value: "y" }})
      done()

    comp = @render(rosterMatrix: @rosterMatrix, data: { a: [{}] }, onDataChange: onDataChange)

    inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(comp.getComponent(), "select")
    inputs[0].value = "y"
    ReactTestUtils.Simulate.change(inputs[0], { target: { value: "y" }})

  it "requires required columns", ->
    @rosterMatrix.contents[0].required = true

    comp = @render(rosterMatrix: @rosterMatrix, data: { a: [{ _id: "1", data: {}}] })
    assert.isTrue comp.getComponent().refs.main.validate(false), "Should fail validation"

    comp = @render(rosterMatrix: @rosterMatrix, data: { a: [{ _id: "1", data: { text: { value: "x" }}}] })
    assert.isFalse comp.getComponent().refs.main.validate(false), "Should pass validation"

  it "validates columns", ->
    @rosterMatrix.contents[0].validations = [
      {
        op: "lengthRange"
        rhs: { literal: { min: 4, max: 6 } }
        message: { en: "message" }
      }
    ]

    comp = @render(rosterMatrix: @rosterMatrix, data: { a: [{ _id: "1", data: { text: { value: "x" }}}] })
    assert.isTrue comp.getComponent().refs.main.validate(false), "Should fail validation"

    comp = @render(rosterMatrix: @rosterMatrix, data: { a: [{ _id: "1", data: { text: { value: "12345" }}}] })
    assert.isFalse comp.getComponent().refs.main.validate(false), "Should pass validation"
