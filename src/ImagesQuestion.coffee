Question = require './Question'
_ = require 'underscore'

# Requires context (ctx) to have displayImage function
# which takes { id: <image id>, remove: <function called when image deleted> } as parameter

module.exports = class ImagesQuestion extends Question
  events:
    "click #add": "addClick"
    "click .image": "thumbnailClick"

  renderAnswer: (answerEl) ->
    # Render image using image manager
    if not @ctx.imageManager
      answerEl.html '''<div class="text-error">Images not available</div>'''
    else
      images = @model.get(@id)

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
      answerEl.html templates['forms/ImagesQuestion'](images: images, canAdd: canAdd, noImage: noImage, notSupported: notSupported)

      # Set sources
      if images
        for image in images
          @setThumbnailUrl(image.id)
    
  setThumbnailUrl: (id) ->
    success = (url) =>
      @$("#" + id).attr("src", url)
    @ctx.imageManager.getImageThumbnailUrl id, success, @error

  addClick: ->
    # Call imageAcquirer
    @ctx.imageAcquirer.acquire (id) =>
      # Add to model
      images = @model.get(@id) || []

      # Make copy to force a model change
      images = images.slice(0)
      images.push { id: id }
      @model.set(@id, images)   
    , @ctx.error

  thumbnailClick: (ev) ->
    id = ev.currentTarget.id

    # Create onRemove callback if not readonly
    if not @options.readonly
      onRemove = () => 
        images = @model.get(@id) || []
        images = _.reject images, (img) =>
          img.id == id
        @model.set(@id, images)
    else
      onRemove = null

    if @ctx.displayImage?
      @ctx.displayImage({ id: id, onRemove: onRemove })