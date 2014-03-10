Question = require './Question'

# Requires context (ctx) to have displayImage function
# which takes { id: <image id>, remove: <function called when image deleted> } as parameter

module.exports = class ImageQuestion extends Question
  events:
    "click #add": "addClick"
    "click .image": "thumbnailClick"

  renderAnswer: (answerEl) ->
    # Render image using image manager
    if not @ctx.imageManager
      answerEl.html '''<div class="text-error">Images not available</div>'''
    else
      image = @getAnswerValue()

      # Determine if can add images
      notSupported = false
      if @options.readonly
        canAdd = false
      else if @ctx.imageAcquirer
        canAdd = not image? # Don't allow adding more than one
      else
        canAdd = false
        notSupported = not image

      # Determine if we need to tell user that no image is available
      noImage = not canAdd and not image and not notSupported

      # Render images
      answerEl.html require('./templates/ImageQuestion.hbs')(image: image, canAdd: canAdd, noImage: noImage, notSupported: notSupported)

      # Set source
      if image
        @setThumbnailUrl(image.id)
    
  setThumbnailUrl: (id) ->
    success = (url) =>
      @$("#" + id).attr("src", url)
    @ctx.imageManager.getImageThumbnailUrl id, success, @error

  addClick: ->
    # Call imageAcquirer
    @ctx.imageAcquirer.acquire (id) =>
      # Add to model
      @setAnswerValue({ id: id })
    , @ctx.error

  thumbnailClick: (ev) ->
    id = ev.currentTarget.id

    # Create onRemove callback
    remove = () => 
      @setAnswerValue(null)

    if @ctx.displayImage?
      @ctx.displayImage({ id: id, remove: remove })