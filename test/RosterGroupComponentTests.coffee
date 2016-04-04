_ = require 'lodash'
compare = require './compare'

TestComponent = require('react-library/lib/TestComponent')
ReactTestUtils = require('react-addons-test-utils')
RosterGroupComponent = require '../src/RosterGroupComponent'

React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement
H = React.DOM

describe "RosterGroupComponent", ->
  beforeEach ->
    @toDestroy = []

    @render = (options) =>
      elem = R(RosterGroupComponent, _.defaults(options, { isVisible: (-> true) }))
      comp = new TestComponent(elem)
      @toDestroy.push(comp)
      return comp

    # Create sample rosterGroup with single text question
    @rosterGroup = {
      _id: "a"
      name: { en: "Name" }
      contents: [
        # Text question
        { _id: "text", text: { en: "Text" }, format: "singleline" }
      ]
    }

  afterEach ->
    for comp in @toDestroy
      comp.destroy()

  it "adds entry when add is clicked", (done) ->
    onDataChange = (val) =>
      compare(val, { a: [{}] })
      done()

    @rosterGroup.allowAdd = true
    comp = @render(rosterGroup: @rosterGroup, data: {}, onDataChange: onDataChange)
    TestComponent.click(comp.findDOMNodeByText(/add/i))

  it "does not show add if add is disabled"
  it "removes entry when remove is clicked"
  it "does not show remove if remove is disabled"
  it "puts answers from inner components in correct position in array"
  it "uses alternate rosterId if specified"
  it "displays prompt"
  it "displays default entry header of #n"

  it "hides items if isVisible is false"
