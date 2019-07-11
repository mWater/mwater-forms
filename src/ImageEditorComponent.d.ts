import { ImageAnswerValue } from "./response";
import React from "react";
import { ImageManager, ImageAcquirer } from "./formContext";

/** Edit an image  */
export default class ImageEditorComponent extends React.Component<{
  imageManager: ImageManager
  imageAcquirer?: ImageAcquirer
  image?: ImageAnswerValue | null

  /** Called when image changed */
  onImageChange?: (image: ImageAnswerValue | null) => void

  /** Localizer to use */
  T: (str: string, ...args: any[]) => string
       
  /** Question to prompt for consent */
  consentPrompt?: string    
}> {}
