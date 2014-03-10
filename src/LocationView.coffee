Backbone = require 'backbone'
LocationFinder = require './LocationFinder'
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
    @settingLocation = false
    @locationFinder = options.locationFinder || new LocationFinder()

    # Listen to location events
    @listenTo(@locationFinder, 'found', @locationFound)
    @listenTo(@locationFinder, 'error', @locationError)

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
    super()

  render: ->
    # Set location string
    if @errorFindingLocation
      @$("#location_relative").text("Cannot find location")
    else if not @loc and not @settingLocation 
      @$("#location_relative").text("Unspecified location")
    else if @settingLocation
      @$("#location_relative").text("Setting location...")
    else if not @currentLoc
      @$("#location_relative").text("Waiting for GPS...")
    else
      @$("#location_relative").text(getRelativeLocation(@currentLoc, @loc))

    if @loc and not @settingLocation
      @$("#location_absolute").text("#{this.loc.latitude.toFixed(6)}, #{this.loc.longitude.toFixed(6)}")
    else
      @$("#location_absolute").text("")

    # Hide map if hidden
    if @hideMap
      @$("#location_map").hide()
      
    # Disable map if location not set
    @$("#location_map").attr("disabled", not @loc)

    # Disable clear if location not set or readonly
    @$("#location_clear").attr("disabled", not @loc || @readonly)

    # Disable set if setting or readonly
    @$("#location_set").attr("disabled", @settingLocation || @readonly)

    # Disable edit if readonly
    @$("#location_edit").attr("disabled", @readonly)

  clearLocation: ->
    @trigger('locationset', null)

  # Takes out relevant coords from html5 position
  convertPosToLoc: (pos) ->
    if not pos?
      return pos
    return _.pick(pos.coords, "latitude", "longitude", "accuracy", "altitude", "altitudeAccuracy")

  setLocation: ->
    @settingLocation = true
    @errorFindingLocation = false

    locationSuccess = (pos) =>
      @settingLocation = false
      @errorFindingLocation = false

      # Extract location
      @loc = @convertPosToLoc(pos)
      
      # Set location
      @currentLoc = @convertPosToLoc(pos)
      @trigger('locationset', @loc)
      @render()

    locationError = (err) =>
      @settingLocation = false
      @errorFindingLocation = true
      @render()

    @locationFinder.getLocation locationSuccess, locationError
    @render()

  locationFound: (pos) =>
    @currentLoc = @convertPosToLoc(pos)
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
    @trigger('locationset', @loc)

    # Hide editing controls and re-render
    @$("#location_edit_controls").slideUp()    
    @render()

  cancelEditLocation: ->
    @$("#location_edit_controls").slideUp()    

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
    (dist / 1000).toFixed(1) + "km " + compassStrs[compassDir]
  else
    (dist).toFixed(0) + "m " + compassStrs[compassDir]