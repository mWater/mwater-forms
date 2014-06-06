Backbone = require 'backbone'
Backbone.$ = require 'jquery'
LocationFinder = require './LocationFinder'
OrientationFinder = require './OrientationFinder'
_ = require 'underscore'
ezlocalize = require 'ez-localize'

# Shows the relative location of a point and allows setting it
# Fires events locationset, map, both with 
# options loc is initial location. (latitude, longitude, accuracy, etc.)
# options readonly makes it non-editable
# options hideMap is true to hide map
# options disableMap is true to disable map
# options locationFinder overrides default LocationFinder
# options T is the localizer to use
# Location is stored format { latitude, longitude, accuracy, altitude?, altitudeAccuracy? }
module.exports = class LocationView extends Backbone.View
  constructor: (options) ->
    super()
    @loc = options.loc
    @readonly = options.readonly
    @hideMap = options.hideMap
    @disableMap = options.disableMap
    @settingLocation = false
    @locationFinder = options.locationFinder || new LocationFinder()
    @orientationFinder = options.orientationFinder || new OrientationFinder()
    #@orientationFinder.startWatch() TODO reenable some day

    @T = options.T or ezlocalize.defaultT

    # Listen to location events
    @listenTo(@locationFinder, 'found', @locationFound)
    @listenTo(@locationFinder, 'error', @locationError)

    # Listen to device orientation events TODO reenable some day
    #@listenTo(@orientationFinder, 'orientationChange', @compassChange)

    # Start tracking location if set
    if @loc
      @locationFinder.startWatch()

    # Do not re-render template as it would destroy input fields
    @$el.html require('./templates/LocationView.hbs')({}, helpers: { T: @T })

    @render()

  events:
    'click #location_map' : 'mapClicked'
    'click #location_set' : 'setLocation'
    'click #location_clear' : 'clearLocation'
    'click #location_edit' : 'editLocation'
    'click #save_button' : 'saveEditLocation'
    'click #cancel_button' : 'cancelEditLocation'

  remove: ->
    @settingLocation = false
    @locationFinder.stopWatch()
    @orientationFinder.stopWatch()
    super()

  render: ->
    # Set location string
    if @errorFindingLocation
      @$("#location_relative").text(@T("GPS not available"))
    else if not @loc and not @settingLocation 
      @$("#location_relative").text(@T("Unspecified location"))
    else if @settingLocation
      @$("#location_relative").text(@T("Setting location..."))
    else if @loc and @currentPos
      # Calculate relative location
      relativeLocation = @getRelativeLocation @currentPos.coords, @loc
      @$("#location_relative").text(relativeLocation.distance + " " + relativeLocation.cardinalDirection )
    else 
      @$("#location_relative").text("")

    if @loc and not @settingLocation
      @$("#location_absolute").text(@T("Latitude") + ": #{this.loc.latitude.toFixed(6)}, " + @T("Longitude") + ": #{this.loc.longitude.toFixed(6)}")
    else
      @$("#location_absolute").text("")

    # Hide map if hidden
    if @hideMap
      @$("#location_map").hide()
      
    # Disable map if location not set
    @$("#location_map").attr("disabled", not @loc or @disableMap)

    # Disable clear if location not set or readonly
    @$("#location_clear").attr("disabled", not @loc || @readonly)

    # Disable set if setting location or readonly
    @$("#location_set").attr("disabled", @settingLocation || @readonly)

    # Disable edit if readonly
    @$("#location_edit").attr("disabled", @readonly)

    if @loc or @settingLocation
      accuracy = @getAccuracyStrength @currentPos
      @$("#gps_strength").attr("class", accuracy.class)
      @$("#gps_strength").text accuracy.text
    else
      @$("#gps_strength").text ""

  displayNotification: (message, className, shouldFadeOut) ->
    # Cancel the fadeout if timer on any preexisting alerts
    timeout = timeout || 0
    clearTimeout timeout

    $notification = @$("#notification")
    $notification.attr("class", "alert")

    # If it is a temporary notification setup a fadeout timer
    $notification.addClass(className).html(message).fadeIn 200, ->
      if shouldFadeOut
        timeout = setTimeout( ->
            $notification.fadeOut 500
            return
        , 3000)

  clearNotification: () ->
    $notification = @$("#notification").empty().removeClass("alert")

  clearLocation: ->
    @loc = null
    @trigger('locationset', null)
    @render()
 
  # Takes out relevant coords from html5 position
  convertPosToLoc: (pos) ->
    if not pos?
      return pos
    return _.pick(pos.coords, "latitude", "longitude", "accuracy", "altitude", "altitudeAccuracy")

  setLocation: ->
    console.log "setting location"
    @settingLocation = true
    @errorFindingLocation = false

    cancelButtonHtml = ' <button id="cancel_set" type="button" class="btn btn-sm btn-default" style="margin-left:5px">' + @T('Cancel') + '</button>'

    cancelSetting = =>
      @settingLocation = false
      @clearNotification()
      @render()

    locationSuccess = (pos) =>
      # If no longer setting location, ignore
      if not @settingLocation
        return

      # Function to use the position last returned
      usePosition = => 
        # Extract location
        @loc = @convertPosToLoc(pos)

        # Set current position
        @currentPos = pos
        @displayNotification @T("Location Set Successfully"), "alert-success", true
        @settingLocation = false
        @errorFindingLocation = false
        @trigger('locationset', @loc)
        @render()  
        return 

      accuracy = @getAccuracyStrength(pos)

      # The first time is usually the 'lowAccuracy' event firing, 
      if accuracy.strength == "fair"
        # Ask the user if they want to use the low accuracy position
        useAnywayButtonHtml = ' <button id="use_anyway" type="button" class="btn btn-sm btn-default" style="margin-left:5px">' + @T("Use Anyway") + '</button>'
        @displayNotification @T('Low GPS Accuracy') + useAnywayButtonHtml + cancelButtonHtml, "alert-warning"
        @$("#use_anyway").on("click", usePosition)
        @$("#cancel_set").on("click", cancelSetting)
      else if accuracy.strength == "strong"
        usePosition()
      else if accuracy.strength == "weak"
        # The accuracy is undesirable
        @displayNotification @T("Very Low GPS Accuracy. Waiting for better signal...") + cancelButtonHtml, "alert-danger", false
        @$("#cancel_set").on("click", cancelSetting)
        @render()

    locationError = (err) =>
      # If no longer setting location, ignore
      if not @settingLocation
        return

      @displayNotification "Unable to set Location", "alert-danger", true
      @settingLocation = false
      @errorFindingLocation = true
      @render()

    @displayNotification @T("Setting Location...") + cancelButtonHtml, "alert-warning"
    @$("#cancel_set").on("click", cancelSetting)

    @locationFinder.getLocation locationSuccess, locationError
    @render()

  compassChange: (values) =>
    if not @currentPos or not @loc
      return

    accuracy = @getAccuracyStrength @currentPos
    $sourcePointer = @$("#source_pointer .glyphicon")

    # Calculate relative location
    relativeLocation = getRelativeLocation @currentPos.coords, @loc

    # Only display the compass if we can accurately calculate relative direction
    if relativeLocation and accuracy.strength != 'weak' and @orientationFinder.active
      $sourcePointer.show()
      arrowRotation = relativeLocation.bearing + values.normalized.alpha
      prefixes = ["", "Webkit", "Moz", "ms", "O"]
      elem = $sourcePointer[0]
      prefixes.forEach (prefix) ->
          elem.style[prefix + "Transform"] = "rotate(" + arrowRotation + "deg)"
    else 
      $sourcePointer.hide()

  locationFound: (pos) =>
    @currentPos = pos
    @errorFindingLocation = false
    @render()

  locationError: =>
    @errorFindingLocation = true
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
    @trigger('locationset', @loc)

    # Hide editing controls and re-render
    @$("#location_edit_controls").slideUp()    
    @render()

  cancelEditLocation: ->
    @$("#location_edit_controls").slideUp() 

  getAccuracyStrength: (pos) =>
    if not (pos and pos.coords and pos.coords.accuracy?)
      return { color: "red", class: "text-danger", strength: "weak", text: "Waiting for GPS..." }

    # Calculate age
    age = new Date().getTime() - pos.timestamp

    # If inaccurate or old (> 30 sec)
    if pos.coords.accuracy > 100 or age > 30*1000
      return { color: "red", class: "text-danger", strength: "weak", text: "Waiting for GPS..." }
    else if pos.coords.accuracy > 25
      return { color: "yellow", class: "text-warning", strength: "fair", text: "Low accuracy GPS ±" + pos.coords.accuracy.toFixed(0) + "m"}
    else 
      return { color: "green", class: "text-success", strength: "strong", text: "GPS Acquired" }

  getRelativeLocation: (from, to) =>
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
    compassStrs = [@T("N"), @T("NE"), @T("E"), @T("SE"), @T("S"), @T("SW"), @T("W"), @T("NW")]

    if dist > 1000
      distance = (dist / 1000).toFixed(1) + " " + @T("km")
    else
      distance = (dist).toFixed(0) + " " + @T("m")

    return {
      distance: distance,
      cardinalDirection: compassStrs[compassDir],
      bearing: angle
    }
