_ = require 'underscore'
assert = require('chai').assert
Backbone = require 'backbone'
sinon = require 'sinon'

CurrentPositionFinder = require '../src/CurrentPositionFinder'

initialDelay = 10000
goodDelay = 5000
excellentAcc = 5
goodAcc = 10
fairAcc = 50
recentThreshold = 90000

createPos = (accuracy, timeago = 0) ->
  return {
    coords: {
      latitude: 1
      longitude: 2
      accuracy: accuracy
    }
    timestamp: new Date().getTime() - timeago
  }

# Uses an algorithm to accurately find current position (coords + timestamp). Fires status events and found event. 
describe "CurrentPositionFinder", ->
  beforeEach ->
    @locationFinder = new MockLocationFinder()
    @clock = sinon.useFakeTimers()
    @posFinder = new CurrentPositionFinder({locationFinder: @locationFinder})

    @pos = null
    @posFinder.on "found", (pos) =>
      @pos = pos

    @status = null
    @posFinder.on "status", (status) =>
      @status = status

    @posFinder.start()

  afterEach ->
    @clock.restore()

  it "starts location finder", ->
    assert.isTrue @locationFinder.watching

  it "sets location if excellent", ->
    pos = createPos(excellentAcc - 1)
    @locationFinder.fire(pos)
    assert.deepEqual @pos, pos

  it "stops location finder after setting", ->
    pos = createPos(excellentAcc - 1)
    @locationFinder.fire(pos)
    assert.isFalse @locationFinder.watching

  it "stops on stop", ->
    @posFinder.stop()

    pos = createPos(excellentAcc - 1)
    @locationFinder.fire(pos)
    assert.isNull @pos
    assert.equal @status.strength, "none"

  it "does not set immediately if good", ->
    pos = createPos(goodAcc - 1)
    @locationFinder.fire(pos)
    assert not @pos

  it "sets after good delay if good", ->
    pos = createPos(goodAcc - 1)
    @locationFinder.fire(pos)

    @clock.tick(goodDelay + 1)
    assert.deepEqual @pos, pos

  it "sets after first good signal, using last good report", ->
    pos1 = createPos(goodAcc - 1)
    @locationFinder.fire(pos1)

    @clock.tick(goodDelay/3)

    pos2 = createPos(goodAcc - 2)
    @locationFinder.fire(pos2)

    @clock.tick(goodDelay/3)

    # Bad position
    pos3 = createPos(goodAcc + 2)
    @locationFinder.fire(pos2)

    @clock.tick(goodDelay/3 + 10)
    
    assert.deepEqual @pos, pos2

  it "still sets after good delay even if signal is now poor", ->
    pos1 = createPos(goodAcc - 1)
    @locationFinder.fire(pos1)

    @clock.tick(goodDelay/2)

    pos2 = createPos(goodAcc + 100)
    @locationFinder.fire(pos2)

    @clock.tick(goodDelay/2 + 2)

    assert.deepEqual @pos, pos1

  it "useable true if good", ->
    pos1 = createPos(goodAcc - 1)
    @locationFinder.fire(pos1)

    assert.equal @status.useable, true    

  it "useable false initially", ->
    assert.equal @status.useable, false

  it "strength is none initially", ->
    assert.equal @status.strength, "none"

  it "strength is none initially if old gps", ->
    pos1 = createPos(goodAcc - 1, recentThreshold + 1)
    @locationFinder.fire(pos1)
    assert.equal @status.strength, "none"

  it "strength is poor if poor", ->
    pos1 = createPos(fairAcc + 1)
    @locationFinder.fire(pos1)
    assert.equal @status.strength, "poor"

  it "strength is fair if fair", ->
    pos1 = createPos(fairAcc - 1)
    @locationFinder.fire(pos1)
    assert.equal @status.strength, "fair"
    assert.equal @posFinder.strength, "fair"
  
  it "useable false immediately if poor", ->
    pos1 = createPos(fairAcc + 1)
    @locationFinder.fire(pos1)
    assert.equal @status.useable, false

  it "useable false immediately if fair", ->
    pos1 = createPos(fairAcc - 1)
    @locationFinder.fire(pos1)
    assert.equal @status.useable, false

  it "useable true if poor and after initial delay", ->
    pos1 = createPos(fairAcc + 1)
    @locationFinder.fire(pos1)

    @clock.tick(initialDelay + 2)

    assert.equal @status.useable, true
    assert.deepEqual @status.pos, pos1

  it "useable true if fair and after initial delay", ->
    pos1 = createPos(fairAcc - 1)
    @locationFinder.fire(pos1)

    @clock.tick(initialDelay + 2)

    assert.equal @status.useable, true
    assert.deepEqual @status.pos, pos1

  it "fires error if location finder reports error", ->
    error = ''
    @posFinder.on 'error', (err) ->
      error = err

    @locationFinder.trigger 'error', "some error"
    assert.equal error, 'some error'
    assert.equal @posFinder.error, 'some error'

  it "stops if location finder reports error", ->
    @locationFinder.trigger 'error', "some error"
    assert.equal @posFinder.running, false

class MockLocationFinder
  constructor:  ->
    _.extend @, Backbone.Events

  getLocation: (success, error) ->
  startWatch: ->
    @watching = true
  stopWatch: ->
    @watching = false

  fire: (loc) ->
    @trigger 'found', loc
