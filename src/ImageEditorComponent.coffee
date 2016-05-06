React = require 'react'
H = React.DOM
R = React.createElement
ImageAnswerComponent = require './answers/ImageAnswerComponent'

# Edit an image 
module.exports = class ImageEditorComponent extends React.Component
  @propTypes:
    imageManager: React.PropTypes.object.isRequired
    imageAcquirer: React.PropTypes.object
    image: React.PropTypes.object             # e.g. { id: someid, caption: caption }
    onImageChange: React.PropTypes.func       # Called when image changed
    T: React.PropTypes.func.isRequired        # Localizer to use

  @childContextTypes:
    imageManager: React.PropTypes.object.isRequired
    imageAcquirer: React.PropTypes.object
    T: React.PropTypes.func.isRequired  # Localizer to use

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
