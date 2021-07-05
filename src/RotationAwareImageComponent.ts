import PropTypes from "prop-types"
import React from "react"
const R = React.createElement
import AsyncLoadComponent from "react-library/lib/AsyncLoadComponent"
import classNames from "classnames"

interface RotationAwareImageComponentProps {
  image: any
  imageManager: any
  thumbnail?: boolean
  height?: number
  onClick?: any
}

export default class RotationAwareImageComponent extends AsyncLoadComponent<RotationAwareImageComponentProps> {
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
    const imageStyle = {}
    const containerStyle = {}
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
          ref: (c) => {
            return (this.parent = c)
          },
          className: containerClasses,
          style: containerStyle
        },
        R("img", {
          ref: (c: any) => {
            return (this.image = c)
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
