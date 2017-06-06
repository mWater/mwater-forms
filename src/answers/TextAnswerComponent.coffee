PropTypes = require('prop-types')
React = require 'react'
H = React.DOM
R = React.createElement

module.exports = class TextAnswerComponent extends React.Component
  @propTypes:
    value: PropTypes.string
    format: PropTypes.string.isRequired
    readOnly: PropTypes.bool
    onValueChange: PropTypes.func.isRequired
    onNextOrComments: PropTypes.func

  @defaultProps:
    readOnly: false

  constructor: (props) ->
    super
    
    @state = {text: props.value}

  componentWillReceiveProps: (nextProps) ->
    # If different, override text
    if nextProps.value != @props.value
      @setState(text: if nextProps.value? then nextProps.value else "")

  focus: () ->
    @refs.input.focus()

  handleKeyDown: (ev) =>
    if @props.onNextOrComments?
      # When pressing ENTER or TAB
      if ev.keyCode == 13 or ev.keyCode == 9
        @props.onNextOrComments(ev)
        # It's important to prevent the default behavior when handling tabs (or else the tab is applied after the focus change)
        ev.preventDefault()

  handleBlur: (ev) =>
    @props.onValueChange(if ev.target.value then ev.target.value else null)

  render: ->
    if @props.format == "multiline"
      return H.textarea {
        className: "form-control"
        id: 'input'
        ref: 'input'
        value: @state.text or ""
        rows: "5"
        readOnly: @props.readOnly
        onBlur: @handleBlur
        onChange: (ev) => @setState(text: ev.target.value)
      }
    else
      return H.input {
        className: "form-control"
        id: 'input'
        ref: 'input'
        type: "text"
        value: @state.text or ""
        readOnly: @props.readOnly
        onKeyDown: @handleKeyDown
        onBlur: @handleBlur
        onChange: (ev) => @setState(text: ev.target.value)
      }