_ = require 'underscore'
$ = require 'jquery'
Backbone = require 'backbone'
Backbone.$ = $
assert = require('chai').assert
forms = require '../src'
LocationView = forms.LocationView
UIDriver = require './helpers/UIDriver'

class MockLocationFinder
  constructor:  ->
    _.extend @, Backbone.Events

  getLocation: (success, error) ->
  startWatch: ->
  stopWatch: ->

describe 'LocationView', ->
  context 'With no set location', ->
    beforeEach ->
      @locationFinder = new MockLocationFinder()
      @locationView = new LocationView(loc:null, locationFinder: @locationFinder)
      @ui = new UIDriver(@locationView.el)

    it 'displays Unspecified', ->
      assert.include(@ui.text(), 'Unspecified')

    it 'disables map', ->
      assert.isTrue @ui.getDisabled("Map") 

    it 'allows setting location', ->
      @locationFinder.getLocation = (success, error) =>
        success({ coords: { latitude: 2, longitude: 3, accuracy: 10}})

      setPos = null
      @locationView.on 'locationset', (pos) ->
        setPos = pos

      @ui.click('Set')

      assert.equal setPos.latitude, 2

    it 'Displays error', ->
      @locationFinder.getLocation = (success, error) =>
        error()

      setPos = null
      @locationView.on 'locationset', (pos) ->
        setPos = pos

      @ui.click('Set')

      assert.equal setPos, null
      assert.include(@ui.text(), 'Cannot')

  context 'With set location', ->
    beforeEach ->
      @locationFinder = new MockLocationFinder()
      @locationView = new LocationView(loc: { latitude: 20, longitude: 10, accuracy: 0}, locationFinder: @locationFinder)
      @ui = new UIDriver(@locationView.el)

    it 'displays Waiting', ->
      assert.include(@ui.text(), 'Waiting')

    it 'displays relative', ->
      @locationFinder.trigger 'found', { coords: { latitude: 21, longitude: 10, accuracy: 10}}
      assert.include(@ui.text(), '111.2km S')

