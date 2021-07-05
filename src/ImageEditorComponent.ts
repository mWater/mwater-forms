import PropTypes from "prop-types"
import React from "react"
const R = React.createElement
import ImageAnswerComponent from "./answers/ImageAnswerComponent"

interface ImageEditorComponentProps {
  imageManager: any
  imageAcquirer?: any
  /** e.g. { id: someid, caption: caption } */
  image?: any
  /** Called when image changed */
  onImageChange?: any
  /** Localizer to use */
  T: any
  /** Question to prompt for consent */
  consentPrompt?: string
}

// Edit an image
export default class ImageEditorComponent extends React.Component<ImageEditorComponentProps> {
  static childContextTypes = {
    imageManager: PropTypes.object.isRequired,
    imageAcquirer: PropTypes.object,
    T: PropTypes.func.isRequired
  }

  getChildContext() {
    return {
      imageManager: this.props.imageManager,
      imageAcquirer: this.props.imageAcquirer,
      T: this.props.T
    }
  }

  render() {
    return R(ImageAnswerComponent, {
      image: this.props.image,
      onImageChange: this.props.onImageChange,
      consentPrompt: this.props.consentPrompt
    })
  }
}
