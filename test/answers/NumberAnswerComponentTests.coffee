assert = require('chai').assert

TestComponent = require('react-library/lib/TestComponent')
ReactTestUtils = require('react-addons-test-utils')

NumberAnswerComponent = require '../../src/answers/NumberAnswerComponent'

React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement
H = React.DOM

describe 'NumberAnswerComponent', ->
  beforeEach ->
    @toDestroy = []

    @render = (options = {}) =>
      elem = R(NumberAnswerComponent, options)
      comp = new TestComponent(elem)
      @toDestroy.push(comp)
      return comp

  afterEach ->
    for comp in @toDestroy
      comp.destroy()

  it "records decimal number", ->
    assert false

  it "records whole number", ->
    assert false

  it "enforces decimal number", ->
    assert false

  it "enforces whole number", ->
    assert false

  it "enforces required", ->
    assert false

  it "enforces required on blank answer", ->
    assert false

  it "allows 0 on required", ->
    assert false

  it "validates range", ->
    assert false

###
  it "records decimal number", ->
      @qview.$el.find("input").val("123.4").change()
      assert not @qview.validate()
      assert @model.get("q1234").value == 123.4

    it "records whole number", ->
      @q.decimal = false
      @qview = @compiler.compileQuestion(@q).render()

      @qview.$el.find("input").val("123").change()
      assert not @qview.validate()
      assert.equal @model.get("q1234").value, 123

    it "enforces decimal number", ->
      @qview.$el.find("input").val("123.4abc").change()
      assert @qview.validate()

    it "enforces whole number", ->
      @q.decimal = false
      @qview = @compiler.compileQuestion(@q).render()

      @qview.$el.find("input").val("123.4").change()
      assert @qview.validate()

    it "enforces required", ->
      assert @qview.validate()

      @q.required = false
      @qview = @compiler.compileQuestion(@q).render()
      assert not @qview.validate()

    it "enforces required on blank answer", ->
      @qview.$el.find("input").val("response").change()
      @qview.$el.find("input").val("").change()
      assert @qview.validate()

    it "allows 0 on required", ->
      @qview.$el.find("input").val("0").change()
      assert not @qview.validate()

    it "validates range", ->
      @q.validations = [
        {
          op: "range"
          rhs: { literal: { max: 6 } }
          message: { _base: "es", es: "message" }
        }
      ]
      @qview = @compiler.compileQuestion(@q).render()

      @qview.$el.find("input").val("7").change()
      assert.equal @qview.validate(), "message"
###