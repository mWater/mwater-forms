assert = require('chai').assert

TestComponent = require('react-library/lib/TestComponent')
ReactTestUtils = require('react-addons-test-utils')

SiteAnswerComponent = require '../../src/answers/SiteAnswerComponent'
AnswerValidator = require '../../src/answers/AnswerValidator'

React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement
H = React.DOM

# TODO: Fix 4 failing test

class SiteContext extends React.Component
  @childContextTypes:
    selectEntity: React.PropTypes.func
    getEntityById: React.PropTypes.func
    getEntityByCode: React.PropTypes.func
    renderEntitySummaryView: React.PropTypes.func
    onNextOrComments: React.PropTypes.func
    T: React.PropTypes.func

  getChildContext: ->
    selectEntity: () ->
      null
    getEntityById: () ->
      null
    getEntityByCode: (code) ->
      if code == '10007'
        return true
      return null
    renderEntitySummaryView: () ->
      null
    onNextOrComments: () ->
      null
    T: () ->
      null

  render: ->
    return @props.children

describe 'SiteAnswerComponent', ->
  beforeEach ->
    @toDestroy = []

    @render = (options = {}) =>
      elem = R(SiteContext, {}, R(SiteAnswerComponent, options))
      comp = new TestComponent(elem)
      @toDestroy.push(comp)
      return comp

  afterEach ->
    for comp in @toDestroy
      comp.destroy()

  it "allows valid site codes", (done) ->
    testComponent = @render({
      onValueChange: (value) ->
        assert.equal value.code, "10007"

        # Validate answer
        answer = {value: value}
        answerValidator = new AnswerValidator()
        question = {_type: "SiteQuestion"}
        result = await answerValidator.validate(question, answer)
        assert.equal result, null

        done()
    })
    input = testComponent.findInput()
    TestComponent.changeValue(input, "10007")
    ReactTestUtils.Simulate.blur(input)

  it "rejects invalid site codes", (done) ->
    testComponent = @render({
      onValueChange: (value) ->
        assert.equal value.code, "10008"

        # Validate answer
        answer = {value: value}
        answerValidator = new AnswerValidator()
        question = {_type: "SiteQuestion"}
        result = await answerValidator.validate(question, answer)
        assert.equal result, 'Invalid code'

        done()
    })
    input = testComponent.findInput()
    TestComponent.changeValue(input, "10008")
    ReactTestUtils.Simulate.blur(input)

