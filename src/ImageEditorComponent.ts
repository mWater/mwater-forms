import { LocalizeString } from "ez-localize"
import PropTypes from "prop-types"
import React from "react"
const R = React.createElement
import ImageAnswerComponent from "./answers/ImageAnswerComponent"
import { ImageAcquirer, ImageManager } from "./formContext"
import { ImageAnswerValue } from "./response"

export interface ImageEditorComponentProps {
  imageManager: ImageManager
  imageAcquirer?: ImageAcquirer
  image?: ImageAnswerValue | null

  /** Called when image changed */
  onImageChange?: (image: ImageAnswerValue | null) => void

  /** Localizer to use */
  T: LocalizeString

  /** Question to prompt for consent */
  consentPrompt?: string
}

/** Edit an image */
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
