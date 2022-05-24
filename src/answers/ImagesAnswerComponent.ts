import PropTypes from "prop-types"
import _ from "lodash"
import React from "react"
const R = React.createElement
import RotationAwareImageComponent, { Image } from "../RotationAwareImageComponent"
import ImagePopupComponent from "../ImagePopupComponent"

export interface ImagesAnswerComponentProps {
  /** array of { id: someid, caption: caption, cover: true/false } */
  imagelist?: Image[]
  /** Called when image list changed */
  onImagelistChange?: any
  consentPrompt?: string
}

interface ImagesAnswerComponentState {
  modalImageId: any
}

// Edit an image
export default class ImagesAnswerComponent extends React.Component<
  ImagesAnswerComponentProps,
  ImagesAnswerComponentState
> {
  static contextTypes = {
    imageManager: PropTypes.object.isRequired,
    imageAcquirer: PropTypes.object,
    T: PropTypes.func.isRequired // Localizer to use
  }

  constructor(props: any) {
    super(props)

    this.state = { modalImageId: null } // Image id of modal. null if not open
  }

  focus() {
    // Nothing to focus
    return null
  }

  handleAdd = () => {
    // Check consent
    if (this.props.consentPrompt) {
      if (!confirm(this.props.consentPrompt)) {
        return
      }
    }

    // Call imageAcquirer
    return this.context.imageAcquirer.acquire(
      (id: any, rotation = 0) => {
        // Add to image list
        let imagelist = this.props.imagelist || []
        imagelist = imagelist.slice()
        imagelist.push({ id, cover: imagelist.length === 0, rotation })
        return this.props.onImagelistChange(imagelist)
      },
      (err: any) => alert(err)
    )
  }

  handleClickImage = (id: any) => {
    return this.setState({ modalImageId: id })
  }

  renderModal() {
    let onRemove, onRotate, onSetCover
    if (!this.state.modalImageId) {
      return null
    }

    const id = this.state.modalImageId

    if (this.props.onImagelistChange) {
      onRemove = () => {
        this.setState({ modalImageId: null })

        // Remove from list
        const imagelist = _.filter(this.props.imagelist || [], (image) => image.id !== id)
        return this.props.onImagelistChange(imagelist)
      }

      // TODO: SurveyorPro: only onSetCover if not already cover
      onSetCover = () => {
        this.setState({ modalImageId: null })

        // Remove from list
        const imagelist = _.map(this.props.imagelist || [], (image) => _.extend({}, image, { cover: image.id === id }))
        return this.props.onImagelistChange(imagelist)
      }

      onRotate = () => {
        const imagelist = _.map(this.props.imagelist || [], function (image) {
          if (image.id === id) {
            return _.extend({}, image, { rotation: ((image.rotation || 0) + 90) % 360 })
          } else {
            return image
          }
        })
        return this.props.onImagelistChange(imagelist)
      }
    }

    return React.createElement(ImagePopupComponent, {
      imageManager: this.context.imageManager,
      image: _.find(this.props.imagelist || [], { id })!,
      T: this.context.T,
      onRemove,
      onSetCover,
      onRotate,
      onClose: () => {
        return this.setState({ modalImageId: null })
      }
    })
  }

  render() {
    return R(
      "div",
      null,
      this.renderModal(),

      _.map(this.props.imagelist || [], (image) => {
        return React.createElement(RotationAwareImageComponent, {
          key: image.id,
          imageManager: this.context.imageManager,
          image,
          thumbnail: true,
          onClick: this.handleClickImage.bind(null, image.id)
        })
      }),

      this.props.onImagelistChange && this.context.imageAcquirer // If can add
        ? R("img", {
            src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAFzAgMAAABtAbdzAAAACVBMVEUAAQBsbmz7//tn1+0/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3woHEjIHlG2SjgAAAxhJREFUeNrt3Mt1pjAMBWA2U8J0NnjhEtyPS/DCrjKbnDn/AUt+cK0AuSxD4APkBCwktt1g2YgQIUKEiCXyb9v+EiFChAgRIkSIECFC5JHIdlz+ECFC5L0I/0ESIUKECBEivxYJ5WNJRIgQeT5ynFAQIfISpICXWEE8GskVpMCXM+LwSDwhHo/kFyOhrIw8ESJEiBAhQoQIkXsiqX8KMI2MzGZmkf+b+XXIx7zGr0KiOInFIYfp8BrkMG/2K5DTvH4FckoBeDxSSVDgkUo2w6ORaqYFjVQTMx6L5CrisIiQl8IiQiLLI5EsIA6JiFk8JCIm/jwOySLicIiS88QhUUYCDFGysR6F5MP1yX1BGUPS6cC7gjKGxPNx9wRlDKkcdu4IyhCSa0ed2kEZQur7awdlDgnVn2KQWL8wzcgPIUKIUyvyU4gwHhwCEXeGRJJ07VMj8iNIlPaVG5GfQJy4FwQiD6KoD68JRB4SACQrY0gfXgNIUg5XH14gJKKQqPxCUjceR7R4XUfU4KrDaxjx2mleRnIH4kBI0IYeClHXXkZSB7JjkMaN6SoS7RCvrw5rkQRBukLm1yIZiJTnI7lrzuYeg/jGU9kTkNSF7I9Bms/8RAyR2IcEAFJ+GMlEiBAhQmQ1svh+wnv8XZH3PKYuRt420zJBWrPfi4jlPD78KJKeg9wh34VBunKQGMQkm7oY6clwoxCTXP1axPL9yT5xmjd9pxVG1828AnQKUlDIPhqvmdeyyrtfh0OCeLUAiFKlsONelVtWFsg1EggkNao9IIUY2bJu5RjgiETKrtcSYcp8ol4VFSCIbX3Xykq1rNbcgZCya9WDoMK+z6pRd9weVqKYjhWvfRWwF8pG+2t5b1gAa1PKa1KUbFJeXWau1j1L3k2K903aEGwaKkxaQ0yaXGzadUwaj2qnEuBItmgGs2lrM2nQs2k1NGmatGn/tGlktWnJ/f5zGTxtNnwTIULkyQi/RNb3SLDuE3QmyH5GTL7YZ/LtwaULESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiNwS+QJpMQICAeI7BAAAAABJRU5ErkJggg==",
            className: "rounded",
            onClick: this.handleAdd,
            style: { maxHeight: 100, verticalAlign: "top" }
          })
        : undefined
    )
  }
}
