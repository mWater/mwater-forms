Question = require './Question'
LocationView = require './LocationView'

# Stores data in value: { latitude, longitude, accuracy, altitude?, altitudeAccuracy? }

module.exports = class LocationQuestion extends Question
  # TODO could be faster to render once and then update location finder
  updateAnswer: (answerEl) ->
    # Remove old location view
    if @locationView?
      @locationView.remove()

    # Create location view
    loc = @getAnswerValue()
    @locationView = new LocationView({ 
      loc: loc
      readonly: @options.readonly
      disableMap: not @ctx.displayMap?
      locationFinder: @ctx.locationFinder
      currentPositionFinder: @ctx.currentPositionFinder
      T: @T
    })

    @locationView.on 'map', (loc) =>
      if @ctx.displayMap?
        @ctx.displayMap(loc)

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