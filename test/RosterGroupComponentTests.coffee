_ = require 'lodash'
compare = require './compare'
assert = require('chai').assert

React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement
H = React.DOM

TestComponent = require('react-library/lib/TestComponent')
ReactTestUtils = require('react-dom/test-utils')
RosterGroupComponent = require '../src/RosterGroupComponent'
MockTContextWrapper = require './MockTContextWrapper'
ResponseRow = require '../src/ResponseRow'

describe "RosterGroupComponent", ->
  beforeEach ->
    @toDestroy = []

    # Options should include data
    @render = (options) =>
      elem = R(RosterGroupComponent, _.defaults(options, { 
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

    # Create sample rosterGroup with single text question
    @rosterGroup = {
      _id: "a"
      name: { en: "Name" }
      contents: [
        # Text question
        { _id: "text", _type: "TextQuestion", text: { en: "Text" }, format: "singleline" }
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

    @rosterGroup.allowAdd = true
    comp = @render(rosterGroup: @rosterGroup, data: {}, onDataChange: onDataChange)
    buttons = ReactTestUtils.scryRenderedDOMComponentsWithTag(comp.getComponent(), "button")
    TestComponent.click(buttons[0])

  it "does not show add if add is disabled", ->
    comp = @render(rosterGroup: @rosterGroup, data: {})
    assert not comp.findDOMNodeByText(/add/i)

  it "removes entry when remove is clicked", (done) ->
    onDataChange = (val) =>
      # Removes first one
      compare(val, { a: [{ _id: "2", data: { x: { value: 2 } } }] })
      done()

    @rosterGroup.allowRemove = true
    comp = @render(rosterGroup: @rosterGroup, data: { a: [{ _id: "1", data: { x: { value: 1 } } }, { _id: "2", data: { x: { value: 2 } } }] }, onDataChange: onDataChange)
    TestComponent.click(ReactTestUtils.scryRenderedDOMComponentsWithClass(comp.getComponent(), "glyphicon-remove")[0])

  it "does not show remove if remove is disabled", ->
    comp = @render(rosterGroup: @rosterGroup, data: {})
    assert.equal ReactTestUtils.scryRenderedDOMComponentsWithClass(comp.getComponent(), "glyphicon-remove").length, 0

  it "puts answers from inner components in correct position in array", (done) ->
    onDataChange = (val) =>
      compare(val, { a: [{ _id: "1", data: {}}, { _id: "2", data: { text: { value: "x", alternate: null}}}] })
      done()

    comp = @render(rosterGroup: @rosterGroup, data: { a: [{ _id: "1", data: {}}, { _id: "2", data: {}}] }, onDataChange: onDataChange)

    # Set last input
    inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(comp.getComponent(), "input")
    inputs[1].value = "x"
    ReactTestUtils.Simulate.change(inputs[1])
    ReactTestUtils.Simulate.blur(inputs[1])

  it "uses alternate rosterId if specified", (done) ->
    onDataChange = (val) =>
      assert.equal val.b.length, 1
      assert val.b[0]._id
      assert.deepEqual val.b[0].data, {}
      done()

    @rosterGroup.allowAdd = true
    @rosterGroup.rosterId = "b"
    comp = @render(rosterGroup: @rosterGroup, data: {}, onDataChange: onDataChange)
    TestComponent.click(ReactTestUtils.findRenderedDOMComponentWithTag(comp.getComponent(), "button"))

  it "displays prompt", ->
    comp = @render(rosterGroup: @rosterGroup, data: {})
    assert comp.findDOMNodeByText(/Name/)

  it "displays default entry header of n.", ->
    @rosterGroup.allowRemove = true
    comp = @render(rosterGroup: @rosterGroup, data: { a: [{ _id: "1", data: {} }, { _id: "2", data: {} }] })
    assert comp.findDOMNodeByText(/1\./)
    assert comp.findDOMNodeByText(/2\./)

  it "hides sub-items if isVisible for <id/rosterId>.<n>.<questionId> is false", ->
    # Hide first
    isVisible = (id) -> id not in ["a.0.text"]
    comp = @render(rosterGroup: @rosterGroup, data: { a: [{ _id: "1", data: {} }, { _id: "2", data: {} }] }, isVisible: isVisible)
    assert.equal ReactTestUtils.scryRenderedDOMComponentsWithTag(comp.getComponent(), "input").length, 1

    # Hide both
    isVisible = (id) -> id not in ["a.0.text", "a.1.text"]
    comp = @render(rosterGroup: @rosterGroup, data: { a: [{ _id: "1", data: {} }, { _id: "2", data: {} }] }, isVisible: isVisible)
    assert.equal ReactTestUtils.scryRenderedDOMComponentsWithTag(comp.getComponent(), "input").length, 0

    # Uses rosterId
    isVisible = (id) -> id not in ["b.0.text", "b.1.text"]
    @rosterGroup.rosterId = "b"
    comp = @render(rosterGroup: @rosterGroup, data: { a: [{ _id: "1", data: {} }, { _id: "2", data: {} }] }, isVisible: isVisible)
    assert.equal ReactTestUtils.scryRenderedDOMComponentsWithTag(comp.getComponent(), "input").length, 0

