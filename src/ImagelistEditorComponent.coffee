React = require 'react'
H = React.DOM
R = React.createElement
ImagesAnswerComponent = require './answers/ImagesAnswerComponent'

# Edit an image list
module.exports = class ImagelistEditorComponent extends React.Component
  @propTypes:
    imageManager: React.PropTypes.object.isRequired
    imageAcquirer: React.PropTypes.object
    imagelist: React.PropTypes.array             # e.g. [{ id: someid, caption: caption }]
    onImagelistChange: React.PropTypes.func       # Called when image list changed
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
    R ImagesAnswerComponent, 
      imagelist: @props.imagelist
      onImagelistChange: @props.onImagelistChange
