import React from "react";
import { ImageManager } from "./formContext";

export interface Image {
  /** UUID of image */
  id: string

  /** Optional clockwise rotation (0, 90, 180, 270) */
  rotation?: number

  /** Optional caption */
  caption?: string

  /** If part of an image set, true if cover image */
  cover?: boolean
}

/** Displays a single image rotated appropriately */
export default class RotationAwareImageComponent extends React.Component<{
  image: Image
  imageManager: ImageManager

  /** True to use thumbnail (max 160 height) */
  thumbnail?: boolean

  /** Optional height */
  height?: number

  /** Called when clicked */
  onClick?: () => void

}> {}
