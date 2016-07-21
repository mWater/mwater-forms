React = require 'react'
H = React.DOM
ModalPopupComponent = require('react-library/lib/ModalPopupComponent')
ImagePopupComponent = require './ImagePopupComponent'

# Displays an image
module.exports = class ImageDisplayComponent extends React.Component
  @propTypes:
    id: React.PropTypes.string.isRequired  # Id of image
    imageManager: React.PropTypes.object.isRequired
    T: React.PropTypes.func.isRequired

  constructor: ->
    super
    @state = { error: false, url: null, popup: false }

  componentDidMount: -> @update(@props)
  componentWillReceiveProps: (newProps) -> @update(newProps)

  update: (props) ->
    # Get URL of thumbnail
    @props.imageManager.getImageThumbnailUrl props.id, (url) =>
      @setState(url: url, error: false)
    , => @setState(error: true)

  handleImgError: => @setState(error: true)

  handleImgClick: => @setState(popup: true)

  render: ->
    if @state.error
      src = "img/no-image-icon.jpg"
    else if @state.url
      src = @state.url
    else
      src = "img/image-loading.png"

    H.span null,
      H.img className: "img-thumbnail", src: src, onError: @handleImgError, onClick: @handleImgClick, style: { maxHeight: 100 }
      if @state.popup
        React.createElement(ImagePopupComponent, {
          imageManager: @props.imageManager
          id: @props.id
          onClose: => @setState(popup: false)
          T: @props.T
        })


