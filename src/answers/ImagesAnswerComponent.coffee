_ = require 'lodash'
React = require 'react'
H = React.DOM
ImageThumbnailComponent = require '../ImageThumbnailComponent'
ImagePopupComponent = require '../ImagePopupComponent'

# Edit an image 
module.exports = class ImagesAnswerComponent extends React.Component
  @propTypes:
    imageManager: React.PropTypes.object.isRequired
    imageAcquirer: React.PropTypes.object
    imagelist: React.PropTypes.array         # array of { id: someid, caption: caption, cover: true/false }
    onImagelistChange: React.PropTypes.func      # Called when image list changed

  constructor: ->
    super

    @state = { modal: null }

  focus: () ->
    # Nothing to focus
    null

  handleAdd: =>
    # Call imageAcquirer
    @props.imageAcquirer.acquire (id) =>
      # Add to image list
      imagelist = @props.imagelist or []
      imagelist = imagelist.slice()
      imagelist.push({ id: id, cover: imagelist.length == 0 })
      @props.onImagelistChange(imagelist)
    , (err) => throw err

  handleClickImage: (id) =>
    if @props.onImagelistChange
      onRemove = () => 
        @setState(modal: null)
        
        # Remove from list
        imagelist = _.filter(@props.imagelist or [], (image) -> image.id != id)
        @props.onImagelistChange(imagelist)

      # TODO only onSetCover if not already cover
      onSetCover = () =>
        @setState(modal: null)

        # Remove from list
        imagelist = _.map(@props.imagelist or [], (image) -> _.extend({}, image, cover: image.id == id))
        @props.onImagelistChange(imagelist)

    modal = React.createElement ImagePopupComponent, 
      imageManager: @props.imageManager
      id: id
      onRemove: onRemove
      onSetCover: onSetCover
      onClose: =>
        @setState(modal: null)

    @setState(modal: modal)

  render: ->
    H.div null,
      @state.modal

      _.map @props.imagelist, (image) =>
        React.createElement ImageThumbnailComponent, 
          key: image.id
          imageManager: @props.imageManager
          imageId: image.id
          onClick: @handleClickImage.bind(null, image.id)

      if @props.onImagelistChange and @props.imageAcquirer # If can add
        H.img 
          src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAFzAgMAAABtAbdzAAAACVBMVEUAAQBsbmz7//tn1+0/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3woHEjIHlG2SjgAAAxhJREFUeNrt3Mt1pjAMBWA2U8J0NnjhEtyPS/DCrjKbnDn/AUt+cK0AuSxD4APkBCwktt1g2YgQIUKEiCXyb9v+EiFChAgRIkSIECFC5JHIdlz+ECFC5L0I/0ESIUKECBEivxYJ5WNJRIgQeT5ynFAQIfISpICXWEE8GskVpMCXM+LwSDwhHo/kFyOhrIw8ESJEiBAhQoQIkXsiqX8KMI2MzGZmkf+b+XXIx7zGr0KiOInFIYfp8BrkMG/2K5DTvH4FckoBeDxSSVDgkUo2w6ORaqYFjVQTMx6L5CrisIiQl8IiQiLLI5EsIA6JiFk8JCIm/jwOySLicIiS88QhUUYCDFGysR6F5MP1yX1BGUPS6cC7gjKGxPNx9wRlDKkcdu4IyhCSa0ed2kEZQur7awdlDgnVn2KQWL8wzcgPIUKIUyvyU4gwHhwCEXeGRJJ07VMj8iNIlPaVG5GfQJy4FwQiD6KoD68JRB4SACQrY0gfXgNIUg5XH14gJKKQqPxCUjceR7R4XUfU4KrDaxjx2mleRnIH4kBI0IYeClHXXkZSB7JjkMaN6SoS7RCvrw5rkQRBukLm1yIZiJTnI7lrzuYeg/jGU9kTkNSF7I9Bms/8RAyR2IcEAFJ+GMlEiBAhQmQ1svh+wnv8XZH3PKYuRt420zJBWrPfi4jlPD78KJKeg9wh34VBunKQGMQkm7oY6clwoxCTXP1axPL9yT5xmjd9pxVG1828AnQKUlDIPhqvmdeyyrtfh0OCeLUAiFKlsONelVtWFsg1EggkNao9IIUY2bJu5RjgiETKrtcSYcp8ol4VFSCIbX3Xykq1rNbcgZCya9WDoMK+z6pRd9weVqKYjhWvfRWwF8pG+2t5b1gAa1PKa1KUbFJeXWau1j1L3k2K903aEGwaKkxaQ0yaXGzadUwaj2qnEuBItmgGs2lrM2nQs2k1NGmatGn/tGlktWnJ/f5zGTxtNnwTIULkyQi/RNb3SLDuE3QmyH5GTL7YZ/LtwaULESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiNwS+QJpMQICAeI7BAAAAABJRU5ErkJggg=="
          className: "img-rounded"
          onClick: @handleAdd
          style: { maxHeight: 100 }
