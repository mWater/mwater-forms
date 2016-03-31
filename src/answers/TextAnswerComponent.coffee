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
    onNextOrComments: React.PropTypes.func

  @defaultProps:
    readOnly: false

  focus: () ->
    @refs.input.focus()

  handleKeyDown: (ev) =>
    if @props.onNextOrComments?
      # When pressing ENTER or TAB
      if ev.keyCode == 13 or ev.keyCode == 9
        @props.onNextOrComments(ev)
        # It's important to prevent the default behavior when handling tabs (or else the tab is applied after the focus change)
        ev.preventDefault()

  render: ->
    if @props.format == "multiline"
      return H.textarea {
        className: "form-control"
        ref: 'input'
        value: @props.value
        rows: "5"
        readOnly: @props.readOnly
        onChange: (ev) =>
          @props.onValueChange(ev.target.value)
      }
    else
      return H.input {
        className: "form-control"
        ref: 'input'
        type: "text"
        value: @props.value
        readOnly: @props.readOnly
        onKeyDown: @handleKeyDown
        onChange: (ev) =>
          @props.onValueChange(ev.target.value)
      }