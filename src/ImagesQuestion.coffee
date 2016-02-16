Question = require './Question'
_ = require 'lodash'
React = require 'react'
H = React.DOM
ModalPopupComponent = require('react-library/lib/ModalPopupComponent')
ImagePopupComponent = require './ImagePopupComponent'

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
    error = =>
      # Display this image on error
      elem.attr("src", "img/no-image-icon.jpg")
    @ctx.imageManager.getImageUrl id, success, error

  addClick: ->
    # Check consent
    if @options.consentPrompt
      if not confirm(@options.consentPrompt)
        return

    # Call imageAcquirer
    @ctx.imageAcquirer.acquire (id) =>
      # Add to model
      images = @getAnswerValue() || []

      # Make copy to force a model change
      images = images.slice(0)
      images.push { id: id }

      # Set cover if first
      if images.length == 1
        images[0].cover = true
        
      @setAnswerValue(images)
    , @ctx.error

  thumbnailClick: (ev) ->
    id = ev.currentTarget.id

    ModalPopupComponent.show((onClose) =>
      # Create remove and onSetCover callbacks if not readonly
      onRemove = null
      onSetCover = null
      if not @options.readonly
        onRemove = () => 
          images = @getAnswerValue() || []
          images = _.reject images, (img) =>
            img.id == id
          onClose()
          @setAnswerValue(images)

        # Only onSetCover if not already
        cover = _.findWhere(@getAnswerValue(), { id: id }).cover
        if not cover
          onSetCover = () =>
            images = @getAnswerValue() || []

            # Make copy to force a model change
            images = _.map(images, _.clone)

            for image in images
              if image.cover?
                delete image.cover
              if image.id == id
                image.cover = true
            onClose()
            @setAnswerValue(images)

      React.createElement(ImagePopupComponent, {
        imageManager: @ctx.imageManager
        id: id
        onClose: onClose
        onRemove: onRemove
        onSetCover: onSetCover
      })
    )
