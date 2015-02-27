_ = require 'underscore'
Backbone = require 'backbone'
LocationFinder = require './LocationFinder'
utils = require './utils'

initialDelay = 10000
goodDelay = 5000

# Uses an algorithm to accurately find current position (coords + timestamp). Fires status events and found event. 
# Pass storage as option (implementing LocalStorage API) to get caching
module.exports = class CurrentPositionFinder
  constructor: (options={}) ->
    # Add events
    _.extend @, Backbone.Events 

    @locationFinder = options.locationFinder or new LocationFinder(options)
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
    @listenTo @locationFinder, "found", @locationFinderFound
    @listenTo @locationFinder, "error", @locationFinderError
    @locationFinder.startWatch()

    # Update status
    @updateStatus()

    setTimeout @afterInitialDelay, initialDelay

  stop: ->
    @running = false
    @locationFinder.stopWatch()
    @stopListening()

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
      @trigger 'found', @pos

  locationFinderError: (err) =>
    @stop()
    @error = err
    @trigger 'error', err

  updateStatus: ->
    @strength = utils.calculateGPSStrength(@pos)
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
