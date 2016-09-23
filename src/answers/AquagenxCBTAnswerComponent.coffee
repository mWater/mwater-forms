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

  constructor: ->
    super

    @state = { compartments: [false, true, false, false, false] }

  focus: () ->
    null

  handleValueChange: () =>
    @props.onValueChange(!@props.value)

  render: ->
    compartmentColors = _.map @state.compartments, (c) -> if c then '#fcf8d0' else '#32a89b'
    return H.div null,
      # compartment1, 4 and 5 are single rect. 2 and 3 are groups of rect
      H.style null,
        "
          #compartment1 {
            fill: #{compartmentColors[0]};
          }
          #compartment2 rect {
            fill: #{compartmentColors[1]};
          }
          #compartment3 rect {
            fill: #{compartmentColors[2]};
          }
          #compartment4 {
            fill: #{compartmentColors[3]};
          }
          #compartment5 {
            fill: #{compartmentColors[4]};
          }

          #compartment1:hover {
            fill: red;
          }
          #compartment2:hover > rect{
            fill: red;
          }
          #compartment3:hover > rect{
            fill: red;
          }
          #compartment4:hover {
            fill: red;
          }
          #compartment5:hover {
            fill: red;
          }
        "
      H.div dangerouslySetInnerHTML: {__html: aquagenxSVGString}

