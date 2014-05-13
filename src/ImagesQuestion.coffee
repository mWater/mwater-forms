Question = require './Question'
_ = require 'underscore'

# Requires context (ctx) to have displayImage function
# which takes { id: <image id>, remove: <function called when image deleted> } as parameter

module.exports = class ImagesQuestion extends Question
  events:
    "click #add": "addClick"
    "click .image": "thumbnailClick"

  updateAnswer: (answerEl) ->
    # Render image using image manager
    if not @ctx.imageManager
      answerEl.html '''<div class="text-warning">''' + @T("Images not available on this platform") + '''</div>'''
    else
      images = @getAnswerValue()

      # Determine if can add images
      notSupported = false
      if @options.readonly
        canAdd = false
      else if @ctx.imageAcquirer
        canAdd = true
      else
        canAdd = false
        notSupported = not images or images.length == 0

      # Determine if we need to tell user that no image are available
      noImage = not canAdd and (not images or images.length == 0) and not notSupported

      # Render images
      data = {
        images: images
        canAdd: canAdd
        noImage: noImage
        notSupported: notSupported
      }
      answerEl.html require('./templates/ImagesQuestion.hbs')(data, helpers: { T: @T })

      # Set sources
      if images
        for image in images
          @setThumbnailUrl(answerEl.find("#" + image.id), image.id)
    
  setThumbnailUrl: (elem, id) ->
    success = (url) =>
      elem.attr("src", url)
    @ctx.imageManager.getImageThumbnailUrl id, success, @error

  addClick: ->
    # Call imageAcquirer
    @ctx.imageAcquirer.acquire (id) =>
      # Add to model
      images = @getAnswerValue() || []

      # Make copy to force a model change
      images = images.slice(0)
      images.push { id: id }
      @setAnswerValue(images)
    , @ctx.error

  thumbnailClick: (ev) ->
    id = ev.currentTarget.id

    # Create onRemove callback if not readonly
    if not @options.readonly
      remove = () => 
        images = @getAnswerValue() || []
        images = _.reject images, (img) =>
          img.id == id
        @setAnswerValue(images)
    else
      remove = null

    if @ctx.displayImage?
      @ctx.displayImage({ id: id, remove: remove })