assert = require('chai').assert

TestComponent = require('react-library/lib/TestComponent')
ReactTestUtils = require('react-addons-test-utils')

SiteAnswerComponent = require '../../src/answers/SiteAnswerComponent'

React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement
H = React.DOM

describe 'SiteAnswerComponent', ->
  beforeEach ->
    @toDestroy = []

    @render = (options = {}) =>
      elem = R(SiteAnswerComponent, options)
      comp = new TestComponent(elem)
      @toDestroy.push(comp)
      return comp

  afterEach ->
    for comp in @toDestroy
      comp.destroy()

  it "allows valid site codes", ->
    assert false

  it "rejects invalid site codes", ->
    assert false

  it "calls selectSite with site types", ->
    assert false

  it "displays site information", ->
    assert false

###
  it "allows valid site codes", ->
    @qview.$el.find("input").val("10007").change()
    assert.deepEqual @model.get("q1234").value, { code: "10007" }
    assert not @qview.validate()

  it "rejects invalid site codes", ->
    @qview.$el.find("input").val("10008").change()
    assert.deepEqual @model.get("q1234").value, { code: "10008" }
    assert @qview.validate()

  it "calls selectSite with site types", ->
    @qview.$el.find("#select").click()
    assert.deepEqual @model.get("q1234").value, { code: "10014" }

  it "displays site information", ->
    @qview.$el.find("input").val("10014").change()
    assert.include(@qview.$el.text(), 'Somename2')
###