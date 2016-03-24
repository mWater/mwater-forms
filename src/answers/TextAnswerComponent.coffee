React = require 'react'
H = React.DOM
R = React.createElement

# Functional
# Not tested

module.exports = class TextAnswerComponent extends React.Component
  @propTypes:
    value: React.PropTypes.string
    onValueChange: React.PropTypes.func.isRequired

  render: ->
    H.input className: "form-control", type: "text", value: @props.value, onChange: (ev) => @props.onValueChange(ev.target.value)