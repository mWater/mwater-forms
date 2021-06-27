PropTypes = require('prop-types')
React = require 'react'
R = React.createElement

ModalPopupComponent = require('react-library/lib/ModalPopupComponent')
AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent')
RotationAwareImageComponent = require './RotationAwareImageComponent'

# Displays an image in a popup and allows removing or setting as cover image
module.exports = class ImagePopupComponent extends AsyncLoadComponent
  @propTypes:
    imageManager: PropTypes.object.isRequired
    image: PropTypes.object.isRequired   # The image object
    onRemove: PropTypes.func
    onSetCover: PropTypes.func
    onRotate: PropTypes.func
    onClose: PropTypes.func.isRequired
    T: PropTypes.func.isRequired  # Localizer to use

  # Override to determine if a load is needed. Not called on mounting
  isLoadNeeded: (newProps, oldProps) -> return newProps.id != oldProps.id

  # Call callback with state changes
  load: (props, prevProps, callback) ->
    @props.imageManager.getImageUrl(props.image.id, (url) =>
      callback(url: url, error: false)
    , => callback(error: true)
    )

  render: ->
    if @state.loading
      return R 'div', className: "alert alert-info", @props.T("Loading...")

    if @state.error
      return R 'div', className: "alert alert-danger", @props.T("Error")

    return React.createElement ModalPopupComponent, 
      footer: R 'button', type: "button", className: "btn btn-default", onClick: @props.onClose, @props.T("Close")
      R 'div', null,
        R 'button', type: "button", className: "close", onClick: @props.onClose, "×"
      
        # Add button links
        R 'div', null,
          if @props.onSetCover
            R 'button', type: "button", className: "btn btn-link", onClick: @props.onSetCover, @props.T("Set as Cover Image")
          " "
          if @props.onRemove
            R 'button', type: "button", className: "btn btn-link", onClick: @props.onRemove, @props.T("Remove")
          " "
          if @props.onRotate
            R 'button', type: "button", className: "btn btn-link", onClick: @props.onRotate, @props.T("Rotate")

        # Render image
        React.createElement RotationAwareImageComponent, 
          key: @props.image.id
          imageManager: @props.imageManager
          image: @props.image
          onClick: @handleClickImage

