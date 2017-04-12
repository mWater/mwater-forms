React = require 'react'
H = React.DOM
ImagePopupComponent = require './ImagePopupComponent'

RotationAwareImageComponent = require './RotationAwareImageComponent'

# Displays an image
module.exports = class ImageDisplayComponent extends React.Component
  @propTypes:
    image: React.PropTypes.object.isRequired  # Image object to display
    imageManager: React.PropTypes.object.isRequired
    T: React.PropTypes.func.isRequired

  constructor: ->
    super
    @state = { error: false, url: null, popup: false }

  componentDidMount: -> @update(@props)
  componentWillReceiveProps: (newProps) -> @update(newProps)

  update: (props) ->
    # Get URL of thumbnail
    @props.imageManager.getImageThumbnailUrl props.image.id, (url) =>
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
      React.createElement(RotationAwareImageComponent, image: @props.image, imageManager: @props.imageManager, onClick: @handleImgClick, height: 100, thumbnail: true)
      if @state.popup
        React.createElement(ImagePopupComponent, {
          imageManager: @props.imageManager
          image: @props.image
          onClose: => @setState(popup: false)
          T: @props.T
        })


