React = require 'react'
H = React.DOM
ModalPopupComponent = require('react-library/lib/ModalPopupComponent')
ImagePopupComponent = require './ImagePopupComponent'

# Displays an image
module.exports = class ImageDisplayComponent extends React.Component
  @propTypes:
    id: React.PropTypes.string.isRequired  # Id of image

  @contextTypes:
    imageManager: React.PropTypes.object.isRequired

  constructor: ->
    super
    @state = { error: false, url: null }

  componentDidMount: -> @update(@props)
  componentWillReceiveProps: (newProps) -> @update(newProps)

  update: (props) ->
    # Get URL of thumbnail
    @context.imageManager.getImageThumbnailUrl props.id, (url) =>
      @setState(url: url, error: false)
    , => @setState(error: true)

  handleImgError: =>
    @setState(error: true)

  handleImgClick: =>
    ModalPopupComponent.show((onClose) =>
      React.createElement(ImagePopupComponent, {
        imageManager: @context.imageManager
        id: @props.id
        onClose: onClose
      })
    )

  render: ->
    if @state.error
      src = "img/no-image-icon.jpg"
    else if @state.url
      src = @state.url
    else
      src = "img/image-loading.png"

    H.img className: "img-thumbnail", src: src, onError: @handleImgError, onClick: @handleImgClick, style: { maxHeight: 100 }

