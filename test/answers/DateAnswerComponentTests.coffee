assert = require('chai').assert

TestComponent = require('react-library/lib/TestComponent')
ReactTestUtils = require('react-addons-test-utils')

DateAnswerComponent = require '../../src/answers/DateAnswerComponent'

React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement
H = React.DOM

# Cannot find datetimepicker

describe 'DateAnswerComponent', ->
  beforeEach ->
    @toDestroy = []

    @render = (options = {}) =>
      elem = R(DateAnswerComponent, options)
      comp = new TestComponent(elem)
      @toDestroy.push(comp)
      return comp

  afterEach ->
    for comp in @toDestroy
      comp.destroy()

  it "displays format YYYY-MM-DD", (done) ->
    testComponent = @render({
      value: null
      onValueChange: (value) ->
        assert.equal value, "2013-12-31"
        done()

    })
    TestComponent.changeValue(testComponent.findInput(), "2013-12-31")

  it "displays format MM/DD/YYYY", ->
    assert false
    @q.format = "MM/DD/YYYY"
    @qview = @compiler.compileQuestion(@q).render()

    @model.set("q1234", { value: "2013-12-31"})
    assert.equal @qview.$el.find("input").val(), "12/31/2013"

  it "handles arbitrary date formats in Moment.js format", ->
    assert false
    @q.format = "MMDDYYYY"
    @qview = @compiler.compileQuestion(@q).render()

    @model.set("q1234", { value: "2013-12-31"})
    assert.equal @qview.$el.find("input").val(), "12312013"
