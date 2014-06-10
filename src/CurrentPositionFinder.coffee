_ = require 'underscore'
Backbone = require 'backbone'
LocationFinder = require './LocationFinder'

initialDelay = 15000
goodDelay = 5000
excellentAcc = 5
goodAcc = 10
fairAcc = 50
recentThreshold = 30000

# Uses an algorithm to accurately find current position (coords + timestamp). Fires status events and found event. 
module.exports = class CurrentPositionFinder
  constructor: (options) ->
    # Add events
    _.extend @, Backbone.Events 

    @locationFinder = options.locationFinder or new LocationFinder()

    @_reset()

  _reset: ->
    @running = false
    @initialDelayComplete = false
    @goodDelayRunning = false

    @strength = 'none'
    @pos = null
    @useable = false

  start: ->
    @_reset()

    @running = true
    @listenTo @locationFinder, "found", @found
    @listenTo @locationFinder, "error", @error
    @locationFinder.startWatch()

    # Update status
    @updateStatus()

    setTimeout @afterInitialDelay, initialDelay

  stop: ->
    @running = false
    @locationFinder.stopWatch()
    @stopListening()

  found: (pos) =>
    # Calculate strength of new position
    newStrength = @calcStrength(pos)

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
      @trigger 'found', @pos

  error: (err) =>
    @stop()
    @trigger 'error', err

  updateStatus: ->
    @strength = @calcStrength(@pos)
    @useable = (@initialDelayComplete and @strength in ["fair", "poor"]) or @strength == "good"
    
    # Trigger status
    @trigger 'status', { strength: @strength, pos: @pos, useable: @useable }

  afterInitialDelay: =>
    # Set useable if strength is not none
    @initialDelayComplete = true
    if @running 
      @updateStatus()

  afterGoodDelay: =>
    if @running
      @stop()
      @trigger 'found', @pos

  calcStrength: (pos) ->
    if not pos
      return "none"

    # If old, accuracy is none
    if pos.timestamp < new Date().getTime() - recentThreshold
      return "none"

    if pos.coords.accuracy <= excellentAcc
      return "excellent"

    if pos.coords.accuracy <= goodAcc
      return "good"

    if pos.coords.accuracy <= fairAcc
      return "fair"

    return "poor"