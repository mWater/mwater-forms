// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
let ImageThumbnailComponent
import PropTypes from "prop-types"
import React from "react"
const R = React.createElement
import AsyncLoadComponent from "react-library/lib/AsyncLoadComponent"

// Displays a thumbnail of an image
export default ImageThumbnailComponent = (function () {
  ImageThumbnailComponent = class ImageThumbnailComponent extends AsyncLoadComponent {
    static initClass() {
      this.propTypes = {
        imageManager: PropTypes.object.isRequired,
        imageId: PropTypes.string.isRequired,
        onClick: PropTypes.func
      }
    }

    // Override to determine if a load is needed. Not called on mounting
    isLoadNeeded(newProps, oldProps) {
      return newProps.imageId !== oldProps.imageId
    }

    // Call callback with state changes
    load(props, prevProps, callback) {
      return props.imageManager.getImageUrl(
        props.imageId,
        (url) => {
          return callback({ url, error: false })
        },
        () => callback({ error: true })
      )
    }

    handleError = () => {
      return this.setState({ error: true })
    }

    render() {
      let url
      if (this.state.loading) {
        // TODO better as font-awesome or suchlike
        url = "img/image-loading.png"
      } else if (this.state.error) {
        // TODO better as font-awesome or suchlike
        url = "img/no-image-icon.jpg"
      } else if (this.state.url) {
        ;({ url } = this.state)
      }

      return R("img", {
        src: url,
        style: { maxHeight: 100 },
        className: "img-thumbnail",
        onClick: this.props.onClick,
        onError: this.handleError
      })
    }
  }
  ImageThumbnailComponent.initClass()
  return ImageThumbnailComponent
})()
