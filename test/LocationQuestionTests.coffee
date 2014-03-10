_ = require 'underscore'
$ = require 'jquery'
Backbone = require 'backbone'
Backbone.$ = $
assert = require('chai').assert
FormCompiler = require '../src/FormCompiler'
commonQuestionTests = require './commonQuestionTests'
UIDriver = require './helpers/UIDriver'

class MockLocationFinder
  constructor:  ->
    _.extend @, Backbone.Events

  getLocation: (success, error) ->
  startWatch: ->
  stopWatch: ->

describe "LocationQuestion", ->
  beforeEach ->
    @locationFinder = new MockLocationFinder()
    @model = new Backbone.Model()
    @compiler = new FormCompiler(model: @model, locale: "es")
    @q = {
      _id: "q1234"
      _type: "LocationQuestion"
      text: { _base: "en", en: "English", es: "Spanish" }
      choices: [
        { id: "a", label: { _base: "en", es: "AA" }, hint: { _base: "en", es: "a-hint" } }
        { id: "b", label: { _base: "en", es: "BB" } }
        { id: "c", label: { _base: "en", es: "CC" }, specify: true }
      ]
    }
    ctx = {
      locationFinder: new MockLocationFinder()
    }
    ctx.locationFinder.getLocation = (success) ->
      success(coords: { latitude: 1, longitude: 2, accuracy: 0 })

    @qview = @compiler.compileQuestion(@q, ctx).render()
    @ui = new UIDriver(@qview.el)


  # Run common tests
  commonQuestionTests.call(this)

  it "records location when set is clicked", ->
    @ui.click("Set")
    assert.deepEqual @model.get("q1234"), { value: { latitude: 1, longitude: 2, accuracy: 0 }}
