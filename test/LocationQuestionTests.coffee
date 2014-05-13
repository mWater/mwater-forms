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
    ctx = {
      locationFinder: new MockLocationFinder()
      displayMap: (loc) =>
        @mapDisplayed = loc
    }
    ctx.locationFinder.getLocation = (success) ->
      success(coords: { latitude: 1, longitude: 2, accuracy: 0 })

    @compiler = new FormCompiler(model: @model, locale: "es", ctx: ctx)
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

    @qview = @compiler.compileQuestion(@q).render()
    @ui = new UIDriver(@qview.el)


  # Run common tests
  commonQuestionTests.call(this)

  it "records location when set is clicked", ->
    @ui.click("Set")
    assert.deepEqual @model.get("q1234"), { value: { latitude: 1, longitude: 2, accuracy: 0 }}

  it "displays map", ->
    assert not @mapDisplayed
    @ui.click("Set")
    @ui.click("Map")
    assert.deepEqual @mapDisplayed, { latitude: 1, longitude: 2, accuracy: 0 }

