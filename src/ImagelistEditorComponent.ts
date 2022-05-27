import PropTypes from "prop-types"
import React from "react"
const R = React.createElement
import ImagesAnswerComponent from "./answers/ImagesAnswerComponent"
import { ImageAcquirer, ImageManager } from "./formContext"
import { ImageAnswerValue } from "./response"

export interface ImagelistEditorComponentProps {
  imageManager: ImageManager
  imageAcquirer?: ImageAcquirer
  imagelist?: ImageAnswerValue[] | null

  /** Called when image changed */
  onImagelistChange?: (image: ImageAnswerValue[] | null) => void

  /** Localizer to use */
  T: (str: string, ...args: any[]) => string

  /** Question to prompt for consent */
  consentPrompt?: string
}

// Edit an image list
export default class ImagelistEditorComponent extends React.Component<ImagelistEditorComponentProps> {
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
    return R(ImagesAnswerComponent, {
      imagelist: this.props.imagelist,
      onImagelistChange: this.props.onImagelistChange,
      consentPrompt: this.props.consentPrompt
    })
  }
}
