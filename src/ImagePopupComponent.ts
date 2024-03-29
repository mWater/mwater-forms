import React from "react"
const R = React.createElement

import ModalPopupComponent from "react-library/lib/ModalPopupComponent"
import AsyncLoadComponent from "react-library/lib/AsyncLoadComponent"
import RotationAwareImageComponent, { Image } from "./RotationAwareImageComponent"
import { ImageManager } from "./formContext"
import { LocalizeString } from "ez-localize"

export interface ImagePopupComponentProps {
  imageManager: ImageManager
  /** The image object */
  image: Image
  onRemove?: any
  onSetCover?: any
  onRotate?: any
  onClose: any
  T: LocalizeString
}

/** Displays an image in a popup and allows removing or setting as cover image */
export default class ImagePopupComponent extends AsyncLoadComponent<ImagePopupComponentProps, { loading: boolean, url?: string, error?: boolean}> {
  // Override to determine if a load is needed. Not called on mounting
  isLoadNeeded(newProps: ImagePopupComponentProps, oldProps: ImagePopupComponentProps) {
    return newProps.image.id !== oldProps.image.id
  }

  // Call callback with state changes
  load(props: ImagePopupComponentProps, prevProps: ImagePopupComponentProps, callback: any) {
    return this.props.imageManager.getImageUrl(
      props.image.id,
      (url: any) => {
        return callback({ url, error: false })
      },
      () => callback({ error: true })
    )
  }

  render() {
    if (this.state.loading) {
      return R("div", { className: "alert alert-info" }, this.props.T("Loading..."))
    }

    if (this.state.error) {
      return R("div", { className: "alert alert-danger" }, this.props.T("Error"))
    }

    return React.createElement(
      ModalPopupComponent,
      {
        footer: R(
          "button",
          { type: "button", className: "btn btn-secondary", onClick: this.props.onClose },
          this.props.T("Close")
        )
      },
      R(
        "div",
        null,
        R("button", { type: "button", className: "btn-close", onClick: this.props.onClose }),

        // Add button links
        R(
          "div",
          null,
          this.props.onSetCover
            ? R(
                "button",
                { type: "button", className: "btn btn-link", onClick: this.props.onSetCover },
                this.props.T("Set as Cover Image")
              )
            : undefined,
          " ",
          this.props.onRemove
            ? R(
                "button",
                { type: "button", className: "btn btn-link", onClick: this.props.onRemove },
                this.props.T("Remove")
              )
            : undefined,
          " ",
          this.props.onRotate
            ? R(
                "button",
                { type: "button", className: "btn btn-link", onClick: this.props.onRotate },
                this.props.T("Rotate")
              )
            : undefined
        ),

        // Render image
        React.createElement(RotationAwareImageComponent, {
          key: this.props.image.id,
          imageManager: this.props.imageManager,
          image: this.props.image
        })
      )
    )
  }
}
