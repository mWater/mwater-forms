Question = require './Question'
LocationView = require './LocationView'

# Stores data in value: { latitude, longitude, accuracy, altitude?, altitudeAccuracy? }

module.exports = class LocationQuestion extends Question
  renderAnswer: (answerEl) ->
    # Remove old location view
    if @locationView?
      @locationView.remove()

    # Create location view
    loc = @getAnswerValue()
    @locationView = new LocationView(loc: loc, readonly: @options.readonly, hideMap: true, locationFinder: @ctx.locationFinder)
    @locationView.on "locationset", (loc) =>
      if loc?
        @setAnswerValue(loc)
      else
        @setAnswerValue(null)

    answerEl.append(@locationView.el)

  remove: ->
    # Remove location view
    @locationView.remove()

    super()