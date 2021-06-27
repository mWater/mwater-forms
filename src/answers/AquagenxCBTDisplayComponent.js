_ = require 'lodash'
PropTypes = require('prop-types')
React = require 'react'
R = React.createElement

AquagenxCBTDisplaySVGString = require './AquagenxCBTDisplaySVG'
getHealthRiskString = require('./aquagenxCBTUtils').getHealthRiskString
ImageDisplayComponent = require '../ImageDisplayComponent'

module.exports = class AquagenxCBTDisplayComponent extends React.Component
  @contextTypes:
    T: PropTypes.func.isRequired  # Localizer to use

  @propTypes:
    value: PropTypes.object
    questionId: PropTypes.string.isRequired
    onEdit: PropTypes.func
    imageManager: PropTypes.object # If not specified, do not display image

  handleClick: =>
    if @props.onEdit
      @props.onEdit()

  renderStyle: ->
    mainId = "#cbtDisplay#{@props.questionId}"
    cbtValues = @props.value.cbt
    compartmentValues = [cbtValues.c1, cbtValues.c2, cbtValues.c3, cbtValues.c4, cbtValues.c5]
    compartmentColors = _.map compartmentValues, (c) -> if c then '#32a89b' else '#ebe7c2'
    return R 'style', null,
      "
        #{mainId} #compartment1 rect {
          fill: #{compartmentColors[0]};
        }
        #{mainId} #compartment2 rect {
          fill: #{compartmentColors[1]};
        }
        #{mainId} #compartment3 rect {
          fill: #{compartmentColors[2]};
        }
        #{mainId} #compartment4 rect {
          fill: #{compartmentColors[3]};
        }
        #{mainId} #compartment5 rect {
          fill: #{compartmentColors[4]};
        }
      "

  renderInfo: ->
    cbtValues = @props.value.cbt
    mpn = cbtValues.mpn
    if mpn == 100
      mpn = '>100'
    return R 'div', null,
      R 'div', null,
        @context.T('MPN/100ml') + ': '
        R('b', null, mpn)
      R 'div', null,
        @context.T('Upper 95% Confidence Interval/100ml') + ': '
        R('b', null, cbtValues.confidence)
      R 'div', null,
        @context.T('Health Risk Category Based on MPN and Confidence Interval') + ': '
        R('b', null, getHealthRiskString(cbtValues.healthRisk, @context.T))

  renderPhoto: ->
    # Displays an image
    if @props.value.image and @props.imageManager
      R 'div', null,
        React.createElement ImageDisplayComponent,
          image: @props.value.image
          imageManager: @props.imageManager
          T: @context.T

  render: ->
    # Can't display if not set
    if not @props.value?.cbt
      return null

    R 'div', id: "cbtDisplay#{@props.questionId}",
      @renderStyle()
      R 'div', dangerouslySetInnerHTML: {__html: AquagenxCBTDisplaySVGString}, onClick: @handleClick
      @renderInfo()
      @renderPhoto()
