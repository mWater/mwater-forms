_ = require 'lodash'
assert = require('chai').assert

TestComponent = require('react-library/lib/TestComponent')
ReactTestUtils = require('react-dom/test-utils')

RadioAnswerComponent = require '../../src/answers/RadioAnswerComponent'

React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement

describe 'RadioAnswerComponent', ->
  before ->
    @toDestroy = []

    @render = (options = {}) =>
      options = _.extend {
        answer: {}
        choices: [
          { id: "a", label: { _base: "en", en: "AA" }, hint: { _base: "en", en: "a-hint" } }
          { id: "b", label: { _base: "en", en: "BB" } }
          { id: "c", label: { _base: "en", en: "CC" }, specify: true }
        ],
        onAnswerChange: () ->
          null
      }, options

      elem = R(RadioAnswerComponent, options)
      comp = new TestComponent(elem)
      @toDestroy.push(comp)
      return comp

  afterEach ->
    for comp in @toDestroy
      comp.destroy()
    @toDestroy = []

  it "displays choices", ->
    testComponent = @render()

    choiceA = testComponent.findDOMNodeByText(/AA/)
    assert choiceA?, 'Not showing choice AA'

    choiceB = testComponent.findDOMNodeByText(/BB/)
    assert choiceB?, 'Not showing choice BB'

    choiceC = testComponent.findDOMNodeByText(/CC/)
    assert choiceC?, 'Not showing choice CC'

  it "displays choice hints", ->
    testComponent = @render()

    hintA = testComponent.findDOMNodeByText(/a-hint/)
    assert hintA?, 'Not showing hint'

  it "records selected choice", (done) ->
    testComponent = @render({
      onAnswerChange: (answer) ->
        assert.equal answer.value, 'a'
        done()
    })

    choiceA = testComponent.findComponentById('a')

    assert choiceA?, 'could not find choice A'
    TestComponent.click(choiceA)

  it "allows unselecting choice by clicking twice", (done) ->
    testComponent = @render({
      answer: {value: 'b'}
      onAnswerChange: (answer) ->
        assert.deepEqual answer.value, null
        done()
    })

    choiceB = testComponent.findComponentById('b')

    assert choiceB?, 'could not find choice B'
    TestComponent.click(choiceB)

  it "displays specify box", ->
    testComponent = @render {value: 'c'}

    specifyInput = ReactTestUtils.findRenderedDOMComponentWithClass.bind(this, testComponent.getComponent(), 'specify-input')

    assert specifyInput?, 'could not find specify input'

  it "it doesn't displays specify box when a choice without specify is selected", ->
    testComponent = @render {value: 'a'}

    assert.throws(ReactTestUtils.findRenderedDOMComponentWithClass.bind(this, testComponent.getComponent(), 'specify-input'), 'Did not find exactly one match (found: 0) for class:specify-input')

  it "records specify value", (done) ->
    testComponent = @render {
      onAnswerChange: (answer) ->
        assert.deepEqual answer.specify, {'c': 'specify'}
        done()
      answer: {value: 'c'}
    }

    specifyInput = ReactTestUtils.findRenderedDOMComponentWithClass(testComponent.getComponent(), 'specify-input')
    TestComponent.changeValue(specifyInput, 'specify')

  it "removes specify value on other selection", (done) ->
    testComponent = @render {
      onAnswerChange: (answer) ->
        assert.equal answer.specify, null
        done()
      answer: {value: 'c'}
      specify: {c: 'specify'}
    }

    choiceC = testComponent.findComponentById('c')
    assert choiceC?, 'could not find choice C'
    TestComponent.click(choiceC)
