React = require 'react'
H = React.DOM
R = React.createElement
AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent')
classNames = require('classnames')

module.exports = class RotationAwareImageComponent extends AsyncLoadComponent
  @propTypes: 
    image: React.PropTypes.object.isRequired
    imageManager: React.PropTypes.object.isRequired
    thumbnail: React.PropTypes.bool
    height: React.PropTypes.number
    onClick: React.PropTypes.func

  # Override to determine if a load is needed. Not called on mounting
  isLoadNeeded: (newProps, oldProps) ->
    return newProps.image.id != oldProps.image.id or newProps.thumbnail != oldProps.thumbnail

  # Call callback with state changes
  load: (props, prevProps, callback) ->
    if props.thumbnail
      props.imageManager.getImageThumbnailUrl(props.image.id, (url) =>
        callback(url: url, error: false)
      , => callback(error: true))
    else
      props.imageManager.getImageUrl(props.image.id, (url) =>
        callback(url: url, error: false)
      , => callback(error: true))

  render: ->
    imageStyle = {}
    classes = classNames({
      "img-thumbnail": @props.thumbnail
    })

    if @props.thumbnail
      imageStyle.maxHeight = @props.height or 160
      imageStyle.width = @props.width or 160

    if @props.image.rotation > 0
      imageStyle.transform = "rotate(#{@props.image.rotation}deg)"
      imageStyle.WebkitTransform = "rotate(#{@props.image.rotation}deg)"
      imageStyle.MsTransform = "rotate(#{@props.image.rotation}deg)"

    if @state.url 
      return H.img(src: @state.url, style: imageStyle, className: classes, onClick: @props.onClick, alt: @props.image.caption or "")
    else
      return null