Backbone = require 'backbone'
_ = require 'underscore'

# Improved location finder. Triggers found event with HTML5 position object (containing coords, etc).
class LocationFinder
  constructor: ->
    _.extend @, Backbone.Events

  cacheLocation = (pos) ->
    window.localStorage['LocationFinder.lastPosition'] = JSON.stringify(pos)

  getCachedLocation = () ->
    if window.localStorage['LocationFinder.lastPosition']
      pos = JSON.parse(window.localStorage['LocationFinder.lastPosition'])

      # Check that valid position (unreproducible bug)
      if not pos.coords
        return

      # Accuracy is down since cached
      pos.coords.accuracy = 10000 # 10 km
      return pos
    
  getLocation: (success, error) ->
    # If no geolocation, send error immediately
    if not navigator.geolocation
      if error then error("No geolocation available")
      return

    console.log "Getting location"

    # Both failures are required to trigger error
    triggerLocationError = _.after 2, =>
      if error
        error()

    lowAccuracyError = (err) =>
      console.error "Low accuracy location error: #{err}"
      triggerLocationError()

    highAccuracyError = (err) =>
      console.error "High accuracy location error: #{err}"
      triggerLocationError()

    lowAccuracyFired = false
    highAccuracyFired = false

    lowAccuracy = (pos) =>
      if not highAccuracyFired
        lowAccuracyFired = true
        cacheLocation(pos)
        success(pos)

    highAccuracy = (pos) =>
      highAccuracyFired = true
      cacheLocation(pos)
      success(pos)

    # Get both high and low accuracy, as low is sufficient for initial display
    navigator.geolocation.getCurrentPosition(lowAccuracy, lowAccuracyError, {
        maximumAge : 3600,
        timeout : 30000,
        enableHighAccuracy : false
    })

    navigator.geolocation.getCurrentPosition(highAccuracy, highAccuracyError, {
        timeout : 60000,
        enableHighAccuracy : true
    })

    # Fire stored one within short time
    setTimeout =>
      cachedLocation = getCachedLocation()
      if cachedLocation and not lowAccuracyFired and not highAccuracyFired
        success(cachedLocation)
    , 250

  startWatch: ->
    # If already watching, continue silently
    if @locationWatchId?
      return

    # If no geolocation, send error immediately
    if not navigator.geolocation
      error("No geolocation available")
      return

    highAccuracyFired = false
    lowAccuracyFired = false
    cachedFired = false

    lowAccuracy = (pos) =>
      if not highAccuracyFired
        lowAccuracyFired = true
        cacheLocation(pos)
        @trigger 'found', pos

    lowAccuracyError = (err) =>
      # Low accuracy errors are not enough to trigger final error
      console.error "Low accuracy watch location error: #{err}"

    highAccuracy = (pos) =>
      highAccuracyFired = true
      cacheLocation(pos)
      @trigger 'found', pos

    highAccuracyError = (err) =>
      console.error "High accuracy watch location error: #{err}"
      @trigger 'error'

    # Fire initial low-accuracy one
    navigator.geolocation.getCurrentPosition(lowAccuracy, lowAccuracyError, {
        maximumAge : 3600,
        timeout : 30000,
        enableHighAccuracy : false
    })

    @locationWatchId = navigator.geolocation.watchPosition(highAccuracy, highAccuracyError, {
        enableHighAccuracy : true
    })  

    # Listen for pause events to stop watching
    document.addEventListener "pause", @pause
    document.addEventListener "resume", @resume

    console.log "Starting location watch #{this.locationWatchId}"

    # Fire stored one within short time
    setTimeout =>
      cachedLocation = getCachedLocation()
      if cachedLocation and not lowAccuracyFired and not highAccuracyFired
        cachedFired = true
        @trigger 'found', cachedLocation
    , 500

  stopWatch: ->
    if @locationWatchId?
      console.log "Stopping location watch #{this.locationWatchId}"
      navigator.geolocation.clearWatch(@locationWatchId)
      @locationWatchId = undefined

    # Listen for pause events to stop watching
    document.removeEventListener "pause", @pause
    document.removeEventListener "resume", @resume

  pause: =>
    if @locationWatchId?
      navigator.geolocation.clearWatch(@locationWatchId)
      @locationWatchId = undefined

  resume: =>
    highAccuracy = (pos) =>
      cacheLocation(pos)
      @trigger 'found', pos

    highAccuracyError = (err) =>
      console.error "High accuracy watch location error: #{err}"
      @trigger 'error'

    if not @locationWatchId?
      @locationWatchId = navigator.geolocation.watchPosition(highAccuracy, highAccuracyError, {
          enableHighAccuracy : true
      })  

module.exports = LocationFinder  