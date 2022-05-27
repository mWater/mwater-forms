import React from "react"
const R = React.createElement
import ImagePopupComponent from "./ImagePopupComponent"
import RotationAwareImageComponent from "./RotationAwareImageComponent"

export interface ImageDisplayComponentProps {
  /** Image object to display */
  image: any
  imageManager: any
  T: any
}

interface ImageDisplayComponentState {
  error: any
  url: any
  popup: any
}

// Displays an image
export default class ImageDisplayComponent extends React.Component<
  ImageDisplayComponentProps,
  ImageDisplayComponentState
> {
  constructor(props: any) {
    super(props)
    this.state = { error: false, url: null, popup: false }
  }

  componentDidMount() {
    return this.update(this.props)
  }
  componentWillReceiveProps(newProps: any) {
    return this.update(newProps)
  }

  update(props: any) {
    // Get URL of thumbnail
    return props.imageManager.getImageThumbnailUrl(
      props.image.id,
      (url: any) => {
        return this.setState({ url, error: false })
      },
      () => this.setState({ error: true })
    )
  }

  handleImgError = () => {
    return this.setState({ error: true })
  }
  handleImgClick = () => {
    return this.setState({ popup: true })
  }

  render() {
    let src
    if (this.state.error) {
      src = "img/no-image-icon.jpg"
    } else if (this.state.url) {
      src = this.state.url
    } else {
      src = "img/image-loading.png"
    }

    return R(
      "span",
      null,
      React.createElement(RotationAwareImageComponent, {
        image: this.props.image,
        imageManager: this.props.imageManager,
        onClick: this.handleImgClick,
        height: 100,
        thumbnail: true
      }),
      this.state.popup
        ? React.createElement(ImagePopupComponent, {
            imageManager: this.props.imageManager,
            image: this.props.image,
            onClose: () => this.setState({ popup: false }),
            T: this.props.T
          })
        : undefined
    )
  }
}
