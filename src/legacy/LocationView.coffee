Backbone = require 'backbone'
Backbone.$ = require 'jquery'
LocationFinder = require '../LocationFinder'
_ = require 'lodash'
ezlocalize = require 'ez-localize'
CurrentPositionFinder = require './CurrentPositionFinder'
utils = require '../utils'

# Shows the relative location of a point and allows setting it
# Fires events locationset, map, both with 
# options loc is initial location. (latitude, longitude, accuracy, etc.)
# options readonly makes it non-editable
# options hideMap is true to hide map
# options disableMap is true to disable map
# options locationFinder overrides default LocationFinder
# options currentPositionFinder overrides default CurrentPositionFinder
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
    @currentPositionFinder = options.currentPositionFinder || new CurrentPositionFinder(locationFinder: @locationFinder)

    @T = options.T or ezlocalize.defaultT

    # Listen to location events
    @listenTo(@locationFinder, 'found', @locationFound)
    @listenTo(@locationFinder, 'error', @locationError)

    # Listen to current position events (for setting location)
    @listenTo(@currentPositionFinder, 'found', @currentPositionFound)
    @listenTo(@currentPositionFinder, 'error', @currentPositionError)
    @listenTo(@currentPositionFinder, 'status', @render)

    # Start tracking location so that we get an accurate location quickly
    @locationFinder.startWatch()

    # Do not re-render template as it would destroy input fields
    @$el.html require('./templates/LocationView.hbs')({}, helpers: { T: @T })

    @render()

  events:
    'click #location_map' : 'mapClicked'
    'click #location_set' : 'setLocation'
    'click #location_clear' : 'clearLocation'
    'click #location_edit' : 'editLocation'
    'click #save_edit_button' : 'saveEditLocation'
    'click #cancel_edit_button' : 'cancelEditLocation'
    'click #cancel_set': "cancelSet"
    'click #use_anyway': "useAnyway"

  remove: ->
    @settingLocation = false
    @locationFinder.stopWatch()
    @currentPositionFinder.stop()
    super()

  render: ->
    # Set location string
    if @errorFindingLocation
      @$("#location_relative").text(@T("GPS not available"))
    else if not @loc and not @currentPositionFinder.running
      @$("#location_relative").text(@T("Unspecified location"))
    else if @currentPositionFinder.running
      @$("#location_relative").text(@T("Setting location..."))
    else if @loc and @currentPos
      # Calculate relative location
      relativeLocation = utils.getRelativeLocation(@currentPos.coords, @loc)
      @$("#location_relative").text(utils.formatRelativeLocation(relativeLocation, @T))
    else
      @$("#location_relative").text("")

    if @loc and @loc.latitude? and @loc.longitude? and not @currentPositionFinder.running
      @$("#location_absolute").text(@T("Latitude") + ": #{@loc.latitude.toFixed(6)}, " + @T("Longitude") + ": #{@loc.longitude.toFixed(6)}")
    else
      @$("#location_absolute").text("")

    # Hide map if hidden
    if @hideMap
      @$("#location_map").hide()

    # Disable map if location not set
    @$("#location_map").attr("disabled", @disableMap || @readonly)

    # Disable clear if location not set or readonly
    @$("#location_clear").attr("disabled", not @loc || @readonly)

    # Disable set if setting location or readonly
    @$("#location_set").attr("disabled", @settingLocation || @readonly)

    # Disable edit if readonly
    @$("#location_edit").attr("disabled", @readonly)

    if @loc and not @currentPositionFinder.running
      strength = utils.formatGPSStrength(@currentPos, @T)
      @$("#gps_strength").attr("class", strength.class)
      @$("#gps_strength").text strength.text
    else
      @$("#gps_strength").text ""

    # Display set location controls
    if @currentPositionFinder.running
      @$("#location_setter").show()
      @$("#use_anyway").toggle(@currentPositionFinder.useable and @currentPositionFinder.strength != "good")

      switch @currentPositionFinder.strength
        when "none"
          msg = @T('Waiting for GPS...')
        when "poor"
          msg = @T('Very weak GPS signal (±{0}m)...', @currentPositionFinder.pos.coords.accuracy.toFixed(0))
        when "fair"
          msg = @T('Weak GPS signal (±{0}m)...', @currentPositionFinder.pos.coords.accuracy.toFixed(0))
        when "good"
          msg = @T('Setting location...')
      @$("#location_setter_msg").text(msg)
    else
      @$("#location_setter").hide()

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
    @currentPositionFinder.start()

  currentPositionFound: (pos) ->
    # Extract location
    @loc = @convertPosToLoc(pos)

    # Set current position
    @currentPos = pos
    @displayNotification @T("Location Set Successfully"), "alert-success", true
    @trigger('locationset', @loc)
    @render()

  currentPositionError: (err) ->
    @displayNotification @T("Cannot set location"), "alert-danger", true

  cancelSet: ->
    @currentPositionFinder.stop()
    @render()

  useAnyway: ->
    if @currentPositionFinder.running
      if @currentPositionFinder.strength == "poor"
        if confirm(@T("Use location with very low accuracy (±{0}m)?", @currentPositionFinder.pos.coords.accuracy.toFixed(0)))
          @currentPositionFinder.stop()
          @currentPositionFound(@currentPositionFinder.pos)
      else
        @currentPositionFinder.stop()
        @currentPositionFound(@currentPositionFinder.pos)

  locationFound: (pos) =>
    @currentPos = pos
    @errorFindingLocation = false
    @render()

  locationError: =>
    @errorFindingLocation = true
    @render()

  mapClicked: =>
    # If we use the map, then stop the currentPositionFinder (or else it might overwrite the value)
    if @currentPositionFinder.running
      @currentPositionFinder.stop()
    @trigger('map', @loc)

  editLocation: ->
    # Set values
    @$("#latitude").val(if @loc then @loc.latitude else "")
    @$("#longitude").val(if @loc then @loc.longitude else "")
    @$("#location_edit_controls").slideDown()

  saveEditLocation: ->
    latitude = parseFloat(@$("#latitude").val())
    longitude = parseFloat(@$("#longitude").val())

    if isNaN(latitude) or latitude < -85 or latitude > 85
      alert("Invalid latitude. Must be a value between -85 and 85.")
      return
    if isNaN(longitude) or longitude < -180 or longitude > 180
      alert("Invalid longitude. Must be a value between -180 and 180.")
      return

    # If we save a value, then stop the currentPositionFinder (or else it might overwrite the value)
    if @currentPositionFinder.running
      @currentPositionFinder.stop()

    # Set location
    @loc = {
      latitude: latitude
      longitude: longitude
      accuracy: 0  # Perfectly accurate when entered
    }
    @trigger('locationset', @loc)

    # Hide editing controls and re-render
    @$("#location_edit_controls").slideUp()
    @render()

  cancelEditLocation: ->
    @$("#location_edit_controls").slideUp() 
