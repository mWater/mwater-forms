React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require '../formUtils'

aquagenxSVGString = require './AquagenxSVG'

module.exports = class AquagenxCBTAnswerComponent extends React.Component
  @propTypes:
    value: React.PropTypes.bool
    onValueChange: React.PropTypes.func.isRequired
    label: React.PropTypes.object.isRequired

  @defaultProps:
    value: false

  focus: () ->
    null

  handleValueChange: () =>
    @props.onValueChange(!@props.value)

  render: ->
    return H.div null,
      # compartment1, 4 and 5 are single rect. 2 and 3 are groups of rect
      H.style null,
        '''
          #compartment1 {
            fill: red;
          }
          #compartment2 rect {
            fill: green;
          }
          #compartment3 rect {
            fill: yellow;
          }
          #compartment4 {
            fill: blue;
          }
          #compartment5 {
            fill: purple;
          }
        '''
      H.div dangerouslySetInnerHTML: {__html: aquagenxSVGString}

