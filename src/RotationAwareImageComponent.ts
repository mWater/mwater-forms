import React, { CSSProperties } from "react"
const R = React.createElement
import AsyncLoadComponent from "react-library/lib/AsyncLoadComponent"
import classNames from "classnames"
import { ImageManager } from "./formContext"

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

interface RotationAwareImageComponentProps {
  image: Image
  imageManager: ImageManager

  /** True to use thumbnail (max 160 height) */
  thumbnail?: boolean

  /** Optional width */
  width?: number

  /** Optional height */
  height?: number

  /** Called when clicked */
  onClick?: () => void
}

/** Displays a single image rotated appropriately */
export default class RotationAwareImageComponent extends AsyncLoadComponent<RotationAwareImageComponentProps, { loading: boolean, url?: string, error: any }> {
  parent: HTMLElement | null
  image: HTMLImageElement | null
  // Override to determine if a load is needed. Not called on mounting
  isLoadNeeded(newProps: any, oldProps: any) {
    return newProps.image.id !== oldProps.image.id || newProps.thumbnail !== oldProps.thumbnail
  }

  // Call callback with state changes
  load(props: any, prevProps: any, callback: any) {
    if (props.thumbnail) {
      return props.imageManager.getImageThumbnailUrl(
        props.image.id,
        (url: any) => {
          return callback({ url, error: false })
        },
        () => callback({ error: true })
      )
    } else {
      return props.imageManager.getImageUrl(
        props.image.id,
        (url: any) => {
          return callback({ url, error: false })
        },
        () => callback({ error: true })
      )
    }
  }

  render() {
    const imageStyle: CSSProperties = {}
    const containerStyle: CSSProperties = {}
    const classes = classNames({
      "img-thumbnail": this.props.thumbnail,
      rotated: this.props.image.rotation,
      "rotate-90": this.props.image.rotation && this.props.image.rotation === 90,
      "rotate-180": this.props.image.rotation && this.props.image.rotation === 180,
      "rotate-270": this.props.image.rotation && this.props.image.rotation === 270
    })

    const containerClasses = classNames({
      "rotated-image-container": true,
      "rotated-thumbnail": this.props.thumbnail
    })

    if (this.props.thumbnail) {
      if (this.props.image.rotation === 90 || this.props.image.rotation === 270) {
        imageStyle.maxHeight = this.props.width || 160
        imageStyle.maxWidth = this.props.height || 160
      } else {
        imageStyle.maxHeight = this.props.height || 160
        imageStyle.maxWidth = this.props.width || 160
      }

      containerStyle.height = this.props.height || 160
    } else {
      imageStyle.maxWidth = "100%"
    }

    if (this.state.url) {
      return R(
        "span",
        {
          ref: (c: HTMLElement | null) => {
            this.parent = c
          },
          className: containerClasses,
          style: containerStyle
        },
        R("img", {
          ref: (c: HTMLImageElement | null) => {
            this.image = c
          },
          src: this.state.url,
          style: imageStyle,
          className: classes,
          onClick: this.props.onClick,
          alt: this.props.image.caption || ""
        })
      )
    } else {
      return null
    }
  }
}
