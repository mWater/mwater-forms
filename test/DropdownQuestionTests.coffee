assert = require("chai").assert
DropdownQuestion = require '../src/DropdownQuestion'
UIDriver = require './helpers/UIDriver'
Backbone = require 'backbone'

# class MockLocationFinder
#   constructor:  ->
#     _.extend @, Backbone.Events

#   getLocation: ->
#   startWatch: ->
#   stopWatch: ->

describe 'DropdownQuestion', ->
  context 'With a few options', ->
    beforeEach ->
      @model = new Backbone.Model()
      @question = new DropdownQuestion
        options: [['a', 'Apple'], ['b', 'Banana']]
        model: @model
        id: "q1"

    it 'accepts known value', ->
      @model.set(q1: 'a')
      assert.equal @model.get('q1'), 'a'
      assert.isFalse @question.$("select").is(":disabled")

    it 'is disabled with unknown value', ->
      @model.set(q1: 'x')
      assert.equal @model.get('q1'), 'x'
      assert.isTrue @question.$("select").is(":disabled")

    it 'is not disabled with empty value', ->
      @model.set(q1: null)
      assert.equal @model.get('q1'), null
      assert.isFalse @question.$("select").is(":disabled")

    it 'is reenabled with setting value', ->
      @model.set(q1: 'x')
      assert.equal @model.get('q1'), 'x'
      @question.setOptions([['a', 'Apple'], ['b', 'Banana'], ['x', 'Kiwi']])
      assert.isFalse @question.$("select").is(":disabled")

