import React from "react"
const R = React.createElement
import AsyncLoadComponent from "react-library/lib/AsyncLoadComponent"

export interface ImageThumbnailComponentProps {
  imageManager: any
  imageId: string
  onClick?: any
}

// Displays a thumbnail of an image
export default class ImageThumbnailComponent extends AsyncLoadComponent<ImageThumbnailComponentProps> {
  // Override to determine if a load is needed. Not called on mounting
  isLoadNeeded(newProps: any, oldProps: any) {
    return newProps.imageId !== oldProps.imageId
  }

  // Call callback with state changes
  load(props: any, prevProps: any, callback: any) {
    return props.imageManager.getImageUrl(
      props.imageId,
      (url: any) => {
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
      className: "",
      onClick: this.props.onClick,
      onError: this.handleError
    })
  }
}
