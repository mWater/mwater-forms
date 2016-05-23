assert = require('chai').assert

TestComponent = require('react-library/lib/TestComponent')
ReactTestUtils = require('react-addons-test-utils')

LikertAnswerComponent = require '../../src/answers/LikertAnswerComponent'

React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement
H = React.DOM

describe.only 'LikertAnswerComponent', ->
  before ->
    @toDestroy = []

    @render = (options = {}) =>
      options = _.extend {
        answer: {}
        choices: [
          { id: "choiceA", label: { _base: "en", en: "Choice A" } }
          { id: "choiceB", label: { _base: "en", en: "Choice B" } }
          { id: "choiceC", label: { _base: "en", en: "Choice C" } }
        ],
        items: [
          { id: "itemA", label: { _base: "en", en: "Item A" }, hint: { _base: "en", en: "a-hint" } }
          { id: "itemB", label: { _base: "en", en: "Item B" } }
          { id: "itemC", label: { _base: "en", en: "Item C" } }
        ],
        onAnswerChange: () ->
          null
      }, options

      elem = R(LikertAnswerComponent, options)
      comp = new TestComponent(elem)
      @toDestroy.push(comp)
      return comp

  afterEach ->
    for comp in @toDestroy
      comp.destroy()
    @toDestroy = []

  it "displays items", ->
    testComponent = @render()

    choiceA = testComponent.findDOMNodeByText(/Item A/)
    assert choiceA?, 'Not showing item A'

    choiceB = testComponent.findDOMNodeByText(/Item B/)
    assert choiceB?, 'Not showing item B'

    choiceC = testComponent.findDOMNodeByText(/Item C/)
    assert choiceC?, 'Not showing item C'

  it "displays choices", ->
    testComponent = @render()

    choiceA = testComponent.findDOMNodeByText(/Choice A/)
    assert choiceA?, 'Not showing choice A'

    choiceB = testComponent.findDOMNodeByText(/Choice B/)
    assert choiceB?, 'Not showing choice B'

    choiceC = testComponent.findDOMNodeByText(/Choice C/)
    assert choiceC?, 'Not showing choice C'

  it "displays choice hints", ->
    testComponent = @render()

    hintA = testComponent.findDOMNodeByText(/a-hint/)
    assert hintA?, 'Not showing hint'

  it "records selected choice", (done) ->
    testComponent = @render({
      onAnswerChange: (answer) ->
        assert.deepEqual answer.value, {'itemB':'choiceB'}
        done()
    })

    id = "itemB:choiceB"

    itemBchoiceB = testComponent.findComponentById(id)

    assert itemBchoiceB?, 'could not find item B, choice B, radio btn'
    TestComponent.click(itemBchoiceB)

  it "allows unselecting choice by clicking twice", (done) ->
    testComponent = @render({
      answer: {value: {'itemB': 'choiceB'}}
      onAnswerChange: (answer) ->
        assert.deepEqual answer.value, {}
        done()
    })

    id = "itemB:choiceB"

    itemBchoiceB = testComponent.findComponentById(id)

    assert itemBchoiceB?, 'could not find item B, choice B, radio btn'
    TestComponent.click(itemBchoiceB)
