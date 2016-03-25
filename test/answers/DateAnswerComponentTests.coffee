assert = require('chai').assert

TestComponent = require('react-library/lib/TestComponent')
ReactTestUtils = require('react-addons-test-utils')

DateAnswerComponent = require '../../src/answers/DateAnswerComponent'

React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement
H = React.DOM

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

  it "displays format YYYY-MM-DD", ->
    #@render({value: "2013-12-31"})
    #assert.equal @qview.$el.find("input").val(), "2013-12-31"
    assert false

  it "displays format MM/DD/YYYY", ->
    assert false

  it "handles arbitrary date formats in Moment.js format", ->
    assert false

###
  it "displays format MM/DD/YYYY", ->
    @q.format = "MM/DD/YYYY"
    @qview = @compiler.compileQuestion(@q).render()

    @model.set("q1234", { value: "2013-12-31"})
    assert.equal @qview.$el.find("input").val(), "12/31/2013"

  it "handles arbitrary date formats in Moment.js format", ->
    @q.format = "MMDDYYYY"
    @qview = @compiler.compileQuestion(@q).render()

    @model.set("q1234", { value: "2013-12-31"})
    assert.equal @qview.$el.find("input").val(), "12312013"

  it "pops up calendar control with current date"
  it "records calendar control selection"
###