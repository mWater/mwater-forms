Question = require './Question'
LocationView = require './LocationView'

module.exports = class GPSQuestion extends Question
  renderAnswer: (answerEl) ->
    # Remove old location view
    if @locationView?
      @locationView.remove()

    # Create location view
    latlng = @model.get(@id)
    if latlng? and latlng.lat?
      loc = {
        type: "Point"
        coordinates: [latlng.lng, latlng.lat]
      }
    else
      loc = null
    @locationView = new LocationView(loc: loc, readonly: @options.readonly, hideMap: true)
    @locationView.on "locationset", (loc) =>
      if loc?
        @model.set(@id, { lat: loc.coordinates[1], lng: loc.coordinates[0]})
      else
        @model.unset(@id)

    answerEl.append(@locationView.el)

  remove: ->
    # Remove location view
    @locationView.remove()

    super()