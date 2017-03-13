React = require 'react'
H = React.DOM
ImageThumbnailComponent = require '../ImageThumbnailComponent'
ImagePopupComponent = require '../ImagePopupComponent'

# Edit an image 
module.exports = class ImageAnswerComponent extends React.Component
  @contextTypes:
    imageManager: React.PropTypes.object.isRequired
    imageAcquirer: React.PropTypes.object
    T: React.PropTypes.func.isRequired  # Localizer to use

  @propTypes:
    image: React.PropTypes.object            # e.g. { id: someid, caption: caption }
    onImageChange: React.PropTypes.func      # Called when image changed
    consentPrompt: React.PropTypes.string    # Question to prompt for consent

  constructor: ->
    super

    @state = { modal: null }

  focus: () ->
    # Nothing to focus
    null

  handleClickImage: =>
    modal = React.createElement ImagePopupComponent, 
      imageManager: @context.imageManager
      id: @props.image.id
      T: @context.T
      onRemove: => 
        @setState(modal: null)
        @props.onImageChange(null)
      onClose: =>
        @setState(modal: null)
      onRotate: =>
        @setState(modal: null)
        image = _.extend({}, @props.image, rotation: ((@props.image.rotation or 0) + 90) % 360 )
        @props.onImageChange(image)

    @setState(modal: modal)

  handleAdd: =>
    # Check consent
    if @props.consentPrompt
      if not confirm(@props.consentPrompt)
        return

    # Call imageAcquirer
    @context.imageAcquirer.acquire (id, rotation = 0) =>
      # Add to model
      @props.onImageChange({ id: id,rotation: rotation })
    , (err) => throw err

  render: ->
    H.div null,
      @state.modal

      if @props.image
        React.createElement RotationAwareImageComponent, 
          key: @props.image.id
          imageManager: @context.imageManager
          image: @props.image
          thumbnail: true
          onClick: @handleClickImage
      else if @props.onImageChange and @context.imageAcquirer
        H.img 
          src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAFzAgMAAABtAbdzAAAACVBMVEUAAQBsbmz7//tn1+0/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3woHEjIHlG2SjgAAAxhJREFUeNrt3Mt1pjAMBWA2U8J0NnjhEtyPS/DCrjKbnDn/AUt+cK0AuSxD4APkBCwktt1g2YgQIUKEiCXyb9v+EiFChAgRIkSIECFC5JHIdlz+ECFC5L0I/0ESIUKECBEivxYJ5WNJRIgQeT5ynFAQIfISpICXWEE8GskVpMCXM+LwSDwhHo/kFyOhrIw8ESJEiBAhQoQIkXsiqX8KMI2MzGZmkf+b+XXIx7zGr0KiOInFIYfp8BrkMG/2K5DTvH4FckoBeDxSSVDgkUo2w6ORaqYFjVQTMx6L5CrisIiQl8IiQiLLI5EsIA6JiFk8JCIm/jwOySLicIiS88QhUUYCDFGysR6F5MP1yX1BGUPS6cC7gjKGxPNx9wRlDKkcdu4IyhCSa0ed2kEZQur7awdlDgnVn2KQWL8wzcgPIUKIUyvyU4gwHhwCEXeGRJJ07VMj8iNIlPaVG5GfQJy4FwQiD6KoD68JRB4SACQrY0gfXgNIUg5XH14gJKKQqPxCUjceR7R4XUfU4KrDaxjx2mleRnIH4kBI0IYeClHXXkZSB7JjkMaN6SoS7RCvrw5rkQRBukLm1yIZiJTnI7lrzuYeg/jGU9kTkNSF7I9Bms/8RAyR2IcEAFJ+GMlEiBAhQmQ1svh+wnv8XZH3PKYuRt420zJBWrPfi4jlPD78KJKeg9wh34VBunKQGMQkm7oY6clwoxCTXP1axPL9yT5xmjd9pxVG1828AnQKUlDIPhqvmdeyyrtfh0OCeLUAiFKlsONelVtWFsg1EggkNao9IIUY2bJu5RjgiETKrtcSYcp8ol4VFSCIbX3Xykq1rNbcgZCya9WDoMK+z6pRd9weVqKYjhWvfRWwF8pG+2t5b1gAa1PKa1KUbFJeXWau1j1L3k2K903aEGwaKkxaQ0yaXGzadUwaj2qnEuBItmgGs2lrM2nQs2k1NGmatGn/tGlktWnJ/f5zGTxtNnwTIULkyQi/RNb3SLDuE3QmyH5GTL7YZ/LtwaULESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiNwS+QJpMQICAeI7BAAAAABJRU5ErkJggg=="
          className: "img-rounded"
          onClick: @handleAdd
          style: { maxHeight: 100 }
      else 
        H.div className: "text-muted", @context.T("No images present")