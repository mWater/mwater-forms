_ = require 'lodash'
EventEmitter = require('events')
LocationFinder = require './LocationFinder'
utils = require './utils'

initialDelay = 10000
goodDelay = 5000

# Uses an algorithm to accurately find current position (coords + timestamp). Fires status events and found event. 
# Only call start once and be sure to call stop after
module.exports = class CurrentPositionFinder
  constructor: (options={}) ->
    # Add events
    @eventEmitter = new EventEmitter()

    # "error" messages are handled specially and will crash if not handled!
    @eventEmitter.on('error', =>)

    @locationFinder = options.locationFinder or new LocationFinder()
    @_reset()

  on: (event, callback) =>
    @eventEmitter.on(event, callback)

  off: (event, callback) =>
    @eventEmitter.removeListener(event, callback)

  _reset: ->
    @running = false
    @initialDelayComplete = false
    @goodDelayRunning = false

    @strength = 'none'
    @pos = null
    @useable = false

  start: ->
    if @running
      @stop()

    @_reset()

    @running = true
    @locationFinder.on("found", @locationFinderFound)
    @locationFinder.on("error", @locationFinderError)
    @locationFinder.startWatch()

    # Update status
    @updateStatus()

    setTimeout @afterInitialDelay, initialDelay

  stop: ->
    if not @running
      return

    @running = false
    @locationFinder.stopWatch()
    @locationFinder.off("found", @locationFinderFound)
    @locationFinder.off("error", @locationFinderError)

  locationFinderFound: (pos) =>
    # Calculate strength of new position
    newStrength = utils.calculateGPSStrength(pos)

    # If none, do nothing
    if newStrength == "none"
      return

    # Replace position if better
    if not @pos or pos.coords.accuracy <= @pos.coords.accuracy
      @pos = pos

    # Update status
    @updateStatus()

    # Start good delay if needed
    if not @goodDelayRunning and @strength == "good"
      setTimeout @afterGoodDelay, goodDelay

    # Set position if excellent
    if @strength == "excellent"
      @stop()
      @eventEmitter.emit('found', @pos)

  locationFinderError: (err) =>
    @stop()
    @error = err
    @eventEmitter.emit('error', err)

  updateStatus: ->
    @strength = utils.calculateGPSStrength(@pos)
    @useable = (@initialDelayComplete and @strength in ["fair", "poor"]) or @strength == "good"
    
    # Trigger status
    @eventEmitter.emit('status', { strength: @strength, pos: @pos, useable: @useable, accuracy: @pos?.coords.accuracy })

  afterInitialDelay: =>
    # Set useable if strength is not none
    @initialDelayComplete = true
    if @running 
      @updateStatus()

  afterGoodDelay: =>
    if @running
      @stop()
      @eventEmitter.emit('found', @pos)
