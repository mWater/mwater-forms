PropTypes = require('prop-types')
React = require 'react'
R = React.createElement
ImageAnswerComponent = require './answers/ImageAnswerComponent'

# Edit an image 
module.exports = class ImageEditorComponent extends React.Component
  @propTypes:
    imageManager: PropTypes.object.isRequired
    imageAcquirer: PropTypes.object
    image: PropTypes.object             # e.g. { id: someid, caption: caption }
    onImageChange: PropTypes.func       # Called when image changed
    T: PropTypes.func.isRequired        # Localizer to use
    consentPrompt: PropTypes.string    # Question to prompt for consent

  @childContextTypes:
    imageManager: PropTypes.object.isRequired
    imageAcquirer: PropTypes.object
    T: PropTypes.func.isRequired  # Localizer to use

  getChildContext: -> 
    {
      imageManager: @props.imageManager
      imageAcquirer: @props.imageAcquirer
      T: @props.T
    }

  render: ->
    R ImageAnswerComponent, 
      image: @props.image
      onImageChange: @props.onImageChange
      consentPrompt: @props.consentPrompt
