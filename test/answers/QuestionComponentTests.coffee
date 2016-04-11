_ = require 'underscore'
assert = require('chai').assert

React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement
H = React.DOM

FormExprEvaluator = require '../../src/FormExprEvaluator'
TestComponent = require('react-library/lib/TestComponent')
ReactTestUtils = require('react-addons-test-utils')

QuestionComponent = require '../../src/QuestionComponent'

describe "QuestionComponent", ->
  beforeEach ->
    @question = {
      _id: "q1234"
      _type: "TextQuestion"
      format: 'singleline'
      text: { _base: "en", en: "English" }
      hint: { _base: "en", en: "HINT" }
      help: { _base: "en", en: "has *formatting*" }
      required: true
    }

    @toDestroy = []

    @render = (options = {}) =>
      @options = _.extend {
        question: @question
        data: {}
        onAnswerChange: () ->
          null
        formExprEvaluator: new FormExprEvaluator()
      }, options
      elem = R(QuestionComponent, @options)
      comp = new TestComponent(elem)
      @toDestroy.push(comp)
      return comp

  afterEach ->
    for comp in @toDestroy
      comp.destroy()

  it "displays question text", ->
    testComponent = @render()

    prompt = testComponent.findDOMNodeByText(/English/)
    assert prompt?, 'Not showing question text'

  it "displays hint", ->
    testComponent = @render()

    hint = testComponent.findDOMNodeByText(/HINT/)
    assert hint?, 'Not showing hint text'

  it "displays required", ->
    testComponent = @render()

    star = testComponent.findDOMNodeByText(/\*/)
    assert star?, 'Not showing required star'

  it "displays help", ->
    testComponent = @render()

    help = testComponent.findDOMNodeByText(/formatting/)
    assert not help?, "Help shouldn't be visible"

    button = testComponent.findComponentById('helpbtn')
    TestComponent.click(button)

    help = testComponent.findDOMNodeByText(/formatting/)
    assert help?, 'Help should now be visible'

  it "display comment box", (done) ->
    testComponent = @render()
    comments = testComponent.findComponentById('comments')

    @question.commentsField = true
    testComponent = @render({
      onAnswerChange: (answer) ->
        assert.equal answer.comments, 'some comment'
        done()
    })

    comments = testComponent.findComponentById('comments')
    TestComponent.changeValue(comments, 'some comment')

  it "loads comment box", ->
    @question.commentsField = true
    testComponent = @render({
      answer: {comments: 'some comment'}
    })

    comment = testComponent.findDOMNodeByText(/some comment/)

    assert comment, 'The comment should be displayed'

  it "records timestamp", ->
    @question.recordTimestamp = true
    @question.commentsField = true
    testComponent = @render({
      answer: {comments: 'some comment'}
      onAnswerChange: (answer) ->
        after = new Date().toISOString()
        # Some imprecision in the date stamp was causing occassional failures
        assert answer.timestamp.substr(0,10) >= before.substr(0,10), answer.timestamp + " < " + before
        assert answer.timestamp.substr(0,10) <= after.substr(0,10), answer.timestamp + " > " + after
    })

    comments = testComponent.findDOMNodeByText(/some comment/)

    before = new Date().toISOString()
    TestComponent.changeValue(comments, 'some comment')


  it "records alternate na", (done) ->
    @question.alternates = {na: true}
    testComponent = @render(
      onAnswerChange: (answer) ->
        assert.equal answer.alternate, 'na'
        done()
    )
    na = testComponent.findComponentById('na')
    TestComponent.click(na)

  it "loads alternate na", ->
    @question.alternates = {na: true}
    testComponent = @render(
      answer: {alternate: 'na'}
    )
    na = testComponent.findComponentById('na')
    assert na.className.indexOf('checked') >= 0

  it "records alternate dontknow", (done) ->
    @question.alternates = {dontknow: true, na: true}
    testComponent = @render(
      onAnswerChange: (answer) ->
        assert.equal answer.alternate, 'dontknow'
        done()
    )
    dn = testComponent.findComponentById('dn')
    TestComponent.click(dn)

  it "erases value on alternate selected", (done) ->
    @question.alternates = {dontknow: true, na: true}
    testComponent = @render(
      answer: {value: 'test'}
      onAnswerChange: (answer) ->
        assert.equal answer.alternate, 'dontknow'
        assert.equal answer.value, null
        done()
    )
    dn = testComponent.findComponentById('dn')
    TestComponent.click(dn)

  it "caches value on alternate selected", (done) ->
    firstCall = true
    @question.alternates = {dontknow: true, na: true}
    myOptions = {
      answer: {value: 'test'}
      onAnswerChange: (answer) =>
        assert.equal answer.alternate, 'dontknow'
        assert.equal answer.value, null

        @options.answer = answer
        @options.onAnswerChange = (answer) ->
          assert.equal null, answer.alternate, "Alternate shouldn't be set anymore"
          assert.equal answer.value, 'test', 'Should be back to test'
          done()

        testComponent.setElement(R(QuestionComponent, @options))

        callback = () ->
          dn = testComponent.findComponentById('dn')
          TestComponent.click(dn)
        setTimeout(callback, 30)
    }

    testComponent = @render(myOptions)
    dn = testComponent.findComponentById('dn')
    TestComponent.click(dn)

  it "erases alternate on value entered", (done) ->
    @question.alternates = {dontknow: true, na: true}
    testComponent = @render(
      answer: {alternate: 'na'}
      onAnswerChange: (answer) ->
        assert.equal answer.alternate, null
        assert.equal answer.value, 'test'
        done()
    )
    input = testComponent.findComponentById('input')
    TestComponent.changeValue(input, 'test')
