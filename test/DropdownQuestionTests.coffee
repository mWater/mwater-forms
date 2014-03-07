assert = require("chai").assert
DropdownQuestion = require '../src/DropdownQuestion'
UIDriver = require './helpers/UIDriver'
Backbone = require 'backbone'

describe 'DropdownQuestion', ->
  context 'With a few options', ->
    beforeEach ->
      @model = new Backbone.Model()
      @question = new DropdownQuestion
        options: [['a', 'Apple'], ['b', 'Banana']]
        model: @model
        id: "q1"

    it 'accepts known value', ->
      @model.set(q1: { value: 'a' })
      assert.deepEqual @model.get('q1'), { value: 'a'}
      assert.isFalse @question.$("select").is(":disabled")

    it 'is disabled with unknown value', ->
      @model.set(q1: { value: 'x' })
      assert.deepEqual @model.get('q1'), { value: 'x' }
      assert.isTrue @question.$("select").is(":disabled")

    it 'is not disabled with empty value', ->
      @model.set(q1: null)
      assert.equal @model.get('q1'), null
      assert.isFalse @question.$("select").is(":disabled")

    it 'is reenabled with setting value', ->
      @model.set(q1: { value: 'x' })
      assert.deepEqual @model.get('q1'), { value: 'x' }
      @question.setOptions([['a', 'Apple'], ['b', 'Banana'], ['x', 'Kiwi']])
      assert.isFalse @question.$("select").is(":disabled")

