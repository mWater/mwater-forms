PropTypes = require('prop-types')
React = require 'react'
H = React.DOM
R = React.createElement
AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent')

# Displays a thumbnail of an image
module.exports = class ImageThumbnailComponent extends AsyncLoadComponent 
  @propTypes: 
    imageManager: PropTypes.object.isRequired
    imageId: PropTypes.string.isRequired
    onClick: PropTypes.func

  # Override to determine if a load is needed. Not called on mounting
  isLoadNeeded: (newProps, oldProps) ->
    return newProps.imageId != oldProps.imageId

  # Call callback with state changes
  load: (props, prevProps, callback) ->
    props.imageManager.getImageUrl(props.imageId, (url) =>
      callback(url: url, error: false)
    , => callback(error: true))

  handleError: =>
    @setState(error: true)

  render: ->
    if @state.loading
      # TODO better as font-awesome or suchlike
      url = "img/image-loading.png"
    else if @state.error
      # TODO better as font-awesome or suchlike
      url = "img/no-image-icon.jpg"
    else if @state.url
      url = @state.url

    return H.img(src: url, style: { maxHeight: 100 }, className: "img-thumbnail", onClick: @props.onClick, onError: @handleError)
