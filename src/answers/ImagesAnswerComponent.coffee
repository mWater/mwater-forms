PropTypes = require('prop-types')
_ = require 'lodash'
React = require 'react'
H = React.DOM
RotationAwareImageComponent = require '../RotationAwareImageComponent'
ImagePopupComponent = require '../ImagePopupComponent'

# Edit an image 
module.exports = class ImagesAnswerComponent extends React.Component
  @contextTypes:
    imageManager: PropTypes.object.isRequired
    imageAcquirer: PropTypes.object
    T: PropTypes.func.isRequired  # Localizer to use

  @propTypes:
    imagelist: PropTypes.array         # array of { id: someid, caption: caption, cover: true/false }
    onImagelistChange: PropTypes.func      # Called when image list changed
    consentPrompt: PropTypes.string    # Question to prompt for consent

  constructor: ->
    super

    @state = { modalImageId: null } # Image id of modal. null if not open

  focus: () ->
    # Nothing to focus
    null

  handleAdd: =>
    # Check consent
    if @props.consentPrompt
      if not confirm(@props.consentPrompt)
        return

    # Call imageAcquirer
    @context.imageAcquirer.acquire (id, rotation = 0) =>
      # Add to image list
      imagelist = @props.imagelist or []
      imagelist = imagelist.slice()
      imagelist.push({ id: id, cover: imagelist.length == 0 , rotation: rotation})
      @props.onImagelistChange(imagelist)
    , (err) => alert(err)

  handleClickImage: (id) =>
    @setState(modalImageId: id)

  renderModal: ->
    if not @state.modalImageId
      return null
      
    id = @state.modalImageId

    if @props.onImagelistChange
      onRemove = () => 
        @setState(modalImageId: null)
    
        # Remove from list
        imagelist = _.filter(@props.imagelist or [], (image) -> image.id != id)
        @props.onImagelistChange(imagelist)

      # TODO: SurveyorPro: only onSetCover if not already cover
      onSetCover = () =>
        @setState(modalImageId: null)

        # Remove from list
        imagelist = _.map(@props.imagelist or [], (image) -> _.extend({}, image, cover: image.id == id))
        @props.onImagelistChange(imagelist)

      onRotate = () =>
        imagelist = _.map(@props.imagelist or [], (image) -> 
          if image.id == id
            return _.extend({}, image, rotation: ((image.rotation or 0) + 90) % 360 )
          else
            return image
        )
        @props.onImagelistChange(imagelist)

    return React.createElement ImagePopupComponent, 
      imageManager: @context.imageManager
      image: _.find(@props.imagelist, { id: id })
      T: @context.T
      onRemove: onRemove
      onSetCover: onSetCover
      onRotate: onRotate
      onClose: =>
        @setState(modalImageId: null)

  render: ->
    H.div null,
      @renderModal()

      _.map @props.imagelist, (image) =>
        React.createElement RotationAwareImageComponent, 
          key: image.id
          imageManager: @context.imageManager
          image: image
          thumbnail: true
          onClick: @handleClickImage.bind(null, image.id)

      if @props.onImagelistChange and @context.imageAcquirer # If can add
        H.img 
          src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAFzAgMAAABtAbdzAAAACVBMVEUAAQBsbmz7//tn1+0/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3woHEjIHlG2SjgAAAxhJREFUeNrt3Mt1pjAMBWA2U8J0NnjhEtyPS/DCrjKbnDn/AUt+cK0AuSxD4APkBCwktt1g2YgQIUKEiCXyb9v+EiFChAgRIkSIECFC5JHIdlz+ECFC5L0I/0ESIUKECBEivxYJ5WNJRIgQeT5ynFAQIfISpICXWEE8GskVpMCXM+LwSDwhHo/kFyOhrIw8ESJEiBAhQoQIkXsiqX8KMI2MzGZmkf+b+XXIx7zGr0KiOInFIYfp8BrkMG/2K5DTvH4FckoBeDxSSVDgkUo2w6ORaqYFjVQTMx6L5CrisIiQl8IiQiLLI5EsIA6JiFk8JCIm/jwOySLicIiS88QhUUYCDFGysR6F5MP1yX1BGUPS6cC7gjKGxPNx9wRlDKkcdu4IyhCSa0ed2kEZQur7awdlDgnVn2KQWL8wzcgPIUKIUyvyU4gwHhwCEXeGRJJ07VMj8iNIlPaVG5GfQJy4FwQiD6KoD68JRB4SACQrY0gfXgNIUg5XH14gJKKQqPxCUjceR7R4XUfU4KrDaxjx2mleRnIH4kBI0IYeClHXXkZSB7JjkMaN6SoS7RCvrw5rkQRBukLm1yIZiJTnI7lrzuYeg/jGU9kTkNSF7I9Bms/8RAyR2IcEAFJ+GMlEiBAhQmQ1svh+wnv8XZH3PKYuRt420zJBWrPfi4jlPD78KJKeg9wh34VBunKQGMQkm7oY6clwoxCTXP1axPL9yT5xmjd9pxVG1828AnQKUlDIPhqvmdeyyrtfh0OCeLUAiFKlsONelVtWFsg1EggkNao9IIUY2bJu5RjgiETKrtcSYcp8ol4VFSCIbX3Xykq1rNbcgZCya9WDoMK+z6pRd9weVqKYjhWvfRWwF8pG+2t5b1gAa1PKa1KUbFJeXWau1j1L3k2K903aEGwaKkxaQ0yaXGzadUwaj2qnEuBItmgGs2lrM2nQs2k1NGmatGn/tGlktWnJ/f5zGTxtNnwTIULkyQi/RNb3SLDuE3QmyH5GTL7YZ/LtwaULESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiNwS+QJpMQICAeI7BAAAAABJRU5ErkJggg=="
          className: "img-rounded"
          onClick: @handleAdd
          style: { maxHeight: 100, verticalAlign: "top"  }
