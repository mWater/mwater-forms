React = require 'react'
H = React.DOM

ModalPopupComponent = require('react-library/lib/ModalPopupComponent')
AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent')

# Displays an image in a popup and allows removing or setting as cover image
module.exports = class ImagePopupComponent extends AsyncLoadComponent
  @propTypes:
    imageManager: React.PropTypes.object.isRequired
    id: React.PropTypes.string.isRequired   # ID of image
    onRemove: React.PropTypes.func
    onSetCover: React.PropTypes.func
    onClose: React.PropTypes.func.isRequired

  @contextTypes:
    T: React.PropTypes.func.isRequired  # Localizer to use

  # Override to determine if a load is needed. Not called on mounting
  isLoadNeeded: (newProps, oldProps) -> return newProps.id != oldProps.id

  # Call callback with state changes
  load: (props, prevProps, callback) ->
    @props.imageManager.getImageUrl(props.id, (url) =>
      callback(url: url, error: false)
    , => callback(error: true)
    )

  render: ->
    if @state.loading
      return H.div className: "alert alert-info", @context.T("Loading...")

    if @state.error
      return H.div className: "alert alert-danger", @context.T("Error")

    return React.createElement ModalPopupComponent, 
      footer: H.button type: "button", className: "btn btn-default", onClick: @props.onClose, @context.T("Close")
      H.div null,
        H.button type: "button", className: "close", onClick: @props.onClose, "×"
      
        # Add button links
        H.div null,
          if @props.onSetCover
            H.button type: "button", className: "btn btn-link", onClick: @props.onSetCover, @context.T("Set as Cover Image")
          " "
          if @props.onRemove
            H.button type: "button", className: "btn btn-link", onClick: @props.onRemove, @context.T("Remove")

        # Render image
        H.img src: @state.url, style: { width: "100%" }

