import PropTypes from "prop-types"
import React from "react"
const R = React.createElement
import ImagesAnswerComponent from "./answers/ImagesAnswerComponent"

interface ImagelistEditorComponentProps {
  imageManager: any,
  imageAcquirer?: any,
  /** e.g. [{ id: someid, caption: caption }] */
imagelist?: any,
  /** Called when image list changed */
onImagelistChange?: any,
  /** Localizer to use */
T: any,
  /** Question to prompt for consent */
consentPrompt?: string
}

// Edit an image list
export default class ImagelistEditorComponent extends React.Component<ImagelistEditorComponentProps> {
  static initClass() {
    this.childContextTypes = {
      imageManager: PropTypes.object.isRequired,
      imageAcquirer: PropTypes.object,
      T: PropTypes.func.isRequired
    }
    // Localizer to use
  }

  getChildContext() {
    return {
      imageManager: this.props.imageManager,
      imageAcquirer: this.props.imageAcquirer,
      T: this.props.T
    }
  }

  render() {
    return R(ImagesAnswerComponent, {
      imagelist: this.props.imagelist,
      onImagelistChange: this.props.onImagelistChange,
      consentPrompt: this.props.consentPrompt
    })
  }
};


ImagelistEditorComponent.initClass()
