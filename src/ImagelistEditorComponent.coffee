PropTypes = require('prop-types')
React = require 'react'
R = React.createElement
ImagesAnswerComponent = require './answers/ImagesAnswerComponent'

# Edit an image list
module.exports = class ImagelistEditorComponent extends React.Component
  @propTypes:
    imageManager: PropTypes.object.isRequired
    imageAcquirer: PropTypes.object
    imagelist: PropTypes.array             # e.g. [{ id: someid, caption: caption }]
    onImagelistChange: PropTypes.func       # Called when image list changed
    T: PropTypes.func.isRequired        # Localizer to use

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
    R ImagesAnswerComponent, 
      imagelist: @props.imagelist
      onImagelistChange: @props.onImagelistChange
