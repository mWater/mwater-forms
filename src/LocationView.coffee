Backbone = require 'backbone'
LocationFinder = require './LocationFinder'
GeoJSON = require './GeoJSON'

# Shows the relative location of a point and allows setting it
# Fires events locationset, map, both with 
# options readonly makes it non-editable
# options hideMap is true to hide map
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
    @$el.html templates['LocationView']()

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
      @$("#location_relative").text(GeoJSON.getRelativeLocation(@currentLoc, @loc))

    if @loc and not @settingLocation
      @$("#location_absolute").text("#{this.loc.coordinates[1].toFixed(6)}, #{this.loc.coordinates[0].toFixed(6)}")
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

  setLocation: ->
    @settingLocation = true
    @errorFindingLocation = false

    locationSuccess = (pos) =>
      @settingLocation = false
      @errorFindingLocation = false

      # Set location
      @loc = GeoJSON.posToPoint(pos)
      @currentLoc = GeoJSON.posToPoint(pos)
      @trigger('locationset', @loc)
      @render()

    locationError = (err) =>
      @settingLocation = false
      @errorFindingLocation = true
      @render()

    @locationFinder.getLocation locationSuccess, locationError
    @render()

  locationFound: (pos) =>
    @currentLoc = GeoJSON.posToPoint(pos)
    @render()

  locationError: =>
    @render()

  mapClicked: =>
    @trigger('map', @loc)

  editLocation: ->
    # Set values
    @$("#latitude").val(if @loc then @loc.coordinates[1] else "")
    @$("#longitude").val(if @loc then @loc.coordinates[0] else "")
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
      type: 'Point'
      coordinates: [parseFloat(@$("#longitude").val()), parseFloat(@$("#latitude").val())]
    }
    @trigger('locationset', @loc)

    # Hide editing controls and re-render
    @$("#location_edit_controls").slideUp()    
    @render()

  cancelEditLocation: ->
    @$("#location_edit_controls").slideUp()    

module.exports = LocationView