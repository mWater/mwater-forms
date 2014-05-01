Backbone = require 'backbone'
Backbone.$ = require 'jquery'
LocationFinder = require './LocationFinder'
OrientationFinder = require './OrientationFinder'
_ = require 'underscore'

# Shows the relative location of a point and allows setting it
# Fires events locationset, map, both with 
# options readonly makes it non-editable
# options hideMap is true to hide map
# options locationFinder overrides default LocationFinder
# Location is stored format { latitude, longitude, accuracy, altitude?, altitudeAccuracy? }
class LocationView extends Backbone.View
  constructor: (options) ->
    super()
    @loc = options.loc
    @readonly = options.readonly
    @hideMap = options.hideMap
    @disableMap = options.disableMap
    @settingLocation = false
    @locationFinder = options.locationFinder || new LocationFinder()
    @orientationFinder = options.orientationFinder || new OrientationFinder()
    @orientationFinder.startWatch()
    # Listen to location events
    @listenTo(@locationFinder, 'found', @locationFound)
    @listenTo(@locationFinder, 'error', @locationError)

    # Listen to device orientation events
    @listenTo(@orientationFinder, 'orientationChange', @compassChange)

    # Start tracking location if set
    if @loc
      @locationFinder.startWatch()

    # Do not re-render template as it would destroy input fields
    @$el.html require('./templates/LocationView.hbs')()

    @render()

  events:
    'click #location_map' : 'mapClicked'
    'click #location_set' : 'setLocation'
    'click #location_clear' : 'clearLocation'
    'click #location_edit' : 'editLocation'
    'click #save_button' : 'saveEditLocation'
    'click #cancel_button' : 'cancelEditLocation'

  remove: ->
    @locationFinder.stopWatch()
    @orientationFinder.stopWatch()
    super()

  render: ->
    # Set location string
    if @errorFindingLocation
      @$("#location_relative").text("Cannot find location")
    else if not @loc and not @settingLocation 
      @$("#location_relative").text("Unspecified location")
    else if @settingLocation
      @$("#location_relative").text("Setting location...")
    else if @relativeLocation
      @$("#location_relative").text(@relativeLocation.distance + " " + @relativeLocation.cardinalDirection )
    else 
      @$("#location_relative").text("")

    if @loc and not @settingLocation
      @$("#location_absolute").text("#{this.loc.latitude.toFixed(6)}, #{this.loc.longitude.toFixed(6)}")
    else
      @$("#location_absolute").text("")

    # Hide map if hidden
    if @hideMap
      @$("#location_map").hide()
      
    # Disable map if location not set
    @$("#location_map").attr("disabled", not @loc or @disableMap)

    # Disable clear if location not set or readonly
    @$("#location_clear").attr("disabled", not @loc || @readonly)

    # Disable edit if readonly
    @$("#location_edit").attr("disabled", @readonly)

    @updateAccuracyStrength @currentLoc
    @$("#gps_strength")[0].className = @accuracy.class
    @$("#gps_strength").text @accuracy.text

  displayNotification: (message, className, shouldFadeOut) ->
    # Cancel the fadeout if timer on any preexisting alerts
    timeout = timeout || 0
    clearTimeout timeout

    $notification = @$("#notification")
    $notification[0].className = "alert"

    # If it is a temporary notification setup a fadeout timer
    $notification.addClass(className).html(message).fadeIn 200, ->
      if shouldFadeOut
        timeout = setTimeout( ->
            $notification.fadeOut 500
            return
        , 3000)

  clearLocation: ->
    @relativeLocation = getRelativeLocation @currentLoc, @loc
    @trigger('locationset', null)
 
  # Takes out relevant coords from html5 position
  convertPosToLoc: (pos) ->
    if not pos?
      return pos
    return _.pick(pos.coords, "latitude", "longitude", "accuracy", "altitude", "altitudeAccuracy")

  setLocation: ->
    console.log "setting location"
    @settingLocation = true
    @errorFindingLocation = false
    alertDebouncer = 0
    alertDisplayed = false

    locationSuccess = (pos) =>

      usePosition = => 
        # Extract location
        @loc = @convertPosToLoc(pos)
        # Set location
        @currentLoc = @convertPosToLoc(pos)
        @relativeLocation = getRelativeLocation @currentLoc, @loc
        alertDisplayed = true
        @displayNotification "Location Set Successfully", "alert-success", true
        @settingLocation = false
        @errorFindingLocation = false
        @trigger('locationset', @loc)
        @render()  
        return 

      @updateAccuracyStrength @convertPosToLoc(pos)

      # The first time is usually the 'lowAccuracy' event firing, 
      # Give high accuracy time to come back instead of immediately alerting user of low accuracy success
      if @accuracy.strength == "fair" and not alertDisplayed
        alertDisplayed = true
        alertDebouncer = setTimeout (=>
          # Ask the user if they want to use the low accuracy position
          @displayNotification "Low GPS Strength <div id='use-anyway' class='btn btn-sm btn-warning' style='margin-left:5px'>Use Anyway</div>", "alert-warning"
          @$("#notification").on("click", "#use-anyway", usePosition)
          return
        ), 3000
      else if @accuracy.strength == "strong"
        # Cancel the low accuracy alert
        clearTimeout alertDebouncer
        usePosition()
      else if @accuracy.strength == "weak" and not alertDisplayed
        # The accuracy is undesirable
        @settingLocation = false
        alertDisplayed = true
        @displayNotification "Low GPS Strength. Waiting for better signal", "alert-danger", false
        @render()

    locationError = (err) =>
      @settingLocation = false
      @errorFindingLocation = true
      # Verify the low accuracy attempt hasn't already succeeded and alerted the user
      if not alertDisplayed
        @displayNotification "Unable to set Location", "alert-danger", true

    @updateAccuracyStrength @currentLoc
    # Display a red warning if GPS is unusable
    if @accuracy.strength == "weak"
      @displayNotification "Waiting for GPS", "alert-danger"
    else
      @displayNotification "Setting Location...", "alert-warning"

    @locationFinder.getLocation locationSuccess, locationError
    @render()

  compassChange: (values) =>
    # Only display the compass if we can accurately calculate relative direction
    $sourcePointer = @$("#source_pointer .glyphicon")
    if @relativeLocation and @accuracy.strength != 'weak' and @orientationFinder.active
      $sourcePointer.show()
      arrowRotation = @relativeLocation.bearing + values.normalized.alpha
      prefixes = ["", "Webkit", "Moz", "ms", "O"]
      elem = $sourcePointer[0]
      prefixes.forEach (prefix) ->
          elem.style[prefix + "Transform"] = "rotate(" + arrowRotation + "deg)"
    else 
      $sourcePointer.hide()

  locationFound: (pos) =>
    @currentLoc = @convertPosToLoc(pos)
    @updateAccuracyStrength @currentLoc
    @relativeLocation = getRelativeLocation @currentLoc, @loc
    @render()

  locationError: =>
    @render()

  mapClicked: =>
    @trigger('map', @loc)

  editLocation: ->
    # Set values
    @$("#latitude").val(if @loc then @loc.latitude else "")
    @$("#longitude").val(if @loc then @loc.longitude else "")
    @$("#location_edit_controls").slideDown()

  saveEditLocation: ->
    if isNaN(parseFloat(@$("#latitude").val()))
      alert("Invalid latitude")
      return
    if isNaN(parseFloat(@$("#longitude").val()))
      alert("Invalid longitude")
      return

    # Set location
    @loc = {
      latitude: parseFloat(@$("#latitude").val())
      longitude: parseFloat(@$("#longitude").val())
      accuracy: 0  # Perfectly accurate when entered
    }
    @relativeLocation = getRelativeLocation @currentLoc, @loc
    @trigger('locationset', @loc)

    # Hide editing controls and re-render
    @$("#location_edit_controls").slideUp()    
    @render()

  cancelEditLocation: ->
    @$("#location_edit_controls").slideUp() 

  updateAccuracyStrength: (pos) =>
    if not (pos and pos.accuracy) then @accuracy = { color: "red", class: "text-danger", strength: "weak", text: "Waiting for GPS..." }
    else if pos.accuracy > 50 then @accuracy = { color: "red", class: "text-danger", strength: "weak", text: "Waiting for GPS..." }
    else if pos.accuracy > 10 then @accuracy = { color: "yellow", class: "text-warning", strength: "fair", text: "Low accuracy GPS"}
    else @accuracy = { color: "green", class: "text-success", strength: "strong", text: "GPS Acquired" }

module.exports = LocationView

getRelativeLocation = (from, to) ->
  x1 = from.longitude
  y1 = from.latitude
  x2 = to.longitude
  y2 = to.latitude
  
  # Convert to relative position (approximate)
  dy = (y2 - y1) / 57.3 * 6371000
  dx = Math.cos(y1 / 57.3) * (x2 - x1) / 57.3 * 6371000
  
  # Determine direction and angle
  dist = Math.sqrt(dx * dx + dy * dy)
  angle = 90 - (Math.atan2(dy, dx) * 57.3)
  angle += 360 if angle < 0
  angle -= 360 if angle > 360
  
  # Get approximate direction
  compassDir = (Math.floor((angle + 22.5) / 45)) % 8
  compassStrs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]

  if dist > 1000
    distance = (dist / 1000).toFixed(1) + "km "
  else
    distance = (dist).toFixed(0) + "m "

  return {
    distance: distance,
    cardinalDirection: compassStrs[compassDir],
    bearing: angle
  }
