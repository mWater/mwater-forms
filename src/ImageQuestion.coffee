Question = require './Question'

# Requires context (ctx) to have displayImage function
# which takes { id: <image id>, remove: <function called when image deleted> } as parameter

module.exports = class ImageQuestion extends Question
  events:
    "click #add": "addClick"
    "click .image": "thumbnailClick"

  updateAnswer: (answerEl) ->
    # Render image using image manager
    if not @ctx.imageManager
      answerEl.html '''<div class="text-warning">''' + @T("Images not available on this platform") + '''</div>'''
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
      data = {
        image: image
        canAdd: canAdd
        noImage: noImage
        notSupported: notSupported
      }
      answerEl.html require('./templates/ImageQuestion.hbs')(data, helpers: { T: @T })

      # Set source
      if image
        @setThumbnailUrl(answerEl.find("#" + image.id), image.id)
    
  setThumbnailUrl: (elem, id) ->
    success = (url) =>
      elem.attr("src", url)
    error = =>
      # Display this image on error
      elem.attr("src", "img/no-image-icon.jpg")
    @ctx.imageManager.getImageThumbnailUrl id, success, error

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