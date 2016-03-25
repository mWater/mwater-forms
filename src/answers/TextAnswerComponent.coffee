React = require 'react'
H = React.DOM
R = React.createElement

# Functional
# TODO: format validation
# Not tested (15 tests not implemented)

module.exports = class TextAnswerComponent extends React.Component
  @propTypes:
    value: React.PropTypes.string
    format: React.PropTypes.string.isRequired
    readOnly: React.PropTypes.bool
    onValueChange: React.PropTypes.func.isRequired

  @defaultProps:
    readOnly: false

  render: ->
    if @props.format == "multiline"
      return H.textarea {
        className: "form-control"
        value: @props.value
        rows: "5"
        readOnly: @props.readOnly
        onChange: (ev) =>
          @props.onValueChange(ev.target.value)
      }
    else
      return H.input {
        className: "form-control"
        type: "text"
        value: @props.value
        readOnly: @props.readOnly
        onChange: (ev) =>
          @props.onValueChange(ev.target.value)
      }