PropTypes = require('prop-types')
React = require 'react'
H = React.DOM
R = React.createElement
AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent')
classNames = require('classnames')

module.exports = class RotationAwareImageComponent extends AsyncLoadComponent
  @propTypes: 
    image: PropTypes.object.isRequired
    imageManager: PropTypes.object.isRequired
    thumbnail: PropTypes.bool
    height: PropTypes.number
    onClick: PropTypes.func

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
    containerStyle = {}
    classes = classNames({
      "img-thumbnail": @props.thumbnail
      "rotated": @props.image.rotation
      "rotate-90": @props.image.rotation and @props.image.rotation == 90
      "rotate-180": @props.image.rotation and @props.image.rotation == 180
      "rotate-270": @props.image.rotation and @props.image.rotation == 270 
    })

    containerClasses= classNames({
      "rotated-image-container": true
      "rotated-thumbnail": @props.thumbnail
    })

    console.log containerClasses

    if @props.thumbnail
      if @props.image.rotation == 90 or @props.image.rotation == 270
        imageStyle.maxHeight = @props.width or 160
        imageStyle.maxWidth = @props.height or 160
      else
        imageStyle.maxHeight = @props.height or 160
        imageStyle.maxWidth = @props.width or 160

      containerStyle.height = @props.height or 160
    else
      imageStyle.maxWidth = "100%"

    if @state.url 
      return H.span 
        ref: (c) => @parent = c
        className: containerClasses
        style: containerStyle,
          H.img
            ref: (c) => @image = c
            src: @state.url
            style: imageStyle
            className: classes
            onClick: @props.onClick
            alt: @props.image.caption or ""

    else
      return null