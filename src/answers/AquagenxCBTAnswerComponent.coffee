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
      H.style null,
        "
          #compartment1 rect {
            fill: #{compartmentColors[0]};
          }
          #compartment2 rect {
            fill: #{compartmentColors[1]};
          }
          #compartment3 rect {
            fill: #{compartmentColors[2]};
          }
          #compartment4 rect {
            fill: #{compartmentColors[3]};
          }
          #compartment5 rect {
            fill: #{compartmentColors[4]};
          }

          #compartment1:hover > rect {
            fill: red;
          }
          #compartment2:hover > rect{
            fill: red;
          }
          #compartment3:hover > rect{
            fill: red;
          }
          #compartment4:hover > rect {
            fill: red;
          }
          #compartment5:hover > rect {
            fill: red;
          }
        "
      H.div dangerouslySetInnerHTML: {__html: aquagenxSVGString}

