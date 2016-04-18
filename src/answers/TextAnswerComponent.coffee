React = require 'react'
H = React.DOM
R = React.createElement

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
        id: 'input'
        ref: 'input'
        value: @props.value or ""
        rows: "5"
        readOnly: @props.readOnly
        onChange: (ev) =>
          @props.onValueChange(if ev.target.value then ev.target.value else null)
      }
    else
      return H.input {
        className: "form-control"
        id: 'input'
        ref: 'input'
        type: "text"
        value: @props.value or ""
        readOnly: @props.readOnly
        onKeyDown: @handleKeyDown
        onChange: (ev) =>
          @props.onValueChange(if ev.target.value then ev.target.value else null)
      }