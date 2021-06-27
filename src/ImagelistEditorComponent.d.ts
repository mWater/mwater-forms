import { ImageAnswerValue } from "./response"
import React from "react"
import { ImageManager, ImageAcquirer } from "./formContext"

/** Edit an image list */
export default class ImagelistEditorComponent extends React.Component<{
  imageManager: ImageManager
  imageAcquirer?: ImageAcquirer
  imagelist?: ImageAnswerValue[] | null

  /** Called when image changed */
  onImagelistChange?: (image: ImageAnswerValue[] | null) => void

  /** Localizer to use */
  T: (str: string, ...args: any[]) => string

  /** Question to prompt for consent */
  consentPrompt?: string
}> {}
