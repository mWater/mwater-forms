_ = require 'underscore'
$ = require 'jquery'
Backbone = require 'backbone'
Backbone.$ = $
assert = require('chai').assert
LocationView = require '../src/legacy/LocationView'
UIDriver = require './helpers/UIDriver'
CurrentPositionFinder = require '../src/legacy/CurrentPositionFinder'

class MockLocationFinder
  constructor:  ->
    _.extend @, Backbone.Events

  getLocation: (success, error) ->
  startWatch: ->
    @watching = true
  stopWatch: ->
    @watching = false

class MockCurrentPositionFinder extends CurrentPositionFinder
  constructor:  ->
    _.extend @, Backbone.Events

  start: ->
    @running = true
    @strength = 'none'

  stop: ->
    @running = false

describe 'LocationView', ->
  context 'With no set location', ->
    beforeEach ->
      @locationFinder = new MockLocationFinder()
      @currentPositionFinder = new MockCurrentPositionFinder()
      @locationView = new LocationView({
        loc:null, 
        locationFinder: @locationFinder, 
        currentPositionFinder: @currentPositionFinder})
      @ui = new UIDriver(@locationView.el)

    it 'displays Unspecified', ->
      assert.include(@ui.text(), 'Unspecified')

    # it 'allows setting location', ->
    #   @locationFinder.getLocation = (success, error) =>
    #     success({ coords: { latitude: 2, longitude: 3, accuracy: 5}, timestamp: new Date().getTime()})

    #   setPos = null
    #   @locationView.on 'locationset', (pos) ->
    #     setPos = pos

    #   @ui.click('Set')

    #   assert.equal setPos.latitude, 2

    # it 'allows cancelling setting location'

    # it 'Displays error', ->
    #   @locationFinder.getLocation = (success, error) =>
    #     error()

    #   setPos = null
    #   @locationView.on 'locationset', (pos) ->
    #     setPos = pos

    #   @ui.click('Set')

    #   assert.equal setPos, null
    #   assert.include(@ui.text(), 'Unable')

  context 'With set location', ->
    beforeEach ->
      @locationFinder = new MockLocationFinder()
      @currentPositionFinder = new MockCurrentPositionFinder()
      @locationView = new LocationView({
        loc: { latitude: 20, longitude: 10, accuracy: 0}, 
        locationFinder: @locationFinder, 
        currentPositionFinder: @currentPositionFinder})
      @ui = new UIDriver(@locationView.el)

    it 'displays Waiting', ->
      assert.include(@ui.text(), 'Waiting')

    it 'displays relative', ->
      @locationFinder.trigger 'found', { coords: { latitude: 21, longitude: 10, accuracy: 10}, timestamp: new Date().getTime()}
      assert.include(@ui.text(), '111.2 km S')

  context 'With set location', ->
    beforeEach ->
      @locationFinder = new MockLocationFinder()
      @currentPositionFinder = new MockCurrentPositionFinder()
      @locationView = new LocationView({ 
        loc: { latitude: 20, longitude: 10, accuracy: 0}, 
        locationFinder: @locationFinder,
        currentPositionFinder: @currentPositionFinder})
      @ui = new UIDriver(@locationView.el)

    it 'displays Waiting', ->
      assert.include(@ui.text(), 'Waiting')
      assert not @locationView.$("#use_anyway").is(":visible")

    it 'Set shows Use Anyway if recent fair accuracy', ->
      @ui.click ("Current Location")
      @currentPositionFinder.strength = 'fair'
      @currentPositionFinder.pos = { coords: { latitude: 2, longitude: 3, accuracy: 20}, timestamp: new Date().getTime()}
      @currentPositionFinder.trigger 'status', { strength: 'fair', pos: @currentPositionFinder.pos }

      assert.equal @locationView.$("#use_anyway").css('display'), 'inline-block'

    # it "Set doesn't shows Use Anyway if not recent >25 <100m accuracy", ->
    #   @locationFinder.getLocation = (success, error) =>
    #     success({ coords: { latitude: 2, longitude: 3, accuracy: 30}, timestamp: new Date().getTime() - 1000*35})
    #   @ui.click ("Set")

    #   # Doesn't show use anyway
    #   assert.notInclude(@ui.text(), 'Use Anyway')

    it 'Use Anyway uses location', ->
      @ui.click ("Current Location")
      @currentPositionFinder.strength = 'fair'
      @currentPositionFinder.pos = { coords: { latitude: 2, longitude: 3, accuracy: 30}, timestamp: new Date().getTime()}
      @currentPositionFinder.trigger 'status', { strength: 'fair', pos: @currentPositionFinder.pos }

      setPos = null
      @locationView.on 'locationset', (pos) ->
        setPos = pos

      @ui.click ("Current Location")

      assert not setPos

      @ui.click ("Use Anyway")
      assert.equal setPos.latitude, 2
      assert.equal setPos.longitude, 3


