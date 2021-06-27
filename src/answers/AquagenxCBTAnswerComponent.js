_ = require 'lodash'
PropTypes = require('prop-types')
React = require 'react'
R = React.createElement

formUtils = require '../formUtils'

ImageThumbnailComponent = require '../ImageThumbnailComponent'
ImagePopupComponent = require '../ImagePopupComponent'

AquagenxCBTPopupComponent = require './AquagenxCBTPopupComponent'
AquagenxCBTDisplayComponent = require './AquagenxCBTDisplayComponent'

# Based on https://www.aquagenx.com/wp-content/uploads/2013/12/Aquagenx-CBT-Instructions-v3.pdf
module.exports = class AquagenxCBTAnswerComponent extends React.Component
  @contextTypes:
    imageManager: PropTypes.object.isRequired
    imageAcquirer: PropTypes.object
    T: PropTypes.func.isRequired  # Localizer to use

  @propTypes:
    # Value contains two entries: image and cbt
    # The cbt data contain c1,c2,c3,c4,c5 (All booleans) + healthRisk(String) + mpn (Number) + confidence(Number)
    value: PropTypes.object
    onValueChange: PropTypes.func.isRequired
    questionId: PropTypes.string.isRequired

  @defaultProps:
    value: {image: null, cbt: null}

  constructor: (props) ->
    super(props)

    @state = { imageModal: null, aquagenxModal: null }

  focus: () ->
    null

  handleClickImage: =>
    modal = React.createElement ImagePopupComponent,
      imageManager: @context.imageManager
      image: @props.value.image
      T: @context.T
      onRemove: =>
        @setState(imageModal: null)
        value = _.clone @props.value
        value.image = null
        @props.onValueChange(value)
      onClose: =>
        @setState(imageModal: null)
      onRotate: =>
        value = _.clone @props.value
        value.image = _.extend({}, value.image, rotation: ((value.image.rotation or 0) + 90) % 360)
        @props.onValueChange(value)

    @setState(imageModal: modal)

  handleAdd: =>
    # Call imageAcquirer
    @context.imageAcquirer.acquire (id) =>
      # Add to model
      value = _.clone @props.value
      value.image = {id: id}
      @props.onValueChange(value)
    , (err) => throw err

  handleEditClick: =>
    modal = React.createElement AquagenxCBTPopupComponent,
      value: @props.value
      questionId: @props.questionId
      onSave: (value) =>
        @setState(aquagenxModal: null)
        @props.onValueChange(value)
      onClose: =>
        @setState(aquagenxModal: null)

    @setState(aquagenxModal: modal)

  handleClearClick: () =>
    value = _.clone @props.value
    value.cbt = null
    @props.onValueChange(value)

  renderImage: ->
    R 'div', null,
      @state.imageModal

      if @props.value?.image
        React.createElement(ImageThumbnailComponent, imageId: @props.value.image.id, onClick: @handleClickImage, imageManager: @context.imageManager)
      else if @props.onValueChange and @context.imageAcquirer
        R 'img',
          src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAFzAgMAAABtAbdzAAAACVBMVEUAAQBsbmz7//tn1+0/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3woHEjIHlG2SjgAAAxhJREFUeNrt3Mt1pjAMBWA2U8J0NnjhEtyPS/DCrjKbnDn/AUt+cK0AuSxD4APkBCwktt1g2YgQIUKEiCXyb9v+EiFChAgRIkSIECFC5JHIdlz+ECFC5L0I/0ESIUKECBEivxYJ5WNJRIgQeT5ynFAQIfISpICXWEE8GskVpMCXM+LwSDwhHo/kFyOhrIw8ESJEiBAhQoQIkXsiqX8KMI2MzGZmkf+b+XXIx7zGr0KiOInFIYfp8BrkMG/2K5DTvH4FckoBeDxSSVDgkUo2w6ORaqYFjVQTMx6L5CrisIiQl8IiQiLLI5EsIA6JiFk8JCIm/jwOySLicIiS88QhUUYCDFGysR6F5MP1yX1BGUPS6cC7gjKGxPNx9wRlDKkcdu4IyhCSa0ed2kEZQur7awdlDgnVn2KQWL8wzcgPIUKIUyvyU4gwHhwCEXeGRJJ07VMj8iNIlPaVG5GfQJy4FwQiD6KoD68JRB4SACQrY0gfXgNIUg5XH14gJKKQqPxCUjceR7R4XUfU4KrDaxjx2mleRnIH4kBI0IYeClHXXkZSB7JjkMaN6SoS7RCvrw5rkQRBukLm1yIZiJTnI7lrzuYeg/jGU9kTkNSF7I9Bms/8RAyR2IcEAFJ+GMlEiBAhQmQ1svh+wnv8XZH3PKYuRt420zJBWrPfi4jlPD78KJKeg9wh34VBunKQGMQkm7oY6clwoxCTXP1axPL9yT5xmjd9pxVG1828AnQKUlDIPhqvmdeyyrtfh0OCeLUAiFKlsONelVtWFsg1EggkNao9IIUY2bJu5RjgiETKrtcSYcp8ol4VFSCIbX3Xykq1rNbcgZCya9WDoMK+z6pRd9weVqKYjhWvfRWwF8pG+2t5b1gAa1PKa1KUbFJeXWau1j1L3k2K903aEGwaKkxaQ0yaXGzadUwaj2qnEuBItmgGs2lrM2nQs2k1NGmatGn/tGlktWnJ/f5zGTxtNnwTIULkyQi/RNb3SLDuE3QmyH5GTL7YZ/LtwaULESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiNwS+QJpMQICAeI7BAAAAABJRU5ErkJggg=="
          className: "img-rounded"
          onClick: @handleAdd
          style: { maxHeight: 100, verticalAlign: "top"  }
      else
        R 'div', className: "text-muted", @context.T("No images present")


  renderAquagenxCBT: ->
    R 'div', null,
      @state.aquagenxModal

      if not @props.value?.cbt?
        R 'div', null,
          R 'button', className: 'btn btn-default', onClick: @handleEditClick,
            @context.T('Record')
      else
        R 'div', null,
          R AquagenxCBTDisplayComponent, 
            value: @props.value
            questionId: @props.questionId
            onEdit: @handleEditClick
          R 'div', null,
            R 'button', className: 'btn btn-default', onClick: @handleEditClick,
              R('span', className:"glyphicon glyphicon-edit")
              " "
              @context.T('Edit')
            R 'button', className: 'btn btn-default', onClick: @handleClearClick, style: {marginLeft: '12px'},
              R('span', className:"glyphicon glyphicon-remove")
              " "
              @context.T('Clear')


  render: ->
    return R 'div', null,
      @renderAquagenxCBT()
      R('br')
      @renderImage()

