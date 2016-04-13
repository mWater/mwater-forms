assert = require('chai').assert

TestComponent = require('react-library/lib/TestComponent')
ReactTestUtils = require('react-addons-test-utils')

SiteAnswerComponent = require '../../src/answers/SiteAnswerComponent'

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

  getChildContext: ->
    selectEntity: () ->
      null
    getEntityById: () ->
      null
    getEntityByCode: () ->
      null
    renderEntitySummaryView: () ->
      null
    onNextOrComments: () ->
      null

  render: ->
    return @props.children

describe 'SiteAnswerComponent', ->
  beforeEach ->
    @toDestroy = []

    @render = (options = {}) =>
      elem = R(SiteContext, R(SiteAnswerComponent, options))
      comp = new TestComponent(elem)
      @toDestroy.push(comp)
      return comp

  afterEach ->
    for comp in @toDestroy
      comp.destroy()

  it "allows valid site codes", ->
    assert false, 'Test not updated yet'
    @qview.$el.find("input").val("10007").change()
    assert.deepEqual @model.get("q1234").value, { code: "10007" }
    assert not @qview.validate()

  it "rejects invalid site codes", ->
    assert false, 'Test not updated yet'
    @qview.$el.find("input").val("10008").change()
    assert.deepEqual @model.get("q1234").value, { code: "10008" }
    assert @qview.validate()

  it "calls selectSite with site types", ->
    assert false, 'Test not updated yet'
    @qview.$el.find("#select").click()
    assert.deepEqual @model.get("q1234").value, { code: "10014" }

  it "displays site information", ->
    assert false, 'Test not updated yet'
    @qview.$el.find("input").val("10014").change()
    assert.include(@qview.$el.text(), 'Somename2')
